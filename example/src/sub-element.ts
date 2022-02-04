import WCSBaseElement, { Router } from "web-components-system";

export default class SubElement extends WCSBaseElement {
    static tagName = "sub-element";

    constructor() {
        super(SubElement.tagName);
        this.props = {
            name: "default",
        };
        this.import = [];
        this.init();
    }

    renderHTML(render: (strings: TemplateStringsArray, ...values: unknown[]) => void): void {
        render`<p>${this.props.name}</p><button on:click="${this.onGoToSubApp}">go to /sub/app</button>`;
    }

    onGoToSubApp() {
        Router.RouterElement.navigate("/sub/app");
    }
}
