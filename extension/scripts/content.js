/**
 * Terms used:
 * UAS - Update and store: Refers to update the current data and store it.
 * UASR - Update and store and reload: Refers to to reload an entire of something and store it.
 */


/**
 * Await for a condition to occur to then run another function.
 * @param condition A function that will determine if can complete.
 * @param onComplete The function to run once condition is met.
 * @param delay Delay in MS to wait before checking again.
 */
let awaitResult = (condition, onComplete, delay = 3000) => {
    setTimeout(() => {
        if (!condition()) return awaitResult(condition, onComplete, delay)
        return onComplete()

    }, delay)
}

let frame
/**
 * Returns the current frame that provides as with new information that we can scrape in the background.
 * @returns {Element}
 */
let getFrame = (url) => {
    let queryFrame = document.querySelector("#queryFrame")
    console.log("Building")
    if (queryFrame) {
        if (frame.src !== url) frame.src = url
        return queryFrame
    }
    frame = document.createElement("iframe")
    frame.id = "queryFrame"
    // frame.style.display = "none"
    frame.src = url
    document.body.appendChild(frame)

    return frame
}


/**
 * Send a command to the service worker
 * @param command Command to run
 * @param onComplete Response from command.
 */
let sendCommand = (command, onComplete) => {
    chrome.runtime.sendMessage({value: command.join("(SPLIT)")}, (response) => {
        onComplete(response)

    });
}

let download = (id,format) => {
    sendCommand(["download", activity, project.id, project.student, format], () => {
        counter++
        if (counter >= projects.length) {
            alert("Downloads finished!")
        }

    })
}


let currentURL = ""
/**
 * This is a listener that listens to when the URL is changed!
 * Add actual logic needed here :)
 */
let onURLChange = () => {
    setTimeout(() => {
        onURLChange()
        sendCommand(["url"], (url) => {
            if (url !== currentURL) {
                //OnChange Code here

                currentURL = url
            }
        })
    }, 3000)
}

/**
 * Collect all of a type and manipulate that data in a certain manner.
 * This is based on an iframe.
 */
let currentCollection = null
/**
 * Collect and manipulate data from a page
 * @param url URL to grab data from
 * @param awaitSelector Wait for this selector to be on page before beginning.
 * @param generalSelector Use this selector to grab all the items with it.
 * @param map Run this mapping function to manipulate the data
 * @param onComplete Lambada function called once the collection is complete with the results.
 */
let collect = (url, awaitSelector, generalSelector, map, onComplete) => {
    if (!currentCollection) {
        currentCollection = url

        awaitResult(() => {
            return getFrame(url).contentDocument.querySelector(awaitSelector) !== null
        }, () => {
            let frame = getFrame(url).contentDocument
            let mapped = []
            for (let item of frame.querySelectorAll(generalSelector)) {
                mapped.push(map(item))
            }
            onComplete(mapped)
            currentCollection = null
        })

        return
    }

    awaitResult(() => {
        return currentCollection === null
    }, () => {
        collect(url, awaitSelector, generalSelector, map, onComplete)
    })
}

/**
 * Collect and manipulate data from a page.
 * @param url URL to grab data from
 * @param selector Wait for and collect data from this selector.
 * @param map Run this mapping function to manipulate the data
 * @param onComplete Lambada function called once the collection is complete with the results.
 */
let collectOne = (url, selector, map, onComplete) => {
    if (!currentCollection) {
        currentCollection = url

        awaitResult(() => {
            return getFrame(url).contentDocument.querySelector(selector) !== null
        }, () => {

            let frame = getFrame(url).contentDocument

            onComplete(map(frame.querySelector(selector)))
            currentCollection = null
        }, 300)

        return
    }

    awaitResult(() => {
        return currentCollection === null
    }, () => {
        collectOne(url, selector, map, onComplete)
    }, 300)
}
//Stored and cached class data :)
let clazzes = {}

/**
 * UAS Based action that stores the basic list of classes.
 * NOTE: Please use this function before any other UAS operations since this builds the foundation for everything.
 * @param onComplete Run once the data has been collected.
 */
let uasClassesList = (onComplete = () => {
}) => collect("https://www.tinkercad.com/dashboard/classes", ".classes-list", ".classes-list", (item) => {
    return {
        name: item.querySelector(".class-name").querySelector("p").textContent,
        id: item.querySelector(".event-handler").id.replace("Checkbox", "")
    }
}, (results) => {
    for (let value of results) {
        if (!clazzes[value.id]) clazzes[value.id] = value

    }
    onComplete()
})
/**
 * UAS Based action to store the Student Class Code
 * @param id ID of class
 * @param onComplete Run once complete.
 */
let uasClassCode = (id, onComplete = () => {
}) => {
    collectOne(`https://www.tinkercad.com/classrooms/${id}`, "#teacherTooltipButton", (item) => {
        return item.textContent.replace("Class link: ", "")
    }, (result) => {
        clazzes[id].code = result
        onComplete()
    })
}
/**
 * UAS Based action to store the activities of a class
 * @param id ID of class
 * @param onComplete Run once complete.
 */
let uasClassActivities = (id, onComplete = () => {
}) => {
    collect(`https://www.tinkercad.com/classrooms/${id}/activities`, ".class-project-card-wrapper", ".class-project-card-wrapper", (item) => {
        return {
            id: item.id, name: item.querySelector("p").textContent
        }
    }, (results) => {
        clazzes[id].activies = results
        onComplete()
    })
}
/**
 * UAS Based action to store the students of a class
 * @param id ID of class
 * @param onComplete Run once complete.
 */
let uasClassStudents = (id, onComplete = () => {
}) => {
    collect(`https://www.tinkercad.com/classrooms/${id}/students`, ".table-content", ".table-content", (item) => {
        let username = item.querySelector(".nickname")
        if (!username) username = "not-found"
        else username = item.querySelector(".nickname").textContent.replaceAll(" ", "")
        let name = item.querySelector("a")
        if (!name) name = "not-found"
        else name = item.querySelector("a").title

        return {
            id: item.querySelector(".rounded-checkbox").id.replace("StudentCheckbox", ""),
            name: name,
            username: username,
            badgeCount: item.querySelector(".classroom-badge-cell").title.replace("This student has ", "").replace(" badges", "").replace(" badge", "")

        }
    }, (results) => {
        clazzes[id].students = results
        onComplete()

    })
}
/**
 * UASR Based action to store all of a classroom's data.
 * @param id ID of class
 * @param onComplete Run once complete.
 */
let uasAllClassroom = (id, onComplete = () => {
}) => {
    uasClassCode(id)
    uasClassActivities(id)
    uasClassStudents(id, onComplete)
}
/**
 * UASR Based action to store all data of all classrooms (Good for initial setup :))
 */
let collectAll = () => {
    uasClassesList(() => {
        for (let clazz of Object.values(clazzes)) {
            uasAllClassroom(clazz.id, () => {
                console.log(clazzes[clazz.id])
            })
        }
    })

}


collectAll()