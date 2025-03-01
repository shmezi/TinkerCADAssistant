import React from "react"

export class CommandData {
    id: string
    args: any

    constructor(id: string, args: any) {
        this.id = id
        this.args = args
    }
}

export const removeBySelector = (removalDocument: Document, selectors: string[]) => {
    for (const selector of selectors) {
        removalDocument.querySelector(selector)?.remove()
    }
}

export const runAfterCondition = (condition: () => boolean, onComplete: () => void, timeOut = 1000) => {
    if (condition()) {
        onComplete()

        return
    }
    setTimeout(() => {
        runAfterCondition(condition, onComplete, timeOut)
        console.log("WOOP")
    }, timeOut)
}

export interface URLChange {
    page: string,
    url: string
}

export const onSelectorLoad = (loadingDocument: Document, selectors: string[], onComplete: () => void, stillActive: null | (() => boolean) = null) => {
    runAfterCondition(() => {
        if (stillActive && !stillActive()) return true
        for (const selector of selectors) {
            if (!loadingDocument.querySelector(selector)) return false
        }
        return true
    }, () => {
        if (!stillActive || stillActive()) onComplete()
    })
}

export interface Command {
    execute: (args: any, onComplete: (response: any) => void) => void;
    id: string
}

export class CommandExecutor {
    commands: Map<string, Command>

    constructor() {
        this.commands = new Map<string, Command>()

    }

    register = (command: Command) => {
        this.commands.set(command.id, command)
    }

}


/**
 * Big button used by TinkerCAD
 * @param text Text that should be inside the big button
 * @param onclick Function called on click of the button
 * @returns {HTMLButtonElement} Returns a big button used in TinkerCAD
 */
export const bigButton = (text: string, onclick: () => void): HTMLButtonElement => {

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

/**
 * Small button used by TinkerCAD
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
export const smallButton2 = (text: string, onclick: () => void): HTMLButtonElement => {
    const button = document.createElement("button");
    button.textContent = text
    button.onclick = onclick
    button.classList.add("button-md")
    button.style.background = "#1477d1"

    button.textContent = text
    button.onclick = onclick
    return button
}