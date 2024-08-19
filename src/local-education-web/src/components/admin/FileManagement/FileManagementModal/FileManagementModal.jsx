/* Libraries */
import { useDispatch, useSelector } from 'react-redux';

/* Redux */
import {
    disableFileManagementModal,
    resetFileManagementSlice,
    selectFileManagement,
    triggerSelectFileCallback
} from '@redux/features/admin/fileManagement';

/* Components */
import { Modal } from '@components/shared';
import CategorySection from '../CategorySection/CategorySection';
import FileSection from '../FileSection/FileSection';
import FileDetailSection from '../FileDetailSection/FileDetailSection';
import FileDetailModal from '../FileDetailModal/FileDetailModal';
import FilePreviewModal from '../FilePreviewModal/FilePreviewModal';
import RenameFileModal from '../RenameFileModal/RenameFileModal';

export default function FileManagementModal() {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const fileManagement = useSelector(selectFileManagement);

    /* Event handlers */
    const handleCloseFileManagementModal = () => {
        dispatch(disableFileManagementModal());
        setTimeout(() => {
            dispatch(resetFileManagementSlice());
        }, 200); // Prevent flickering on closing
    };
    const handleSelectFile = () => {
        dispatch(triggerSelectFileCallback());
        handleCloseFileManagementModal();
    };

    return (
        <Modal show={fileManagement.showFileManagementModal} handleClose={handleCloseFileManagementModal}>
            <section className='flex flex-col pb-6 w-[calc(100vw-3rem)] h-[calc(100svh-3rem)] lg:h-[calc(100svh-9rem)] dark:text-white bg-white dark:bg-black border border-gray-500 rounded-lg shadow'>
                <div className='flex items-center justify-end gap-4 m-2 mb-1 p-2'>
                    <button
                        type='button'
                        className='font-semibold text-sm text-blue-400'
                        onClick={handleCloseFileManagementModal}
                    >
                        Đóng
                    </button>
                    {fileManagement.isSelectingFiles && (
                        <button
                            type='button'
                            disabled={fileManagement.selectedFiles.length === 0}
                            className={`px-4 py-1 font-semibold text-white bg-nature-green drop-shadow ${fileManagement.selectedFiles.length === 0 ? 'opacity-50' : 'hover:opacity-80'
                                } rounded`}
                            onClick={handleSelectFile}
                        >
                            Chọn
                        </button>
                    )}
                </div>
                <div className='flex-grow grid grid-cols-12 lg:divide-x divide-gray-200 overflow-y-auto'>
                    <CategorySection />
                    <FileSection />
                    <FileDetailSection />
                    <div className='lg:hidden'>
                        <FileDetailModal />
                    </div>
                </div>
            </section>
            <FilePreviewModal />
            <RenameFileModal />
        </Modal>
    );
}
