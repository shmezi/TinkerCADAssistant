import {stripTinkerPrefix} from "../patches/PatchHandler";
import {UrlInfo} from "./UrlInfo";

const urlPattern = /^classrooms\/(?<clazz>\w+)(?:\/activities\/(?<activity>\w+))?.*$/

export const extractFromUrl = (url: string): UrlInfo => {
    const groups = urlPattern.exec(stripTinkerPrefix(url))?.groups
    if (!groups) throw new Error(`Could not parse url '${url}'`)

    return {
        clazz: groups.clazz,
        activity: groups.activity ?? null,
    }
}
