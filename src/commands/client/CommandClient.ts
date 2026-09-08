import {CommandRequest} from "../data/CommandRequest";
import {CommandResponse} from "../data/CommandResponse";
import {CommandExecutor} from "../CommandExecutor";

export abstract class CommandClient {
    id: string
    executor = new CommandExecutor()

    private awaitingResponse = new Map<number, (response: CommandResponse) => void>()

    protected abstract sendRawCommand(message: CommandRequest | CommandResponse): void

    private responseForReference = (reference: number) => {
        const retrievedValue = this.awaitingResponse.get(reference)
        if (!retrievedValue) return null

        this.awaitingResponse.delete(reference)
        return retrievedValue
    }

    onIncomingMessage = (message: CommandRequest | CommandResponse) => {
        if (message instanceof CommandResponse) {
            this.responseForReference(message.reference)
            return
        }

        this.executor.execute(message)

    }

    abstract registerClient(): void


    constructor(id: string) {
        this.id = id


    }


}