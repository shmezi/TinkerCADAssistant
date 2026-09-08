import {commandClient} from "../entrypoint/main-content";
import {UrlInfo} from "../scraping/UrlInfo";
import {TinkerProject} from "./TinkerProject";

const TINKER_PREFIX = "https://api-reader.tinkercad.com/"
export const query = async (path: string) => {
    const opened = await commandClient.sendCommand("worker", "open_api", null)
    if (!opened.ok) throw new Error(opened.error)

    const value = await commandClient.sendCommand("api", "fetch", `${TINKER_PREFIX}${path}`)
    if (!value.ok) throw new Error(value.error)
    return value
}

export const queryProjects = async (info: UrlInfo) => {
    const raw: any = (await query(`class/${info.clazz}/project/${info.activity}/designs`)).data
    if (!raw) return
   return (raw as TinkerProject[])


}