import {CommandResponse} from "./data/CommandResponse";

export class CommandMultiplexer {
    private clients = new Map<string, number>()


    sendCommandToTab = (tab: number, command: CommandRequest) => {
        try {
            chrome.tabs.sendMessage(tab, command)
        } catch (_) {

        }
    }

    sendCommand = (command: CommandRequest) => {

    }

    sendResponse = (response: CommandResponse) => {

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

        if (command instanceof CommandResponse){
            this.sendResponse(command)
            return;
        }
        //First handle specialty commands:

        switch (command.command) {
            case "registerClient":
                this.register(command.receivingClient, tab)
                break
            default:
                this.sendCommand(command)
                break
        }
    }

}