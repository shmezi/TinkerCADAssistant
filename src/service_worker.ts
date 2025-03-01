import {Command, CommandData, CommandExecutor, runAfterCondition} from "./common";
import MessageSender = chrome.runtime.MessageSender;
import Tab = chrome.tabs.Tab;

const isActive = (message = false) => {
    if (message) console.log("Extension was reloaded, no exception thrown")
    return chrome.runtime?.id

}
const awaitActive = (onActive: () => void) => {
    if (!isActive()) {
        setTimeout(() => {
            awaitActive(onActive)
        }, 100)
        return
    }
    onActive()

}
const commandExecutor = new CommandExecutor()
chrome.runtime.onMessage.addListener((
    command: CommandData,
    sender: MessageSender,
    onComplete: (response: any) => void) => {
    if (!commandExecutor.commands.has(command.id)) return
    commandExecutor.commands.get(command.id)?.execute(command.args, onComplete)
    return true;
})
const sendCommandToTab = (id: number, data: CommandData, response: (data: any) => void) => {
    chrome.tabs.sendMessage(id, data, response)
}

class URLCommand implements Command {
    id: string = "url"

    execute(args: any, onComplete: (response: any) => void): void {
        chrome.tabs.query({active: true, lastFocusedWindow: true}).then((tabs) => {
            if (tabs.length === 0) return
            onComplete(tabs[0].url)
        })
    }
}

class OpenAndFetch implements Command {

    id: string = "openAndFetch"

    execute(url: any, onComplete: (response: JSON) => void) {


        let queryTab: Tab | null

        const sendFetchRequest = (tabID: number) => {
            sendCommandToTab(tabID, new CommandData("fetch", url), (json: JSON) => {
                onComplete(json)
            })
        }
        chrome.tabs.query({active: false, currentWindow: true}).then(tabs => {
            for (const tab of tabs) {
                if (tab.url?.match("https://api-reader.tinkercad.com")) {
                    queryTab = tab
                    break
                }
            }
            if (queryTab && queryTab.id) {
                sendFetchRequest(queryTab.id)
                return
            }
            chrome.tabs.create({url: "https://api-reader.tinkercad.com/users", active: false}).then(newTab => {
                setTimeout(() => {
                    if (!newTab.id) return
                    sendFetchRequest(newTab.id)
                }, 1500)

            })
        })


    }
}


class PageManager {

    tabIDToPage: Map<number, string>
    onVisit = (url: string) => {

    }


    constructor() {
        this.tabIDToPage = new Map<number, string>()
        chrome.history.onVisited.addListener((history) => {
            const pageRegex = /^https:\/\/www\.tinkercad\.com\/(\w+)\/?.*$/gm
            const url = history.url
            if (url?.match(/^https:\/\/www\.tinkercad\.com.+$/gm)) {
                chrome.tabs.query({url: url}).then(tabs => {
                    const tab = tabs[0]


                    const urlPageRegex = pageRegex.exec(url)
                    const pageHandlerID = urlPageRegex?.[1]
                    const newURL = urlPageRegex?.[0]

                    setTimeout(() => {
                        if (!tab || !tab.id) return;

                        sendCommandToTab(tab.id, new CommandData("first", null), (first: boolean) => {
                            if (!tab || !tab.id) {
                                console.log("Tab doesnt have an id or something")
                                return
                            }


                            if ((this.tabIDToPage.get(tab.id) !== newURL || first) && newURL) {
                                if (!tab || !tab.id) return
                                this.tabIDToPage.set(tab.id, newURL)
                                sendCommandToTab(tab.id, new CommandData("change", {
                                    page: pageHandlerID,
                                    url: newURL
                                }), () => {
                                    console.log("Page switched!")
                                })


                            }
                        })


                    }, 2000)


                })


            }
        })


    }


}

/**
 * Registration
 */
new PageManager()
commandExecutor.register(new URLCommand())
commandExecutor.register(new OpenAndFetch())