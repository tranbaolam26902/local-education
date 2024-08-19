export const getFileType = (fileExtension) => {
    if (fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg') return 'image';
    if (fileExtension === 'mp3') return 'audio';
    if (fileExtension === 'mp4') return 'video';
};
