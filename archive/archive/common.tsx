// export class CommandData<TArgs = unknown> {
//     id: string
//     args: TArgs
//
//     constructor(id: string, args: TArgs) {
//         this.id = id
//         this.args = args
//     }
// }
// /**
//  * Utility function to copy text to the user's clipboard functionally :)
//  * @param text The text to copy
//  */
//
// export const copyTextToClipboard = (text:string) => {
//     let copyFrom = document.createElement("textarea");
//     copyFrom.textContent = text;
//     document.body.appendChild(copyFrom);
//     copyFrom.select();
//     document.execCommand('copy');
//     copyFrom.blur();
//     document.body.removeChild(copyFrom);
// }
//
// export interface DownloadJob {
//     id: string,
//     directory: string,
//     name: string
//     format: "stl" | "obj" | "svg"
// }
//
//
//
//
// export const removeBySelector = (removalDocument: Document, selectors: string[]) => {
//     for (const selector of selectors) {
//         removalDocument.querySelector(selector)?.remove()
//     }
// }
//
// export const waitAfterCondition = async (condition: () => boolean, timeOut = 1000): Promise<void> => {
//     while (!condition()) {
//         await new Promise((resolve) => setTimeout(resolve, timeOut))
//     }
// }
//
// export interface URLChange {
//     page: string,
//     url: string
// }
//
// export const waitForSelectors = async (
//     loadingDocument: Document,
//     selectors: string[],
//     stillActive: null | (() => boolean) = null,
//     timeOut = 1000
// ): Promise<void> => {
//     await waitAfterCondition(() => {
//         if (stillActive && !stillActive()) {
//             return true
//         }
//
//         for (const selector of selectors) {
//             if (!loadingDocument.querySelector(selector)) {
//                 return false
//             }
//         }
//
//         return true
//     }, timeOut)
//
//     if (stillActive && !stillActive()) {
//         return
//     }
// }
//
//
//
//
//
//
// /**
//  * Big button used by TinkerCAD
//  * @param text Text that should be inside the big button
//  * @param onclick Function called on click of the button
//  * @returns {HTMLButtonElement} Returns a big button used in TinkerCAD
//  */
// export const bigButton = (text: string, onclick: () => void): HTMLButtonElement => {
//
//     const button = document.createElement("button");
//     button.textContent = text
//     button.onclick = onclick
//     button.classList.add("btn", "activities", "btn-white","big-button")
//
//     button.textContent = text
//     button.onclick = onclick
//     return button
// }
//
// /**
//  * Small button used by TinkerCAD
//  * @param text Text that should be inside the big button
//  * @param onclick Function called on click of the button
//  * @returns {HTMLButtonElement} Returns a big button used in TinkerCAD
//  */
// export const smallButton = (text: string, onclick: () => void): HTMLButtonElement => {
//     const button = document.createElement("button");
//     button.textContent = text
//     button.onclick = onclick
//     button.classList.add("btn", "btn-primary", "tinkerButton")
//     button.style.padding = "10px"
//     button.style.marginTop = "5px"
//
//     button.style.fontFamily = "Open Sans, Helvetica, Arial, sans-serif"
//     button.textContent = text
//     button.onclick = onclick
//     return button
// }
// export const smallButton2 = (text: string, onclick: () => void): HTMLButtonElement => {
//     const button = document.createElement("button");
//     button.textContent = text
//     button.onclick = onclick
//     button.classList.add("button-md")
//     button.style.background = "#1477d1"
//
//     button.textContent = text
//     button.onclick = onclick
//     return button
// }
