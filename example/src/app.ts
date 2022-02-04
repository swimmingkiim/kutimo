import WCSBaseElement, { Router, WCSElementState } from "web-components-system";
import SubElement from "./sub-element";
import "../index.css";
import "./sample.css";

const test = "this is test";

export default class AppElement extends WCSBaseElement {
    static tagName = "wcs-app";
    testValue = 5;

    constructor() {
        super(AppElement.tagName);
        this.import = [SubElement];
        this.init({
            count: 0,
            limit: 3,
            name: "swimmingkiim",
        });
    }

    renderHTML(render: (strings: TemplateStringsArray, ...values: unknown[]) => void): void {
        render`
          <div>
            <p>${test}</p>
            <p count="${this.state.count}">${this.state.count}</p>
            <button on:click="${this.onClickDecrementButton}">decrement</button>
            <button on:click="${this.onClickIncrementButton}">increment</button>
            ${this.state.count > this.state.limit ? '<sub-element name="swimmingkiim"></sub-element>' : ' <sub-element name="more"></sub-element>'}
            <button on:click="${this.onGoToSub}">go to /sub</button>
            <button on:click="${this.onGoToHome}">go to home</button>
          </div>`;

    }

    onUpdateState(): (prevState: WCSElementState, currentState: WCSElementState) => void {
        return (prevState, currentState) => {
            console.log("old: ", prevState);
            console.log("new: ", currentState);
        };
    }

    onGoToHome() {
        Router.RouterElement.navigate("/");
    }

    onGoToSub() {
        Router.RouterElement.navigate("/sub");
    }

    onClickIncrementButton() {
        this.setState({
            count: this.state.count + 1,
        });
    }

    onClickDecrementButton() {
        this.setState({
            count: this.state.count - 1,
        });
    }
}

