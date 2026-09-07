interface CommandRequest {
    receivingClient: string
    requestingClient: string
    reference: number
    command: string
    args: any
}