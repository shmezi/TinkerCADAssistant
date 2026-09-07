// import {CommandData, removeBySelector, waitAfterCondition,} from "./common";
// import {CommandExecutor} from "../commands/CommandExecutor";
// import MessageSender = chrome.runtime.MessageSender;
// import {FetchCommand} from "../commands/cmds/FetchCommand";
//
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
//
// const fetcher = async (url: string): Promise<unknown> => {
//     const newFrame = document.createElement("iframe")
//     newFrame.classList.add("fetcher")
//     newFrame.style.display = "none"
//     newFrame.src = url
//     const queryFrame = document.body.appendChild(newFrame)
//
//
//     await waitAfterCondition(() => !!queryFrame.contentDocument?.querySelector("pre"))
//     const queryDocument = queryFrame.contentDocument
//     if (!queryDocument) {
//         queryFrame.remove()
//         return null
//     }
//     const content = queryDocument.querySelector("pre")
//
//     if (!content || !content.textContent) {
//         queryFrame.remove()
//         return null
//     }
//
//     const parsed = JSON.parse(content.textContent)
//     queryFrame.remove()
//     return parsed
// }
//
//
//
//
//
// void waitAfterCondition(() => document.querySelector("pre") !== null).then(() => {
//     removeBySelector(document, [".json-formatter-container", "pre"])
//     const title = document.createElement("h1")
//     title.textContent = "TinkerCAD Assistant Data Query System"
//     const description = document.createElement("h4")
//     description.textContent = "Hey there, TinkerCAD assistant uses this window to collect data for you! (Don't worry all your data stays locally :) )"
//     document.body.appendChild(title)
//     document.body.appendChild(description)
// })
//
// commandExecutor.register(new FetchCommand())
