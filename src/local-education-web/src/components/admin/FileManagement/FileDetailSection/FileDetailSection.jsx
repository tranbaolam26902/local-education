/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Unicons from '@iconscout/react-unicons';

/* Redux */
import { enableFilePreviewModal, selectFileManagement } from '@redux/features/admin/fileManagement';

/* Utils */
import { formatBytes } from '@utils/formats';
import { extractFileName } from '@utils/strings';

export default function FileDetailSection() {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const fileManagement = useSelector(selectFileManagement);
    const [isCopied, setIsCopied] = useState(false);

    /* Refs */
    const pathRef = useRef(null);

    /* Event handlers */
    const handlePreview = () => {
        if (
            fileManagement.currentFile.path.includes('.jpg') ||
            fileManagement.currentFile.path.includes('.jpeg') ||
            fileManagement.currentFile.path.includes('.png') ||
            fileManagement.currentFile.path.includes('.mp3') ||
            fileManagement.currentFile.path.includes('.mp4')
        ) {
            dispatch(enableFilePreviewModal());
            return;
        }
        window.open(`${import.meta.env.VITE_API_ENDPOINT}/${fileManagement.currentFile.path}`);
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
        <section className='col-span-2 hidden lg:flex flex-col gap-y-4 px-4 pt-1'>
            {fileManagement.multiSelectMode ? (
                <div className='flex items-center gap-x-2'>
                    <Unicons.UilCheckCircle size='24' className='text-blue-400' />
                    <h2 className='font-semibold text-xl'>Đã chọn {fileManagement.selectedFiles.length} mục</h2>
                </div>
            ) : (
                fileManagement.currentFile.id && (
                    <>
                        <h2 className='font-semibold text-xl'>Chi tiết</h2>
                        <div role='button' className='relative block cursor-pointer' onClick={handlePreview}>
                            <img
                                src={`${import.meta.env.VITE_API_ENDPOINT}/${fileManagement.currentFile.thumbnailPath}`}
                                alt=''
                                className='w-full rounded drop-shadow'
                            />
                            <button
                                type='button'
                                className='absolute inset-0 flex items-center justify-center gap-x-2 text-white bg-black/20 drop-shadow'
                            >
                                <Unicons.UilSearch size='24' className='hidden 2xl:inline-block' />
                                <span className='text-xs xl:text-base'>Nhấn để xem chi tiết</span>
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
                    </>
                )
            )}
        </section>
    );
}
