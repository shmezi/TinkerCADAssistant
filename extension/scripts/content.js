/**
 *  TinkerCAD assistant was developed by Ezra Golombek 2025.
 */

/**
 * Terms used:
 * UAS - Update and store: Refers to update the current data and store it.
 * UASR - Update and store and reload: Refers to to reload an entire of something and store it.
 */


const PageType = Object.freeze({
    GENERAL: 'general',
    ACTIVITY: 'activity',
    TEACHER: 'teacher',
    CLASSES: 'classes',
    GALLERY: 'gallery',
    ACTIVITIES: 'activities'
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
    if (!isActive()) {

        return
    }
    chrome.storage.local.get(["storage"], (data) => {
        let store
        if (!data.storage) {
            store = {}
        } else {
            store = data.storage
        }
        onComplete(store[id])

    })
}
/**
 * Retrieve all class IDS
 * @param onComplete Callback including all of the keys
 */
let getKeys = (onComplete) => {
    if (!isActive()) {

        return
    }
    chrome.storage.local.get(["storage"], (data) => {
        let store
        if (!data.storage) {
            store = {}
        } else {
            store = data.storage
        }
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
    if (!isActive()) {

        return
    }
    chrome.storage.local.get(["storage"], (data) => {
        let store
        if (!data.storage) {
            store = {}
        } else store = data.storage
        {
            store[id] = value
        }

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
        if (queue.length !== 0) recursive(queue[0])
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
    if (queue.length === 1) recursive(queue[0])
}


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
    button.style.overflow = "hidden"
    button.style.textOverflow = "ellipsis"
    button.style.whiteSpace = "nowrap"
    button.style.fontFamily = "Open Sans, Helvetica, Arial, sans-serif"
    button.textContent = text
    button.onclick = onclick
    return button
}

let downloadAllButton = (format, directoryName, items) => {
    return bigButton(`Download ${format}s`, () => {
        let counter = 0
        for (const project of Object.values(items)) {
            // if (project.name === ogProjectName || project.name === `Copy of ${ogProjectName}`) {
            //     counter++
            //     continue
            //TODO: ADD BACK!
            // }

            download({
                id: project.id.replace(" ", ""),
                downloadName: project.downloadName.replace(/ /g, '')
            }, directoryName, format, () => {
                counter++
                if (counter >= projects.length) {
                    alert("Downloads finished!")
                }
            })
        }
    })
}


/**
 * Small button used by TinkerCAD
 * @param text Text that should be inside the big button
 * @param onclick Function called on click of the button
 * @returns {HTMLButtonElement} Returns a big button used in TinkerCAD
 */
let smallButton = (text, onclick) => {
    const button = document.createElement("button");
    button.textContent = text
    button.onclick = onclick
    button.classList.add("btn", "btn-primary", "tinkerButton")
    button.style.padding = "10px"
    button.style.marginTop = "5px"

    button.style.fontFamily = "Open Sans, Helvetica, Arial, sans-serif"
    button.textContent = text
    button.onclick = onclick
    return button
}
let smallButton2 = (text, onclick) => {
    const button = document.createElement("button");
    button.textContent = text
    button.onclick = onclick
    button.classList.add("button-md")
    button.style.background = "#1477d1"

    button.textContent = text
    button.onclick = onclick
    return button
}


let exampleDownloadItem = {
    id: "TinkerCAD ID",
    downloadName: "name"
}


let currentPage = PageType.GENERAL
/**
 * Await for a condition to occur to then run another function.
 * @param condition A function that will determine if can complete.
 * @param onComplete The function to run once condition is met.
 * @param delay Delay in MS to wait before checking again.
 * @param context Context that we should wait inside for.
 * */
let awaitResult = (condition, onComplete, delay = 1000) => {

    setTimeout(() => {
        let state = condition()
        if (!state) {
            return awaitResult(condition, onComplete, delay)
        }

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
    console.log(`Current context: ${currentPage}, context for item set to ${context}`)

    elementListeners[context][id] = () => {
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
    console.log(`Moved to context of :${currentPage}, now updating all matching elements!`)
    for (let contextID of Object.keys(elementListeners)) {
        if (currentPage !== contextID) continue

        let context = elementListeners[contextID]

        for (let listener of Object.values(context)) {
            listener()
            console.log("Listening!")
        }


    }
}

let activityRegex = /^https:\/\/www\.tinkercad\.com\/classrooms\/.+\/activities\/.+$/gm
let tinkerCADURL = /^https:\/\/www\.tinkercad\.com.*$/gm
let classesRegex = /^https:\/\/www\.tinkercad\.com\/dashboard\/classes$/gm
let activitiesRegex = /^https:\/\/www\.tinkercad\.com\/classrooms\/.+\/activities$/gm

let getCurrentURL = (onComplete, delay = 100) => {

    awaitResult(() => {
        let item = document.querySelector("#urlchecker")
        if (!item) {
            sendCommand(["url"], (url) => {
                setCurrentURL(url)
            })
            return false
        }
        if (item.textContent !== undefined && item.textContent !== null) return true
    }, () => {
        onComplete(document.querySelector("#urlchecker").textContent)
    }, delay)


}

let setCurrentURL = (url) => {
    let item = document.querySelector("#urlchecker")
    if (!item) {
        let newItem = document.createElement("p")
        newItem.style.display = "none"
        newItem.textContent = url
        newItem.id = "urlchecker"

        document.body.appendChild(newItem)
    } else {
        item.textContent = url
    }

}


/**
 * This is a listener that listens to when the URL is changed!
 * Add actual logic needed here :)
 */
let first = true
let onURLChange = () => {
    setTimeout(() => {
        sendCommand(["url"], (url) => {

            getCurrentURL((newURL) => {
                if ((url !== newURL && url !== null) || first) {
                    if (url.match(tinkerCADURL)) {
                        if (url.match(activityRegex)) {
                            currentPage = PageType.ACTIVITY
                        } else if (url.match(classesRegex)) {
                            currentPage = PageType.CLASSES
                        } else if (url.match(activitiesRegex)) {
                            currentPage = PageType.ACTIVITIES
                        } else {
                            currentPage = PageType.GENERAL
                        }
                        setCurrentURL(url)
                        updateActiveElements()
                        first = false
                    }

                }
            })

        })
        onURLChange()
    }, 100)
}
onURLChange()


let frame
/**
 * Returns the current frame that provides as with new information that we can scrape in the background.
 * NOTE: Please be warry! if you are scraping a few sites that have the same selectors make sure to blank out the url each run see example in collect.
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
 * Utility to make sure the extension is still not reloaded to prevent the extension once reloaded not throwing exceptions :)
 * @param message Weather a message should be sent when this happens
 * @returns Returns if it is active or not.
 */
let isActive = (message = false) => {
    if (message) console.log("Extension was reloaded, no exception thrown")
    return chrome.runtime?.id

}
/**
 * Send a command to the service worker
 * @param command Command to run
 * @param onComplete Response from command.
 */
let sendCommand = (command, onComplete) => {
    if (!isActive()) {

        return
    }

    chrome.runtime.sendMessage({value: command.join("(SPLIT)")}, (response) => {
        onComplete(response)

    });
}
/**
 * Download a project
 * @param project Download object, see example objects for example.
 * @param directoryName Name of directory that the items will be downloaded to
 * @param format Format to download the items as (STL SVG etc)
 * @param onComplete Callback run once download complete.
 */
let download = (project, directoryName, format, onComplete) => {
    sendCommand(["download", project.id, project.downloadName, directoryName, format], onComplete)
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
 * @param reason
 * @param secondary Secondary actions that can be run to collect all the needed info
 */
let collect = (url, awaitSelector, generalSelector, map, onComplete, reason = null, secondary) => {
    if (reason) console.log(`Searching because ${reason} URL: ${url}`)
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

            getFrame("")
            if (secondary) {
                onComplete(mapped, secondary(frame))
            } else {
                onComplete(mapped)
            }
            currentCollection = null
        })

        return
    }

    awaitResult(() => {
        return currentCollection === null
    }, () => {
        collect(url, awaitSelector, generalSelector, map, onComplete, reason)
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
            getFrame("")
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
let sasGeneralClasses = (onComplete = () => {
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
            if (++i >= clazzes.length) onComplete()
        })
    }


})

/**
 * UAS Based action to store the Student Class Code
 * @param id ID of class
 * @param onComplete Run once complete.
 * @param force
 */
let sasStudentCodeOfClass = (id, onComplete = () => {
}, force = false) => {
    get(id, (data) => {

        if (data.code && !force) {
            onComplete()
            console.log("All class codes are up to date!")
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
 * @param clazzID ID of class
 * @param onComplete Run once complete.
 * @param force
 */
let sasClassActivitiesOf = (clazzID, onComplete = () => {
}, force = false) => {
    get(clazzID, (data) => {


        if (data.activities && !force) {
            onComplete()
            console.log("All activities are up to date!")
            return
        }

        collect(`https://www.tinkercad.com/classrooms/${clazzID}/activities`, ".class-project-card-wrapper", ".class-project-card-wrapper", (item) => {


            return {
                id: item.id.replace("ActivityCard", ""), name: item.querySelector("p").textContent
            }
        }, (results) => {

            modify(clazzID, (data) => {
                if (!data.activities) data.activities = {}
                for (let result of results) {
                    if (!data.activities[result.id])
                        data.activities[result.id] = result
                }
            }, onComplete)
            console.log(`filling in activities for class of ${clazzID}`)
        }, `Data collection ${clazzID}`)

    })


}
document.addEventListener('keydown', (event) => {
    if (event.shiftKey) {
        console.log("Shift down")
        for (const elem of document.querySelectorAll('.actions')) {
            elem.style.display = "initial"
        }
    }
})
document.addEventListener('keyup', (event) => {
    if (!event.shiftKey) {
        console.log("Shift Up")
        for (const elem of document.querySelectorAll('.actions')) {
            elem.style.display = "none"
        }
    }
})

let projectIDRegex = /\/things\/(.{11})/gm
/**
 * UAS Based action to store the projects of an activity
 * @param clazz ID of class
 * @param activity ID of activity
 * @param onComplete Run once complete.
 * @param force Weather this action should be run overriding old data
 */
let sasGetProjectsOfActivity = (clazz, activity, onComplete = () => {
}, force = false) => {
    get(clazz, (data) => {
        if (data.activities[activity].projects && /*data.activities[activity].ogFiles &&*/ !force) {
            onComplete()
            console.log("All activities are up to date!")
            return
        }

        collect(`https://www.tinkercad.com/classrooms/${clazz}/activities/${activity}`, ".project-students-assets", ".thing-box", (item) => {
            let author = (/.+(\w{11}).+/gm).exec(item.querySelector(".author-information").querySelector("a").href)[1]
            let value = item.querySelector("a").href.match(projectIDRegex)[0].replace("/things/", "")
            let name = item.querySelector("h3").textContent

            return {
                id: value,
                name: name,
                author: author,
            }

        }, (results, secondaryResult) => {
            // console.log(`Results: ${results} ${results}  ${results.match(projectIDRegex).groups}  ${results.match(projectIDRegex)}`)

            modify(clazz, (data) => {
                data.activities[activity].projects = {}
                data.activities[activity].ogFiles = {}
                for (let file of secondaryResult) {
                    data.activities[activity].ogFiles[file.id] = file
                }
                for (let project of results) {
                    data.activities[activity].projects[project.id] = project
                }
            }, onComplete)
            console.log(`filling in all of the projects in the activity of ${activity}`)
        }, null, (frame) => {
            let files = []
            if (!frame.querySelector(".asset-card-wrapper")) return []
            for (const ogFile of frame.querySelectorAll(".asset-card-wrapper")) {
                let item = ogFile.querySelector(".asset-card-title")
                files.push({
                    id: item.id.replace("TemplateDesignHeaderCard", ""),
                    name: item.querySelector("p").textContent
                })
            }
            return files
        })

    })


}

/**
 * UAS Based action to store the projects of all the activities of a class
 * @param clazz ID of class
 * @param onComplete Run once complete.
 * @param force Weather this action should be run overriding old data
 */
let sasGetAllProjectsOfActivitiesOfClazz = (clazz, onComplete = () => {
}, force = false) => {
    get(clazz, (data) => {
        let i = 0
        let items = Object.values(data.activities)
        for (let activity of items) {
            sasGetProjectsOfActivity(clazz, activity.id, () => {
                if (++i >= items.length) onComplete()
            }, force)
        }
    })
}


/**
 * UAS Based action to store the students of a class
 * @param id ID of class
 * @param onComplete Run once complete.
 * @param force
 */
let sasGetStudentsOfClass = (id, onComplete = () => {
}, force = false) => {
    get(id, (data) => {
        if (data.students && !force) {
            onComplete()
            console.log("All students are up to date!")
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
                if (!data.students) data.students = {}
                for (let student of students) {
                    data.students[student.id] = student
                }

            }, onComplete)

        })
    })

}
/**
 * UASR Based action to store all of a classroom's data.
 * @param id ID of class
 * @param onComplete Run once complete.
 * @param force
 */
let usasAllClassroom = (id, onComplete = () => {
}, force = false) => {

    sasStudentCodeOfClass(id, () => {
        sasClassActivitiesOf(id, () => {
            sasGetAllProjectsOfActivitiesOfClazz(id, () => {
                sasGetStudentsOfClass(id, onComplete, force)
            }, force)
        }, force)
    }, force)


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
let usasAllData = (onComplete = () => {
}) => {
    sasGeneralClasses(() => {

        getKeys((clazzIds) => {
            let i = 0
            for (let key of clazzIds) {
                usasAllClassroom(key, () => {
                    if (++i >= clazzIds.length) onComplete()
                })
            }
        })
    })

}
/**
 * Run general update sequence on storage.
 * Checking in general items that have never been adding them adding them.
 * This does not completely rebuild the storage.
 */
let updateStorage = () => {
    if (!isActive()) {

        return
    }
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
let views = {}

let enableView = (id, enable, disable) => {
    let og = document.querySelector("#main")
    og.style.display = "none"
    views[id] = {id: id, enable: enable, disable: disable}
    let container = document.createElement("div")
    container.classList.add("view")
    document.body.appendChild(container)
    enable(container)

}

let disableView = (id) => {
    let og = document.querySelector("#main")
    og.style.display = "block"

    for (let item of document.querySelectorAll(".view")) {
        console.log("Removed")
        item.remove()
    }
    views[id].disable()
}

function contains_heb(str) {
    return (/[\u0590-\u05FF]/).test(str);
}

let galleryViewEnable = (projects = null) => enableView("gallery",
    (container) => {
        currentPage = PageType.GALLERY

        let frame = document.createElement("iframe")
        let h1 = document.createElement("h2")
        h1.style.height = "5vh"
        h1.style.width = "100vw"
        h1.style.dir = "auto"


        container.appendChild(h1)

        container.appendChild(frame)


        let setFrame = (id, name) => {
            console.log(`Setting frame to ID of ${id}`)
            frame.src = `https://www.tinkercad.com/things/${id}/edit`
            if (contains_heb(name)) {
                h1.style.textAlign = "right"
            } else h1.style.textAlign = "left"
            h1.innerText = name
            awaitResult(() => {
                return frame.contentDocument.querySelector("#viewcube-home-button") && currentPage === PageType.GALLERY
            }, () => {
                frame.contentDocument.querySelector("#sidebarContainer").remove()
                frame.contentDocument.querySelector(".editor__tab__subnav").remove()
                frame.contentDocument.querySelector(".editor__topnav").remove()
                frame.contentDocument.querySelector(".hud").remove()
                let canvas = frame.contentDocument.querySelector("canvas")
                canvas.style.width = "100vw"
                frame.style.height = "95vh"
            }, 300)
        }
        frame.style.width = "100vw"
        frame.style.height = "95vh"
        let i = 1

        let loop = (projects) => {
            setTimeout(() => {
                if (currentPage !== PageType.GALLERY)
                    return

                if (projects.length <= i)
                    i = 0

                setFrame(projects[i].id, projects[i].name)
                i++

                loop(projects)

            }, 20000)
        }

        if (projects) {
            setFrame(projects[0].id, projects[0].name)
            loop(projects)
        } else {
            getGalleryProjects((projects) => {
                setFrame(projects[0].id, projects[0].name)
                loop(projects)
            })
        }
        container.appendChild(bigButton("Back", () => {
            disableView("gallery")
        }))


    }, () => {


    })
let getGalleryProjects = (onComplete) => {
    let projects = []
    let i = 0
    getKeys((keys => {
        for (const clazzID of keys) {
            get(clazzID, (clazz) => {
                console.log(`Retrieved class of id ${clazzID}`)
                let students = []
                for (const student of Object.values(clazz.students)) {
                    if (student.badgeCount !== "0" && student.badgeCount !== null && student.badgeCount !== undefined) {
                        students.push(student.id)
                    }
                }
                for (const activity of Object.values(clazz.activities)) {
                    for (const project of Object.values(activity.projects)) {
                        if (students.includes(project.author)) {
                            projects.push(project)
                            console.log(`Pushing project to items: ${project.id}`)
                        }

                    }
                }
                //Hey there, since this whole thing is async, this needs to be done here :) Not outsideo f hte get(method) since this just has a callback and the rest continues onward :)
                if (++i >= keys.length) {
                    onComplete(projects)
                }
            })

        }

    }))

}


let teacherViewEnable = () => enableView("teacher", (container) => {
    currentPage = PageType.TEACHER

    let header = document.createElement("div")
    let row = document.createElement("div")


    let frame = document.createElement("iframe")
    let studentList = document.createElement("ul")


    let previous
    let setFrame = (id, elem) => {
        frame.src = `https://www.tinkercad.com/things/${id}/edit`
        if (previous) {
            previous.style.border = "none"
        }
        elem.style.border = "2px solid #FFD700"
        previous = elem

    }

    frame.style.border = "none"
    frame.style.width = "87vw"
    frame.style.height = "92vh"
    header.style.height = "8vh"
    header.style.display = "flex"
    header.style.alignItems = "center"
    header.style.justifyContent = "center"

    // studentList.style.alignItems = "center"
    studentList.style.width = "13vw"
    studentList.style.listStyleType = "none"
    studentList.style.padding = "0"
    studentList.style.display = "inline"
    studentList.style.overflow = "hidden"
    studentList.style.overflowY = "scroll"
    studentList.style.height = "90vh"
    row.style.display = "flex"

    container.appendChild(header)
    row.appendChild(frame)
    row.appendChild(studentList)
    container.appendChild(row)


    getCurrentActivityAndClassID((clazzID, activityID) => {
        get(clazzID, (clazz) => {
            header.classList.add("btn-group")
            header.style.display = "flex"
            header.style.padding = "1%"
            header.appendChild(bigButton("Back", () => {
                disableView("teacher")
                currentPage = PageType.ACTIVITY
            }))
            header.appendChild(bigButton("Reload", () => {
                update(() => {
                })
            }))
            let autoPlaying = false

            let autPlayLoop = () => {
                setTimeout(() => {
                    if (autoPlaying && currentPage === PageType.TEACHER) {
                        let items = document.querySelectorAll(".selection")
                        let next = false
                        let i = 0
                        for (const item of items) {
                            if (++i >= items.length) {
                                setFrame(items[0].id, items[0])
                            }
                            if (next) {
                                setFrame(item.id, item)
                                break
                            }
                            if (item === previous) {
                                next = true
                            }
                        }
                        autPlayLoop()
                    }
                }, 30000)
            }
            let autoButton = bigButton("Auto", () => {
                autoPlaying = !autoPlaying
                if (autoPlaying) {
                    autoButton.style.backgroundColor = "#4076c7"
                    autoButton.style.color = "#fff"
                } else {
                    autoButton.style.backgroundColor = "#fff"
                    autoButton.style.color = "#4076c7"
                }

                autPlayLoop()
            })
            header.appendChild(autoButton)

            header.appendChild(bigButton(clazz.code, () => copyTextToClipboard(clazz.code.replaceAll("-", ""))))
            let first = true
            for (let project of Object.values(clazz.activities[activityID].projects)) {

                let b = smallButton(clazz.students[project.author].name, () => {
                    setFrame(project.id, b)
                })
                if (first) {
                    setFrame(project.id, b)
                    first = false
                }
                b.id = project.id
                b.classList.add("selection")
                b.style.width = "13vw"
                studentList.appendChild(b)

            }
            let update = (onComplete) => {
                get(clazzID, (clazz) => {


                    let getProjects = () => {
                        let a = clazz.activities[activityID].projects
                        for (let value of Object.values(a)) {
                            console.log(`Item: ${value.id}`)
                        }

                        return a
                    }
                    let projectIDS = () => {
                        let ids = []
                        for (const project of Object.values(getProjects())) {
                            ids.push(project.id)
                        }
                        return ids
                    }


                    let alreadyActive = []
                    sasGetStudentsOfClass(clazzID, () => {
                        sasClassActivitiesOf(clazzID, () => {

                        }, true)
                        sasGetProjectsOfActivity(clazzID, activityID, () => {

                            let ids = projectIDS()
                            for (const elem of document.querySelectorAll(".selection")) {
                                if (!ids.includes(elem.id)) {
                                    elem.remove()
                                } else {
                                    alreadyActive.push(elem.id)
                                }
                            }

                            for (const project of Object.values(getProjects())) {
                                console.log(project.id)
                                if (alreadyActive.includes(project.id)) {

                                    continue
                                }
                                console.log(`Adding button for: ${project.id}`)
                                let b = smallButton(clazz.students[project.author].name, () => {
                                    setFrame(project.id, b)
                                })
                                b.id = project.id
                                b.classList.add("selection")
                                b.style.width = "13vw"
                                studentList.appendChild(b)

                            }
                            onComplete()


                        }, true)

                    }, true)
                })

            }
            let loop = () => {
                setTimeout(() => {
                    update(() => {

                        if (currentPage === PageType.TEACHER)
                            loop()
                        else {
                            console.log("Update loop stopped!")
                        }
                    })

                }, 5000)
            }
            loop()


        })
    })


}, () => {
})


/**
 * finds the id of the class that is currently on screen in
 * @param onFound Callback called in including id of the class
 */
let getCurrentClazzID = (onFound) => {
    getCurrentURL((data) => {
        let clazzRegex = /(https:\/\/www\.tinkercad\.com\/classrooms\/)(\w+)\/?(.+)*\/(\w+)/gm
        let v = clazzRegex.exec(data)

        console.log(`Found data: ${v[2]}`)
        onFound(v[2])

    }, 100)
}

/**
 * finds the id of the activity that is currently on screen in
 * @param onFound
 */
let getCurrentActivityAndClassID = (onFound) => {
    let clazzRegex = /(https:\/\/www\.tinkercad\.com\/classrooms\/)(\w+)\/?(.+)*\/(\w+)/gm

    getCurrentURL((data) => {
        let d = clazzRegex.exec(data)
        onFound(d[2], d[4])
    }, 100)
}
let getCurrentClazz = (onFound) => {
    getCurrentClazzID((clazzId) => {
        get(clazzId, (clazz) => {
            onFound(clazz)
        })
    })
}
let getCurrentActivity = (onFound) => {
    getCurrentActivityAndClassID((clazzID, activityID) => {
        get(clazzID, (clazz) => {
            onFound(clazz.activities[activityID])
        })
    })
}

let test = () => {
    console.log("Test")
}
let main = () => {
    onURLChange()

    /**
     * Implementation of TinkerCAD assistant actual look and feel from here on :)
     */
    onElementLoad(".left-actions", "gallery", (container) => {
        let elem = smallButton2("Gallery", () => {
            galleryViewEnable()
        })
        container.querySelector("#newClassButton").insertAdjacentElement('afterend', elem)

    }, 500, PageType.CLASSES)

    let easyTools = (context) => {
        onElementsLoad(".thing-box", "border", (item) => {
            let container = document.createElement("div")
            container.style.padding = "3px"
            container.style.display = "flex"
            container.style.alignItems = "center"
            container.style.justifyContent = "center"
            let id = item.querySelector("a").href?.match(projectIDRegex)[0]?.replace("/things/", "")
            if (!id) return
            let name = item.querySelector("h3").textContent

            let button = (text, onClick) => {
                let b = smallButton(text, onClick)
                b.style.padding = "4px"
                b.style.margin = "3px"
                b.style.fontSize = "14px"
                b.classList.add("actions")
                b.style.display = "none"
                container.appendChild(b)
            }

            button("Tinker this", () => {
                sendCommand(["open", `https://www.tinkercad.com/things/${id}/edit`, () => {
                }])
            })
            button("STL", () => {
                download({
                    id: id.replace(" ", ""),
                    downloadName: name.replace(/ /g, '')
                }, "tinkerAssistant", "stl", () => {
                })

            })
            button("SVG", () => {
                download({
                    id: id.replace(" ", ""),
                    downloadName: name.replace(/ /g, '')
                }, "tinkerAssistant", "stl", () => {
                })

            })
            // container.style.border = "2px solid #FFD700"

            item.querySelector(".thumbnail").insertAdjacentElement("beforebegin", container)

        }, 3000, context)

    }
    easyTools(PageType.GENERAL)
    easyTools(PageType.ACTIVITY)

    onElementLoad(".class-projects-list-toolbar", "gallery", (container) => {
        let elem = bigButton("Gallery", () => {
            getCurrentClazz((clazz) => {
                let projects = []
                for (const activities of Object.values(clazz.activities)) {
                    for (const project of Object.values(activities.projects)) {
                        projects.push(project)
                    }
                }
                galleryViewEnable(projects)
            })


        })
        let header = document.querySelector(".class-projects-list-toolbar")
        header.style.display = "flex"
        elem.style.marginLeft = "5px"
        header.appendChild(elem)


    }, 500, PageType.ACTIVITIES)

    onElementsLoad(".project-toolbar-top", "downloadButtons", (item) => {
        let elem = item.querySelector(".btn-group")
        elem.appendChild(bigButton("Teacher view", () => {
            teacherViewEnable()
        }))

        elem.appendChild(bigButton("Gallery", () => {
            getCurrentActivity((activity) => {
                galleryViewEnable(Object.values(activity.projects))
            })
        }))
        getCurrentActivityAndClassID((clazzID, activityID) => {
            get(clazzID, (clazz) => {
                let activityName = clazz.activities[activityID].name
                let projects = clazz.activities[activityID].projects
                let newProjects = {}

                for (let project of Object.values(projects)) {
                    newProjects[project.id] = {
                        id: project.id,
                        downloadName: clazz.students[project.author].name.replace(/ /g, '')
                    }
                    console.log(clazz.students[project.author].name.replace(/ /g, ''))

                }

                let directoryName = `${clazz.name.replace(/ /g, '')}/${activityName.replace(/ /g, '')}`

                console.log(`Directory: ${directoryName}`)


                elem.appendChild(downloadAllButton("stl", directoryName, newProjects))
                elem.appendChild(downloadAllButton("svg", directoryName, newProjects))
            })

        })


    }, 3000, PageType.ACTIVITY)


    updateStorage()
}
main()



