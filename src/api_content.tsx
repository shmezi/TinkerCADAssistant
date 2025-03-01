import {Command, CommandData, CommandExecutor, onSelectorLoad, removeBySelector, runAfterCondition} from "./common";
import MessageSender = chrome.runtime.MessageSender;

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


const fetcher = (url: string, onComplete: (result: JSON) => void) => {
    const newFrame = document.createElement("iframe")
    newFrame.classList.add("fetcher")
    newFrame.style.display = "none"
    newFrame.src = url
    const queryFrame = document.body.appendChild(newFrame)


    runAfterCondition(() => {
        const queryDocument = queryFrame.contentDocument

        if (!queryDocument) return false

        return queryDocument.querySelector("pre") !== null
    }, () => {
        const queryDocument = queryFrame.contentDocument
        if (!queryDocument) return false
        const content = queryDocument.querySelector("pre")

        if (!content || !content.textContent) return
        console.log(`Fetch success for: ${url}`)
        onComplete(JSON.parse(content.textContent))
        queryFrame.remove()
    })
}


class FetchCommand implements Command {
    id: string = "fetch"
    execute = (url: string, onComplete: (response: JSON) => void) => {
        console.log(`A retrieve occurred for: ${url}`)
        fetcher(url, onComplete)
    }
}

onSelectorLoad(document, ["pre"], () => {
    removeBySelector(document, [".json-formatter-container", "pre"])
    const title = document.createElement("h1")
    title.textContent = "TinkerCAD Assistant Data Query System"
    const description = document.createElement("h4")
    description.textContent = "Hey there, TinkerCAD assistant uses this window to collect data for you! (Don't worry all your data stays locally :) )"
    document.body.appendChild(title)
    document.body.appendChild(description)
})


commandExecutor.register(new FetchCommand())