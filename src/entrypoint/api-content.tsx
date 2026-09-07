import {info} from "../utils/Logger";
import {queryInContainer} from "../scraping/api-scraper";
import {waitForSelectorsInDoc} from "../utils/advanced-html-events";
import {PageLoader} from "../pages/PageLoader";

info("Api-Content has started!")
const pageLoader = new PageLoader()
const onEnable = async () => {
    let value = await queryInContainer("https://api-reader.tinkercad.com/users")
    await waitForSelectorsInDoc(document, ["body"])
    await pageLoader.load(document, "api")
    console.log(value)
}
onEnable()