/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Unicons from '@iconscout/react-unicons';

/* Redux */
import {
    disableMobileFilePreviewSection,
    enableFilePreviewModal,
    selectFileManagement
} from '@redux/features/admin/fileManagement';

/* Utils */
import { formatBytes } from '@utils/formats';

/* Utils */
import { extractFileName } from '@utils/strings';

/* Components */
import { Modal } from '@components/shared';

export default function FileDetailModal() {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const fileManagement = useSelector(selectFileManagement);
    const [isCopied, setIsCopied] = useState(false);

    /* Refs */
    const pathRef = useRef(null);

    /* Event handlers */
    const handleCloseMobileFilePreviewSection = () => {
        dispatch(disableMobileFilePreviewSection());
    };
    const handlePreview = () => {
        dispatch(enableFilePreviewModal());
    };
    const handleCopy = () => {
        navigator.clipboard.writeText(pathRef.current.innerText);
        setIsCopied(true);
    };

    /* Side effects */
    /* Reset is copied on file changed */
    useEffect(() => {
        setIsCopied(false);
    }, [fileManagement.currentFile]);

    return (
        <Modal show={fileManagement.showMobileFilePreviewSection} handleClose={handleCloseMobileFilePreviewSection}>
            <section className='fixed top-0 right-0 bottom-0 flex flex-col gap-y-4 px-6 py-4 w-80 max-w-[80vw] h-full bg-white dark:bg-black border-l dark:border-gray-400'>
                <div className='flex items-center justify-between'>
                    <h2 className='font-semibold text-xl'>Chi tiết</h2>
                    <button
                        type='button'
                        className='font-semibold text-sm text-blue-400'
                        onClick={handleCloseMobileFilePreviewSection}
                    >
                        Đóng
                    </button>
                </div>
                <div role='button' className='relative block cursor-pointer' onClick={handlePreview}>
                    <img
                        src={`${import.meta.env.VITE_API_ENDPOINT}/${fileManagement.currentFile.thumbnailPath}`}
                        alt={fileManagement.currentFile.name}
                        className='w-full rounded drop-shadow'
                    />
                    <button
                        type='button'
                        className='absolute inset-0 flex items-center justify-center gap-x-2 text-white bg-black/20 drop-shadow'
                    >
                        <Unicons.UilSearch size='24' />
                        <span>Nhấn để xem chi tiết</span>
                    </button>
                </div>
                <div className='flex flex-col gap-1'>
                    <b>Đường dẫn:</b>
                    <div
                        className={`relative flex items-center justify-center gap-1 p-2 outline outline-2 ${isCopied ? 'outline-nature-green' : 'outline-gray-400'
                            } rounded`}
                    >
                        {isCopied && (
                            <span className='absolute top-0 left-0 -mt-px px-1 font-semibold text-xs text-white bg-nature-green rounded-tl rounded-br'>
                                Đã sao chép
                            </span>
                        )}
                        <span
                            ref={pathRef}
                            className='flex-grow truncate'
                            title={`${import.meta.env.VITE_API_ENDPOINT}/${fileManagement.currentFile.path}`}
                        >
                            {import.meta.env.VITE_API_ENDPOINT}/{fileManagement.currentFile.path}
                        </span>
                        <button
                            title={isCopied ? 'Đã sao chép' : 'Sao chép'}
                            className='relative -m-2 p-2'
                            disabled={isCopied}
                            onClick={handleCopy}
                        >
                            <Unicons.UilCopy size='24' />
                        </button>
                    </div>
                </div>
                <p>
                    <b className='mr-1'>Tên:</b>
                    <span className='break-words'>{extractFileName(fileManagement.currentFile.name).name}</span>
                </p>
                <p>
                    <b className='mr-1'>Định dạng:</b>
                    <span>{extractFileName(fileManagement.currentFile.name).extension}</span>
                </p>
                <p>
                    <b className='mr-1'>Loại:</b>
                    <span>{fileManagement.currentFile.fileType}</span>
                </p>
                <p>
                    <b className='mr-1'>Kích thước:</b>
                    <span>{formatBytes(fileManagement.currentFile.size)}</span>
                </p>
                <p>
                    <b className='mr-1'>Ngày tạo:</b>
                    <span>
                        {new Date(fileManagement.currentFile.createdDate).toLocaleString('vi-vn', {
                            dateStyle: 'short'
                        })}
                    </span>
                </p>
            </section>
        </Modal>
    );
}
