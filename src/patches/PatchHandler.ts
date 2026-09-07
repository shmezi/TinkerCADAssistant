import {Patch} from "./Patch";
import {doesSelectorExist} from "../utils/advanced-html-events";
import {PatchLocation} from "./PatchLocation";
import {DownloadAllPatch} from "./defined/DownloadAllPatch";

export class PatchHandler {
    registeredPatches: Array<Patch> = []

    patchesToApplyToPage = new Map<string, Patch>()


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
                this.patchesToApplyToPage.set(patch.awaitSelector, patch)
        }
    }

    constructor() {
        this.registerPatch(new DownloadAllPatch())

        setInterval(this.patchLoop, 200);
    }
}