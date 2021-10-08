import * as fs from "fs";
import * as path from "path";
import { remark } from "remark";
import remarkHtml from "remark-html";

const getFileInString = (filePath) => {
    return fs.readFileSync(filePath);
}

const getFileList = (rootPath, pathList, extension) => {
    let result = [...pathList];
    const files = fs.readdirSync(rootPath);
    files.forEach((file) => {
        if (file.endsWith(extension)) {
            result.push(path.join(rootPath, file));
            return;
        }
        result = getFileList(path.join(rootPath, file), result, extension);
    });
    return result;
}

const writeFile = (filePath, text) => {
    const dirPath = filePath.slice(0, filePath.lastIndexOf("/"));
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    fs.writeFile(filePath, text, { flag: "w" }, (err) => {
        if (err) {
            throw err;
        }
    });
}

const generatePostHTMLs = (fileList) => {
    return fileList.map((filePath) => {
        const newFilePath = filePath.replace(".md", ".html").replace(path.join(process.cwd(), "md"), path.join(process.cwd(), "post"));
        remark()
            .use(remarkHtml)
            .process(getFileInString(filePath))
            .then((file) => {
                const htmlString = file.value;
                writeFile(newFilePath, htmlString);
            })
        return newFilePath;
    })
}

const getDirTreeObject = (rootPath, tree, extension) => {
    let result = { ...tree };
    const files = fs.readdirSync(rootPath);
    files.forEach((file) => {
        if (file.endsWith(extension)) {
            result._current.push(path.join(rootPath, file).replace(process.cwd(), ""));
            return;
        }
        result[file] = getDirTreeObject(path.join(rootPath, file), { _current: [] }, extension);
    });
    return result;
}

const updatePostTreeInData = (tree, filePath) => {
    fs.readFile(filePath, (err, data) => {
        const prevData = JSON.parse(data.toString());
        const newData = { ...prevData, "post-tree": tree };
        fs.writeFile(filePath, JSON.stringify(newData, undefined, 4), (err) => {
            if (err) {
                throw err;
            }
        })
    });

}

const main = () => {
    const fileList = getFileList(path.join(process.cwd(), "md"), [], ".md");
    generatePostHTMLs(fileList);
    const tree = getDirTreeObject(path.join(process.cwd(), "post"), { _current: [] }, ".html");
    updatePostTreeInData(tree, path.join(process.cwd(), "data.json"));
}

main();