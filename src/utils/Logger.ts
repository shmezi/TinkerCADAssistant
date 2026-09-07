import {ANSI_COLORS} from "./ANSI_COLORS";

export const printToConsole = (prefix: string, color: string, message: string) => {
    console.log(`${color}[${prefix}] ${ANSI_COLORS.BLUE} ${message}`)
}


export const info = (message: string) => {
    printToConsole("info", ANSI_COLORS.CYAN, message)
}

export const warn = (message: string) => {
    printToConsole("warn", ANSI_COLORS.YELLOW, message)
}


export const error = (message: string) => {
    printToConsole("error", ANSI_COLORS.BRIGHT_RED, message)
}