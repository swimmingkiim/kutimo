import WCSBaseElement from "wcs-element";

/**
 * RouterPageElement is used on RouterElement.
 * It displays elements for current location.
 */
export default class RouterPageElement extends WCSBaseElement {
  static tagName = "wcs-router-page";

  constructor() {
    super(RouterPageElement.tagName);
    this.props = {
      path: "/",
      elementName: this.getAttribute("element-name")
    };
    this.init({});
  }

  renderHTML(render: (strings: TemplateStringsArray, ...values: unknown[]) => void): void {
    render`<${ this.props.elementName }></${ this.props.elementName }>`;
  }
}
