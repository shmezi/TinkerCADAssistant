import {Command, CommandContext} from "./Command";
import {CommandData} from "./CommandData";

export class CommandExecutor {
    private readonly commands = new Map<string, Command<unknown, unknown>>()

    register<TArgs, TResponse>(command: Command<TArgs, TResponse>): this {
        if (this.commands.has(command.name)) {
            throw new Error(`Command "${command.name}" is already registered`)
        }
        this.commands.set(command.name, command as Command<unknown, unknown>)
        return this
    }

    unregister(name: string): boolean {
        return this.commands.delete(name)
    }

    has(name: string): boolean {
        return this.commands.has(name)
    }

    async execute<TResponse>(data: CommandData<unknown, unknown>, context: CommandContext): Promise<TResponse> {
        const command = this.commands.get(data.name)
        if (!command) throw new Error(`Unknown command: "${data.name}"`)
        return await command.execute(data.args, context) as TResponse
    }
}
