const getComponent = (htmlStr) => {
    return class extends HTMLElement{
        constructor() {
        super()
        this.template = document.createElement("template");
        this.template.innerHTML = htmlStr;
        this.root = this.attachShadow({mode: "open"});
        this.root.appendChild(this.template.content);
        const js = eval(this.root.querySelector("script").innerText);
        js(this.root)
        }
    }
}

const registerCustomElement = (tagName, htmlString) => {
    const elClass = getComponent(htmlString);
    customElements.define(tagName, elClass);
}

const registerCustomElementAll = () => {
    const importList = document.querySelectorAll("link[rel=hcj-import]");
    Array.prototype.forEach.call(importList, async(el) => {
        const path = el.href;
        const fileName = path.match(/([a-z|\-]+\.html)$/)[0].replace(".html", "");
        const result = await fetch(path);
        registerCustomElement(fileName, await result.text());
    })
}

registerCustomElementAll();


const getUniqueTagNames = (parentNode, nodeList) => {
    if (!parentNode.children) return ;
    Array.from(parentNode.children).forEach((node) => {
        !nodeList.includes(node.tagName.toLowerCase()) && nodeList.push(node.tagName.toLowerCase());
        if (node.children) {
            logTagName(node, nodeList);
        }
    })
    return nodeList;
}