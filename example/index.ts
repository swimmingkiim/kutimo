import WCSBaseElement from "wcs-element";

class SampleElement extends WCSBaseElement {

    constructor() {
        super("test-element");
        super.init({
            count: 0
        });
        this.html`
        <div>
            <p>{{ this.state.count }}</p>
            <button on:click="${this.onClickDecrementButton}">decrement</button>
            <button on:click="${this.onClickIncrementButton}">increment</button>
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


