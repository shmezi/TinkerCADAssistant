import {Command} from "./Command";

export class CommandExecutor {
    commands: Map<string, Command<any, any>>

    constructor() {
        this.commands = new Map<string, Command<any, any>>()

    }

    register = (command: Command<any, any>) => {
        this.commands.set(command.id, command)
    }

}