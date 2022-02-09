import KutimoBaseElement from "kutimo";
import KutimoHeaderElement from "./components/kutimo-header";

export default class AppElement extends KutimoBaseElement {
    static tagName = "kutimo-app";
    kutimoName = "Kutimo - Web Components System";
    constructor() {
        super(AppElement.tagName);
        this.import = [KutimoHeaderElement];
        this.init();
    }

    renderHTML(render: (strings: TemplateStringsArray, ...values: unknown[]) => void): void {
        render`
            <kutimo-header name="Welcome to ${this.kutimoName}"></kutimo-header>`;

    }
    // onAfterRender():void {
    // const paramRegex = /:[a-zA-Z]+/;
    // const replacedRegex = "[a-zA-Z0-9]+";
    // console.log(["/", "/:id"].find((path) => path !== "/" && window.location.pathname.match(path.replace(paramRegex, replacedRegex))));
    // }
}

