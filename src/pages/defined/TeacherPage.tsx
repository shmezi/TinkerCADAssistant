import {Page} from "../Page";
import React from "react";
export class TeacherPage extends Page {
    id = "teacher"

    content = () => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
            <iframe
                src="https://www.tinkercad.com/things/de3kIVirPdZ-copy-of-/edit"
                style={{
                    width: '60vw',
                    height: '80vh',
                    border: 'none'
                }}
            />
        </div>
    )
}