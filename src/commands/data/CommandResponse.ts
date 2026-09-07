export class CommandResponse {
    origin: string
    destination: string
    reference: number
    content: any

    constructor(origin: string,
                destination: string,
                reference: number,
                content: any) {
        this.origin = origin
        this.destination = destination
        this.reference = reference
        this.content = content

    }
}