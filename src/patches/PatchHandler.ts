import {Patch} from "./Patch";
import {doesSelectorExist} from "../utils/advanced-html-events";
import {PatchLocation} from "./PatchLocation";
import {DownloadAllPatch} from "./defined/DownloadAllPatch";
import {TeacherModePatch} from "./defined/TeacherModePatch";

export const stripTinkerPrefix = (url: string) => url.substring(26)

export class PatchHandler {
    registeredPatches: Array<Patch> = []

    patchesToApplyToPage = new Map<string, Patch>() //Await Selector | Patch


    registerPatch = (patch: Patch) => {
        this.registeredPatches.push(patch)
    }
    clearPatchedElementsFromPage = () => {
        let patchNodes = document.querySelectorAll(".ta-patched")
        for (let patch of patchNodes) {
            patch.remove()
        }
    }


    private applyPatch = (patch: Patch) => {
        let elem = document.querySelector(patch.changeSelector)
        if (!elem) return
        let patchWithMeta = patch.patch()
        patchWithMeta.id = patch.id
        patchWithMeta.classList.add("ta-patched")
        switch (patch.location) {
            case PatchLocation.CHILD:
                elem.appendChild(patchWithMeta)
                break
            case PatchLocation.AFTER:
                elem.insertAdjacentElement("afterend", patchWithMeta)
                break
            case PatchLocation.BEFORE:
                elem.insertAdjacentElement("beforebegin", patchWithMeta)
                break

        }


    }

    patchLoop = () => {
        for (let [key, patch] of this.patchesToApplyToPage) {
            if (doesSelectorExist(document, `#${patch.id}`)) {
                this.patchesToApplyToPage.delete(key)
                continue
            }
            if (!doesSelectorExist(document, key))
                continue
            this.applyPatch(patch)
            this.patchesToApplyToPage.delete(key)
        }
    }



    onUrlChange = (url: string) => {
        this.clearPatchedElementsFromPage()
        this.patchesToApplyToPage.clear()
        for (let patch of this.registeredPatches) {
            if (patch.url.test(url))
                this.patchesToApplyToPage.set(patch.uniqueAwaitSelector(), patch)
        }
    }

    constructor() {
        this.registerPatch(new TeacherModePatch())
        this.registerPatch(new DownloadAllPatch())
        this.onUrlChange(stripTinkerPrefix(window.location.href));

        setInterval(this.patchLoop, 200);
    }
}