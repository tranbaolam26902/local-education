/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Unicons from '@iconscout/react-unicons';
import { toast } from 'react-toastify';

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
    disableIsEditedMap,
    disableIsEditingPin,
    disableIsNewPin,
    disableIsWaitingPin,
    editPin,
    enableIsEditedMap,
    enableIsNewPin,
    enableIsWaitingPin,
    hideMapEditor,
    removePin,
    resetAddingPinMessage,
    resetCurrentDestinationScene,
    resetEditMapSlice,
    resetEditingPin,
    selectEditMap,
    selectEditTour,
    setIsShowOnStartUp,
    setMapPath,
    setPins
} from '@redux/features/admin/editTour';

/* Services */
import { useTourServices } from '@services/admin';

/* Components */
import { DestinationSceneItem, Input } from '@components/admin';

export default function MapPane() {
    /* Hooks */
    const dispatch = useDispatch();

    /* Services */
    const tourServices = useTourServices();

    /* States */
    const editMap = useSelector(selectEditMap);
    const editTour = useSelector(selectEditTour);
    const fileManagement = useSelector(selectFileManagement);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isChangedMap, setIsChangedMap] = useState(false);

    /* Refs */
    const searchKeywordRef = useRef(null);
    const showOnStartUpRef = useRef(null);

    /* Functions */
    const clearSearchKeyword = () => {
        setSearchKeyword('');
    };
    const resetMapPathAndPins = () => {
        if (editTour.editingTour.atlas) {
            dispatch(setMapPath(editTour.editingTour.atlas.path));
            if (editTour.editingTour.atlas.pins.length) {
                const pins = editTour.editingTour.atlas.pins.map((pin) => ({
                    ...pin,
                    name: `pin-${pin.top}-${pin.left}`
                }));
                dispatch(setPins(pins));
            } else dispatch(setPins([]));
        } else {
            dispatch(setMapPath(''));
            dispatch(setPins([]));
        }
    };

    /* Event handlers */
    const handleSelectMap = () => {
        dispatch(
            setSelectFileCallback(() => {
                setIsChangedMap(true);
            })
        );
        dispatch(setAllowedCategory('images'));
        dispatch(setCurrentCategory('images'));
        dispatch(disableMultiSelectModeButton());
        dispatch(enableFileManagementModal(true));
    };
    const handleStartAddPin = () => {
        dispatch(enableIsWaitingPin());
        dispatch(enableIsNewPin());
    };
    const handleStopAddPin = () => {
        dispatch(disableIsWaitingPin());
        dispatch(disableIsNewPin());
        dispatch(resetAddingPinMessage());
    };
    const handleClearAllPins = () => {
        if (!confirm('Xác nhận xoá toàn bộ địa điểm trên bản đồ hiện tại?')) return;
        dispatch(enableIsEditedMap());
        dispatch(setPins([]));
    };
    const handleCancelAction = () => {
        if (editMap.isNewPin) {
            handleDeletePin();
        } else {
            dispatch(disableIsEditingPin());
            dispatch(resetCurrentDestinationScene());
            dispatch(resetEditingPin());
        }
    };
    const handleSavePin = () => {
        if (editTour.currentDestinationScene === null) {
            alert('Vui lòng chọn địa điểm.');
            return;
        }
        const newPin = {
            ...editMap.editingPin,
            title: editTour.currentDestinationScene.title,
            sceneIndex: editTour.currentDestinationScene.index,
            thumbnailPath: editTour.currentDestinationScene.urlPreview
        };
        dispatch(editPin(newPin));
        dispatch(disableIsEditingPin());
        dispatch(resetCurrentDestinationScene());
        dispatch(disableIsNewPin());
        dispatch(resetEditingPin());
        dispatch(enableIsEditedMap());
    };
    const handleDeletePin = () => {
        dispatch(removePin(editMap.editingPin.name));
        dispatch(disableIsEditingPin());
        dispatch(resetCurrentDestinationScene());
        dispatch(disableIsNewPin());
        dispatch(resetEditingPin());
        dispatch(enableIsEditedMap());
    };
    const handleCloseMapEditor = () => {
        if (!editMap.isEditedMap) {
            handleCancelAction();
            dispatch(hideMapEditor());
        } else if (confirm('Chưa lưu thay đổi. Xác nhận trở về?')) {
            dispatch(hideMapEditor());
            dispatch(resetEditMapSlice());
            resetMapPathAndPins();
        } else return;
    };
    const handleSaveMap = async () => {
        if (editMap.isWaitingPin || editMap.isEditingPin) {
            alert('Vui lòng hoàn tất thao tác trước khi lưu.');
            return;
        }

        const map = {
            path: editMap.mapPath,
            pins: editMap.pins,
            isShowOnStartUp: editMap.isShowOnStartUp
        };
        const updateResult = await tourServices.updateTourMap(editTour.editingTour.id, map);

        if (updateResult.isSuccess) {
            dispatch(disableIsEditedMap());
            toast.success('Lưu bản đồ thành công.', { toastId: 'save-map' });
        } else {
            toast.error(`Lưu thất bại. ${updateResult.errors[0]}`, { toastId: 'save-map' });
        }
    };
    const handleDeleteMap = async () => {
        if (!confirm('Các địa điểm trên bản đồ cũng sẽ bị mất. Xác nhận xóa bản đồ?')) return;

        dispatch(setMapPath(''));
        dispatch(setPins([]));
        showOnStartUpRef.current.checked = false;
        dispatch(enableIsEditedMap());
    };

    /* Side effects */
    /* Handle select map from file management */
    useEffect(() => {
        if (!isChangedMap) return;
        const selectedFile = fileManagement.selectedResult[0];
        if (!selectedFile) return;

        dispatch(enableIsEditedMap());
        dispatch(setMapPath(selectedFile.path));
        dispatch(setPins([]));
        setIsChangedMap(false);
    }, [isChangedMap]);
    /* Reset search keyword on change editing pin */
    useEffect(() => {
        setSearchKeyword('');
    }, [editMap.editingPin]);

    return (
        <section className='absolute top-0 right-0 bottom-0 flex flex-col w-96 max-w-[80vw] h-full bg-white dark:bg-black border-l dark:border-gray-400'>
            {/* Start: Content section */}
            <section className='flex-grow flex flex-col gap-y-4 overflow-y-auto px-6 pt-4 pb-0'>
                <div className='flex items-center justify-between'>
                    <h1 className='font-bold text-2xl'>Bản đồ</h1>
                    {editMap.mapPath && (
                        <button type='button' className='font-semibold text-sm text-red-400' onClick={handleDeleteMap}>
                            Xóa bản đồ
                        </button>
                    )}
                </div>
                {/* Start: Buttons section */}
                {!editMap.isEditingPin && (
                    <section className='flex flex-col gap-y-2'>
                        <button
                            id='btn-select-map'
                            type='button'
                            disabled={editMap.isWaitingPin}
                            className={`flex items-center justify-center gap-2 px-4 py-2 text-white rounded drop-shadow ${editMap.isWaitingPin ? 'bg-blue-300' : 'bg-blue-400 hover:opacity-80'
                                }`}
                            onClick={handleSelectMap}
                        >
                            <Unicons.UilMap size='20' />
                            <span className='drop-shadow'>Chọn bản đồ</span>
                        </button>
                        <button
                            type='button'
                            disabled={editMap.isWaitingPin || editMap.mapPath === ''}
                            className={`flex items-center justify-center gap-1 px-4 py-2 text-white rounded drop-shadow ${editMap.isWaitingPin || editMap.mapPath === ''
                                    ? 'bg-blue-300'
                                    : 'bg-blue-400 hover:opacity-80'
                                }`}
                            onClick={handleStartAddPin}
                        >
                            <Unicons.UilPlus size='20' />
                            <span className='drop-shadow'>Thêm địa điểm</span>
                        </button>
                        <button
                            type='button'
                            disabled={editMap.isWaitingPin || editMap.pins.length === 0 || editMap.mapPath === ''}
                            className={`flex items-center justify-center gap-2 px-4 py-2 text-white rounded drop-shadow ${editMap.isWaitingPin || editMap.pins.length === 0 || editMap.mapPath === ''
                                    ? 'bg-red-300'
                                    : 'bg-red-400 hover:opacity-80'
                                }`}
                            onClick={handleClearAllPins}
                        >
                            <Unicons.UilTrash size='20' />
                            <span className='drop-shadow'>Xoá toàn bộ địa điểm</span>
                        </button>
                        <div className='flex items-center gap-1'>
                            <input
                                ref={showOnStartUpRef}
                                type='checkbox'
                                id='show-on-startup'
                                className='cursor-pointer'
                                defaultChecked={editTour.editingTour?.atlas?.isShowOnStartUp}
                                onChange={(e) => {
                                    dispatch(enableIsEditedMap());
                                    dispatch(setIsShowOnStartUp(e.target.checked));
                                }}
                            />
                            <label htmlFor='show-on-startup' className='flex-1 cursor-pointer select-none'>
                                Hiển thị khi bắt đầu
                            </label>
                        </div>
                    </section>
                )}
                {/* End: Buttons section */}

                {/* Start: Prompt section */}
                {editMap.isWaitingPin && (
                    <section className='flex flex-col gap-y-2'>
                        <h5 className='py-2 text-sm text-center bg-gray-500/20 rounded-xl'>
                            {editMap.addingPinMessage}
                        </h5>
                        <button
                            type='button'
                            onClick={handleStopAddPin}
                            className='font-semibold text-red-400 hover:opacity-80'
                        >
                            Hủy
                        </button>
                    </section>
                )}
                {/* End: Prompt section */}

                {/* Start: Edit pin section */}
                {editMap.isEditingPin && (
                    <section className='flex-grow flex flex-col gap-y-2 overflow-y-auto'>
                        <div className='flex items-center justify-between'>
                            <h2 className='font-bold text-lg'>Chọn địa điểm</h2>
                            <button
                                type='button'
                                className='font-semibold text-sm hover:opacity-80'
                                onClick={handleCancelAction}
                            >
                                Huỷ thao tác
                            </button>
                        </div>
                        <div className='grid grid-cols-2 gap-x-2'>
                            <button
                                type='button'
                                className='py-1 text-white bg-nature-green rounded drop-shadow hover:opacity-80'
                                onClick={handleSavePin}
                            >
                                Lưu địa điểm
                            </button>
                            <button
                                type='button'
                                className='py-1 text-white bg-red-400 rounded drop-shadow hover:opacity-80'
                                onClick={handleDeletePin}
                            >
                                Xoá địa điểm
                            </button>
                        </div>
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
                        <div className='flex-grow flex flex-col gap-y-2 overflow-y-auto no-scrollbar pb-8'>
                            {editTour.editingTour.scenes
                                .filter((scene) => scene.title.toLowerCase().includes(searchKeyword.toLowerCase()))
                                .sort((a, b) => a.sceneIndex > b.sceneIndex)
                                .map((scene) => (
                                    <DestinationSceneItem key={scene.title + scene.index} scene={scene} />
                                ))}
                        </div>
                    </section>
                )}
                {/* End: Edit pin section */}
            </section>
            {/* End: Content section */}

            {/* Start: Footer section */}
            <section className='relative flex items-center justify-between px-6 py-4'>
                <div className='absolute z-10 -top-4 left-0 right-0 h-4 bg-gradient-to-t from-white dark:from-black to-transparent border-b dark:border-gray-700'></div>
                <button type='button' className='font-semibold hover:opacity-80' onClick={handleCloseMapEditor}>
                    Đóng
                </button>
                <button
                    type='button'
                    disabled={!editMap.isEditedMap}
                    className={`flex items-center gap-1 px-4 py-2 font-semibold text-white bg-nature-green drop-shadow rounded ${editMap.isEditedMap ? 'hover:opacity-80' : 'opacity-50'
                        }`}
                    onClick={handleSaveMap}
                >
                    <Unicons.UilCheck size='20' />
                    <span>Lưu bản đồ</span>
                </button>
            </section>
            {/* End: Footer section */}
        </section>
    );
}
