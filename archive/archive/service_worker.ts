// import {Command, CommandData, CommandExecutor, DownloadJob} from "./common";
// import MessageSender = chrome.runtime.MessageSender;
//
// const isActive = (message = false) => {
//     if (message) console.log("Extension was reloaded, no exception thrown")
//     return chrome.runtime?.id
//
// }
// const awaitActive = (onActive: () => void) => {
//     if (!isActive()) {
//         setTimeout(() => {
//             awaitActive(onActive)
//         }, 100)
//         return
//     }
//     onActive()
//
// }
// const commandExecutor = new CommandExecutor()
// chrome.runtime.onMessage.addListener((
//     command: CommandData,
//     sender: MessageSender,
//     onComplete: (response: unknown) => void) => {
//     if (!commandExecutor.commands.has(command.id)) return
//     Promise.resolve(commandExecutor.commands.get(command.id)?.execute(command.args)).then(onComplete)
//     return true;
// })
//
// const sendCommandToTab = <TResponse,>(id: number, data: CommandData): Promise<TResponse> => {
//     return new Promise((resolve) => {
//         chrome.tabs.sendMessage(id, data, (response: TResponse) => resolve(response))
//     })
// }
//
// class URLCommand implements Command<void, string | null> {
//     id: string = "url"
//
//     execute = async () => {
//         const tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true})
//         return tabs[0]?.url ?? null
//     }
// }
//
// class OpenAndFetch implements Command<string, unknown> {
//
//     id: string = "openAndFetch"
//
//     execute = async (url: string) => {
//         const tabs = await chrome.tabs.query({})
//         const queryTab = tabs.find((tab) => tab.url?.includes("https://api-reader.tinkercad.com"))
//
//         if (typeof queryTab?.id === "number") {
//             return sendCommandToTab(queryTab.id, new CommandData("fetch", url))
//         }
//
//         const newTab = await chrome.tabs.create({url: "https://api-reader.tinkercad.com/users", active: false})
//         await new Promise((resolve) => setTimeout(resolve, 1500))
//         if (!newTab.id) {
//             return null
//         }
//         return sendCommandToTab(newTab.id, new CommandData("fetch", url))
//     }
// }
//
//
// class PageManager {
//
//     tabIDToPage: Map<number, string>
//     onVisit = (url: string) => {
//
//     }
//
//
//     constructor() {
//         this.tabIDToPage = new Map<number, string>()
//         chrome.history.onVisited.addListener((history) => {
//             const pageRegex = /^https:\/\/www\.tinkercad\.com\/(\w+)\/?.*$/gm
//             const url = history.url
//             if (url?.match(/^https:\/\/www\.tinkercad\.com.+$/gm)) {
//                 chrome.tabs.query({url: url}).then(tabs => {
//                     const tab = tabs[0]
//
//
//                     const urlPageRegex = pageRegex.exec(url)
//                     const pageHandlerID = urlPageRegex?.[1]
//                     const newURL = urlPageRegex?.[0]
//
//                     setTimeout(() => {
//                         if (!tab || !tab.id) return;
//                         const tabID = tab.id;
//
//                         void (async () => {
//                             const first = await sendCommandToTab<boolean>(tabID, new CommandData("first", null))
//
//
//                             if ((this.tabIDToPage.get(tabID) !== newURL || first) && newURL) {
//                                 this.tabIDToPage.set(tabID, newURL)
//                                 await sendCommandToTab(tabID, new CommandData("change", {
//                                     page: pageHandlerID,
//                                     url: newURL
//                                 }))
//                                 console.log("Page switched!")
//
//
//                             }
//                         })()
//
//
//                     }, 2000)
//
//
//                 })
//
//
//             }
//         })
//
//
//     }
//
//
// }
//
// class OpenURL implements Command<string, null> {
//     id = "open"
//     execute = async (url: string) => {
//         await chrome.tabs.create({url: url, active: false})
//         return null
//     }
// }
//
// const download = async (job: DownloadJob): Promise<void> => {
//     await new Promise<void>((resolve) => {
//         chrome.downloads.download({
//             url: `https://csg.tinkercad.com/things/${job.id}/polysoup.${job.format}?rev=-1`,
//             filename: `${job.directory}/${job.name}.${job.format}`
//         }, () => {
//             resolve()
//         });
//     })
// }
//
// class DownloadCommand implements Command<DownloadJob[], null> {
//     id = "download"
//
//     execute = async (jobs: DownloadJob[]) => {
//         await Promise.all(jobs.map((job) => download(job)))
//         return null
//     }
// }
//
// chrome.runtime.onInstalled.addListener(((details) => {
//     chrome.tabs.query({url: "https://api-reader.tinkercad.com/*"}).then(tabs => {
//         for (const tab of tabs) {
//             if (!tab.id) continue
//             chrome.tabs.remove(tab.id)
//         }
//     })
//     chrome.tabs.query({url: "https://www.tinkercad.com/*"}).then(tabs => {
//         for (const tab of tabs) {
//             if (!tab.id) continue
//             chrome.tabs.reload(tab.id)
//         }
//     })
// }))
//
// /**
//  * Registration
//  */
// new PageManager()
// commandExecutor.register(new URLCommand())
// commandExecutor.register(new OpenAndFetch())
// commandExecutor.register(new OpenURL())
// commandExecutor.register(new DownloadCommand())
