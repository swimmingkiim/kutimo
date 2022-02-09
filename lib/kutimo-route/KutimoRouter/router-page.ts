import KutimoBaseElement from "kutimo-element";

/**
 * RouterPageElement is used on RouterElement.
 * It displays elements for current location.
 */
export default class RouterPageElement extends KutimoBaseElement {
    static tagName = "kutimo-router-page";

    constructor() {
        super(RouterPageElement.tagName);
        this.props = {
            path: "/",
            schema: "/",
            elementName: this.getAttribute("element-name")
        };
        this.init({});
    }

    renderHTML(render: (strings: TemplateStringsArray, ...values: unknown[]) => void): void {
      const values = this.props.path.split("/");
      const props = this.props.schema.split("/").map((val, idx) => val.startsWith(":") ? {key: val.slice(0), idx} :null).filter((val) => val !== null).map(({key, idx}) => ({key, val: values[idx]}));
      render`<${this.props.elementName} ${props.map(({key, val}) => `prop${key}="${val}"`).join(" ")}></${this.props.elementName}>`;
    }
}
