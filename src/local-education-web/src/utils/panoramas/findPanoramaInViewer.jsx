export const findPanoramaBySrc = (viewerRef, src) => {
    return viewerRef.current.scene.children.find((imagePanorama) => imagePanorama.src === src);
};

export const findPanoramaById = (viewerRef, uuid) => {
    return viewerRef.current.scene.children.find((imagePanorama) => imagePanorama.uuid === uuid);
};
