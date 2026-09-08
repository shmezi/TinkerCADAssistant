import {Patch} from "../Patch";
import {PatchLocation} from "../PatchLocation";
import {mediumButton} from "../../scraping/tinkerbuttons";
import {info} from "../../utils/Logger";
import {extractFromUrl} from "../../scraping/url-extraction";
import {queryProjects} from "../../data/DataQuery";
import {DownloadJob} from "../../download/DownloadJob";
import {requestDownload} from "../../data/request-download";

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
            const projects = await queryProjects(activityInfo)
            if (!projects) return
            const jobs = projects.map((project): DownloadJob => {
                return new DownloadJob(project.id, "tinkercad", `${project.description}`, "stl")
            })
            await requestDownload(jobs)


        })
    }

}
