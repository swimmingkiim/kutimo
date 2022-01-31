import WCSBaseElement from "wcs-element";

const test = "this is test";

class SubElement extends WCSBaseElement {
    static tagName = "sub-element";
    constructor() {
        super(SubElement.tagName);
        this.props = {
            name: "default",
        }
        this.import = [];
        this.init();
        this.html`
            <p>{{this.props.name}}</p>
        `;
        this.startRender();
    }
}


class AppElement extends WCSBaseElement {
    static tagName = "wcs-app";
    constructor() {
        super(AppElement.tagName);
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
        this.startRender();
    }

    onAfterRender(): void {
        console.log("after app(state): ", this.state)
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

WCSBaseElement.registerTag(AppElement)

const wcsRoot = document.createElement("div");
wcsRoot.setAttribute("id", "wcs-root");
document.body.prepend(wcsRoot);

const container = document.createElement("div");

container.innerHTML = "<wcs-app></wcs-app>";

document.body.querySelector("#wcs-root").innerHTML = "<wcs-app></wcs-app>";
document.body.querySelector("#wcs-root").appendChild(container);


