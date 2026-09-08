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

const CLIENT_STARTUP_TIMEOUT = 10_000
const CLIENT_POLL_INTERVAL = 100

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
        chrome.tabs.onRemoved.addListener(this.onTabRemoved)
        this.listening = true
        return this
    }

    dispose(): void {
        if (!this.listening) return
        chrome.runtime.onMessage.removeListener(this.onIncomingMessage)
        chrome.tabs.onRemoved.removeListener(this.onTabRemoved)
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

    private async deliver<TResponse>(message: CommandMessage): Promise<CommandResponse<TResponse>> {
        if (typeof message.recipient === "number") {
            return this.sendToTab<TResponse>({tabId: message.recipient}, message)
        }

        const clientId = message.recipient
        let target = await this.waitForClient(clientId)
        try {
            return await this.sendToTab<TResponse>(target, message)
        } catch {
            // The registered tab may have closed before onRemoved was observed.
            if (this.clients.get(clientId)?.tabId === target.tabId) {
                this.clients.delete(clientId)
            }
            target = await this.waitForClient(clientId)
            return this.sendToTab<TResponse>(target, message)
        }
    }

    private sendToTab<TResponse>(
        target: ClientLocation,
        message: CommandMessage,
    ): Promise<CommandResponse<TResponse>> {
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

    private onTabRemoved = (tabId: number): void => {
        for (const [clientId, location] of this.clients) {
            if (location.tabId === tabId) this.clients.delete(clientId)
        }
    }

    private async waitForClient(clientId: string): Promise<ClientLocation> {
        const deadline = Date.now() + CLIENT_STARTUP_TIMEOUT
        while (Date.now() < deadline) {
            const client = this.clients.get(clientId)
            if (client) return client
            await new Promise(resolve => setTimeout(resolve, CLIENT_POLL_INTERVAL))
        }
        throw new Error(`Command client "${clientId}" did not register within ${CLIENT_STARTUP_TIMEOUT}ms`)
    }

    private response(id: string, ok: boolean, data?: unknown, error?: string): CommandResponse {
        return {channel: COMMAND_CHANNEL, type: MessageType.Response, id, ok, data, error}
    }
}
