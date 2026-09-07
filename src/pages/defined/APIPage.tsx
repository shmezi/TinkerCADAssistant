import {Page} from "../Page";
import React from "react";

export class APIPage extends Page {
    id = "api"

    content = () => <>
        <h1>TinkerCAD-Assistant Fetching API Window</h1>
        <h3>Please don't close the tab while we load your projects!</h3>
    </>

}