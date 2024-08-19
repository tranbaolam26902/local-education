export const extractFileName = (fileName) => {
    const name = fileName.substring(0, fileName.lastIndexOf('.'));
    const extension = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);

    return { name, extension };
};
