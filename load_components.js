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

const getComponent = (htmlStr) => {
    return class extends HTMLElement{
        constructor(fileContent) {
        super()
        this.template = document.createElement("template");
        this.template.innerHTML = fileContent ? fileContent : htmlStr;
        this.root = this.attachShadow({mode: "open"});
        this.root.appendChild(this.template.content);
        if (this.root.querySelector("link[rel=hcj-import]")) {
            registerCustomElementAll(this.root);
        }
        console.log(this.root)
        const js = eval(this.root.querySelector("script").innerText);
        const props = { ...getAttributesObject(this), _innerHTML: this.innerHTML };
        js(this.root, props, store);
        }
    }
}

export const registerCustomElement = async(filePath, tagName) => {
    if (customElements.get(tagName)) {
        return;
    }
    const result = await fetch(filePath);
    const elClass = getComponent(await result.text());
    customElements.define(tagName, elClass);
}

const registerCustomElementAll = (root) => {
    const importList = root.querySelectorAll("link[rel=hcj-import]");
    Array.prototype.forEach.call(importList, (el) => {
        const path = el.href;
        const fileName = getFileName(path);
        registerCustomElement(path, fileName);
    })
}

const main = () => {
    registerCustomElementAll(document);
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
