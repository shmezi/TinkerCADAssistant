import {CommandClient} from "./CommandClient";
import {CommandRequest} from "../data/CommandRequest";
import {CommandResponse} from "../data/CommandResponse";
import {workerClient} from "../../entrypoint/worker";

export class WorkerClient extends CommandClient {
    registerClient(): void {

    }

    protected sendRawCommand(message: CommandRequest | CommandResponse): void {

    }

}