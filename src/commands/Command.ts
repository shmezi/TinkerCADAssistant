export interface CommandContext {
    /** Logical caller, retained when the worker routes a command. */
    origin: string
    /** Sender reported by the immediate Chrome messaging hop. */
    sender: chrome.runtime.MessageSender
}

/**
 * Base class for commands running in either a content script or service worker.
 * A subclass only needs a stable name and its execution logic.
 */
export abstract class Command<TArgs = void, TResponse = void> {
    protected constructor(public readonly name: string) {}

    abstract execute(
        args: TArgs,
        context: CommandContext,
    ): TResponse | Promise<TResponse>
}
