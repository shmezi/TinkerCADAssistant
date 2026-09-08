import {CommandServer} from "../commands/messaging/CommandServer";
import {info} from "../utils/Logger";

/** Register service-worker commands on this exported server. */
export const commandServer = new CommandServer().listen()


info("Worker has started!")

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        try {
            const id = tab.id;
            if (!id) return
            await commandServer.sendCommand(id, "url_change", changeInfo.url)
        } catch (_) {
        }
    }
});
