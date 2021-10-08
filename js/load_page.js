import { registerCustomElement } from "./load_components.js";
import { getFileContentInString, getFileName } from "/js/_util.js";

export const clearPage = () => {
    const page = document.querySelector("#page");
    if (page.hasChildNodes) {
        page.childNodes.forEach((node) => {
            page.removeChild(node);
        });
    }
}

export const loadPage = async(filePath) => {
    const fileName = getFileName(filePath);
    const fileContent = await getFileContentInString(filePath);
    if (!customElements.get(fileName)) {
        await registerCustomElement(filePath, fileName);
    }
    clearPage();
    const Element = customElements.get(fileName);
    document.querySelector("#page").appendChild(new Element(fileContent));
}