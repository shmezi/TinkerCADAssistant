import {Patch} from "../Patch";
import {PatchLocation} from "../PatchLocation";
import {bigButton} from "../../scraping/tinkerbuttons";
import {info} from "../../utils/Logger";
import {mainPageLoader} from "../../entrypoint/main-content";

export class TeacherModePatch extends Patch {
    id = "teacher-view-patch"
    url = /^classrooms\/\w*\/activities\/\w*.+$/
    awaitSelector = ".activity-header-left"
    changeSelector = ".activity-header-left"
    location = PatchLocation.CHILD

    patch(): Element {
        return bigButton("Teacher Mode", async () => {
            info("Loading teacher mode!")
            await mainPageLoader.load(document, "teacher")


        })
    }

}
