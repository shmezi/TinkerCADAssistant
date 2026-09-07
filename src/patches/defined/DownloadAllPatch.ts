import {Patch} from "../Patch";
import {PatchLocation} from "../PatchLocation";
import {mediumButton} from "../../scraping/tinkerbuttons";
import {info} from "../../utils/Logger";

export class DownloadAllPatch extends Patch {
    id = "download-patch"
    url = /^classrooms\/\w*\/activities\/\w*\?view=work.+$/
    awaitSelector = ".activity-header-left"
    changeSelector = ".activity-header-left"
    location = PatchLocation.CHILD

    patch(): Element {
        return mediumButton("Download projects", () => {
            info("Print items")
        })
    }

}

