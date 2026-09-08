import {RecievableHost} from "./RecievableHost";
import {CommandResponse} from "../../data/CommandResponse";
import {CommandRequest} from "../../data/CommandRequest";

export class ContentScriptHost extends RecievableHost {
    type = "content-script"
    tab: number

    sendToClient(message: CommandRequest | CommandResponse): void {
        try {
            chrome.tabs.sendMessage(this.tab, message)
        } catch (_) {

        }
    }

    constructor(host: string, tab: number) {
        super(host)
        this.tab = tab
    }


}