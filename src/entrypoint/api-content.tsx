import {info} from "../utils/Logger";
import {queryInContainer} from "../scraping/api-scraper";
import {waitForSelectorsInDoc} from "../utils/advanced-html-events";
import {PageLoader} from "../pages/PageLoader";
import {CommandClient} from "../commands/messaging/CommandClient";
import {FetchCommand} from "../commands/impl/api/FetchCommand";

info("Api-Content has started!")
export const apiCommandClient = new CommandClient("api")
apiCommandClient.register(new FetchCommand())
const pageLoader = new PageLoader()
const onEnable = async () => {
    let value = await queryInContainer("https://api-reader.tinkercad.com/users")
    await waitForSelectorsInDoc(document, ["body"])
    await pageLoader.load(document, "api")
    console.log(value)
}
onEnable()
