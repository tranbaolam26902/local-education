/* Libraries */
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as THREE from 'three';

/* Redux */
import {
    disableScenePane,
    editPin,
    editScene,
    enableGettingInfoHotspotPosition,
    enableGettingLinkHotspotPosition,
    enabledHasChangesScenes,
    selectEditMap,
    selectEditTour,
    setStartUpScene,
    showAudioPane,
    showMapEditor
} from '@redux/features/admin/editTour';

export default function ControlOverlay({ viewerRef }) {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const editTour = useSelector(selectEditTour);
    const editMap = useSelector(selectEditMap);

    /* Functions */
    const swapPinReferenceToStartupScene = () => {
        const firstSceneIndex = editTour.editingTour.scenes[0].index;
        const firstPin = editMap.pins.find((pin) => pin.sceneIndex === firstSceneIndex);
        const currentPin = editMap.pins.find((pin) => pin.sceneIndex === editTour.currentScene.index);
        // Both scenes have pins
        if (firstPin && currentPin && firstPin.sceneIndex !== currentPin.sceneIndex) {
            dispatch(
                editPin({
                    ...firstPin,
                    sceneIndex: currentPin.sceneIndex
                })
            );
            dispatch(
                editPin({
                    ...currentPin,
                    sceneIndex: firstPin.sceneIndex
                })
            );
        } else if (!currentPin) {
            // Only startup scene has pin
            dispatch(
                editPin({
                    ...firstPin,
                    sceneIndex: editTour.currentScene.index
                })
            );
        } else if (!firstPin) {
            // Only current scene has pin
            dispatch(
                editPin({
                    ...currentPin,
                    sceneIndex: firstSceneIndex
                })
            );
        }
    };

    /* Event handlers */
    const handleAddLinkHotspot = () => {
        dispatch(disableScenePane());
        dispatch(enableGettingLinkHotspotPosition());
    };
    const handleAddInfoHotspot = () => {
        dispatch(disableScenePane());
        dispatch(enableGettingInfoHotspotPosition());
    };
    const handleSaveInitialView = () => {
        const newScene = editTour.editingTour.scenes.find((scene) => scene.index === editTour.currentScene.index);
        if (!newScene) {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
            return;
        }
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), viewerRef.current.camera);
        const intersect = raycaster.intersectObject(viewerRef.current.panorama);
        const cameraPosition = intersect[0].point;

        dispatch(editScene({ ...newScene, x: cameraPosition.x, y: cameraPosition.y, z: cameraPosition.z }));
        toast.success(`Lưu góc nhìn của địa điểm '${editTour.currentScene.title}' thành công.`);
        dispatch(enabledHasChangesScenes());
    };
    const handleSetStartUpScene = () => {
        dispatch(setStartUpScene(editTour.currentScene.index));
        swapPinReferenceToStartupScene();

        dispatch(enabledHasChangesScenes());
    };
    const handleEditAudio = () => {
        dispatch(showAudioPane());
    };
    const handleEditMap = () => {
        dispatch(showMapEditor());
    };

    return (
        <section className={`absolute right-6 bottom-6 flex items-center gap-4`}>
            <button
                type='button'
                className='hidden lg:inline-block px-2 py-1 text-sm text-white bg-black/60 rounded hover:opacity-80'
                onClick={handleAddLinkHotspot}
            >
                Thêm điểm liên kết
            </button>
            <button
                type='button'
                className='hidden lg:inline-block px-2 py-1 text-sm text-white bg-black/60 rounded hover:opacity-80'
                onClick={handleAddInfoHotspot}
            >
                Thêm điểm thông tin
            </button>
            <button
                type='button'
                className='hidden lg:inline-block px-2 py-1 text-sm text-white bg-black/60 rounded hover:opacity-80'
                onClick={handleSaveInitialView}
            >
                Lưu góc nhìn
            </button>
            <button
                type='button'
                className='hidden lg:inline-block px-2 py-1 text-sm text-white bg-black/60 rounded hover:opacity-80'
                onClick={handleSetStartUpScene}
            >
                Đặt làm điểm bắt đầu
            </button>
            <button
                type='button'
                className='hidden lg:inline-block px-2 py-1 text-sm text-white bg-black/60 rounded hover:opacity-80'
                onClick={handleEditAudio}
            >
                Chỉnh sửa nhạc nền
            </button>
            <button
                type='button'
                className='hidden lg:inline-block px-2 py-1 text-sm text-white bg-black/60 rounded hover:opacity-80'
                onClick={handleEditMap}
            >
                Chỉnh sửa bản đồ
            </button>
        </section>
    );
}
