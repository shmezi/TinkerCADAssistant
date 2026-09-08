import {Command} from "../Command";
import {CommandData} from "../CommandData";
import {CommandExecutor} from "../CommandExecutor";
import {
    COMMAND_CHANNEL,
    CommandDestination,
    CommandMessage,
    CommandResponse,
    errorText,
    isCommandMessage,
    isRegistrationMessage,
    SERVICE_WORKER,
} from "./Message";
import {MessageType} from "./MessageType";

interface ClientLocation {
    tabId: number
    frameId?: number
}

/** Service-worker endpoint and logical client-ID router. */
export class CommandServer {
    readonly executor = new CommandExecutor()
    private readonly clients = new Map<string, ClientLocation>()
    private listening = false

    constructor(public readonly id: string = SERVICE_WORKER) {}

    register<TArgs, TResponse>(command: Command<TArgs, TResponse>): this {
        this.executor.register(command)
        return this
    }

    listen(): this {
        if (this.listening) return this
        chrome.runtime.onMessage.addListener(this.onIncomingMessage)
        this.listening = true
        return this
    }

    dispose(): void {
        if (!this.listening) return
        chrome.runtime.onMessage.removeListener(this.onIncomingMessage)
        this.listening = false
    }

    sendCommand<TResponse = unknown, TArgs = unknown>(
        to: CommandDestination,
        commandName: string,
        args: TArgs,
    ): Promise<CommandResponse<TResponse>> {
        return this.deliver({
            channel: COMMAND_CHANNEL,
            type: MessageType.Command,
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            sender: this.id,
            recipient: to,
            command: new CommandData<TArgs, TResponse>(commandName, args),
        })
    }

    private onIncomingMessage = (
        message: unknown,
        sender: chrome.runtime.MessageSender,
        respond: (response?: CommandResponse | {ok: true}) => void,
    ): boolean | void => {
        if (isRegistrationMessage(message)) {
            if (sender.tab?.id === undefined) return
            this.clients.set(message.clientId, {tabId: sender.tab.id, frameId: sender.frameId})
            respond({ok: true})
            return
        }
        if (!isCommandMessage(message)) return

        // Refresh the caller's location on every request as service workers may restart.
        if (sender.tab?.id !== undefined) {
            this.clients.set(message.sender, {tabId: sender.tab.id, frameId: sender.frameId})
        }

        const task = message.recipient === this.id
            ? this.executor.execute(message.command, {origin: message.sender, sender})
                .then(data => this.response(message.id, true, data))
            : this.deliver(message)

        void task
            .then(respond)
            .catch(error => respond(this.response(message.id, false, undefined, errorText(error))))
        return true
    }

    private deliver<TResponse>(message: CommandMessage): Promise<CommandResponse<TResponse>> {
        const target = typeof message.recipient === "number"
            ? {tabId: message.recipient}
            : this.clients.get(message.recipient)
        if (!target) {
            return Promise.reject(new Error(`Command client "${message.recipient}" is not registered`))
        }

        return new Promise((resolve, reject) => {
            const callback = (response: CommandResponse<TResponse>) => {
                const runtimeError = chrome.runtime.lastError
                if (runtimeError) return reject(new Error(runtimeError.message))
                if (!response) return reject(new Error(`Client "${message.recipient}" did not respond`))
                resolve(response)
            }
            if (target.frameId === undefined) chrome.tabs.sendMessage(target.tabId, message, callback)
            else chrome.tabs.sendMessage(target.tabId, message, {frameId: target.frameId}, callback)
        })
    }

    private response(id: string, ok: boolean, data?: unknown, error?: string): CommandResponse {
        return {channel: COMMAND_CHANNEL, type: MessageType.Response, id, ok, data, error}
    }
}
