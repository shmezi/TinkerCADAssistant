import {RecievableHost} from "./RecievableHost";
import {CommandRequest} from "../../data/CommandRequest";
import {CommandResponse} from "../../data/CommandResponse";
import {workerClient} from "../../../entrypoint/worker";

export class WorkerHost extends RecievableHost {
    type = "worker"

    sendToClient(message: CommandRequest | CommandResponse): void {
        workerClient.onIncomingMessage(message)
    }

    constructor() {
        super("worker");
    }


}