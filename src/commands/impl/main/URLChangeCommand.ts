import {Command, CommandContext} from "../../Command";
import {stripTinkerPrefix} from "../../../patches/PatchHandler";
import {patchHandler} from "../../../entrypoint/main-content";

export class URLChangeCommand extends Command<string> {

    execute(newUrl: string, context: CommandContext) {
        let urlWithoutPrefix = stripTinkerPrefix(newUrl)
        console.log(urlWithoutPrefix)
        patchHandler.onUrlChange(urlWithoutPrefix)

    }

    constructor() {
        super("url_change")
    }


}