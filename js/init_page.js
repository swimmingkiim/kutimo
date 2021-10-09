import { loadPage } from "./load_page.js";
import { getFileContentInJSON, getFileContentInString } from "./_util.js";


const setTitle = (title) => {
    document.querySelector("title").innerText = title;
    return 0;
}

export const setPage = async(url) => {
    if (url) {
        window.location.href = url;
    }
    const data = await getFileContentInJSON("/data.json");
    const defaultPath = data["home-entry"];
    const urlPageQuery = window.location.href.match(/page=[a-z|0-9|\-]+/);
    const urlPostQuery = window.location.href.match(/post=[a-z|0-9|\-|\/]+/);
    if (urlPageQuery) {
        const filePath = "/src/pages/" + urlPageQuery[0].replace("page=", "") + ".html";
        let payload = {
            props: {}
        };
        if(urlPostQuery) {
            payload.props["postPath"] = urlPostQuery[0].replace("post=/post/", "") + ".html";
        }
        loadPage(filePath, payload);
        return;
    }
    loadPage(defaultPath);
}

const main = async() => {
    const data = await getFileContentInJSON("/data.json");
    setTitle(data.name);
    setPage();
    window.addEventListener("popstate", () => {
        console.log("popstate");
        setPage();
    })
}

main();
