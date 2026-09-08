import {DownloadJob} from "../download/DownloadJob";
import {commandClient} from "../entrypoint/main-content";

export const requestDownload = async (jobs: DownloadJob[]) => {
    await commandClient.sendCommand("worker", "download", jobs)
}