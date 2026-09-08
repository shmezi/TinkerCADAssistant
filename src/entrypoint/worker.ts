import {info} from "../utils/Logger";
import {CommandMultiplexer} from "../commands/multiplexer/CommandMultiplexer";
import {CommandRequest} from "../commands/data/CommandRequest";
import {WorkerClient} from "../commands/client/WorkerClient";

info("Worker has started!")

const commandMultiplexer = new CommandMultiplexer()
export const workerClient = new WorkerClient("worker")

//TODO: Replace this block with command framework implementation:
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        try {
            const id = tab.id;
            if (!id) return

            const urlChange: CommandRequest = {
                command: "url",
                args: undefined,
                destination: "TODO: The command needs to be added back :)",
                origin: "",
                reference: 0
            }

            commandMultiplexer.sendCommand(urlChange)
        } catch (_) {

        }
    }
});