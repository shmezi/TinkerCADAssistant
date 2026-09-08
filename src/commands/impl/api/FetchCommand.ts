import {Command, CommandContext} from "../../Command";
import {queryInContainer} from "../../../scraping/api-scraper";
import {apiCommandClient} from "../../../entrypoint/api-content";

export class FetchCommand extends Command<string, any> {

    execute(requested: string, context: CommandContext): Promise<any> {
        return new Promise(async (resolve, reject) => {

            const v = await queryInContainer(requested)

            return resolve(v)
        })
    }

    constructor() {
        super("fetch")
    }


}