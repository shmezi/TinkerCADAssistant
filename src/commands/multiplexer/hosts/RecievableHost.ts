import {CommandRequest} from "../../data/CommandRequest";
import {CommandResponse} from "../../data/CommandResponse";

export abstract class RecievableHost {
    abstract type: string

    hostId: string;

    abstract sendToClient(message: CommandRequest | CommandResponse): void

    protected constructor(hostId: string) {
        this.hostId = hostId
    }
}