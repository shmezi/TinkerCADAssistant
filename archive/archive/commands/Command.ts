export interface Command<TArgs = unknown, TResponse = unknown> {
    execute: (args: TArgs) => TResponse | Promise<TResponse>;
    id: string
}