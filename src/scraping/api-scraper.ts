// Listener for new events
// Queue requests of data, filterning out duplicates
// I-Frame loading data, maybe in parallel
// Return data when complete

import {waitForSelectorInFrame} from "../utils/advanced-html-events";
import {info} from "../utils/Logger";

const createQueryFrame = (url: string) => {
    const iframe = Object.assign(document.createElement("iframe"), {
        src: url,
        className: "fetcher",
        hidden: true
    })
    return document.body.appendChild(iframe)
}

/**
 * Query a url inside of a containerized iframe.
 * @param url
 */
export const queryInContainer = async (url: string): Promise<unknown> => {
    return new Promise(async (resolve, reject) => {

        let queryFrame = createQueryFrame(url)

        if (!queryFrame.contentDocument) {
            queryFrame.remove()
            return reject(new Error("Document failed to exist!"))
        }

        await waitForSelectorInFrame(queryFrame, ["pre"])


        const content = queryFrame.contentDocument.querySelector("pre")

        if (!content || !content.textContent) {

            queryFrame.remove()
            return reject(new Error("Content failed to load!"))
        }

        const parsed = JSON.parse(content.textContent)
        queryFrame.remove()
        info(parsed)
        return resolve(parsed)


    })

}