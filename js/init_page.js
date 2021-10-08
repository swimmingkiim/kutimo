import { loadPage } from "./load_page.js";
import { getFileContentInJSON, getFileContentInString } from "./_util.js";


const setTitle = (title) => {
    document.querySelector("title").innerText = title;
    return 0;
}

const setPage = async() => {
    const urlPageQuery = window.location.href.match(/page=[a-z|0-9|\-]+/);
    if (urlPageQuery) {
        const filePath = "/src/pages/" + urlPageQuery[0].replace("page=", "") + ".html";
        loadPage(filePath);
        return;
    }
    const data = await getFileContentInString("/data.json");
    loadPage(data["home-entry"]);
}

const main = async() => {
    const data = await getFileContentInJSON("/data.json");
    setTitle(data.name);
    setPage();
}

main();
