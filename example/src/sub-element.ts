import WCSBaseElement from "web-components-system";
import RouterElement from "../../lib/wcs-route/WCSRouter/router";

export default class SubElement extends WCSBaseElement {
    static tagName = "sub-element";

    constructor() {
        super(SubElement.tagName);
        this.props = {
            name: "default",
        };
        this.import = [];
        this.init();
        this.html`<p>{{ this.props.name }}</p><button on:click="${ this.onGoToSubApp }">go to /sub/app</button>`;
        this.startRender();
    }

    onGoToSubApp() {
        RouterElement.navigate("/sub/app");
    }
}
