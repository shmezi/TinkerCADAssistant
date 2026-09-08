export class DownloadJob {
    id: string
    directory: string
    name: string
    format: "stl" | "obj" | "svg"

    constructor(id: string,
                directory: string,
                name: string,
                format: "stl" | "obj" | "svg" = "stl") {
        this.id = id;
        this.directory = directory
        this.name = name
        this.format = format
    }
}