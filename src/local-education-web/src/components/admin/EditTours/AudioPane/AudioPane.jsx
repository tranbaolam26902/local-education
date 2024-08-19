/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, easeInOut, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import * as Unicons from '@iconscout/react-unicons';
import { toast } from 'react-toastify';

/* Redux */
import {
    disableAudioPane,
    editScene,
    enabledHasChangesScenes,
    selectEditTour,
    selectPaneManagement
} from '@redux/features/admin/editTour';
import {
    disableMultiSelectModeButton,
    enableFileManagementModal,
    selectFileManagement,
    setAllowedCategory,
    setCurrentCategory,
    setSelectFileCallback
} from '@redux/features/admin/fileManagement';

export default function AudioPane() {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const editTour = useSelector(selectEditTour);
    const fileManagement = useSelector(selectFileManagement);
    const paneManagement = useSelector(selectPaneManagement);
    const [isChangedAudio, setIsChangedAudio] = useState(false);
    const [audioPath, setAudioPath] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    /* Refs */
    const autoPlayRef = useRef(null);
    const loopRef = useRef(null);
    const audioRef = useRef(null);

    /* Functions */
    const getSceneByIndex = (index) => editTour.editingTour.scenes.find((scene) => scene.index === index);

    /* Event handlers */
    const handleSelectAudio = () => {
        dispatch(
            setSelectFileCallback(() => {
                setIsChangedAudio(true);
            })
        );
        dispatch(setAllowedCategory('audios'));
        dispatch(setCurrentCategory('audios'));
        dispatch(disableMultiSelectModeButton());
        dispatch(enableFileManagementModal(true));
    };
    const handleDeleteAudio = () => {
        setAudioPath('');
        setHasChanges(true);
    };
    const handleCancelEditAudio = () => {
        if (hasChanges) {
            if (!confirm('Chưa lưu thay đổi. Xác nhận trở về?')) return;

            const currentScene = editTour.editingTour.scenes.find(
                (scene) => scene.index === editTour.currentScene.index
            );

            if (currentScene.audio?.path) setAudioPath(currentScene.audio.path);
            else setAudioPath('');
            if (loopRef.current)
                if (currentScene.audio?.loopAudio !== undefined) loopRef.current.checked = currentScene.audio.loopAudio;
                else loopRef.current.checked = loopRef.current.defaultChecked;
            if (autoPlayRef.current)
                if (currentScene.audio?.autoPlay !== undefined)
                    autoPlayRef.current.checked = currentScene.audio.autoPlay;
                else autoPlayRef.current.checked = autoPlayRef.current.defaultChecked;
            setHasChanges(false);
        }
        dispatch(disableAudioPane());
    };
    const handleSaveAudio = () => {
        const currentScene = editTour.editingTour.scenes.find((scene) => scene.index === editTour.currentScene.index);
        if (!currentScene) return;

        dispatch(
            editScene({
                ...currentScene,
                audio: audioPath
                    ? {
                        path: audioPath,
                        autoPlay: autoPlayRef.current.checked,
                        loopAudio: loopRef.current.checked
                    }
                    : null
            })
        );

        toast.success('Lưu nhạc nền thành công.');
        dispatch(disableAudioPane());
        dispatch(enabledHasChangesScenes());
        setHasChanges(false);
    };

    /* Side effects */
    /* Handle select audio from file management */
    useEffect(() => {
        if (!isChangedAudio) return;
        const selectedFile = fileManagement.selectedResult[0];
        if (!selectedFile) return;

        setHasChanges(true);
        setAudioPath(selectedFile.path);
        setIsChangedAudio(false);
        if (audioRef.current) audioRef.current.load();
    }, [isChangedAudio]);
    /* Load current scene's audio path */
    useEffect(() => {
        if (editTour.currentScene.audio?.path) setAudioPath(editTour.currentScene.audio.path);
        else setAudioPath('');
    }, [editTour.currentScene]);

    return (
        <AnimatePresence>
            {paneManagement.isShowAudioPane && (
                <motion.section
                    initial={{ x: '100%', transition: { duration: 0.2, ease: easeInOut } }}
                    animate={{ x: '0', transition: { duration: 0.2, ease: easeInOut } }}
                    exit={{ x: '100%', transition: { duration: 0.2, ease: easeInOut } }}
                    className={`absolute top-0 right-0 bottom-0 flex flex-col w-96 max-w-[80vw] h-full bg-white dark:bg-black border-l dark:border-gray-400`}
                >
                    {/* Start: Content section */}
                    <section className='flex-grow flex flex-col gap-y-4 overflow-y-auto px-6 pt-4 pb-0'>
                        <h1 className='font-bold text-2xl'>Chỉnh sửa nhạc nền</h1>
                        <button
                            type='button'
                            className='flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-400 rounded drop-shadow hover:opacity-80'
                            onClick={handleSelectAudio}
                        >
                            <Unicons.UilMusicNote size='20' />
                            <span className='drop-shadow'>Chọn nhạc nền</span>
                        </button>
                        {audioPath && (
                            <>
                                <button
                                    type='button'
                                    className='flex items-center justify-center gap-2 -mt-2 px-4 py-2 text-white bg-red-400 rounded drop-shadow hover:opacity-80'
                                    onClick={handleDeleteAudio}
                                >
                                    <Unicons.UilTrash size='20' />
                                    <span className='drop-shadow'>Xóa nhạc nền</span>
                                </button>
                                <audio ref={audioRef} controls className='w-full'>
                                    <source
                                        src={`${import.meta.env.VITE_API_ENDPOINT}/${audioPath}`}
                                        type='audio/mp3'
                                    />
                                </audio>
                                <div className='flex flex-col gap-y-1'>
                                    <div className='flex items-center gap-x-1'>
                                        <input
                                            ref={autoPlayRef}
                                            type='checkbox'
                                            id='audio-autoplay'
                                            defaultChecked={
                                                getSceneByIndex(editTour.currentScene.index).audio?.autoPlay ?? true
                                            }
                                            onChange={() => {
                                                setHasChanges(true);
                                            }}
                                        />
                                        <label htmlFor='audio-autoplay'>Tự động phát</label>
                                    </div>
                                    <div className='flex items-center gap-x-1'>
                                        <input
                                            ref={loopRef}
                                            type='checkbox'
                                            id='audio-loop'
                                            defaultChecked={
                                                getSceneByIndex(editTour.currentScene.index).audio?.loopAudio ?? true
                                            }
                                            onChange={() => {
                                                setHasChanges(true);
                                            }}
                                        />
                                        <label htmlFor='audio-loop'>Lặp lại</label>
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                    {/* End: Footer section */}

                    {/* Start: Footer section */}
                    <section className='flex items-center justify-between px-6 py-4 border-t border-gray-400 dark:border-gray-700'>
                        <button
                            type='button'
                            className='font-semibold hover:opacity-80'
                            onClick={handleCancelEditAudio}
                        >
                            Đóng
                        </button>
                        <button
                            type='button'
                            disabled={!hasChanges}
                            className={`flex items-center gap-1 px-4 py-2 font-semibold text-white bg-nature-green drop-shadow rounded ${hasChanges ? 'hover:opacity-80' : 'opacity-50'
                                }`}
                            onClick={handleSaveAudio}
                        >
                            <Unicons.UilCheck size='20' />
                            <span>Lưu nhạc nền</span>
                        </button>
                    </section>
                    {/* End: Footer section */}
                </motion.section>
            )}
        </AnimatePresence>
    );
}
