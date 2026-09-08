import {Command} from "../Command";
import {CommandData} from "../CommandData";
import {CommandExecutor} from "../CommandExecutor";
import {
    COMMAND_CHANNEL,
    CommandDestination,
    CommandResponse,
    errorText,
    isCommandMessage,
} from "./Message";
import {MessageType} from "./MessageType";

const requestId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2)}`

/** A named content-script endpoint. The worker routes commands by this ID. */
export class CommandClient {
    readonly executor = new CommandExecutor()
    private listening = false
    private ready: Promise<void>

    constructor(public readonly id: string) {
        if (!id.trim()) throw new Error("Command client ID cannot be empty")
        this.listen()
        this.ready = this.registerClient()
    }

    register<TArgs, TResponse>(command: Command<TArgs, TResponse>): this {
        this.executor.register(command)
        return this
    }

    dispose(): void {
        if (!this.listening) return
        chrome.runtime.onMessage.removeListener(this.onIncomingMessage)
        this.listening = false
    }

    /** Send a command to a registered client ID and receive its response message. */
    async sendCommand<TResponse = unknown, TArgs = unknown>(
        to: CommandDestination,
        commandName: string,
        args: TArgs,
    ): Promise<CommandResponse<TResponse>> {
        await this.ready
        const message = {
            channel: COMMAND_CHANNEL,
            type: MessageType.Command,
            id: requestId(),
            sender: this.id,
            recipient: to,
            command: new CommandData<TArgs, TResponse>(commandName, args),
        }

        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response: CommandResponse<TResponse>) => {
                const runtimeError = chrome.runtime.lastError
                if (runtimeError) return reject(new Error(runtimeError.message))
                if (!response) return reject(new Error(`No response from destination "${to}"`))
                resolve(response)
            })
        })
    }

    private listen(): void {
        if (this.listening) return
        chrome.runtime.onMessage.addListener(this.onIncomingMessage)
        this.listening = true
    }

    private registerClient(): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {channel: COMMAND_CHANNEL, type: MessageType.Register, clientId: this.id},
                () => {
                    const runtimeError = chrome.runtime.lastError
                    if (runtimeError) reject(new Error(runtimeError.message))
                    else resolve()
                },
            )
        })
    }

    private onIncomingMessage = (
        message: unknown,
        sender: chrome.runtime.MessageSender,
        respond: (response: CommandResponse) => void,
    ): boolean | void => {
        if (!isCommandMessage(message)) return
        const addressedById = message.recipient === this.id
        const addressedByTab = typeof message.recipient === "number"
            && this.executor.has(message.command.name)
        if (!addressedById && !addressedByTab) return
        void this.executor.execute(message.command, {origin: message.sender, sender})
            .then(data => respond(this.response(message.id, true, data)))
            .catch(error => respond(this.response(message.id, false, undefined, errorText(error))))
        return true
    }

    private response(id: string, ok: boolean, data?: unknown, error?: string): CommandResponse {
        return {channel: COMMAND_CHANNEL, type: MessageType.Response, id, ok, data, error}
    }
}
