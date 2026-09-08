import {stripTinkerPrefix} from "../patches/PatchHandler";
import {ExtractedUrlInformation} from "./ExtractedUrlInformation";

const urlPattern = /^classrooms\/(?<clazz>\w+)(?:\/activities\/(?<activity>\w+))?.*$/

export const extractFromUrl = (url: string): ExtractedUrlInformation => {
    const groups = urlPattern.exec(stripTinkerPrefix(url))?.groups
    if (!groups) throw new Error(`Could not parse url '${url}'`)

    return {
        clazz: groups.clazz,
        activity: groups.activity ?? null,
    }
}
