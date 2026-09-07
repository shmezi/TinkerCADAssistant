export interface DownloadJob {
    id: string,
    directory: string,
    name: string
    format: "stl" | "obj" | "svg"
}