import {PatchLocation} from "./PatchLocation";

/**
 * A patch is a method to overlay content and embed content directly into the editor in an easy to use fashion
 * @param url - Regex to match this patch to
 * @param id - Unique ID of this patch to ensure duplicate patches are not applied!
 * @param awaitSelector - Await on URL page for this elemenet to load
 * @param changeSelector - Make changes to this element
 * @param location - Location of where changes are to be made
 * @param patch - The new element that is added + actions.
 *
 * */
export abstract class Patch {
    abstract url: RegExp
    abstract id: string
    abstract awaitSelector: string
    abstract changeSelector: string
    abstract location: PatchLocation

    abstract patch(): Element
}