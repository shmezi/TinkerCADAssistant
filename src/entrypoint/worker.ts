import {info} from "../utils/Logger";
import {CommandMultiplexer} from "../commands/CommandMultiplexer";
import {CommandResponse} from "../commands/data/CommandResponse";

info("Worker has started!")

const multiplexer = new CommandMultiplexer()
chrome.runtime.onMessage.addListener((command: CommandRequest | CommandResponse, sender, sendResponse) => {
    multiplexer.onIncoming(command, sender.tab?.id)
});


//TODO: Replace this block with command framework implementation:
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        try {
            chrome.tabs.sendMessage(tabId, {
                action: "URL_CHANGED",
                url: changeInfo.url
            })
        } catch (_) {

        }
    }
});