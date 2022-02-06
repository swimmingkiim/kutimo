import KutimoBaseElement from "kutimo-element";
/**
 * RouterPageElement is used on RouterElement.
 * It displays elements for current location.
 */
export default class RouterPageElement extends KutimoBaseElement {
    static tagName: string;
    constructor();
    renderHTML(render: (strings: TemplateStringsArray, ...values: unknown[]) => void): void;
}
