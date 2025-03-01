import {Command, CommandData, CommandExecutor, onSelectorLoad, smallButton, URLChange} from "./common";
import MessageSender = chrome.runtime.MessageSender;

let currentPage: string | null = null
const commandExecutor = new CommandExecutor()
const sendCommand = (data: CommandData, response: (data: any) => void) => {
    chrome.runtime.sendMessage(data, response)
}
chrome.runtime.onMessage.addListener((
    command: CommandData,
    sender: MessageSender,
    onComplete: (response: any) => void) => {
    if (!commandExecutor.commands.has(command.id)) return
    commandExecutor.commands.get(command.id)?.execute(command.args, onComplete)
    return true;
})


interface PageHandler {
    id: string
    onLoad: (url: string) => void

}

const pageElement = (page: string, toModify: string, clazz: string, onLoad: (element: Element) => void) => {
    onSelectorLoad(document, [toModify], () => {
        const elementsToModify = document.querySelectorAll(toModify)
        for (const element of elementsToModify) {
            if (!element) return
            if (element.classList.contains(clazz)) return
            onLoad(element)
            element.classList.add(clazz)
        }
    }, () => currentPage === page)
}
let projectIDRegex = /\/things\/(.{11})/gm

class DashHandler implements PageHandler {
    id = "dashboard"
    onLoad = (url: string) => {
        if (url)
        pageElement(this.id, ".thing-box", "easyTools", (item) => {
            if (!item) return;
            let container = document.createElement("div")
            container.style.padding = "3px"
            container.style.display = "flex"
            container.style.alignItems = "center"
            container.style.justifyContent = "center"
            let id = item.querySelector("a")?.href?.match(projectIDRegex)?.[0]?.replace("/things/", "")
            if (!id) return
            let name = item?.querySelector("h3")?.textContent

            let button = (text: string, onClick: () => void) => {
                let b = smallButton(text, onClick)
                b.style.padding = "4px"
                b.style.margin = "3px"
                b.style.fontSize = "14px"
                b.classList.add("actions")
                // b.style.display = "none"
                container.appendChild(b)
            }

            button("Tinker this", () => {
                console.log("A")
            })
            button("STL", () => {
                console.log("B")

            })
            button("SVG", () => {
                console.log("c")

            })
            // container.style.border = "2px solid #FFD700"

            item?.querySelector(".thumbnail")?.insertAdjacentElement("beforebegin", container)
        })
    }
}


class PageChangeHandler implements Command {
    id: string;
    pages = new Map<string, PageHandler>()

    constructor() {
        this.id = "change"

    }

    execute = (newPage: URLChange, onComplete: (response: any) => void) => {
        console.log(`Changed contexts to: ${newPage.page} Exact URL: ${newPage.url}`)
        currentPage = newPage.page
        this.pages.get(newPage.page)?.onLoad(newPage.url)
    }
    registerPage = (handler: PageHandler) => {
        this.pages.set(handler.id, handler)
    }

}


class FirstActive implements Command {
    execute = (args: any, onComplete: (response: any) => void) => {

        if (document.querySelector("#markerItem")) {
            onComplete(false)
            return
        }
        const newMarker = document.createElement("p")
        newMarker.id = "markerItem"
        document.body.appendChild(newMarker)
        onComplete(true)
    }
    id: string;

    constructor() {
        this.id = "first"
    }
}


commandExecutor.register(new FirstActive())
const pageChangeHandler = new PageChangeHandler()
commandExecutor.register(pageChangeHandler)
pageChangeHandler.registerPage(new DashHandler())
sendCommand(new CommandData("openAndFetch", "https://api-reader.tinkercad.com/designs/detail/cLe5l6nECEG"), (data: JSON) => {
    console.log("FOUND:")
    console.log(data)
})
