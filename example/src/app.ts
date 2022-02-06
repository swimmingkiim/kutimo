import KutimoBaseElement from "kutimo";
import KutimoHeaderElement from "./components/kutimo-header";

export default class AppElement extends KutimoBaseElement {
    static tagName = "kutimo-app";
    kutimoName = "Web Components System";
    constructor() {
        super(AppElement.tagName);
        this.import = [KutimoHeaderElement];
        this.init();
    }

    renderHTML(render: (strings: TemplateStringsArray, ...values: unknown[]) => void): void {
        render`
            <kutimo-header name="Welcome to ${this.kutimoName}"></kutimo-header>`;

    }
}

