import {CommandRequest} from "./data/CommandRequest";
import {CommandResponse} from "./data/CommandResponse";

export abstract class Command {
    abstract name: string
    abstract desc: string

    abstract execute(data: CommandRequest): Promise<CommandResponse>

}