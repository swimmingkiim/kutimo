import { store } from "./init_store.js";
import { getFileName } from "./_util.js";


const getAttributesObject = (element) => {
    let result = {};
    Array.from(element.attributes)
            .forEach((attr) => {
                result[attr.name] = attr.value;
            });
    return result;
}

const getComponent = (htmlStr, propsObject) => {
    return class extends HTMLElement{
        constructor(fileContent, customObject) {
            super()
            this.template = document.createElement("template");
            this.template.innerHTML = fileContent ? fileContent : htmlStr;
            this.root = this.attachShadow({mode: "open"});
            this.root.appendChild(this.template.content);
            const js = eval(this.root.querySelector("script[name=main]").innerText);
            const props = { ...getAttributesObject(this), _innerHTML: this.innerHTML };
            const passDown = customObject ? customObject : propsObject ? propsObject : null;
            const objToPassDown = js(this.root, props, store, passDown);
            if (this.root.querySelector("link[rel=hcj-import]")) {
                registerCustomElementAll(this.root, objToPassDown);
            }
        }
    }
}

export const registerCustomElement = async(filePath, tagName, passDownObject) => {
    if (customElements.get(tagName)) {
        return;
    }
    const result = await fetch(filePath);
    const elClass = getComponent(await result.text(), passDownObject);
    customElements.define(tagName, elClass);
}

const registerCustomElementAll = (root, passDownObject) => {
    const importList = root.querySelectorAll("link[rel=hcj-import]");
    Array.prototype.forEach.call(importList, (el) => {
        const path = el.href;
        const fileName = getFileName(path);
        registerCustomElement(path, fileName, passDownObject);
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
