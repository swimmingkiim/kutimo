import WCSBaseElement from "wcs-element";
import "./index.css";
import "./src/sample.css";

const test = "this is test";

class SubElement extends WCSBaseElement {
    static tagName = "sub-element";

    constructor() {
        super(SubElement.tagName);
        this.props = {
            name: "default",
        };
        this.import = [];
        this.init();
        this.html`<p>{{ this.props.name }}</p>`;
        this.startRender();
    }
}

class AppElement extends WCSBaseElement {
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
        this.html`
      <div>
        <p>${ test }</p>
        <p count="{{ this.state.count }}">{{ this.state.count }}</p>
        <button on:click=" this.onClickDecrementButton }">decrement</button>
        <button on:click=" this.onClickIncrementButton }">increment</button>
        {{ 3 > 5 ? '
        <sub-element name="swimmingkiim"></sub-element>
        ' : '
        <sub-element name="more"></sub-element>
        ' }}
      </div>`;
        this.startRender();
    }

    onBeforeRender(): void {
        if (this.state.count === 5 && this.state.limit < 10) {
            this.setState({
                limit: 10,
            });
        }
    }

    onAfterRender(): void {
        console.log("after app(state): ", this.state);
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

WCSBaseElement.registerTag(AppElement);

const container = document.createElement("div");

container.innerHTML = "<wcs-app></wcs-app>";

document.body.querySelector("#wcs-root").innerHTML = "<wcs-app></wcs-app>";
document.body.querySelector("#wcs-root").appendChild(container);
