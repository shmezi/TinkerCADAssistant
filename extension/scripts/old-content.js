const regex = /https:\/\/www\.tinkercad\.com\/things\/([^\/-]+)/;
const timeout = 2000

//Global variables
let activity = ""
let projects = []

let inActivityPage = false
let sendCommand = (command, complete) => {
    chrome.runtime.sendMessage({value: command.join("(SPLIT)")}, (response) => {
        complete(response)
    });
}


let downloadAllButton = (format) => {
    return bigButton(`Download ${format}s`, null, () => {
        let counter = 0
        for (const project of projects) {
            if (project.name === ogProjectName || project.name === `Copy of ${ogProjectName}`) {
                counter++
                continue
            }
            sendCommand(["download", activity, project.id, project.student, format], () => {
                counter++
                if (counter >= projects.length) {
                    alert("Downloads finished!")
                }

            })
        }
    })
}
let bigButtonTemplate
let bigButton = (text, description = null, onclick) => {
    if (bigButtonTemplate !== undefined) {
        let b = bigButtonTemplate.clone()
        b.textContent = text

        b.onclick = onclick
        return b
    }
    const button = document.createElement("button");
    button.classList.add("extension")
    button.classList.add("btn", "activities", "btn-white")
    button.style.height = "40px"
    button.style.marginLeft = "10px"
    button.style.fontFamily = "Open Sans, Helvetica, Arial, sans-serif"
    button.textContent = text
    button.onclick = onclick
    return button
}


let smallButtonTemplate

function smallButton(text, project, onclick) {

    if (smallButtonTemplate !== undefined) {
        let b = smallButtonTemplate.clone()
        b.textContent = text
        b.onclick = onclick
        return b
    }

    const ogButton = project.html.querySelector("span").querySelector("a").querySelector("button")
    const templateButton = document.createElement("button");
    for (const c of ogButton.classList) {
        templateButton.classList.add(c)
    }
    templateButton.classList.add("extension")
    templateButton.style.fontSize = "11px"
    templateButton.style.margin = "10px"
    templateButton.style.fontFamily = "artifakt-element, sans-serif"
    templateButton.textContent = text;
    templateButton.onclick = onclick
    return templateButton
}

let passSetup = true
let ogProjectName


let code = "No Code Found!"

function setup() {
    let item = document.querySelector(".classroom-code-generator-code")
    if (item)
        code = item.innerHTML
    if (!inActivityPage || !passSetup) return
    let b = document.querySelector(".extension")
    if (!b) return;
    const article = document.querySelector("#newDesignTemplateButton"); //Reference to 'Create new design button', making sure it is loaded in.
    const checker = document.querySelector(".gallery-box-wrapper")
    const projectName = document.querySelector(".project-name")
    if (checker && projectName) {

        console.log(`Setting up teacher tools now for ${projectName.querySelector("p").innerHTML}`)
        projects = []
        passSetup = false
        //Retrieve students projects and other information!
        activity = projectName.querySelector("p").innerHTML
        let rawProjects = document.querySelectorAll(".gallery-box-wrapper")
        let ogName = document.querySelector(".asset-card-name")
        if (ogName) ogProjectName = ogName.textContent
        for (const rawProject of rawProjects) {
            //ID Finding
            const messID = rawProject.querySelector("a").href
            const cleanID = messID.match(regex);
            const id = cleanID ? cleanID[1] : null;
            //Other constants
            const student = rawProject.querySelector(".author-information").querySelector("a").innerHTML
            const name = rawProject.querySelector(".thing-box-edit-with-information-wrapper").querySelector("a").innerHTML
            projects.push({
                id: id, student: student, name: name, html: rawProject
            })
        }


        //Inital setup here
        let stl = article.insertAdjacentElement("afterend", downloadAllButton("stl"));
        let svg = stl.insertAdjacentElement("afterend", downloadAllButton("svg"));

        let teacher = svg.insertAdjacentElement("afterend", bigButton("Teacher View", null, () => {
            teacherViewEnable(projects)
            console.log("Teacherview enable!")
        }))

        console.log(`A`)
        let index = 0
        for (const project of projects) {
            if (project.name === `Copy of ${ogProjectName}`)
                project.html.querySelector(".thumbnail").style.border = "2px solid red"

            let downloadButtonAction = (format) => {
                sendCommand(["download", activity, project.id, project.student, format], (response) => {
                })
            }
            const og = project.html.querySelector("span").querySelector("a").href

            const downloadButton = smallButton("STL", project, () => {
                downloadButtonAction("stl")
            })

            const tinkerButton = smallButton("Tinker this", project, () => {
            })

            const tinker = document.createElement("a")
            tinker.innerHTML = tinkerButton.outerHTML
            tinker.href = og
            project.html.querySelector("tk-design-dropdown");
            const downloadSVGButton = smallButton("SVG", project, () => {
                downloadButtonAction("svg")
            })

            let location = project.html.querySelector("tk-thing-box").querySelector("div")
            let container = document.createElement("div")
            location.insertAdjacentElement("beforebegin", container)
            container.style.display = "flex"
            container.style.alignItems = "center"
            container.style.justifyContent = "center"
            container.appendChild(tinker)
            container.appendChild(downloadButton)
            container.appendChild(downloadSVGButton)
            index++


        }
        console.log(`B`)

    } else {
        console.log("Currently not in an activity!")
        setTimeout(setup, 2000)
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.update === "yes") {
        inActivityPage = true
        passSetup = true
        setup()
    } else {
        inActivityPage = false
    }
});

/**
 * Teacher view code starts here
 */






let container
let selectionContainer
let selector
let frame

let updateSizing = () => {
    if (container) {
        container.width = (screen.width).toString()
        container.height = (screen.height).toString()
    }
    // if (selector) {
    //     console.log("Resizing the selector!")
    //     // selector.width =  /*(Number(container.width) * 0.2).toString()*/
    //     selector.style.height = "100px"
    // }

    if (frame) {
        frame.width = "90%"
        frame.height = (Number(container.height) * 0.8).toString()
    }

}

function copyTextToClipboard(text) {
    var copyFrom = document.createElement("textarea");

    //Set the text content to be the text you wished to copy.
    copyFrom.textContent = text;

    //Append the textbox field into the body as a child.
    //"execCommand()" only works when there exists selected text, and the text is inside
    //document.body (meaning the text is part of a valid rendered HTML element).
    document.body.appendChild(copyFrom);

    //Select all the text!
    copyFrom.select();

    //Execute command
    document.execCommand('copy');

    //(Optional) De-select the text using blur().
    copyFrom.blur();

    //Remove the textbox field from the document.body, so no other JavaScript nor
    //other elements can get access to this.
    document.body.removeChild(copyFrom);
}

let current = 0
let storedPage
let currentProject
let cacheAll = false
let cachedPages = []
let generatedPages = false
let teacherViewEnable = () => {
    //Main setup logic
    if (projects.length === 0) return
    cachedPages = []
    generatedPages = false

    current = 0
    addEventListener("resize", updateSizing);

    //Remove standard container
    let item = document.querySelector("#main")
    storedPage = item.cloneNode(true)
    item.remove()

    //Create teacher-view container
    container = document.createElement("div")
    container.classList.add("teacher-view")
    container.style.display = "flex"
    container.style.flexDirection = "column"


    updateSizing()
    document.body.appendChild(container)

    let buttonContainer = document.createElement("div")
    buttonContainer.style.display = "flex"
    buttonContainer.style.flexDirection = "row"

    //Back button declaration
    let back = bigButton("Back", null, teacherViewDisable)
    back.style.display = "block"
    buttonContainer.appendChild(back)
    let codeText = bigButton(code, null, () => {
        copyTextToClipboard(code)
    })
    codeText.style.border = "2px solid #FFD700"
    codeText.classList.add("project-content-titles")
    codeText.classList.add("ng-star-inserted")
    codeText.textContent = code

    let downloadButtonAction = (format) => {
        sendCommand(["download", activity, currentProject.id, currentProject.student, format], (response) => {
        })
    }
    let stl = bigButton("STL", null, () => {
        downloadButtonAction("stl")
    })
    let svg = bigButton("SVG", null, () => {
        downloadButtonAction("svg")
    })
    // let switcher = bigButton("switch", null, () => {
    //     cacheAll = !cacheAll
    //     if (!cacheAll) {
    //         let i = 0
    //         if (!generatedPages) {
    //             for (const project of projects) {
    //                 let newFrame = document.createElement("iframe")
    //                 newFrame.src = `https://www.tinkercad.com/things/${projects[i].id}/edit`
    //                 newFrame.style.border = "2px solid blue"
    //                 newFrame.style.display = "none"
    //                 cachedPages.push(newFrame)
    //                 selectionContainer.appendChild(newFrame)
    //                 i++
    //             }
    //             generatedPages = true
    //         }
    //         generatedPages[0].style.display = "initial"
    //         frame.style.display = "none"
    //
    //     } else {
    //         generatedPages[current].style.display = "initial"
    //         switcher.style.border = "none"
    //         frame.style.display = "initial"
    //     }
    //
    //
    // })
    back.style.display = "block"

    buttonContainer.appendChild(stl)
    buttonContainer.appendChild(svg)
    buttonContainer.appendChild(codeText)
    // buttonContainer.appendChild(switcher)
    container.appendChild(buttonContainer)


    //Selection declaration
    selectionContainer = document.createElement("div")
    selectionContainer.style.display = "flex"
    selectionContainer.style.flexDirection = "row"


    //Frame declaration
    frame = document.createElement("iframe")
    frame.src = `https://www.tinkercad.com/things/${projects[0].id}/edit`
    let e = frame.querySelector("#topnav-tinkercad-button")
    if (e)
        e.remove()
    updateSizing()
    selectionContainer.appendChild(frame)


    selector = document.createElement("ul")
    selector.style.width = "10%"
    selector.style.height = `${screen.height * 0.8}px`
    selector.style.overflowY = "scroll"
    selector.style.overflowX = "clip"
    selector.style.display = "flex"
    selector.style.flexDirection = "column"
    selector.style.listStyle = "none"
    selector.style.alignItems = "flex-end"

    // selector.style.alignContent = "end"


    //Creation of items that can be selected
    let index = 0
    for (const project of projects) {
        let li = document.createElement("li")
        let myIndex = Number(index.toString())
        li.style.flexShrink = "1"
        li.style.alignContent = "center"

        console.log(`Activity ${activity}`)
        let button = bigButton(`${project.student}`, null, () => {


            currentProject = project
            console.log(`Previous: ${current} new: ${myIndex}`)
            let items = selector.querySelectorAll(".item")
            items[current].style.border = "none"

            current = myIndex

            items[current].style.border = "2px solid black"
            // selector[current].style.backgroundColor = "red"
            // if (cacheAll) {
            //     cachedPages[myIndex].style.display = "none"
            //     cachedPages[current].style.display = "initial"
            // } else {
            frame.src = `https://www.tinkercad.com/things/${project.id}/edit`
            let e = frame.querySelector("#topnav-tinkercad-button")
            if (e)
                e.remove()
            // }


        })

        button.classList.add("item")

        if (project.name === `Copy of ${ogProjectName}`) button.style.backgroundColor = "red"
        li.appendChild(button)
        index++
        selector.appendChild(li)

    }
    selectionContainer.appendChild(selector)
    container.appendChild(selectionContainer)
    let items = selector.querySelectorAll(".item")
    items[current].style.border = "2px solid black"
    currentProject = projects[0]
    updateSizing()
}
let teacherViewDisable = () => {
    sendCommand(["reload"], () => {
        passSetup = true
        setup()
    })
}

setup()
