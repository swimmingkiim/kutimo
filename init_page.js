import { loadPage } from "./load_page.js";
import { getFileContentInJSON } from "./_util.js";


const setTitle = (title) => {
    document.querySelector("title").innerText = title;
    return 0;
}

const setHomePage = async() => {
    const data = await getFileContentInJSON("/data.json");
    loadPage(data["home-entry"]);
}

const main = async() => {
    const data = await getFileContentInJSON("/data.json");
    setTitle(data.name);
    setHomePage();
}

main();
