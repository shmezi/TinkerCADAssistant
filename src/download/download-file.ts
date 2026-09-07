import {DownloadJob} from "./DownloadJob";

export const startDownload = async (job: DownloadJob): Promise<void> => {
    await new Promise<void>((resolve) => {
        chrome.downloads.download({
            url: `https://csg.tinkercad.com/things/${job.id}/polysoup.${job.format}?rev=-1`,
            filename: `${job.directory}/${job.name}.${job.format}`
        }, () => {
            resolve()
        });
    })
}