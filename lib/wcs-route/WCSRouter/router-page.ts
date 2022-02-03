import WCSBaseElement from "wcs-element";

export default class RouterPageElement extends WCSBaseElement {
  static tagName = "wcs-router-page";

  constructor() {
    super(RouterPageElement.tagName);
    this.props = {
      path: "/",
      elementName: this.getAttribute("element-name")
    };
    this.init({});
    this.html`
      {{
      <this.props.elementName></this.props.elementName> }}
    `;
    this.startRender();
  }
}
