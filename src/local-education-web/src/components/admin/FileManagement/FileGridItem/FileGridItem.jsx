/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Unicons from '@iconscout/react-unicons';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

/* Assets */
import { images } from '@assets/images';

/* Redux */
import {
    addFileToSelectedList,
    clearSelectedFiles,
    enableMobileFilePreviewSection,
    removeFileFromSelectedList,
    resetCurrentFile,
    selectFileManagement,
    setCurrentFile,
    showFileRenameModal,
    toggleMultiSelectMode,
    triggerUpdateFiles
} from '@redux/features/admin/fileManagement';

/* Services */
import { useFileServices } from '@services/admin';

/* Utils */
import { extractFileName } from '@utils/strings';

/* Components */
import { Fade } from '@components/shared';

export default function FileGridItem({ file }) {
    /* Hooks */
    const dispatch = useDispatch();

    /* Services */
    const fileServices = useFileServices();

    /* States */
    const fileManagement = useSelector(selectFileManagement);
    const [showFileOptions, setShowFileOptions] = useState(false);

    /* Refs */
    const fileOptionsRef = useRef(null);
    const fileOptionsButtonRef = useRef(null);

    /* Functions */
    const closeFileOptions = () => {
        setShowFileOptions(false);
    };
    const cleanUpAfterDeleteFiles = () => {
        dispatch(resetCurrentFile());
        dispatch(clearSelectedFiles());
        if (fileManagement.multiSelectMode) dispatch(toggleMultiSelectMode());
        dispatch(triggerUpdateFiles());
    };

    /* Event handlers */
    const handleSelectFile = (e) => {
        if (fileManagement.multiSelectMode) {
            if (!fileManagement.selectedFiles.includes(file)) {
                dispatch(addFileToSelectedList(file));
            } else if (!e.target.closest('button')) {
                dispatch(removeFileFromSelectedList(file));
            }
        } else {
            if (!fileManagement.selectedFiles.includes(file)) {
                dispatch(clearSelectedFiles());
                dispatch(addFileToSelectedList(file));
            } else if (!e.target.closest('button')) {
                dispatch(removeFileFromSelectedList(file));
            }
        }
        if (fileManagement.currentFile.id !== file.id && !fileManagement.multiSelectMode) {
            dispatch(setCurrentFile(file));
        } else if (!e.target.closest('button')) {
            dispatch(resetCurrentFile());
        }
    };
    const handleToggleFileOptions = () => {
        setShowFileOptions((state) => !state);
    };
    const handleCloseFileOptionsOnMouseDown = (e) => {
        if (e.target.closest('button') === fileOptionsButtonRef.current) return;
        if (fileOptionsRef.current && !fileOptionsRef.current.contains(e.target)) closeFileOptions();
    };
    const handleEnableMobileFilePreviewSection = () => {
        dispatch(setCurrentFile(file));
        dispatch(enableMobileFilePreviewSection());
        closeFileOptions();
    };
    const handleRenameFile = () => {
        closeFileOptions();
        dispatch(showFileRenameModal());
    };
    const handleToggleFilesDeletedStatus = async () => {
        closeFileOptions();
        if (fileManagement.selectedFiles.length === 0) return;

        const fileIds = fileManagement.selectedFiles.map((selectedFile) => selectedFile.id);
        const moveResult = await fileServices.toggleFilesDeletedStatus(fileIds);

        if (moveResult.isSuccess) {
            cleanUpAfterDeleteFiles();
            if (fileManagement.currentCategory === 'trash') toast.success('Khôi phục các tập tin đã chọn thành công.');
            else toast.success('Chuyển các tập tin đã chọn vào thùng rác thành công.');
        } else {
            toast.error(moveResult.errors[0]);
        }
    };
    const handleDeleteFiles = async () => {
        closeFileOptions();
        if (
            fileManagement.selectedFiles.length === 0 ||
            !confirm('Sau khi xoá không thể khôi phục. Xác nhận xoá các tập tin đã chọn?')
        )
            return;

        const fileIds = fileManagement.selectedFiles.map((selectedFile) => selectedFile.id);
        const deleteResult = await fileServices.deleteFiles(fileIds);

        if (deleteResult.isSuccess) {
            cleanUpAfterDeleteFiles();
            toast.success('Xoá các tập tin đã chọn thành công.');
        } else {
            toast.error(deleteResult.errors[0]);
        }
    };

    /* Side effects */
    /* Close Tour's Options when clicking outside */
    useEffect(() => {
        document.addEventListener('mousedown', handleCloseFileOptionsOnMouseDown);

        return () => {
            document.removeEventListener('mousedown', handleCloseFileOptionsOnMouseDown);
        };
    }, []);

    return (
        <div
            className={`relative col-span-6 flex h-fit flex-col gap-y-1 rounded border bg-gray-200 p-2 outline outline-4 dark:border-gray-700 dark:bg-dark md:col-span-4 xl:col-span-3 ${
                fileManagement.selectedFiles.includes(file) ? 'outline-blue-400' : 'outline-transparent'
            }`}
            role='button'
            onClick={handleSelectFile}
        >
            {file.thumbnailPath === 'app_data/audio_thumbnail.png' ||
            file.fileType === 'Audio' ||
            file.name.includes('.mp3') ? (
                <img
                    src={images.audioThumbnail}
                    alt={file.name}
                    className='aspect-video rounded-sm object-cover object-center drop-shadow'
                />
            ) : file.thumbnailPath === 'app_data/excel-logo.png' || file.name.includes('.xlsx') ? (
                <img
                    src={images.excelLogo}
                    alt={file.name}
                    className='aspect-video rounded-sm object-cover object-center drop-shadow'
                />
            ) : file.thumbnailPath === 'app_data/other_thumbnail.png' || file.fileType === 'Other' ? (
                <img
                    src={images.otherThumbnail}
                    alt={file.name}
                    className='aspect-video rounded-sm object-cover object-center drop-shadow'
                />
            ) : (
                <img
                    src={`${import.meta.env.VITE_API_ENDPOINT}/${file.thumbnailPath}`}
                    alt={file.name}
                    className='aspect-video rounded-sm object-cover object-center drop-shadow'
                />
            )}
            <div className='relative flex items-center gap-x-1'>
                <span className='flex-grow truncate text-sm'>{extractFileName(file.name).name}</span>
                {!fileManagement.isSelectingFiles && (
                    <>
                        <button ref={fileOptionsButtonRef} type='button' onClick={handleToggleFileOptions}>
                            <Unicons.UilEllipsisH size='20' />
                        </button>
                        <AnimatePresence>
                            {showFileOptions && (
                                <Fade
                                    ref={fileOptionsRef}
                                    duration={0.1}
                                    className='absolute right-8 z-10 flex w-max flex-col rounded border bg-white py-0.5
                            shadow-2xl before:absolute before:-right-[17px] before:top-1/2 before:hidden before:-translate-y-1/2
                            before:border-8 before:border-transparent before:border-l-white after:absolute after:left-full after:top-1/2 after:-translate-y-1/2
                            after:border-8 after:border-transparent after:border-l-white dark:border-gray-700 dark:bg-dark dark:before:inline-block dark:before:border-l-gray-600 dark:after:border-l-dark'
                                >
                                    <button
                                        type='button'
                                        className='flex items-center gap-1 px-2 text-left text-sm hover:opacity-80 lg:hidden'
                                        onClick={handleEnableMobileFilePreviewSection}
                                    >
                                        Chi tiết
                                    </button>
                                    {!file.isDeleted && (
                                        <button
                                            type='button'
                                            className='flex items-center gap-1 px-2 text-left text-sm hover:opacity-80'
                                            onClick={handleRenameFile}
                                        >
                                            Đổi tên
                                        </button>
                                    )}
                                    <button
                                        type='button'
                                        className={`flex items-center gap-1 px-2 text-left text-sm${
                                            file.isDeleted ? ' ' : ' text-red-400 '
                                        }over:opacity-80`}
                                        onClick={handleToggleFilesDeletedStatus}
                                    >
                                        {file.isDeleted ? 'Khôi phục' : 'Xoá'}
                                    </button>
                                    {file.isDeleted && (
                                        <button
                                            type='button'
                                            className='over:opacity-80 flex items-center gap-1 px-2 text-left text-sm text-red-400'
                                            onClick={handleDeleteFiles}
                                        >
                                            Xoá
                                        </button>
                                    )}
                                </Fade>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>
        </div>
    );
}
