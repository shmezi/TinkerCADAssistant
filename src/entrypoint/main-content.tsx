import {info} from "../utils/Logger";
import {waitForSelectorsInDoc} from "../utils/advanced-html-events";
import {smallButton2} from "../scraping/tinkerbuttons";

info("Main-Content has started!")

const onPageLoad = async () => {
    await waitForSelectorsInDoc(document, [".activity-header-left"])
    document.querySelector(".activity-header-left")?.appendChild( smallButton2("Download projects", () => {
        info("Print items")
    }))

}
onPageLoad()