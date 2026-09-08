import {Command, CommandContext} from "../../Command";
import {DownloadJob} from "../../../download/DownloadJob";
import {startDownload} from "../../../download/download-file";


export class DownloadCommand extends Command<DownloadJob[]> {

    execute(jobs: DownloadJob[], context: CommandContext) {

        for (const job of jobs) {
            startDownload(job)
        }


    }

    constructor() {
        super("download")
    }


}