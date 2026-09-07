import {Classroom} from "./Classroom";
import {Activity} from "./Activity";
import {Project} from "./Project";
import {Member} from "./Member";

export interface ActivityData {
    clazz: Classroom
    activity: Activity
    projects: Project[]
    studentMap: Map<string, Member>
}