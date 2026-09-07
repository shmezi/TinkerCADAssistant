import {info} from "../utils/Logger";
import {PatchHandler, stripTinkerPrefix} from "../patches/PatchHandler";
import {PageLoader} from "../pages/PageLoader";

info("Main-Content has started!")
export const mainPageLoader = new PageLoader()
const handler = new PatchHandler()

const onPageLoad = async () => {


}

// Listen for messages coming from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "URL_CHANGED") {
        let url: string = message.url
        let urlWithoutPrefix = stripTinkerPrefix(url)
        console.log(urlWithoutPrefix)
        handler.onUrlChange(urlWithoutPrefix)
    }
});


onPageLoad()