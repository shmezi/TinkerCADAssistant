import {CommandServer} from "../commands/messaging/CommandServer";
import {info} from "../utils/Logger";
import {OpenTinkerAPICommand} from "../commands/impl/worker/OpenTinkerAPICommand";
import {DownloadCommand} from "../commands/impl/worker/DownloadCommand";

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
commandServer.register(new OpenTinkerAPICommand())

commandServer.register(new DownloadCommand())