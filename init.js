import { getFileContentInJSON } from "./_util.js";

const setTitle = (title) => {
    document.querySelector("title").innerText = title;
    return 0;
}

const main = async() => {
    const data = await getFileContentInJSON("/data.json");
    setTitle(data.name)
}

main();