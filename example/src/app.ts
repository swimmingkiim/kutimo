import WCSBaseElement from "web-components-system";
import SubTitleElement from "./components/sub-title";

export default class AppElement extends WCSBaseElement {
    static tagName = "wcs-app";
    wcsName = "Web Components System";
    constructor() {
        super(AppElement.tagName);
        this.import = [SubTitleElement];
        this.init();
    }

    renderHTML(render: (strings: TemplateStringsArray, ...values: unknown[]) => void): void {
        render`
          <div>
            <h1>${this.wcsName}</h1>
            <sub-title name="Welcome to ${this.wcsName}"></sub-title>
          </div>`;

    }
}

