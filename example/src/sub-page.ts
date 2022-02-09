import KutimoBaseElement from "kutimo-element";

export default class SubPageElement extends KutimoBaseElement {
    static tagName = "sub-page";
    constructor() {
        super(SubPageElement.tagName);
        this.props = {
            id: this.getAttribute("prop:id"),
        };
        this.init();
    }

    renderHTML(render: (strings: TemplateStringsArray, ...values: unknown[]) => void) {
        render`<div>this is page number ${this.props.id}</div>`;
    }
}
