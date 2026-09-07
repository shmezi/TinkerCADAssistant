import {pollUntil, TimeoutError} from "./polling";
import {warn} from "./Logger";

const TIMEOUT = 5000;


const doAllSelectorsExistOnDocument = (doc: Document | null, selectors: string[]) => {
    console.log(doc)
    console.log(selectors)
    if (!doc) return false

    return selectors.every((selector) => doc.querySelector(selector) != null)
}

export const waitForSelector = (frame: HTMLIFrameElement, selectors: string[]): Promise<void> => {

    return new Promise(async (resolve, reject) => {
        if (!frame.contentDocument) return reject()

        try {
            await pollUntil(() => {
                return doAllSelectorsExistOnDocument(frame.contentDocument, selectors)
            })
            resolve()
        } catch (e: TimeoutError | any) {
            reject(new Error("Could not resolve element with selectors!"))

        }


    })
}