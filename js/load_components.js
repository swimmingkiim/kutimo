import { store } from "./init_store.js";
import { getFileName, getFileContentInString } from "./_util.js";

export const loadComponent = async(filePath, payload) => {
    const fileName = getFileName(filePath);
    const fileContent = await getFileContentInString(filePath);
    if (customElements.get(fileName) === undefined) {
        await registerCustomElement(filePath, fileName);
    }
    const Element = customElements.get(fileName);
    return new Element(fileContent, payload);
}

const getAttributesObject = (element) => {
    let result = {};
    Array.from(element.attributes)
            .forEach((attr) => {
                result[attr.name] = attr.value;
            });
    return result;
}

const getComponent = (htmlStr, _payload) => {
    return class extends HTMLElement{
        constructor(fileContent, payload) {
            super()
            this.payload = { ...(_payload ? _payload : {}), ...(payload ? payload : {}) };
            this.template = document.createElement("template");
            this.template.innerHTML = fileContent ? fileContent : htmlStr;
            this.root = this.attachShadow({mode: "open"});
            this.root.appendChild(this.template.content);
            const script = this.root.querySelector("script[name=main]");
            const js = script ? eval(script.innerText) : () => null;
            const props = { ...getAttributesObject(this), _innerHTML: this.innerHTML, ...(this.payload.props ? this.payload.props : {}) };
            const passDown = this.payload.passDown ? this.payload.passDown : null;
            const objToPassDown = js(this.root, props, store, passDown);
            if (this.root.querySelector("link[rel=hcj-import]")) {
                registerCustomElementAll(this.root, objToPassDown);
            }
        }
    }
}

export const registerCustomElement = async(filePath, tagName, payload) => {
    const result = await fetch(filePath);
    const elClass = getComponent(await result.text(), payload);
    customElements.get(tagName) ? null : customElements.define(tagName, elClass);
}

const registerCustomElementAll = (root, payload) => {
    const importList = root.querySelectorAll("link[rel=hcj-import]");
    Array.prototype.forEach.call(importList, (el) => {
        const path = el.href;
        const fileName = getFileName(path);
        registerCustomElement(path, fileName, payload);
    })
}

const main = () => {
    registerCustomElementAll(document, null);
    console.log("init store : ", store);
}

main();

export default registerCustomElementAll;

// const getUniqueTagNames = (parentNode, nodeList) => {
//     if (!parentNode.children) return ;
//     Array.from(parentNode.children).forEach((node) => {
//         !nodeList.includes(node.tagName.toLowerCase()) && nodeList.push(node.tagName.toLowerCase());
//         if (node.children) {
//             getUniqueTagNames(node, nodeList);
//         }
//     })
//     return nodeList;
// }

// console.log(getUniqueTagNames(document, []));
