export const getFileContentInString = async(filePath) => {
    const res = await fetch(filePath);
    if (res.status === 404) return null;
    return await res.text();
}

export const getFileContentInJSON = async(jsonFilePath) => {
    const plainText = await getFileContentInString(jsonFilePath);
    return JSON.parse(plainText);
}

export const getType = (val) => {
    let type = typeof val;
    if (type === "object") {
        type = Array.isArray(val) ? "array" : "object";
    }
    return type;
}

export const compare = (val1, val2) => {
    const type = getType(val1) === getType(val2) ? getType(val1) : false;
    if (!type || type === "function") {
        return false;
    }
    if (type === "array" || type === "object") {
        return JSON.stringify(val1) === JSON.stringify(val2);
    }
    return val1 === val2;
}

export const getFileName = (path, extension) => {
    return path.match(/([a-z|0-9|\-]+\.[a-z]+)$/)[0].replace(extension ? `.${extension}` : ".html", "");
}