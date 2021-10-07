export const getFileContentInString = async(filePath) => {
    const res = await fetch(filePath);
    if (res.status === 404) return null;
    return await res.text();
}

export const getFileContentInJSON = async(jsonFilePath) => {
    const plainText = await getFileContentInString(jsonFilePath);
    return JSON.parse(plainText);
}