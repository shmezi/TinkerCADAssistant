import {CommandResponse} from "../data/CommandResponse";
import {CommandRequest} from "../data/CommandRequest";
import {RecievableHost} from "./hosts/RecievableHost";
import {ContentScriptHost} from "./hosts/ContentScriptHost";
import {WorkerHost} from "./hosts/WorkerHost";


export class CommandMultiplexer {
    //ClientId -> Receivable Host
    private clients = new Map<string, RecievableHost>()


    sendCommand = (command: CommandRequest) => {
        const destinationClient = this.clients.get(command.destination)
        if (!destinationClient) throw new Error(`Client ${command.destination} is not registered!`)
        destinationClient.sendToClient(command)
    }

    sendResponse = (response: CommandResponse) => {
        const destinationClient = this.clients.get(response.destination)
        if (!destinationClient) throw new Error(`Client ${response.destination} is not registered!`)
        destinationClient.sendToClient(response)
    }
    registerContentClient = (client: string, tab: number) => {
        this.clients.set(client, new ContentScriptHost(client, tab))
    }

    registerClient = (host: RecievableHost) => {
        this.clients.set(host.hostId, host)
    }
    /**
     * OnIncoming messages / commands from other clients
     * @param command
     * @param tab
     */
    onIncoming = (command: CommandRequest | CommandResponse, tab: number | undefined) => {
        if (!tab) return

        if (command instanceof CommandResponse) {
            this.sendResponse(command)
            return;
        }
        //First handle specialty commands:

        switch (command.command) {
            case "registerClient":
                this.registerContentClient(command.origin, tab)
                break
            default:
                this.sendCommand(command)
                break
        }
    }

    constructor() {
        chrome.runtime.onMessage.addListener((command: CommandRequest | CommandResponse, sender, sendResponse) => {
            this.onIncoming(command, sender.tab?.id)
        });
        this.registerClient(new WorkerHost())

    }

}