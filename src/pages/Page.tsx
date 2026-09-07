import React from "react";

export abstract class Page {
    abstract id: string

    abstract content(): React.ReactNode
}