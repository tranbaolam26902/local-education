/* Libraries */
import * as THREE from 'three';

export const getPositionOnPanorama = (viewer) => {
    const intersects = viewer.raycaster.intersectObject(viewer.panorama, true);
    if (intersects.length > 0) {
        const point = intersects[0].point.clone();
        const world = viewer.panorama.getWorldPosition(new THREE.Vector3());
        point.sub(world);
        if (point.length() !== 0) {
            return {
                x: parseInt(point.x.toFixed(2)),
                y: parseInt(point.y.toFixed(2)),
                z: parseInt(point.z.toFixed(2))
            };
        }
    }

    return { x: 0, y: 0, z: 0 };
};
