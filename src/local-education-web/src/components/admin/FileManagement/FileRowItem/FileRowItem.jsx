/* Libraries */
import { useDispatch, useSelector } from 'react-redux';
import * as Unicons from '@iconscout/react-unicons';
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

export default function FileRowItem({ file }) {
    /* Hooks */
    const dispatch = useDispatch();

    /* Services */
    const fileServices = useFileServices();

    /* States */
    const fileManagement = useSelector(selectFileManagement);

    /* Functions */
    const cleanUpAfterDeleteFiles = () => {
        dispatch(resetCurrentFile());
        dispatch(clearSelectedFiles());
        if (fileManagement.multiSelectMode) dispatch(toggleMultiSelectMode());
        dispatch(triggerUpdateFiles());
    };

    /* Event handlers */
    const handleEnableMobileFilePreviewSection = () => {
        dispatch(setCurrentFile(file));
        dispatch(enableMobileFilePreviewSection());
    };
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
    const handleRenameFile = () => {
        dispatch(showFileRenameModal());
    };
    const handleToggleFilesDeletedStatus = async () => {
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

    return (
        <div
            className={`relative col-span-12 flex items-center gap-x-2 rounded p-2 lg:gap-x-4 ${
                fileManagement.selectedFiles.includes(file)
                    ? 'bg-blue-200 dark:bg-gray-600'
                    : 'odd:bg-gray-100 dark:odd:bg-dark'
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
                    className='aspect-video h-10 rounded-sm object-cover object-center drop-shadow'
                />
            ) : file.thumbnailPath === 'app_data/excel-logo.png' || file.name.includes('.xlsx') ? (
                <img
                    src={images.excelLogo}
                    alt={file.name}
                    className='aspect-video h-10 rounded-sm object-cover object-center drop-shadow'
                />
            ) : file.thumbnailPath === 'app_data/other_thumbnail.png' || file.fileType === 'Other' ? (
                <img
                    src={images.otherThumbnail}
                    alt={file.name}
                    className='aspect-video h-10 rounded-sm object-cover object-center drop-shadow'
                />
            ) : (
                <img
                    src={`${import.meta.env.VITE_API_ENDPOINT}/${file.thumbnailPath}`}
                    alt={file.name}
                    className='aspect-video h-10 rounded-sm object-cover object-center drop-shadow'
                />
            )}
            <h5 className='flex-grow truncate'>{file.name}</h5>
            <div className='flex items-center gap-2'>
                <button
                    type='button'
                    title='Chi tiết'
                    className='text-gray-600 hover:opacity-80 dark:text-white lg:hidden'
                    onClick={handleEnableMobileFilePreviewSection}
                >
                    <Unicons.UilInfoCircle size='20' />
                </button>
                {!file.isDeleted && (
                    <button
                        type='button'
                        title='Đổi tên'
                        className='text-gray-600 hover:opacity-80 dark:text-white'
                        onClick={handleRenameFile}
                    >
                        <Unicons.UilPen size='20' />
                    </button>
                )}
                <button
                    type='button'
                    title={file.isDeleted ? 'Khôi phục' : 'Xoá'}
                    className={`hover:opacity-80 ${file.isDeleted ? 'text-gray-600 dark:text-white' : 'text-red-400'}`}
                    onClick={handleToggleFilesDeletedStatus}
                >
                    {file.isDeleted ? <Unicons.UilRedo size='20' /> : <Unicons.UilTrash size='20' />}
                </button>
                {file.isDeleted && (
                    <button
                        type='button'
                        title='Xóa'
                        className='text-red-400 hover:opacity-80'
                        onClick={handleDeleteFiles}
                    >
                        <Unicons.UilTrash size='20' />
                    </button>
                )}
            </div>
        </div>
    );
}
