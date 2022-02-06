import WCSBaseElement from "web-components-system";
import "./wcs-header.css";
import logo from "../../../public/assets/logo.svg";

export default class WCSHeaderElement extends WCSBaseElement {
    static tagName = "wcs-header";

    constructor() {
        super(WCSHeaderElement.tagName);
        this.props = {
            name: "default",
        };
        this.import = [];
        this.init();
    }

    renderHTML(render: (strings: TemplateStringsArray, ...values: unknown[]) => void): void {
        render`<header class="header wrapper">
                <img src="${logo}" />
                <h1 class="header title">${this.props.name}</h1>
              </header>`;
    }
}

