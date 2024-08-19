/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Unicons from '@iconscout/react-unicons';
import { toast } from 'react-toastify';

/* Redux */
import {
    addScene,
    disableHasChangesScenes,
    enabledHasChangesScenes,
    selectEditMap,
    selectEditTour,
    selectPaneManagement,
    toggleShowScenePane
} from '@redux/features/admin/editTour';
import {
    enableFileManagementModal,
    selectFileManagement,
    setAllowedCategory,
    setCurrentCategory,
    setSelectFileCallback,
    toggleMultiSelectMode
} from '@redux/features/admin/fileManagement';

/* Services */
import { useSceneServices, useTourServices } from '@services/admin';

/* Utils */
import { extractFileName } from '@utils/strings';

/* Components */
import { Input } from '@components/admin';
import SceneItem from '../SceneItem/SceneItem';

export default function ScenePane() {
    /* Hooks */
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /* Services */
    const sceneServices = useSceneServices();
    const tourServices = useTourServices();

    /* States */
    const editTour = useSelector(selectEditTour);
    const editMap = useSelector(selectEditMap);
    const scenes = editTour.editingTour.scenes;
    const paneManagement = useSelector(selectPaneManagement);
    const fileManagement = useSelector(selectFileManagement);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isAddedNewScenes, setIsAddedNewScenes] = useState(false);

    /* Refs */
    const searchKeywordRef = useRef(null);

    /* Functions */
    const clearSearchKeyword = () => {
        setSearchKeyword('');
    };
    // Get largest index in tour's scenes to prevent scene conflicts
    const getLastSceneIndex = () =>
        scenes.length
            ? scenes.reduce((acc, curr) => (acc.index > curr.index ? acc.index : curr.index), { index: -1 })
            : -1;
    const addScenesFromFiles = (files) => {
        let lastSceneIndex = getLastSceneIndex();

        files.forEach((file) => {
            lastSceneIndex++;
            const scene = {
                index: lastSceneIndex,
                title: extractFileName(file.name).name,
                x: 0,
                y: 0,
                z: 0,
                urlPreview: file.thumbnailPath,
                urlImage: file.path,
                linkHotspots: [],
                infoHotspots: []
            };
            dispatch(addScene(scene));
        });
    };

    /* Event handlers */
    const handleToggleScenePane = () => {
        dispatch(toggleShowScenePane());
    };
    const handleSelectingFiles = () => {
        dispatch(
            setSelectFileCallback(() => {
                setIsAddedNewScenes(true);
            })
        );
        dispatch(setAllowedCategory('images'));
        dispatch(setCurrentCategory('images'));
        dispatch(toggleMultiSelectMode());
        dispatch(enableFileManagementModal(true));
    };
    const handleSaveChanges = async () => {
        /* Save map if user delete some scenes referrenced in map pins */
        const map = {
            path: editMap.mapPath,
            pins: editMap.pins,
            isShowOnStartUp: editMap.isShowOnStartUp
        };
        const updateResult = await tourServices.updateTourMap(editTour.editingTour.id, map);

        if (!updateResult.isSuccess) {
            toast.error(`Lưu thất bại. ${updateResult.errors[0]}`, { toastId: 'save-map' });
        }

        const updateScenesResult = await sceneServices.updateTourScenes(
            editTour.editingTour.id,
            editTour.editingTour.scenes
        );

        if (updateScenesResult.isSuccess) {
            toast.success('Lưu thay đổi thành công.', { toastId: 'save-scene-toast' });
            dispatch(disableHasChangesScenes());
        } else {
            toast.error(`Lưu thất bại. ${updateScenesResult.errors[0]}`, { toastId: 'save-scene-toast' });
        }
    };
    const handleBack = () => {
        if (editTour.hasChanges) {
            if (!confirm('Các thay đổi chưa lưu sẽ bị mất. Xác nhận quay lại?')) return;
            else {
                navigate('/admin/tours');
                dispatch(disableHasChangesScenes());
            }
        } else navigate('/admin/tours');
    };

    /* Side effects */
    /* Add scenes from selected files */
    useEffect(() => {
        if (isAddedNewScenes) {
            addScenesFromFiles(fileManagement.selectedResult);
            setIsAddedNewScenes(false);
            dispatch(enabledHasChangesScenes());
        }
    }, [isAddedNewScenes]);

    return (
        <section
            className={`absolute top-0 left-0 bottom-0 flex flex-col w-96 max-w-[80vw] h-full bg-white dark:bg-black border-r dark:border-gray-400 transition-transform duration-200${(!paneManagement.isShowScenePane || paneManagement.disableScenePane) && ' -translate-x-full'
                }`}
        >
            {/* Start: Toggle button */}
            {!paneManagement.disableScenePane && (
                <button
                    type='button'
                    title={paneManagement.isShowScenePane ? 'Ẩn' : 'Hiện'}
                    className='absolute top-1/2 left-full -translate-y-1/2 py-4 bg-white dark:bg-black dark:border dark:border-l-transparent dark:border-gray-400 rounded-r-2xl'
                    onClick={handleToggleScenePane}
                >
                    {paneManagement.isShowScenePane ? (
                        <Unicons.UilAngleLeft size='24' className='drop-shadow' />
                    ) : (
                        <Unicons.UilAngleRight size='24' className='drop-shadow' />
                    )}
                </button>
            )}
            {/* End: Toggle button */}

            {/* Start: Content section */}
            <section className='flex-grow flex flex-col gap-y-2 overflow-y-auto px-6 pt-4 pb-0'>
                <h1 title={editTour.editingTour.title} className='mb-2 font-bold text-2xl min-h-[2rem] truncate'>
                    {editTour.editingTour.title}
                </h1>
                <button
                    type='button'
                    className='flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-400 rounded drop-shadow hover:opacity-80'
                    onClick={handleSelectingFiles}
                >
                    <Unicons.UilPlus size='20' />
                    <span>Thêm địa điểm</span>
                </button>
                <Input
                    ref={searchKeywordRef}
                    value={searchKeyword}
                    placeholder='Tìm kiếm địa điểm...'
                    rightIcon={<Unicons.UilSearch size='20' className='dark:text-white' />}
                    clearInput={clearSearchKeyword}
                    onChange={(e) => {
                        setSearchKeyword(e.target.value);
                    }}
                />
                <div className='flex-grow flex flex-col gap-y-2 overflow-y-auto pb-8 no-scrollbar'>
                    {editTour.editingTour.scenes
                        .filter((scene) => scene.title.toLowerCase().includes(searchKeyword.toLowerCase()))
                        .sort((a, b) => a.sceneIndex > b.sceneIndex)
                        .map((scene) => (
                            <SceneItem key={JSON.stringify(scene)} scene={scene} />
                        ))}
                </div>
            </section>
            {/* End: Content section */}

            {/* Start: Footer section */}
            <section className='relative flex items-center justify-between px-6 py-4'>
                <div className='absolute z-10 -top-4 left-0 right-0 h-4 bg-gradient-to-t from-white dark:from-black to-transparent border-b dark:border-gray-700'></div>
                <button type='button' className='font-semibold hover:opacity-80' onClick={handleBack}>
                    Trở về
                </button>
                <button
                    type='button'
                    disabled={!editTour.hasChanges}
                    className={`flex items-center gap-1 px-4 py-2 font-semibold text-white bg-nature-green drop-shadow rounded ${editTour.hasChanges ? 'hover:opacity-80' : 'opacity-50'
                        }`}
                    onClick={handleSaveChanges}
                >
                    <Unicons.UilCheck size='20' />
                    <span>Lưu thay đổi</span>
                </button>
            </section>
            {/* End: Footer section */}
        </section>
    );
}
