/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Unicons from '@iconscout/react-unicons';
import { AnimatePresence, easeInOut, motion } from 'framer-motion';
import { toast } from 'react-toastify';

/* Redux */
import {
    addOrUpdateLinkHotspot,
    editScene,
    enabledHasChangesScenes,
    hideLinkHotspotPane,
    resetCurrentDestinationScene,
    resetCurrentLinkHotspot,
    selectEditTour,
    selectLinkHotspot,
    selectPaneManagement,
    setCurrentDestinationScene,
    setCurrentLinkHotspot,
    setCurrentEditingScene,
    showLinkHotspotPane,
    disableIsNewLinkHotspot
} from '@redux/features/admin/editTour';

/* Components */
import { DestinationSceneItem, Input } from '@components/admin';

export default function LinkHotspotPane({ viewerRef }) {
    // Hooks
    const dispatch = useDispatch();

    // States
    const paneManagement = useSelector(selectPaneManagement);
    const editTour = useSelector(selectEditTour);
    const linkHotspot = useSelector(selectLinkHotspot);
    const [searchTerm, setSearchTerm] = useState('');

    // Refs
    const titleRef = useRef(null);
    const useDefaultTitleRef = useRef(null);
    const searchInputRef = useRef(null);

    // Functions
    const validateLinkHotspot = () => {
        if (titleRef.current.value.trim() === '') {
            toast.warn('Tên điểm liên kết không được để trống.');
            return false;
        }
        if (!editTour.currentDestinationScene) {
            toast.warn('Vui lòng chọn địa điểm.');
            return false;
        }
        return true;
    };
    const handleCloseLinkHotspot = () => {
        dispatch(disableIsNewLinkHotspot());
        dispatch(hideLinkHotspotPane());
        dispatch(resetCurrentLinkHotspot());
        dispatch(resetCurrentDestinationScene());

        titleRef.current.value = '';
        setSearchTerm('');
    };
    /* Allow new link hotspots added into scene can be edit  */
    const addEventForAddedLinkHotspots = (destinationScene) => {
        viewerRef.current.panorama.children.forEach((hotspot) => {
            if (hotspot.linkId === linkHotspot.currentLinkHotspot.linkId) {
                hotspot.addEventListener('touchstart', () => {
                    dispatch(
                        setCurrentLinkHotspot({
                            ...linkHotspot.currentLinkHotspot,
                            title: destinationScene.title,
                            sceneIndex: destinationScene.index
                        })
                    );
                    dispatch(setCurrentDestinationScene(destinationScene));
                    dispatch(showLinkHotspotPane());
                    hotspot.focus();
                });
                hotspot.addEventListener('click', () => {
                    dispatch(
                        setCurrentLinkHotspot({
                            ...linkHotspot.currentLinkHotspot,
                            title: destinationScene.title,
                            sceneIndex: destinationScene.index
                        })
                    );
                    dispatch(setCurrentDestinationScene(destinationScene));
                    dispatch(showLinkHotspotPane());
                    hotspot.focus();
                });
            }
        });
    };

    // Event handlers
    const handleCancelEditLinkHotspot = () => {
        // Remove hotspot from panorama
        if (linkHotspot.isNewHotspot)
            viewerRef.current.panorama.children.forEach((spot) => {
                if (spot.linkId === linkHotspot.currentLinkHotspot.linkId) {
                    spot.dispose();
                }
            });

        handleCloseLinkHotspot();
    };
    const handleDeleteLinkHotspot = () => {
        // Remove hotspot from panorama
        viewerRef.current.panorama.children.forEach((spot) => {
            if (spot.linkId === linkHotspot.currentLinkHotspot.linkId) {
                spot.dispose();
            }
        });

        const newScene = {
            ...editTour.currentScene,
            linkHotspots: [
                ...editTour.currentScene.linkHotspots.filter(
                    (spot) => spot.linkId !== linkHotspot.currentLinkHotspot.linkId
                )
            ]
        };
        dispatch(editScene(newScene));
        dispatch(setCurrentEditingScene(newScene));

        dispatch(enabledHasChangesScenes());
        handleCloseLinkHotspot();
    };
    const handleSaveLinkHotspot = () => {
        if (!validateLinkHotspot()) return;

        const currentScene = editTour.editingTour.scenes.find((scene) => scene.index === editTour.currentScene.index);
        if (!currentScene) {
            alert('Không có địa điểm phù hợp, vui lòng thử lại.');
            return;
        }

        const destinationScene = {
            ...editTour.currentDestinationScene,
            title: titleRef.current.value.trim()
        };
        dispatch(
            addOrUpdateLinkHotspot({
                sceneIndex: editTour.currentScene.index,
                linkHotspot: {
                    ...linkHotspot.currentLinkHotspot,
                    sceneIndex: destinationScene.index,
                    title: destinationScene.title
                }
            })
        );

        addEventForAddedLinkHotspots(destinationScene);

        dispatch(enabledHasChangesScenes());
        handleCloseLinkHotspot();
    };

    /* Side effects */
    /* Use scene title as link hotspot default title */
    useEffect(() => {
        if (!editTour.currentDestinationScene || !useDefaultTitleRef.current?.checked) return;

        titleRef.current.value = editTour.currentDestinationScene.title;
    }, [editTour.currentDestinationScene]);

    return (
        <AnimatePresence>
            {paneManagement.isShowLinkHotspotPane && (
                <motion.section
                    initial={{ x: '100%', transition: { duration: 0.2, ease: easeInOut } }}
                    animate={{ x: '0', transition: { duration: 0.2, ease: easeInOut } }}
                    exit={{ x: '100%', transition: { duration: 0.2, ease: easeInOut } }}
                    className={`absolute top-0 right-0 bottom-0 flex flex-col w-96 max-w-[80vw] h-full bg-white dark:bg-black border-l dark:border-gray-400`}
                >
                    {/* Start: Content section */}
                    <section className='flex-grow flex flex-col gap-y-4 overflow-y-auto px-6 pt-4 pb-0'>
                        <h1 className='font-bold text-2xl'>Chỉnh sửa điểm liên kết</h1>
                        {/* Start: Name section */}
                        <div className='flex flex-col gap-2'>
                            <Input ref={titleRef} placeholder='Nhập tên điểm liên kết...' />
                            <div className='flex items-center gap-1'>
                                <input
                                    ref={useDefaultTitleRef}
                                    id='title'
                                    type='checkbox'
                                    className='cursor-pointer'
                                    defaultChecked={true}
                                    onChange={(e) => {
                                        if (e.target.checked && editTour.currentDestinationScene)
                                            titleRef.current.value = editTour.currentDestinationScene.title;
                                    }}
                                />
                                <label htmlFor='title' className='cursor-pointer select-none'>
                                    Sử dụng tên địa điểm
                                </label>
                            </div>
                        </div>
                        {/* End: Name section */}

                        {/* Start: Destination Scene section */}
                        <div className='flex-grow flex flex-col gap-y-2 overflow-y-auto'>
                            <h2 className='font-semibold text-lg'>Chọn địa điểm</h2>
                            <Input
                                ref={searchInputRef}
                                placeholder='Tìm kiếm địa điểm...'
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value.trim());
                                }}
                                clearInput={() => {
                                    setSearchTerm('');
                                }}
                            />
                            <div className='flex-grow flex flex-col gap-y-2 overflow-y-auto pb-8 no-scrollbar'>
                                {editTour.editingTour.scenes
                                    .filter((scene) => scene.title.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((scene) =>
                                        scene.index !== editTour.currentScene.index ? (
                                            <DestinationSceneItem key={scene.title + scene.index} scene={scene} />
                                        ) : null
                                    )}
                            </div>
                        </div>
                        {/* End: Destination Scene section */}
                    </section>
                    {/* End: Content section */}

                    {/* Start: Footer section */}
                    <section className='relative flex flex-col gap-y-4 px-6 py-4'>
                        <div className='absolute z-10 -top-4 left-0 right-0 h-4 bg-gradient-to-t from-white dark:from-black to-transparent border-b dark:border-gray-700'></div>
                        <div className='flex items-center justify-between'>
                            <button
                                type='button'
                                className='font-semibold text-sm hover:opacity-80'
                                onClick={handleCancelEditLinkHotspot}
                            >
                                Huỷ thao tác
                            </button>
                            <button
                                type='button'
                                className='font-semibold text-sm text-red-400 hover:opacity-80'
                                onClick={handleDeleteLinkHotspot}
                            >
                                Xoá điểm liên kết
                            </button>
                        </div>
                        <button
                            type='button'
                            className='flex items-center justify-center gap-1 px-4 py-2 font-semibold text-white bg-nature-green rounded drop-shadow hover:opacity-80'
                            onClick={handleSaveLinkHotspot}
                        >
                            <Unicons.UilCheck size='20' />
                            <span>Lưu điểm liên kết</span>
                        </button>
                    </section>
                    {/* End: Footer section */}
                </motion.section>
            )}
        </AnimatePresence>
    );
}
