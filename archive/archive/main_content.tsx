// import {
//     bigButton,
//     Command,
//     CommandData,
//     CommandExecutor,
//     copyTextToClipboard,
//     DownloadJob,
//     smallButton,
//     smallButton2,
//     URLChange,
//     waitForSelectors
// } from "./common";
// import {Project} from "../data/Project";
// import {Activity} from "../data/Activity";
// import {Classroom} from "../data/Classroom";
// import {Member} from "../data/Member";
// import {ActivityData} from "../data/ActivityData";
// import {TemplateList} from "../data/TemplateList";
// import MessageSender = chrome.runtime.MessageSender;
//
//
// const sendCommand = <TResponse, >(data: CommandData): Promise<TResponse> => {
//     return new Promise((resolve) => {
//         chrome.runtime.sendMessage(data, (response: TResponse) => resolve(response))
//     })
// }
//
// const getClassByID = async (id: string): Promise<Classroom | undefined> => {
//     const clazzes = await sendCommand<Classroom[]>(new CommandData("openAndFetch", "https://api-reader.tinkercad.com/users/user/groups"))
//     return clazzes.find((clazz) => clazz.id === id)
// }
//
// const getActivityByID = async (id: string): Promise<Activity> => {
//     return sendCommand<Activity>(new CommandData("openAndFetch", `https://api-reader.tinkercad.com/users/user/groups/class/project/${id}`))
// }
//
// const getTemplatesByActivityID = async (id: string): Promise<Project[]> => {
//     const projects = await sendCommand<TemplateList>(new CommandData("openAndFetch", `https://api-reader.tinkercad.com/class/clazz/project/${id}/templates`))
//     return projects.tinkercad
// }
//
// const getProjectsByActivityID = async (id: string): Promise<Project[]> => {
//     const allProjects = await sendCommand<Project[]>(new CommandData("openAndFetch", `https://api-reader.tinkercad.com/class/clazz/project/${id}/designs`))
//     const templateProjects = await getTemplatesByActivityID(id)
//     const templateIDs = new Set(templateProjects.map((item) => item.id))
//     return allProjects.filter((item) => !templateIDs.has(item.id))
// }
//
// const getProjectsByStudentID = async (id: string): Promise<Project[]> => {
//     const projects: Project[] = []
//     let page = 0
//
//     while (true) {
//         const pageProjects = await sendCommand<Project[]>(
//             new CommandData("openAndFetch", `https://api-reader.tinkercad.com/users/${id}/designs?type=tinkercad&page=${page}&pageSize=60`)
//         )
//         projects.push(...pageProjects)
//
//         if (pageProjects.length < 60) {
//             return projects
//         }
//
//         page += 1
//     }
// }
//
// const getStudentsByClazzID = async (id: string): Promise<Member[]> => {
//     const members = await sendCommand<Member[]>(
//         new CommandData("openAndFetch", `https://api-reader.tinkercad.com/users/user/groups/${id}/members?pageSize=2000&type=2&userAvatars=true`)
//     )
//     return members.filter((member) => member.member_id !== "-1")
// }
//
// const getAllStudentProjectsByClazzID = async (id: string): Promise<Project[]> => {
//     const students = await getStudentsByClazzID(id)
//     const projectGroups = await Promise.all(students.map((student) => getProjectsByStudentID(student.member_id)))
//     return projectGroups.flat()
// }
//
//
// const getActivityData = async (clazzID: string, activityID: string): Promise<ActivityData> => {
//     const [activity, clazz, projects, students] = await Promise.all([
//         getActivityByID(activityID),
//         getClassByID(clazzID),
//         getProjectsByActivityID(activityID),
//         getStudentsByClazzID(clazzID),
//     ])
//
//     if (!clazz) {
//         throw new Error(`Class ${clazzID} was not found`)
//     }
//
//     const studentMap = new Map<string, Member>()
//     for (const student of students) {
//         if (!student.member_id) continue
//         studentMap.set(student.member_id, student)
//     }
//
//     return {
//         clazz,
//         activity,
//         projects,
//         studentMap,
//     }
// }
//
//
// let currentPage: string | null = null
// const commandExecutor = new CommandExecutor()
//
//
// abstract class View {
//     abstract id: string
//     abstract defineView: (container: HTMLDivElement) => void | Promise<void>
//
//
//     activate = () => {
//         const main = document.querySelector("#main")
//         if (!main || !(main instanceof HTMLDivElement)) return
//         main.style.display = "none"
//         const viewContainer = document.querySelector(`#${this.id}-view`)
//         if (viewContainer && viewContainer instanceof HTMLDivElement) {
//             viewContainer.style.display = "initial"
//             return;
//         }
//         const newViewContainer = document.createElement("div")
//
//         newViewContainer.id = `${this.id}-view`
//         newViewContainer.classList.add("view")
//         main.insertAdjacentElement("beforebegin", newViewContainer)
//
//         void this.defineView(newViewContainer)
//
//     }
//     deactivate = () => {
//         const main = document.querySelector("#main")
//         const viewContainer = document.querySelector(`#${this.id}-view`)
//         if (!main || !(main instanceof HTMLDivElement)) return
//         main.style.display = "initial"
//         if (viewContainer && viewContainer instanceof HTMLDivElement) {
//             viewContainer.style.display = "none"
//         }
//
//
//     }
// }
//
// class TeacherView extends View {
//     id: string = 'teacher'
//     clazz: string
//     activity: string
//
//     constructor(clazz: string, activity: string) {
//         super();
//         this.clazz = clazz
//         this.activity = activity
//     }
//
//     defineView = async (container: HTMLDivElement) => {
//         const {clazz, projects, studentMap} = await getActivityData(this.clazz, this.activity)
//         const header = document.createElement("div")
//         const row = document.createElement("div")
//         const frameContainer = document.createElement("div")
//         const students = document.createElement("ol")
//         header.classList.add("header", "btn-group")
//         row.classList.add("row-content")
//         frameContainer.id = "teacherFrame"
//
//         const setFrame = (id: string) => {
//             container.querySelector("iframe")?.remove()
//             const newFrame = document.createElement("iframe")
//             newFrame.src = `https://www.tinkercad.com/things/${id}/edit`
//             newFrame.id = id
//             container.querySelector("#teacherFrame")?.appendChild(newFrame)
//         }
//
//         const back = bigButton("Back", () => {
//             this.deactivate()
//         })
//         const code = bigButton(clazz.code, () => {
//             copyTextToClipboard(clazz.code)
//         })
//
//         let previous = projects[0]?.id ?? ""
//         const advanceFrame = () => {
//             const items = Array.from(container.querySelectorAll(".project"))
//             const currentIndex = items.findIndex((item) => item.id === `project-${previous}`)
//             if (currentIndex === -1 || items.length === 0) {
//                 return
//             }
//
//             const nextIndex = (currentIndex + 1) % items.length
//             const nextProject = items[nextIndex]
//             if (nextProject) {
//                 setFrame(nextProject.id.replace("project-", ""))
//             }
//         }
//
//         const select = (id: string) => {
//             document.querySelector(`#project-${previous}`)?.classList.remove("selected")
//             document.querySelector(`#project-${id}`)?.classList.add("selected")
//             setFrame(id)
//             previous = id
//         }
//
//         const updateProjectList = async () => {
//             const projects = await getProjectsByActivityID(this.activity)
//             const projectElem = container.querySelectorAll(".project")
//             const newIDs = projects.map((item) => item.id)
//             const currentIDs = Array.from(projectElem).map((item) => item.id.replace("project-", ""))
//
//             for (const current of currentIDs) {
//                 if (newIDs.includes(current)) continue
//                 if (container.querySelector("iframe")?.id === current) {
//                     advanceFrame()
//                 }
//                 container.querySelector(`#project-${current}`)?.remove()
//             }
//
//             for (const newProject of projects) {
//                 if (currentIDs.includes(newProject.id)) continue
//                 const name = studentMap.get(newProject.user_id)?.screen_name ?? newProject.user_id
//                 const newStudent = smallButton(name, () => {
//                     select(newProject.id)
//                 })
//                 newStudent.classList.add("project")
//                 newStudent.id = `project-${newProject.id}`
//                 students.appendChild(newStudent)
//             }
//         }
//
//         header.appendChild(back)
//         header.appendChild(code)
//         container.appendChild(header)
//         row.appendChild(frameContainer)
//         row.append(students)
//         container.append(row)
//
//         void updateProjectList()
//
//         const firstProject = projects[0]
//         if (firstProject) {
//             select(firstProject.id)
//         }
//     }
//
// }
//
// document.addEventListener('keydown', (event) => {
//     if (event.shiftKey) {
//         for (const elem of document.querySelectorAll('.shift')) {
//             if (!elem) continue
//             elem.classList.add("shiftDown")
//             elem.classList.remove("shiftUp")
//         }
//     }
// })
// document.addEventListener('keyup', (event) => {
//     if (!event.shiftKey) {
//         for (const elem of document.querySelectorAll('.shift')) {
//             elem.classList.add("shiftUp")
//             elem.classList.remove("shiftDown")
//         }
//     }
// })
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
// interface PageHandler {
//     id: string
//     onLoad: (url: string) => void | Promise<void>
//
// }
//
// const pageElement = async (page: string, toModify: string, clazz: string, onLoad: (element: Element) => void) => {
//     await waitForSelectors(document, [toModify], () => currentPage === page)
//     if (currentPage !== page) {
//         return
//     }
//
//     const elementsToModify = document.querySelectorAll(toModify)
//     for (const element of elementsToModify) {
//         if (!element) continue
//         if (element.classList.contains(clazz)) continue
//         onLoad(element)
//         element.classList.add(clazz)
//     }
// }
//
// const download = (downloads: DownloadJob[]) => {
//     void sendCommand<null>(new CommandData("download", downloads))
// }
//
// const prepareDownloadJob = (id: string, directory: string, name: string, format: "stl" | "obj" | "stl"): DownloadJob => {
//     return {
//         id: id,
//         directory: directory,
//         name: name,
//         format: format
//     }
// }
//
// let projectIDRegex = /\/things\/(.{11})/gm
//
// // const teacherView = new TeacherView()
//
// class EasyTools implements PageHandler {
//     id = "dashboard"
//     onLoad = (url: string) => {
//         console.log("EasyTools loadded!")
//         void pageElement(this.id, ".thing-box", "easyTools", (item) => {
//
//             if (!item) return;
//             let container = document.createElement("div")
//             container.style.padding = "3px"
//             container.style.display = "flex"
//             container.style.alignItems = "center"
//             container.style.justifyContent = "center"
//             let projectID = item.querySelector("a")?.href?.match(projectIDRegex)?.[0]?.replace("/things/", "")
//
//
//             let button = (text: string, onClick: () => void) => {
//                 let b = smallButton(text, onClick)
//                 b.style.padding = "4px"
//                 b.style.margin = "3px"
//                 b.style.fontSize = "14px"
//                 b.classList.add("shift")
//                 b.classList.add("shiftUp")
//                 container.appendChild(b)
//             }
//
//             button("Tinker this", () => {
//                 void sendCommand<null>(new CommandData("open", `https://www.tinkercad.com/things/${projectID}/edit`))
//             })
//             button("STL", () => {
//                 let projectName = item?.querySelector("h3")?.textContent
//                 if (!(projectID && projectName)) return
//
//                 const downloadJob: DownloadJob = {
//                     id: projectID,
//                     name: projectName,
//                     directory: "TinkerCADAssistant",
//                     format: "stl"
//                 }
//                 void sendCommand<null>(new CommandData("download", [downloadJob]))
//
//             })
//             button("SVG", () => {
//                 let projectName = item?.querySelector("h3")?.textContent
//                 if (!(projectID && projectName)) return
//                 const downloadJob: DownloadJob = {
//                     id: projectID,
//                     name: projectName,
//                     directory: "TinkerCADAssistant",
//                     format: "svg"
//                 }
//                 void sendCommand<null>(new CommandData("download", [downloadJob]))
//
//             })
//
//             item?.querySelector(".thumbnail")?.insertAdjacentElement("beforebegin", container)
//         })
//     }
// }
//
// class DashboardPageHandler implements PageHandler {
//     id = "dashboard"
//     easyTools = new EasyTools()
//
//
//     onLoad = (url: string) => {
//         console.log("DashBoard area loaded!")
//         const urlPageRegex = /^https:\/\/www\.tinkercad\.com\/(\w+)\/?(\w+)?.*$/
//         const subSiteRegex = urlPageRegex.exec(url)
//         const easyToolsSubSiteLocations = ["designs", "tutorials", "challenges"]
//         let applyEasyTools = false
//         if (!subSiteRegex) return;
//         if (!subSiteRegex[2]) applyEasyTools = true
//         if (easyToolsSubSiteLocations.includes(subSiteRegex[2])) applyEasyTools = true
//         if (applyEasyTools) {
//             this.easyTools.onLoad(url)
//         }
//
//     }
// }
//
//
// // noinspection D
// class ClassroomHandler implements PageHandler {
//     id = "classrooms"
//
//
//     onLoad = (url: string) => {
//         const classRoomRegex = /^https:\/\/www\.tinkercad\.com\/(\w+)\/?(\w+)?\/?(\w+)?\/?(\w+)?.*$/
//         const classRegexExec = classRoomRegex.exec(url)
//         if (!classRegexExec) return;
//         const clazzID = classRegexExec[2]
//         if ((!classRegexExec[3])) { //Landing page of a classroom
//
//             void pageElement(this.id, "#classNameDetailTitle", "downloadAll", (container) => {
//                 if (!(container instanceof HTMLDivElement)) return
//                 const button = smallButton2("Download All", () => {
//                     void (async () => {
//                         const clazz = await getClassByID(clazzID)
//                         if (!clazz) return
//
//                         const students = await getStudentsByClazzID(clazzID)
//                         const names = new Map<string, string>()
//                         for (const student of students) {
//                             names.set(student.member_id, student.screen_name)
//                         }
//
//                         const projects = await getAllStudentProjectsByClazzID(clazzID)
//                         await sendCommand<null>(new CommandData("download", projects.map((item) => {
//                             let tags = item.asm_tags?.replace("/", "-").replace(".", "").replace(" ", "")
//                             if (!tags) tags = "none"
//                             return {
//                                 id: item.id,
//                                 name: `${names.get(item.user_id) ?? item.user_id}${tags}`,
//                                 directory: `TinkerCADAssistant/${clazz.name}`,
//                                 format: "stl"
//                             }
//
//                         })))
//                     })()
//                 })
//                 container.style.display = "flex"
//                 container.style.justifyContent = "space-between"
//                 button.style.width = "15rem"
//                 button.style.marginLeft = "3rem"
//                 button.style.marginRight = "3rem"
//                 container.appendChild(button)
//             })
//
//             return;
//         }
//
//
//         if (!classRegexExec[4]) return//The forth group of the regex expression is the activity ID
//
//         const activityID = classRegexExec[4]
//         const teacherView = new TeacherView(clazzID, activityID)
//         void pageElement(this.id, ".project-toolbar-top", "downloadAll", (parentContainer) => {
//             const container = parentContainer.querySelector(".btn-group")
//             if (!container) return
//             const downloadAllButton = (format: string) => {
//                 container.appendChild(bigButton(`Download ${format}s`, () => {
//                     void (async () => {
//                         const {clazz, activity, projects, studentMap} = await getActivityData(clazzID, activityID)
//                         await sendCommand<null>(new CommandData("download", projects.map((item) => {
//                             return {
//                                 id: item.id,
//                                 name: `${studentMap.get(item.user_id)?.screen_name ?? item.user_id}`,
//                                 directory: `TinkerCADAssistant/${clazz.name}/${activity.name}`,
//                                 format: format
//                             }
//
//                         })))
//                     })()
//                 }))
//             }
//             downloadAllButton("stl")
//             downloadAllButton("svg")
//             downloadAllButton("obj")
//             container.append(bigButton("Teacher View", () => {
//                 teacherView.activate()
//             }))
//         })
//         return;
//
//
//     }
// }
//
// class PageChangeHandler implements Command<URLChange, void> {
//     id: string = "change"
//     pages = new Map<string, PageHandler>()
//
//
//     execute = async (newPage: URLChange) => {
//         console.log(`Changed contexts to: ${newPage.page} Exact URL: ${newPage.url}`)
//         currentPage = newPage.page
//         await this.pages.get(newPage.page)?.onLoad(newPage.url)
//
//     }
//     registerPage = (handler: PageHandler) => {
//         this.pages.set(handler.id, handler)
//     }
//
// }
//
//
// class FirstActive implements Command<void, boolean> {
//     execute = async () => {
//
//         if (document.querySelector("#markerItem")) {
//             return false
//         }
//         const newMarker = document.createElement("p")
//         newMarker.id = "markerItem"
//         document.body.appendChild(newMarker)
//         return true
//     }
//     id: string;
//
//     constructor() {
//         this.id = "first"
//     }
// }
//
//
// commandExecutor.register(new FirstActive())
// const pageChangeHandler = new PageChangeHandler()
// commandExecutor.register(pageChangeHandler)
// pageChangeHandler.registerPage(new DashboardPageHandler())
// pageChangeHandler.registerPage(new ClassroomHandler())
