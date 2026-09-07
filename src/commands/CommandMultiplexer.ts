import {CommandResponse} from "./data/CommandResponse";
import {CommandRequest} from "./data/CommandRequest";

export const WORKER_CLIENT_ID = "@SERVICEWORKER@"

export class CommandMultiplexer {
    private clients = new Map<string, number>()


    sendToTab = (tab: number, command: CommandRequest | CommandResponse) => {
        try {
            chrome.tabs.sendMessage(tab, command)
        } catch (_) {

        }
    }


    sendCommand = (command: CommandRequest) => {
        if (command.destination == WORKER_CLIENT_ID) {

            return
        }

        const destinationClient = this.clients.get(command.destination)
        if (!destinationClient) throw new Error(`Client ${command.destination} is not registered!`)

        this.sendToTab(destinationClient, command)


    }

    sendResponse = (response: CommandResponse) => {
        if (response.destination == WORKER_CLIENT_ID) {
            return
        }
        const destinationClient = this.clients.get(response.destination)
        if (!destinationClient) throw new Error(`Client ${response.destination} is not registered!`)

        this.sendToTab(destinationClient, response)
    }
    register = (client: string, tab: number) => {
        this.clients.set(client, tab)
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
                this.register(command.origin, tab)
                break
            default:
                this.sendCommand(command)
                break
        }
    }

}