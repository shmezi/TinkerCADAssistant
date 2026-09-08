import {info} from "../utils/Logger";
import {queryInContainer} from "../scraping/api-scraper";
import {waitForSelectorsInDoc} from "../utils/advanced-html-events";
import {PageLoader} from "../pages/PageLoader";
import {CommandClient} from "../commands/messaging/CommandClient";

info("Api-Content has started!")
export const commandClient = new CommandClient("api")
const pageLoader = new PageLoader()
const onEnable = async () => {
    let value = await queryInContainer("https://api-reader.tinkercad.com/users")
    await waitForSelectorsInDoc(document, ["body"])
    await pageLoader.load(document, "api")
    console.log(value)
}
onEnable()
