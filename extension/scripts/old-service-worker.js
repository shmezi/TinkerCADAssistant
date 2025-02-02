// noinspection DuplicatedCode

let commands = {}
let registerCommand = (command) => {
    commands[command.command] = command
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message) {
        let og = message.value

        let args = og.split("(SPLIT)")
        let command = commands[args[0]]
        if (command === undefined) {
            console.log(`Could not find a command with the name of ${args[0]}`)
            return
        }

        sendResponse(command.action(args, sendResponse))
    }
    return true;
});


registerCommand({
    command: "download",
    action: (args, sendResponse) => {
        chrome.downloads.download({
                url: `https://csg.tinkercad.com/things/${args[2]}/polysoup.${args[4]}?rev=-1`,
                filename: `${args[1]} - ${args[4]}/${args[3]}.${args[4]}`
            },
            function (id) {
                sendResponse(`Downloaded: ${args[1]}`)
            });
        setTimeout(function () {
        }, 500);
    }
})

registerCommand({
    command: "teacher",
    action: (args, sendResponse) => {
        chrome.tabs.create({url: chrome.runtime.getURL("teacherview.html")});
    }
})

registerCommand({
    command: "reload",
    action: (args, sendResponse) => {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        })
    }
})
let prev = ""
const reg = /^https:\/\/www\.tinkercad\.com\/classrooms\/.*\/.*$/;

chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
    console.log(`Update: ${details.frameType}`)
    if (details.url === prev && details.frameType !== "outermost_frame") {
        prev = details.url
        return
    }
    prev = details.url
    console.log(`Details: ${details.url} and it is ${reg.test(details.url)}`)

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            // Send a message to the content script in the active tab
            console.log("Update!")
            let update
            if (reg.test(details.url))
                update = "yes"
            else
                update = "false"
            chrome.tabs.sendMessage(tabs[0].id, {update: update});

        });

});