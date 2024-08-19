/* Libraries */
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

/* Redux */
import {
    hideFileRenameModal,
    selectFileManagement,
    setCurrentFile,
    triggerUpdateFiles
} from '@redux/features/admin/fileManagement';

/* Services */
import { useFileServices } from '@services/admin';

/* Utils */
import { extractFileName } from '@utils/strings';

/* Components */
import { Modal } from '@components/shared';

export default function RenameFileModal() {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const fileManagement = useSelector(selectFileManagement);
    const [errorMessages, setErrorMessages] = useState([]);

    /* Refs */
    const fileNameRef = useRef(null);

    /* File services */
    const fileServices = useFileServices();

    /* Functions */
    const validateFileName = () => {
        if (fileNameRef.current.value.trim() === '') {
            setErrorMessages(['Tên tập tin không được để trống.']);
            return false;
        }

        return true;
    };

    /* Event handlers */
    const handleHideFileRenameModal = () => {
        dispatch(hideFileRenameModal());
        setErrorMessages([]);
    };
    const handleRenameFile = async (e) => {
        e.preventDefault();
        if (!validateFileName()) return;

        const fileExtension = extractFileName(fileManagement.currentFile.name).extension;
        const editedFile = {
            ...fileManagement.currentFile,
            name: `${fileNameRef.current.value.trim()}.${fileExtension}`
        };
        const renameResult = await fileServices.renameFile(editedFile);

        if (renameResult.isSuccess) {
            dispatch(setCurrentFile(editedFile));
            dispatch(triggerUpdateFiles());
            handleHideFileRenameModal();
            toast.success('Đổi tên tập tin thành công.', { toastId: 'edit-file-name' });
        } else {
            setErrorMessages(renameResult.errors);
        }
    };

    return (
        <Modal show={fileManagement.isShowFileRenameModal} handleClose={handleHideFileRenameModal}>
            <form
                className='flex flex-col gap-8 p-8 w-96 max-w-[calc(100vw-3rem)] dark:text-white bg-white dark:bg-dark dark:border dark:border-gray-700 rounded-2xl shadow'
                onSubmit={handleRenameFile}
            >
                <h4 className='font-bold text-xl text-center uppercase'>Đổi tên</h4>
                {errorMessages.map((errorMessage, index) => (
                    <h6 key={index} className='text-center text-red-400'>
                        {errorMessage}
                    </h6>
                ))}
                <input
                    ref={fileNameRef}
                    type='text'
                    autoFocus
                    placeholder='Nhập tên tập tin...'
                    defaultValue={extractFileName(fileManagement.currentFile.name).name}
                    className='px-4 py-2 bg-white dark:bg-dark border border-gray-400 rounded shadow-inner'
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') handleHideFileRenameModal();
                    }}
                    onFocus={(e) => {
                        e.target.select();
                    }}
                />
                <div className='inline-grid grid-cols-2 gap-x-4'>
                    <button
                        type='button'
                        className='px-8 py-2 text-nature-green dark:text-light-green bg-white dark:bg-dark border border-nature-green dark:border-light-green rounded drop-shadow hover:bg-gray-50 dark:hover:bg-gray-900'
                        onClick={handleHideFileRenameModal}
                    >
                        Huỷ
                    </button>
                    <button
                        type='submit'
                        className='px-8 py-2 text-white bg-nature-green rounded drop-shadow hover:opacity-80'
                    >
                        Lưu
                    </button>
                </div>
            </form>
        </Modal>
    );
}
