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
        console.log("Sending back some stuff :)")
        //Actually running command's action using the arguments provided with the sendResponse back
        command.action(args, sendResponse)

    }
    return true;
});


registerCommand({
    // project.id, project.name, directoryName, format
    command: "download", action: (args, sendResponse) => {

        console.log(args[2])

        chrome.downloads.download({
            url: `https://csg.tinkercad.com/things/${args[1]}/polysoup.${args[4]}?rev=-1`,
            filename: `${args[3]}/${args[2]}.${args[4]}`
        }, function (id) {
            sendResponse(`Downloaded: ${args[1]}`)
        });
        setTimeout(function () {
        }, 500);
    }
})

registerCommand({
    command: "url", action: (args, sendResponse) => {
        chrome.tabs.query({active: true, lastFocusedWindow: true}).then(r => {
            if (r[0])
                sendResponse(r[0].url)

        })

    }
})


registerCommand({
    command: "reload", action: (args, sendResponse) => {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        })
    }
})
registerCommand({
    command: "open", action: (args, sendResponse) => {
        chrome.tabs.create({url: args[1],active:false});
    }
})

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function (details) {
    chrome.tabs.create({url: chrome.runtime.getURL('intro.html')});
})