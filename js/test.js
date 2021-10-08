export class BaseComponent extends HTMLElement {
    constructor(str) {
        super();
        const domParser = new DOMParser();
        const dom = domParser.parseFromString(str, "text/html");
        const style = document.createElement("style");
        const script = document.createElement("script");
        style.innerHTML = dom.querySelector("style").innerHTML;
        script.innerHTML = dom.querySelector("script").innerHTML;
        this.template = document.createElement("template");
        this.template.appendChild(style);
        Array.from(dom.querySelector("template").content.childNodes).forEach((child) => this.template.appendChild(child));
        this.template.appendChild(script);
    }
}
