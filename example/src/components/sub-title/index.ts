import WCSBaseElement, { Router } from "web-components-system";
import "./sub-title.css";

export default class SubTitleElement extends WCSBaseElement {
    static tagName = "sub-title";

    constructor() {
        super(SubTitleElement.tagName);
        this.props = {
            name: "default",
        };
        this.import = [];
        this.init();
    }

    renderHTML(render: (strings: TemplateStringsArray, ...values: unknown[]) => void): void {
        render`<p>${this.props.name}</p>`;
    }

    onGoToSubApp() {
        Router.RouterElement.navigate("/sub/app");
    }
}

