/* Big button used by TinkerCAD
 * @param text Text that should be inside the big button
 * @param onclick Function called on click of the button
 * @returns {HTMLButtonElement} Returns a big button used in TinkerCAD
 */
export const bigButton = (text: string, onclick: () => void): HTMLButtonElement => {

    const button = document.createElement("button");
    button.textContent = text
    button.onclick = onclick
    button.classList.add("btn", "activities", "btn-white", "big-button")

    button.textContent = text
    button.onclick = onclick
    return button
}

/* Small button used by TinkerCAD
* @param text Text that should be inside the big button
* @param onclick Function called on click of the button
* @returns {HTMLButtonElement} Returns a big button used in TinkerCAD
*/
export const smallButton = (text: string, onclick: () => void): HTMLButtonElement => {
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
export const mediumButton = (text: string, onclick: () => void): HTMLButtonElement => {
    const button = document.createElement("button");
    button.textContent = text
    button.onclick = onclick
    button.classList.add("button-md")
    button.style.background = "#1477d1"

    button.textContent = text
    button.onclick = onclick
    return button
}
