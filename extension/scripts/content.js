/**
 *  TinkerCAD assistant was developed by Ezra Golombek 2025.
 */

/**
 * Terms used:
 * UAS - Update and store: Refers to update the current data and store it.
 * UASR - Update and store and reload: Refers to to reload an entire of something and store it.
 */


const PageType = Object.freeze({
    GENERAL: 'general', ACTIVITY: 'activity', TEACHER: 'teacher'
})
/**
 * Utility function to copy text to the user's clipboard functionally :)
 * @param text The text to copy
 */

let copyTextToClipboard = (text) => {
    let copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.blur();
    document.body.removeChild(copyFrom);
}

/**
 * Retrieves from storage an item based on id.
 * @param id ID of the item that was stored
 * @param onComplete Action run on completion
 */
let get = (id, onComplete) => {
    chrome.storage.local.get(["storage"], (data) => {
        let store
        if (!data.storage)
            store = {}
        else
            store = data.storage
        onComplete(store[id])

    })
}
let getKeys = (onComplete) => {
    chrome.storage.local.get(["storage"], (data) => {
        let store
        if (!data.storage)
            store = {}
        else
            store = data.storage
        onComplete(Object.keys(store))
    })
}

/**
 * USE WITH CAUTION, or better yet use the modify function to safely modify items!
 * Set item inside storage using an Id
 * @param id ID of the item that was stored
 * @param value The value to set it to
 * @param onComplete Action run on completion
 */
let unsafeSet = (id, value, onComplete) => {
    chrome.storage.local.get(["storage"], (data) => {
        let store
        if (!data.storage) store = {}
        else
            store = data.storage
        store[id] = value

        chrome.storage.local.set({storage: store}, (data) => {
            onComplete()
        })
    })
}
/**
 * USE WITH CAUTION, or better yet use the modify function to safely modify items!
 * Modify an item inside storage using an Id
 * @param id ID of the item that was stored
 * @param map Modification to run on item
 * @param onComplete Action run on completion
 */
let unSafeModify = (id, map, onComplete) => {
    get(id, (data) => {
        let d
        if (!data) {
            d = {}
        } else {
            d = data
        }

        map(d)
        unsafeSet(id, d, onComplete)

    })
}
let queue = []
/**
 * Recursive function used in conjunction with the queue and modify system.
 * Please avoid calling this method unless you are certain you know what you are doing :)
 * @param obj
 */
let recursive = (obj) => {
    unSafeModify(obj.id, obj.map, () => {
        obj.onComplete()
        queue.shift()
        if (queue.length !== 0)
            recursive(queue[0])
    })
}
/**
 * Modify an item safely that is inside of the database / add it if it does not exist
 * @param id ID of item that should be modified
 * @param map Modification to make on item
 * @param onComplete Run on completion
 */
let modify = (id, map, onComplete = () => {
}) => {
    queue.push({id: id, map: map, onComplete: onComplete})
    if (queue.length === 1)
        recursive(queue[0])
}


/**
 * reWrite this section please :)
 *
 */


/**
 * Big button used by TinkerCAD
 * @param text Text that should be inside the big button
 * @param onclick Function called on click of the button
 * @returns {HTMLButtonElement} Returns a big button used in TinkerCAD
 */
let bigButton = (text, onclick) => {
    const button = document.createElement("button");
    button.textContent = text
    button.onclick = onclick
    button.classList.add("btn", "activities", "btn-white")
    button.style.height = "40px"
    button.style.marginLeft = "10px"
    button.style.fontFamily = "Open Sans, Helvetica, Arial, sans-serif"
    button.textContent = text
    button.onclick = onclick
    return button
}
let downloadAllButton = (format, items) => {
    return bigButton(`Download ${format}s`, () => {
        let counter = 0
        for (const project of items) {
            if (project.name === ogProjectName || project.name === `Copy of ${ogProjectName}`) {
                counter++
                continue
            }
            download(project.id, format, () => {
                counter++
                if (counter >= projects.length) {
                    alert("Downloads finished!")
                }
            })
        }
    })
}

let smallButtonTemplate

function smallButton(text, project, onclick) {

    const ogButton = project.html.querySelector("span").querySelector("a").querySelector("button")
    const smallButton = document.createElement("button");
    for (const c of ogButton.classList) {
        smallButton.classList.add(c)
    }
    smallButton.textContent = text
    smallButton.onclick = onclick
    smallButton.classList.add("extension")
    smallButton.style.fontSize = "11px"
    smallButton.style.margin = "10px"
    smallButton.style.fontFamily = "artifakt-element, sans-serif"
    smallButton.textContent = text;
    smallButton.onclick = onclick
    return smallButton
}


let currentPage = PageType.GENERAL
/**
 * Await for a condition to occur to then run another function.
 * @param condition A function that will determine if can complete.
 * @param onComplete The function to run once condition is met.
 * @param delay Delay in MS to wait before checking again.
 * @param context Context that we should wait inside for.
 * */
let awaitResult = (condition, onComplete, delay = 3000) => {

    setTimeout(() => {
        if (!condition()) return awaitResult(condition, onComplete, delay)

        return onComplete()

    }, delay)
}


let elementListeners = {}

/**
 * Wait for an element to load into the DOM to later be manipulated.
 * @param selector Selector of item to wait for.
 * @param id ID of element that is added
 * @param onComplete Action run on completion.
 * @param delay Delay to wait between checks.
 * @param context Context that we should wait inside for.
 */
let onElementLoad = (selector, id, onComplete, delay = 300, context = PageType.GENERAL) => {

    if (!elementListeners[context]) elementListeners[context] = {}

    console.log(`Searching for selector ${selector} - ${document.querySelector(selector)}`)

    elementListeners[context][id] = elementListeners[context][id] = () => {
        awaitResult(() => {
            // console.log("evaluating")
            if (currentPage !== context) return
            // console.log(`going again ${document.querySelector(selector)}`)
            return document.querySelector(selector) !== undefined && document.querySelector(selector) !== null
        }, () => {
            onComplete(document.querySelector(selector))
        }, delay)
    }


}

/**
 * Listen when an element in the DOM loads to later manipulate. Listens only in specific specified contexts.
 * @param generalSelector Selector of element to wait for.
 * @param id ID of what is going to be added.
 * @param action Manipulation of what was scraped.
 * @param delay Delay in MS of how long to wait between runs
 * @param context Context to run in, see [Page] for reference.
 */
let onElementsLoad = (generalSelector, id, action, delay = 300, context = PageType.GENERAL) => {
    onElementLoad(generalSelector, id, () => {
        for (let item of document.querySelectorAll(generalSelector)) {
            action(item)
        }

    }, delay, context)

}
/**
 * Update which listeners should be running. (THIS DOES NOT DEACTIVATE THEM! however, they automatically shut down if they are loaded in the wrong context :))
 */

let updateActiveElements = () => {

    for (let element of Object.keys(elementListeners)) {
        if (currentPage !== element) continue

        let context = elementListeners[element]

        for (let listener of Object.values(context)) {
            listener()
        }


    }
}

let activityRegex = /^https:\/\/www\.tinkercad\.com\/classrooms\/.+\/activities\/.+$/gm
let tinkerCADURL = /^https:\/\/www\.tinkercad\.com.*$/gm


let getCurrentURL = () => {
    return document.querySelector("#url-check").textContent
}

let setCurrentURL = (url) => {
    let item = document.querySelector("#url-check")
    if (!item) {
        let newItem = document.createElement("p")
        newItem.style.display = "none"
        newItem.textContent = url
        document.appendChild(item)
        item = newItem
    } else {
        item.textContent = url
    }
    return item.textContent
}

/**
 * This is a listener that listens to when the URL is changed!
 * Add actual logic needed here :)
 */
let onURLChange = () => {
    setTimeout(() => {
        sendCommand(["url"], (url) => {
            if (url !== getCurrentURL() && url !== null && url.match(tinkerCADURL)) {
                console.log(`${url}, ${url.match(activityRegex)}`)
                if (url.match(activityRegex)) {
                    currentPage = PageType.ACTIVITY
                } else {
                    currentPage = PageType.GENERAL
                }
                setCurrentURL(url)
                updateActiveElements()
            }
        })
        onURLChange()
    }, 3000)
}
onURLChange()

let frame
/**
 * Returns the current frame that provides as with new information that we can scrape in the background.
 * @returns {Element}
 */
let getFrame = (url) => {
    let queryFrame = document.querySelector("#queryFrame")
    if (queryFrame) {
        if (frame.src !== url) frame.src = url
        return queryFrame
    }
    frame = document.createElement("iframe")
    frame.id = "queryFrame"
    frame.style.display = "none"
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

let download = (id, format, onComplete) => {
    sendCommand(["download", activity, project.id, project.student, format], onComplete)
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
        console.log(`awaiting ${url}`)
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


/**
 * UAS Based action that stores the basic list of classes.
 * NOTE: Please use this function before any other UAS operations since this builds the foundation for everything.
 * @param onComplete Run once the data has been collected.
 */
let sasClasses = (onComplete = () => {
}) => collect("https://www.tinkercad.com/dashboard/classes", ".classes-list", ".classes-list", (item) => {
    return {
        name: item.querySelector(".class-name").querySelector("p").textContent,
        id: item.querySelector(".event-handler").id.replace("Checkbox", "")
    }
}, (clazzes) => {

    let i = 0
    for (let clazz of clazzes) {
        modify(clazz.id, (data) => {
            data.name = clazz.name
            data.id = clazz.id
        }, () => {
            if (++i >= clazzes.length)
                onComplete()
        })
    }


})
/**
 * UAS Based action to store the Student Class Code
 * @param id ID of class
 * @param onComplete Run once complete.
 */
let sasClassCodeOf = (id, onComplete = () => {
}) => {
    get(id, (data) => {

        if (data.code) {
            onComplete()
            return
        }
        collectOne(`https://www.tinkercad.com/classrooms/${id}`, "#teacherTooltipButton", (item) => {
            return item.textContent.replace("Class link: ", "")
        }, (result) => {
            modify(id, (data) => {
                data.code = result
            }, onComplete)
            console.log(`filling in classcode for class of ${id}`)


        })
    })


}
/**
 * UAS Based action to store the activities of a class
 * @param id ID of class
 * @param onComplete Run once complete.
 */
let sasClassActivitiesOf = (id, onComplete = () => {
}) => {
    get(id, (data) => {
        if (data.activities) {
            onComplete()
            return
        }

        collect(`https://www.tinkercad.com/classrooms/${id}/activities`, ".class-project-card-wrapper", ".class-project-card-wrapper", (item) => {
            return {
                id: item.id.replace("ActivityCard", ""), name: item.querySelector("p").textContent
            }
        }, (results) => {
            console.log(results)

            modify(id, (data) => {
                if (!data.activities) data.activities = {}
                for (let result of results) {
                    data.activities[result.id] = result
                }
            }, onComplete)
            console.log(`filling in activities for class of ${id}`)
        })

    })


}

let projectIDRegex = /url\("https:\/\/csg\.tinkercad\.com\/things\/(.+)\/t300-15\.png\?rev=1738623001271000000&s=&v=1"\)/gm
let sasActivityProjectsOf = (clazz, activity, onComplete = () => {
}) => {
    get(clazz, (data) => {
        console.log("Start")
        if (false) {
            onComplete()
            console.log("All activities are up to date!")
            return
        }
        console.log(`Trying to collect for class ${clazz} with activity ${activity}`)

        collect(`https://www.tinkercad.com/classrooms/${clazz}/activities/${activity}`, ".project-students-assets", ".thing-box", (item) => {
            let value = item.querySelector(".turntable-image-container")
            console.log(`Item ${value}`)
            return value
        }, (results) => {
            // console.log(`Results: ${results} ${results}  ${results.match(projectIDRegex).groups}  ${results.match(projectIDRegex)}`)

            modify(clazz, (data) => {
                data.activities[activity].projects = results
            }, onComplete)
            console.log(`filling in all of the activities for activity of ${activity}`)
        })

    })


}
let sasActivityProjectOfClazz = (clazz, onComplete = () => {
}) => {
    get(clazz, (data) => {
        let i = 0
        let items = Object.values(data.activities)
        for (let activity of items) {
            console.log(`ID: ${activity.id}`)
            sasActivityProjectsOf(clazz, activity.id, () => {
                if (++i >= items.length)
                    onComplete()
            })
        }
    })
}


/**
 * UAS Based action to store the students of a class
 * @param id ID of class
 * @param onComplete Run once complete.
 */
let sasClassStudentsOf = (id, onComplete = () => {
}) => {
    get(id, (data) => {
        if (data.students) {
            onComplete()
            return
        }
        collect(`https://www.tinkercad.com/classrooms/${id}/students`, ".table-content", ".table-content", (item) => {
            let username = item.querySelector(".nickname")
            if (!username) {
                username = "not-found"
            } else {
                username = item.querySelector(".nickname").textContent.replaceAll(" ", "")
            }
            let name = item.querySelector("a")
            if (!name) {
                name = "not-found"
            } else {
                name = item.querySelector("a").title
            }

            return {
                id: item.querySelector(".rounded-checkbox").id.replace("StudentCheckbox", ""),
                name: name,
                username: username,
                badgeCount: item.querySelector(".classroom-badge-cell").title.replace("This student has ", "").replace(" badges", "").replace(" badge", "")

            }
        }, (students) => {

            modify(id, (data) => {
                data.students = students
            }, onComplete)
            console.log(`Filling in students for class of ${id}`)

        })
    })

}
/**
 * UASR Based action to store all of a classroom's data.
 * @param id ID of class
 * @param onComplete Run once complete.
 */
let usasAllClassroom = (id, onComplete = () => {
}) => {

    sasClassCodeOf(id, () => {
        sasClassActivitiesOf(id, () => {
            sasActivityProjectOfClazz(id, () => {
                sasClassStudentsOf(id, onComplete)
            })

        })
    })


}
/**
 * Returns the current user that is logged in.
 * @returns {string}
 */
let getCurrentUser = (onRetrieve) => {
    collectOne("https://www.tinkercad.com/dashboard", "tk-header-avatar", (data) => {
        return data.querySelector("img").src.replace("https://api-reader.tinkercad.com/api/user/", "").replace("/images/kursuH3JRXo/t40.jpg", "")
    }, (data) => {
        onRetrieve(data)

    })


}

/**
 * UASR Based action to store all data of all classrooms (Good for initial setup :))
 */
let usasAllData = (onComplete) => {
    sasClasses(() => {

        getKeys((clazzIds) => {
            let i = 0
            for (let key of clazzIds) {
                usasAllClassroom(key, () => {
                    if (++i >= clazzIds.length)
                        onComplete()
                })
            }
        })
    })

}

let updateStorage = () => {
    chrome.storage.local.get("user", (user) => {
        getCurrentUser((username) => {
            if (user.user !== username) {
                console.log("Attempting to rebuild storage cache!")
                chrome.storage.local.clear(() => {
                    chrome.storage.local.set({user: username}, () => {
                        console.log(`Signed-In User changed! Rebuilding Cache`)
                        updateStorage()
                    })
                })
                return
            }
            console.log("Collecting all!")
            usasAllData()


        })

    })


}


/**
 * Implementation of TinkerCAD assistant actual look and feel from here on :)
 */
onElementsLoad(".thing-box", "border", (item) => {
    item.querySelector(".thumbnail").style.border = "2px solid #FFD700"
}, 3000, PageType.GENERAL)

onElementsLoad(".project-toolbar-top", "downloadButtons", (item) => {
    let elem = item.querySelector(".btn-group")
    elem.appendChild(downloadAllButton("stl"))
    elem.appendChild(downloadAllButton("svg"))
}, 3000, PageType.ACTIVITY)


updateStorage()

