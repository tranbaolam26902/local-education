/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Unicons from '@iconscout/react-unicons';
import { AnimatePresence } from 'framer-motion';

/* Redux */
import {
    disableMultiSelectModeButton,
    enableFileManagementModal,
    selectFileManagement,
    setAllowedCategory,
    setCurrentCategory,
    setSelectFileCallback
} from '@redux/features/admin/fileManagement';
import {
    deleteScene,
    editScene,
    enabledHasChangesScenes,
    removeLinkHotspotsByDestinationSceneIndex,
    removePinBySceneIndex,
    selectEditTour,
    setCurrentEditingScene
} from '@redux/features/admin/editTour';

/* Utils */
import { extractFileName } from '@utils/strings';

/* Components */
import { Fade } from '@components/shared';

export default function SceneItem({ scene }) {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const editTour = useSelector(selectEditTour);
    const fileManagement = useSelector(selectFileManagement);
    const [showSceneOptions, setShowSceneOptions] = useState(false);
    const [isSwapedScene, setIsSwapedScene] = useState(false);

    /* Refs */
    const nameInputRef = useRef(null);
    const sceneOptionsRef = useRef(null);
    const sceneOptionsButtonRef = useRef(null);

    /* Functions */
    const closeSceneOptions = () => {
        setShowSceneOptions(false);
    };

    /* Event handlers */
    const handleSelectScene = () => {
        dispatch(setCurrentEditingScene(scene));
    };
    /* Start: Scene options section */
    const handleToggleShowSceneOptions = () => {
        setShowSceneOptions((state) => !state);
    };
    const handleCloseSceneOptionsOnMouseDown = (e) => {
        if (e.target.closest('button') === sceneOptionsButtonRef.current) return;
        if (sceneOptionsRef.current && !sceneOptionsRef.current.contains(e.target)) closeSceneOptions();
    };
    const handleRename = () => {
        nameInputRef.current.select();
        closeSceneOptions();
    };
    const handleCancelEditName = () => {
        nameInputRef.current.value = scene.title; // Reset scene's title
        nameInputRef.current.blur();
    };
    const handleSaveName = () => {
        if (nameInputRef.current.value.trim() === '') return;

        const newScene = {
            ...scene,
            title: nameInputRef.current.value.trim()
        };
        dispatch(editScene(newScene));

        if (editTour.currentScene.index === scene.index) dispatch(setCurrentEditingScene(newScene)); // Prevent bug when rename current scene

        nameInputRef.current.blur();
        dispatch(enabledHasChangesScenes());
    };
    const handleSwapScene = () => {
        dispatch(
            setSelectFileCallback(() => {
                setIsSwapedScene(true);
            })
        );
        dispatch(setAllowedCategory('images'));
        dispatch(setCurrentCategory('images'));
        dispatch(disableMultiSelectModeButton());
        dispatch(enableFileManagementModal(true));
    };
    const handleDeleteScene = () => {
        if (!confirm(`Xác nhận xoá địa điểm '${scene.title}'?`)) return;
        dispatch(deleteScene(scene.index));

        dispatch(removeLinkHotspotsByDestinationSceneIndex(scene.index)); // Remove LinkHotspots link to this scene after delete
        dispatch(removePinBySceneIndex(scene.index)); // Remove pins move to this scene after delete

        closeSceneOptions();
        dispatch(enabledHasChangesScenes());
    };
    /* End: Scene options section */

    /* Side effects */
    /* Close Tour's Options when clicking outside */
    useEffect(() => {
        document.addEventListener('mousedown', handleCloseSceneOptionsOnMouseDown);

        return () => {
            document.removeEventListener('mousedown', handleCloseSceneOptionsOnMouseDown);
        };
    }, []);
    /* Swap scene */
    useEffect(() => {
        if (isSwapedScene) {
            const selectedFile = fileManagement.selectedResult[0];
            if (selectedFile) {
                const newScene = {
                    ...scene,
                    title: extractFileName(selectedFile.name).name,
                    urlPreview: selectedFile.thumbnailPath,
                    urlImage: selectedFile.path,
                    linkHotspots: [],
                    infoHotspots: []
                };
                dispatch(editScene(newScene));
                nameInputRef.current.value = newScene.title;
                if (editTour.currentScene.index === scene.index) dispatch(setCurrentEditingScene(newScene)); // Trigger re-render panorama when swap current scene
                setIsSwapedScene(false);
                dispatch(enabledHasChangesScenes());
            }
        }
    }, [isSwapedScene]);

    return (
        <div
            className={`relative cursor-pointer rounded${editTour.currentScene.index === scene.index
                    ? ' outline outline-4 -outline-offset-4 outline-nature-yellow'
                    : ''
                }`}
        >
            {editTour.editingTour.scenes.reduce((previous, current) => {
                return current.index < previous.index ? current : previous;
            }).index === scene.index && (
                    <span className='absolute top-3 left-3 px-4 py-0.5 font-semibold text-sm bg-blue-400 text-white outline outline-2 outline-white rounded-full'>
                        Bắt đầu
                    </span>
                )}
            <img
                src={`${import.meta.env.VITE_API_ENDPOINT}/${scene.urlPreview}`}
                alt={scene.title}
                className='w-full aspect-[2/1] rounded'
                onClick={handleSelectScene}
            />
            <div className='absolute left-1 right-1 bottom-1 flex items-center gap-x-1 px-4 h-8 bg-black/40 rounded-full cursor-default'>
                {editTour.currentScene.index === scene.index && (
                    <span className='-ml-2 px-1.5 py-px font-semibold text-xs bg-nature-yellow text-dark rounded-full drop-shadow'>
                        Chỉnh sửa
                    </span>
                )}
                <input
                    ref={nameInputRef}
                    type='text'
                    defaultValue={scene.title}
                    className='flex-1 inline-block text-white truncate line-clamp-1 bg-transparent rounded focus:outline focus:outline-white drop-shadow'
                    onBlur={(e) => {
                        if (e.target.value.trim() === '') e.target.value = scene.title;
                        else handleSaveName();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                        else if (e.key === 'Escape') handleCancelEditName();
                    }}
                />
                <button
                    ref={sceneOptionsButtonRef}
                    type='button'
                    className='drop-shadow'
                    onClick={handleToggleShowSceneOptions}
                >
                    <Unicons.UilEllipsisV size='20' className='text-white' />
                </button>
                <AnimatePresence>
                    {showSceneOptions && (
                        <Fade
                            ref={sceneOptionsRef}
                            duration={0.1}
                            className='absolute right-10 z-10 flex flex-col py-1 bg-white rounded shadow-2xl

                            dark:bg-dark dark:border dark:border-gray-700 dark:after:border-l-dark dark:before:inline-block dark:before:border-l-gray-600

                            after:absolute after:top-1/2 after:left-full after:-translate-y-1/2 after:border-8 after:border-transparent after:border-l-white

                            before:hidden before:absolute before:top-1/2 before:-right-[17px] before:-translate-y-1/2 before:border-8 before:border-transparent before:border-l-white'
                        >
                            <button
                                type='button'
                                className='flex items-center gap-1 px-2 py-1 text-left text-sm hover:opacity-80'
                                onClick={handleRename}
                            >
                                <Unicons.UilPen size='16' />
                                <span>Đổi tên</span>
                            </button>
                            <button
                                type='button'
                                className='flex items-center gap-1 px-2 py-1 text-left text-sm hover:opacity-80'
                                onClick={handleSwapScene}
                            >
                                <Unicons.UilRepeat size='16' />
                                <span>Đổi địa điểm</span>
                            </button>
                            <button
                                type='button'
                                className='flex items-center gap-1 px-2 py-1 text-left text-sm text-red-400 hover:opacity-80'
                                onClick={handleDeleteScene}
                            >
                                <Unicons.UilTrash size='16' />
                                <span>Xoá</span>
                            </button>
                        </Fade>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
