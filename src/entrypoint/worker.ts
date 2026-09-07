import {info} from "../utils/Logger";

info("Worker has started!")


// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.url) {
//         const url = new URL(changeInfo.url);
//
//     }
// });


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Only execute when the URL actually changes
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