import {info} from "../utils/Logger";
import {queryInContainer} from "../scraping/api-scraper";
import {waitForSelectorsInDoc} from "../utils/advanced-html-events";
import {PageLoader} from "../pages/PageLoader";

info("Api-Content has started!")
const loader = new PageLoader()
const onEnable = async () => {
    let value = await queryInContainer("https://api-reader.tinkercad.com/users")
    console.log(value)
    await waitForSelectorsInDoc(document, ["body"])
    await loader.load(document, "api")

}
onEnable()