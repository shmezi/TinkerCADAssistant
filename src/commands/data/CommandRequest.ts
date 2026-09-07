export class CommandRequest {
    origin: string
    destination: string
    reference: number
    command: string
    args: any

    constructor(origin: string,
                destination: string,
                reference: number,
                command: string, args: any) {
        this.origin = origin
        this.destination = destination
        this.reference = reference
        this.command = command
        this.args = args
    }
}