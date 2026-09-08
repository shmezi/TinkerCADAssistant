/** A typed command message ready to be passed to client.sendCommand(). */
export class CommandData<TArgs = void, TResponse = void> {
    /** Carries the response type at compile time without adding message data. */
    declare readonly responseType: TResponse

    constructor(
        public readonly name: string,
        public readonly args: TArgs,
    ) {}
}
