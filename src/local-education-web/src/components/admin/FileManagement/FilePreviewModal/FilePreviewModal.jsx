/* Libraries */
import { useDispatch, useSelector } from 'react-redux';

/* Redux */
import { disableFilePreviewModal, selectFileManagement } from '@redux/features/admin/fileManagement';

/* Componets */
import { Modal } from '@components/shared';

export default function FilePreviewModal() {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const fileManagement = useSelector(selectFileManagement);

    /* Event handlers */
    const handleCloseFilePreviewModal = () => {
        dispatch(disableFilePreviewModal());
    };

    return (
        <Modal show={fileManagement.showFilePreviewModal} handleClose={handleCloseFilePreviewModal}>
            <button
                type='button'
                title='Đóng'
                className='fixed top-8 lg:top-1.5 right-8 lg:right-6 px-4 py-2 font-semibold text-sm text-white bg-black dark:bg-gray-500 rounded-full drop-shadow hover:opacity-80'
                onClick={handleCloseFilePreviewModal}
            >
                Đóng
            </button>
            {(fileManagement.currentFile.fileType === 'Panorama' ||
                fileManagement.currentFile.fileType === 'Image') && (
                    <img
                        src={`${import.meta.env.VITE_API_ENDPOINT}/${fileManagement.currentFile.path}`}
                        alt={fileManagement.currentFile.name}
                        className='max-w-[calc(100vw-3rem)] max-h-[calc(100svh-6rem)] object-contain object-center'
                    />
                )}
            {fileManagement.currentFile.fileType === 'Video' && (
                <video
                    className='max-w-[calc(100vw-3rem)] max-h-[calc(100svh-6rem)]'
                    controls
                >
                    <source
                        src={`${import.meta.env.VITE_API_ENDPOINT}/${fileManagement.currentFile.path}`}
                        type='video/mp4'
                    />
                </video>
            )}
            {fileManagement.currentFile.fileType === 'Audio' && (
                <audio
                    className='max-w-[calc(100vw-3rem)] max-h-[calc(100svh-6rem)]'
                    controls
                >
                    <source
                        src={`${import.meta.env.VITE_API_ENDPOINT}/${fileManagement.currentFile.path}`}
                        type='audio/mp3'
                    />
                </audio>
            )}
        </Modal>
    );
}
