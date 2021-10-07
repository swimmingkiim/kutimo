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
        constructor() {
        super()
        this.template = document.createElement("template");
        this.template.innerHTML = htmlStr;
        this.root = this.attachShadow({mode: "open"});
        this.root.appendChild(this.template.content);
        const js = eval(this.root.querySelector("script").innerText);
        const props = { ...getAttributesObject(this), _innerHTML: this.innerHTML };
        js(this.root, props);
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

const main = () => {
    registerCustomElementAll();
}

main();


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
