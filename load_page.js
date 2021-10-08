import { registerCustomElement } from "./load_components.js";
import { getFileContentInString, getFileName } from "./_util.js";

export const clearPage = () => {
    const page = document.querySelector("#page");
    if (page.hasChildNodes) {
        page.childNodes.forEach((node) => {
            page.removeChild(node);
        });
    }
}

export const loadPage = async(filePath) => {
    console.log("gg:", filePath)
    const fileName = getFileName(filePath);
    const fileContent = await getFileContentInString(filePath);
    console.log(customElements.get(fileName))
    if (!customElements.get(fileName)) {
        await registerCustomElement(filePath, fileName);
    }
    clearPage();
    const Element = customElements.get(fileName);
    document.querySelector("#page").appendChild(new Element(fileContent));
}