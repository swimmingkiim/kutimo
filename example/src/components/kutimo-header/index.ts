import KutimoBaseElement from "kutimo";
import "./kutimo-header.css";
import logo from "../../../public/assets/logo.svg";

export default class KutimoHeaderElement extends KutimoBaseElement {
    static tagName = "kutimo-header";

    constructor() {
        super(KutimoHeaderElement.tagName);
        this.props = {
            name: "default",
        };
        this.import = [];
        this.init();
    }

    renderHTML(render: (strings: TemplateStringsArray, ...values: unknown[]) => void): void {
        render`<header class="header wrapper">
                <img class="header logo" src="${logo}" />
                <h1 class="header title">${this.props.name}</h1>
              </header>`;
    }
}

