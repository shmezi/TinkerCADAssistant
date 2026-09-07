import {stripTinkerPrefix} from "../patches/PatchHandler";
import {ExtractedUrlInformation} from "./ExtractedUrlInformation";

const urlStripper = /^classrooms\/(?<clazz>\w+)(\/activities\/(?<activity>\w+))?.+$/gm;

export const extractFromUrl = (url: string): ExtractedUrlInformation => {
    const strippedPrefx = stripTinkerPrefix(url)
    const groups = urlStripper.exec(strippedPrefx)?.groups
    if (!groups) throw new Error(`Could not parse url '${url}'`)
    return {
        clazz: groups["clazz"],
        activity: groups["activity"]
    }
}