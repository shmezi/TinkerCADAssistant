import {Command} from "./Command";
import {CommandRequest} from "./data/CommandRequest";
import {CommandResponse} from "./data/CommandResponse";

export class CommandExecutor {
    private commands = new Map<string, Command>()

    register = (command: Command) => {
        this.commands.set(command.name, command)
    }

    execute = (data: CommandRequest): Promise<CommandResponse> => {
        return new Promise(async (resolve, reject) => {
            const command = this.commands.get(data.command)
            if (!command) {
                reject(new Error(`Could not find command with id of: ${data.command}`))
                return
            }
            resolve(command.execute(data))

        })

    }
}