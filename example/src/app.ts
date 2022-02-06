import WCSBaseElement from "web-components-system";
import WCSHeaderElement from "./components/wcs-header";

export default class AppElement extends WCSBaseElement {
    static tagName = "wcs-app";
    wcsName = "Web Components System";
    constructor() {
        super(AppElement.tagName);
        this.import = [WCSHeaderElement];
        this.init();
    }

    renderHTML(render: (strings: TemplateStringsArray, ...values: unknown[]) => void): void {
        render`
          <div>
            <wcs-header name="Welcome to ${this.wcsName}"></wcs-header>
          </div>`;

    }
}

