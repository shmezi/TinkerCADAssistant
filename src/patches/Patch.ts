import {PatchLocation} from "./PatchLocation";

/**
 * A patch is a method to overlay content and embed content directly into the editor in an easy to use fashion
 */
export abstract class Patch {
    abstract url: string
    abstract awaitSelector: string
    abstract changeSelector: string
    abstract location: PatchLocation

    abstract patch(): Element
}