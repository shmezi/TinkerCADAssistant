import {CommandData} from "../CommandData";
import {MessageType} from "./MessageType";

export const SERVICE_WORKER = "worker"
export const COMMAND_CHANNEL = "tinker-command"
export type CommandDestination = string | number

export interface RegistrationMessage {
    channel: typeof COMMAND_CHANNEL
    type: MessageType.Register
    clientId: string
}

export interface CommandMessage<TArgs = unknown> {
    channel: typeof COMMAND_CHANNEL
    type: MessageType.Command
    id: string
    sender: string
    recipient: CommandDestination
    command: CommandData<TArgs, unknown>
}

export interface CommandResponse<TResponse = unknown> {
    channel: typeof COMMAND_CHANNEL
    type: MessageType.Response
    id: string
    ok: boolean
    data?: TResponse
    error?: string
}

export type Message<TArgs = unknown, TResponse = unknown> =
    RegistrationMessage | CommandMessage<TArgs> | CommandResponse<TResponse>

export const isRegistrationMessage = (value: unknown): value is RegistrationMessage => {
    const message = value as Partial<RegistrationMessage> | null
    return message?.channel === COMMAND_CHANNEL && message.type === MessageType.Register
}

export const isCommandMessage = (value: unknown): value is CommandMessage => {
    const message = value as Partial<CommandMessage> | null
    return message?.channel === COMMAND_CHANNEL && message.type === MessageType.Command
}

export const errorText = (error: unknown): string =>
    error instanceof Error ? error.message : String(error)
