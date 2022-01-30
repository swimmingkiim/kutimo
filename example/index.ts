import WCSBaseElement from "wcs-element";

const test = "this is test";

class SubElement extends WCSBaseElement {

    constructor() {
        super("sub-element");
        super.init();
        this.props = {
            name: "default",
        }
        this.html`
            <p>{{this.props.name}}</p>
        `;
    }
}


class SampleElement extends WCSBaseElement {

    constructor() {
        super("test-element");
        this.import = [SubElement];
        this.init({
            count: 0,
            name: "swimmingkiim",
        });
        this.html`
        <div>
            <p>${test}</p>
            <p count="{{this.state.count}}">{{this.state.count}}</p>
            <button on:click="${this.onClickDecrementButton}">decrement</button>
            <button on:click="${this.onClickIncrementButton}">increment</button>
            <sub-element name="{{this.state.count < 3 ? "more" : this.state.name}}"></sub-element>
        </div>`
    }

    onClickIncrementButton() {
        this.setState({
            count: this.state.count + 1,
        })
    }
    onClickDecrementButton() {
        this.setState({
            count: this.state.count - 1,
        })
    }
}
const testElement = new SampleElement();

const wcsRoot = document.createElement("div");
wcsRoot.setAttribute("id", "wcs-root");
document.body.prepend(wcsRoot);
document.body.querySelector("#wcs-root").innerHTML = "<test-element></test-element>";


