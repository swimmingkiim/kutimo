import WCSBaseElement from "wcs-element";
/**
 * RouterPageElement is used on RouterElement.
 * It displays elements for current location.
 */
export default class RouterPageElement extends WCSBaseElement {
    static tagName: string;
    constructor();
    renderHTML(render: (strings: TemplateStringsArray, ...values: unknown[]) => void): void;
}
