import {info} from "../utils/Logger";
import {waitForSelectorsInDoc} from "../utils/advanced-html-events";
import {PageLoader} from "../pages/PageLoader";
import {CommandClient} from "../commands/messaging/CommandClient";
import {FetchCommand} from "../commands/impl/api/FetchCommand";

info("Api-Content has started!")

export const apiCommandClient = new CommandClient("api")
const pageLoader = new PageLoader()


const onEnable = async () => {
    await waitForSelectorsInDoc(document, ["body"])
    await pageLoader.load(document, "api")
    apiCommandClient.register(new FetchCommand())
}
onEnable()
