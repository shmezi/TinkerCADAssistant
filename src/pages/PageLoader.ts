import {Page} from "./Page";
import {waitForSelectorsInDoc} from "../utils/advanced-html-events";
import {createRoot, Root} from "react-dom/client";
import {APIPage} from "./defined/APIPage";
import {error, info} from "../utils/Logger";


export class PageLoader {

    private root: Root | null = null;

    private pages = new Map<string, Page>()

    private currentPage: string | null = null


    public registerPage = (page: Page) => {
        this.pages.set(page.id, page)
    }

    public load = async (doc: Document, page: string) => {
        info(`Attempting to load ${page}`)

        await waitForSelectorsInDoc(doc, ["body"])
        let newPage = this.pages.get(page)
        if (!newPage) {
            error(`Could not find page of id ${page}`)
            return
        }
        this.currentPage = page
        doc.body.replaceChildren();
        doc.body.style.cssText = "margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: auto;";

        // 3. Create a clean root element instead of attaching directly to doc.body
        let appRoot = doc.getElementById("extension-root");
        if (!appRoot) {
            appRoot = doc.createElement("div");
            appRoot.id = "extension-root";
            doc.body.appendChild(appRoot);
        }

        // 4. Mount React safely
        const root = createRoot(appRoot);
        root.render(newPage.content());


    }

    constructor() {
        this.registerPage(new APIPage())
    }


}