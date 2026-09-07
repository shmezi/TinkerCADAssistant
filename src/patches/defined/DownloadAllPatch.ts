import {Patch} from "../Patch";
import {PatchLocation} from "../PatchLocation";
import {mediumButton} from "../../scraping/tinkerbuttons";
import {info} from "../../utils/Logger";
import {extractFromUrl} from "../../scraping/url-extraction";

export class DownloadAllPatch extends Patch {
    id = "download-patch"
    url = /^classrooms\/\w*\/activities\/\w*\?view=work.+$/
    awaitSelector = ".activity-header-left"
    changeSelector = ".activity-header-left"
    location = PatchLocation.CHILD

    patch(): Element {
        return mediumButton("Download projects", async () => {
            info("Print items")
            const activityInfo = extractFromUrl(window.location.href)

            // await mainPageLoader.load(document, "teacher")
        })
    }

}

