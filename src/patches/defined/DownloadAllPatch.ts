import {Patch} from "../Patch";
import {PatchLocation} from "../PatchLocation";
import {mediumButton} from "../../scraping/tinkerbuttons";
import {info} from "../../utils/Logger";
import {extractFromUrl} from "../../scraping/url-extraction";
import {commandClient} from "../../entrypoint/main-content";

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
            const opened = await commandClient.sendCommand("worker", "open_api", null)
            if (!opened.ok) throw new Error(opened.error)

            const value = await commandClient.sendCommand("api", "fetch", "https://api-reader.tinkercad.com/users")
            if (!value.ok) throw new Error(value.error)
            // await mainPageLoader.load(document, "teacher")
            console.log(value.data)
        })
    }

}
