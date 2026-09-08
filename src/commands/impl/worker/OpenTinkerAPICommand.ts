import {Command, CommandContext} from "../../Command";


export class OpenTinkerAPICommand extends Command {

    execute(requested: any, context: CommandContext): Promise<void> {
        const apiURL = "https://api-reader.tinkercad.com/"
        return new Promise(async (resolve, reject) => {
            console.log("Test")
            const tabs = await chrome.tabs.query({url: apiURL})
            if (tabs.length > 0) return resolve()

            const tab = await chrome.tabs.create({
                url: apiURL,
                active: false
            });


            resolve()
        })


    }

    constructor() {
        super("open_api")
    }


}