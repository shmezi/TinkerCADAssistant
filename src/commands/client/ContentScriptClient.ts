import {CommandClient} from "./CommandClient";
import {CommandRequest} from "../data/CommandRequest";
import {CommandResponse} from "../data/CommandResponse";

export class ContentScriptClient extends CommandClient {
    registerClient(): void {
        this.sendRawCommand(new CommandRequest(this.id, "special", -1, "registerClient", null))
        chrome.runtime.onMessage.addListener((message: CommandRequest | CommandResponse, sender, sendResponse) => {
            this.onIncomingMessage(message)
        });
    }

    protected sendRawCommand(message: CommandRequest | CommandResponse): void {
        chrome.runtime.sendMessage(message);
    }

}