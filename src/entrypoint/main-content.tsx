import {info} from "../utils/Logger";
import {PatchHandler} from "../patches/PatchHandler";

info("Main-Content has started!")
const handler = new PatchHandler()
const onPageLoad = async () => {


}

// Listen for messages coming from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "URL_CHANGED") {
        let url: string = message.url
        let urlWithoutPrefix = url.substring(26)
        console.log(urlWithoutPrefix)
        handler.onUrlChange(urlWithoutPrefix)
    }
});



onPageLoad()