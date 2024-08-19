/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Unicons from '@iconscout/react-unicons';
import { toast } from 'react-toastify';
import * as uuid from 'uuid';

/* Hooks */
import { useDebounce } from '@hooks/shared';

/* Redux */
import {
    clearSelectedFiles,
    decreaseFilePageNumber,
    hideDeletedFiles,
    increaseFilePageNumber,
    resetCurrentFile,
    selectFileManagement,
    setCurrentCategory,
    setFileFolderId,
    setFileKeyword,
    setFilePageNumber,
    setFilePageSize,
    setFileSortColumn,
    showDeletedFiles,
    toggleFileSortOrder,
    toggleMultiSelectMode,
    triggerUpdateFiles
} from '@redux/features/admin/fileManagement';
import { saveSettings, selectSettings, toggleFileViewMode } from '@redux/features/shared/settings';

/* Services */
import { useFileServices } from '@services/admin';

/* Components */
import { Input } from '@components/admin';
import { Pager } from '@components/shared';
import FileGridItem from '../FileGridItem/FileGridItem';
import FileRowItem from '../FileRowItem/FileRowItem';

export default function FileSection() {
    /* States */
    const settings = useSelector(selectSettings);
    const fileManagement = useSelector(selectFileManagement);
    const [categories, setCategories] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [files, setFiles] = useState([]);
    const [metadata, setMetadata] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    /* Hooks */
    const dispatch = useDispatch();
    const debounceSearchKeyword = useDebounce(searchKeyword, 500);

    /* Services */
    const fileServices = useFileServices();

    /* Refs */
    const categoryNameRef = useRef(null);
    const inputFileRef = useRef(null);
    const searchKeywordRef = useRef(null);

    /* Functions */
    const getCategories = async () => {
        const categoriesResult = await fileServices.getFolders();

        if (categoriesResult.isSuccess) setCategories(categoriesResult.result);
    };
    const clearSearchKeyword = () => {
        setSearchKeyword('');
    };
    const renderCategoryName = () => {
        switch (fileManagement.currentCategory) {
            case 'all':
                return 'Tất cả';
            case 'images':
                return 'Hình ảnh';
            case 'videos':
                return 'Video';
            case 'audios':
                return 'Audio';
            case 'others':
                return 'Khác';
            case 'trash':
                return 'Thùng rác';
        }
    };
    const getFiles = async () => {
        setIsLoading(true);
        const fileResult = await fileServices.getFilesByQueries(new URLSearchParams(fileManagement.fileQueries));

        if (fileResult.isSuccess) {
            setFiles(fileResult.result.items);
            setMetadata(fileResult.result.metadata);
        }
        setIsLoading(false);
    };
    const cleanUpAfterDeleteFiles = () => {
        dispatch(resetCurrentFile());
        dispatch(clearSelectedFiles());
        if (fileManagement.multiSelectMode) dispatch(toggleMultiSelectMode());
        dispatch(triggerUpdateFiles());
    };

    /* Event handlers */
    const handleChangeCategory = (e) => {
        const category = categories.find((category) => category.slug === e.target.value) || {
            id: uuid.NIL,
            slug: e.target.value
        };
        dispatch(setCurrentCategory(category.slug));
        dispatch(setFileFolderId(category.id));
        if (category.slug === 'trash') dispatch(showDeletedFiles());
        else dispatch(hideDeletedFiles());
    };
    const handleUploadFile = (e) => {
        const files = Array.from(e.target.files);
        const uploadPromises = files.map(async (file) => await fileServices.uploadFile(file));
        toast.promise(
            Promise.allSettled(uploadPromises).then(() => {
                dispatch(triggerUpdateFiles());
            }),
            {
                pending: 'Đang tải lên...',
                success: 'Tải lên thành công.',
                error: 'Tải lên thất bại, vui lòng thử lại.'
            },
            {
                toastId: 'upload-toast'
            }
        );
    };
    const handleChangeSortColumn = (e) => {
        dispatch(setFileSortColumn(e.target.value));
    };
    const handleToggleSortOrder = () => {
        dispatch(toggleFileSortOrder());
    };
    const handleToggleFileViewMode = () => {
        dispatch(toggleFileViewMode());
        dispatch(saveSettings());
    };
    const handleToggleMultiSelectMode = () => {
        dispatch(toggleMultiSelectMode());
    };
    const handleMoveFilesToTrash = async () => {
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
    const handleEmptyTrash = async () => {
        if (!confirm('Sau khi xoá không thể khôi phục. Xác nhận xoá toàn bộ tập tin trong thùng rác?')) return;

        const emptyResult = await fileServices.emptyTrash();

        if (emptyResult.isSuccess) {
            cleanUpAfterDeleteFiles();
            toast.success('Xoá toàn bộ tập tin trong thùng rác thành công.');
        } else {
            toast.error(emptyResult.errors[0]);
        }
    };

    /* Side effects */
    /* Sync category name */
    useEffect(() => {
        categoryNameRef.current.value = fileManagement.currentCategory;
    }, [fileManagement.currentCategory]);
    /* Get categories */
    useEffect(() => {
        getCategories();
    }, []);
    /* Clear selected files and reset page number when change category */
    useEffect(() => {
        dispatch(clearSelectedFiles());
        dispatch(resetCurrentFile());
        dispatch(setFilePageNumber(1));
        if (fileManagement.multiSelectMode) dispatch(toggleMultiSelectMode());
    }, [fileManagement.currentCategory]);
    /* Debounce file keyword */
    useEffect(() => {
        dispatch(setFileKeyword(searchKeyword.trim()));
    }, [debounceSearchKeyword]);
    /* Get files by queries */
    useEffect(() => {
        const filesTimeout = setTimeout(() => {
            getFiles();
        }, 100); // Prevent flickering if allowed category is existed

        return () => {
            clearTimeout(filesTimeout);
        };
    }, [fileManagement.fileQueries, fileManagement.isUpdateFiles]);
    /* Clear selected files when toggle off multi select mode */
    useEffect(() => {
        if (!fileManagement.multiSelectMode) {
            dispatch(clearSelectedFiles());
            dispatch(resetCurrentFile());
        }
    }, [fileManagement.multiSelectMode]);

    return (
        <section className='col-span-12 lg:col-span-8 flex flex-col gap-y-4 px-4 pt-1 overflow-y-auto overflow-x-hidden'>
            {/* Start: Header section */}
            <section className='relative'>
                <h2 className='hidden lg:block font-bold text-xl'>{renderCategoryName()}</h2>
                <select
                    ref={categoryNameRef}
                    className='lg:hidden font-bold text-xl dark:bg-black'
                    onChange={handleChangeCategory}
                >
                    <option value='all'>Tất cả</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                            {category.name}
                        </option>
                    ))}
                    <option value='trash'>Thùng rác</option>
                </select>
                <button
                    type='button'
                    className='absolute -top-1 right-0 flex items-center justify-center gap-1 px-4 py-1 text-white bg-nature-green rounded shadow-inner hover:opacity-80'
                    onClick={() => {
                        inputFileRef.current.click();
                    }}
                >
                    <Unicons.UilUpload size='16' />
                    <span className='drop-shadow'>Tải lên</span>
                </button>
                <input
                    ref={inputFileRef}
                    type='file'
                    hidden
                    multiple
                    accept='image/*, video/*, audio/*'
                    onChange={handleUploadFile}
                />
            </section>
            {/* End: Header section */}

            {/* Start: Control bar section */}
            <section className='grid grid-cols-12 gap-x-4 gap-y-2'>
                {/* Start: Search */}
                <div className='col-span-12 lg:col-span-4 xl:col-span-3 2xl:col-span-3'>
                    <Input
                        ref={searchKeywordRef}
                        value={searchKeyword}
                        placeholder='Tìm kiếm file...'
                        rightIcon={<Unicons.UilSearch size='20' className='dark:text-white' />}
                        clearInput={clearSearchKeyword}
                        onChange={(e) => {
                            setSearchKeyword(e.target.value);
                        }}
                    />
                </div>
                {/* End: Search */}

                {/* Start: Action buttons */}
                <div className='col-span-12 lg:col-span-4 xl:col-span-3 2xl:col-span-3'>
                    <select
                        className='px-4 py-2 w-full h-full bg-white border border-gray-400 rounded shadow-inner appearance-none dark:bg-dark'
                        onChange={handleChangeSortColumn}
                    >
                        <option value='createdDate'>Sắp xếp theo Ngày</option>
                        <option value='name'>Sắp xếp theo Tên</option>
                        <option value='size'>Sắp xếp Kích thước</option>
                    </select>
                </div>

                <div className='col-span-12 lg:col-span-4 xl:col-span-3 2xl:col-span-3'>
                    <div className='flex items-center gap-x-2'>
                        <button
                            type='button'
                            title='Đảo ngược hướng sắp xếp'
                            className='flex items-center justify-center p-2 h-full aspect-square bg-white border border-gray-400 rounded shadow-inner drop hover:bg-gray-100 dark:bg-dark dark:hover:bg-white/30'
                            onClick={handleToggleSortOrder}
                        >
                            {fileManagement.fileQueries.SortOrder === 'asc' ? (
                                <Unicons.UilSortAmountUp size='24' />
                            ) : (
                                <Unicons.UilSortAmountDown size='24' />
                            )}
                        </button>
                        <button
                            type='button'
                            title={settings.fileViewMode === 'grid' ? 'Bố cục kiểu danh sách' : 'Bố cục kiểu lưới'}
                            className='flex items-center justify-center p-2 h-full aspect-square bg-white border border-gray-400 rounded shadow-inner hover:bg-gray-100 dark:bg-dark dark:hover:bg-white/30'
                            onClick={handleToggleFileViewMode}
                        >
                            {settings.fileViewMode === 'grid' ? (
                                <Unicons.UilColumns size='24' className='rotate-90' />
                            ) : (
                                <Unicons.UilApps size='24' />
                            )}
                        </button>
                        {fileManagement.showMultiSelectModeButton && (
                            <button
                                type='button'
                                title='Chuyển chế độ chọn'
                                className={`flex items-center justify-center p-2 h-full aspect-square bg-white border border-gray-400 rounded shadow-inner hover:bg-gray-100 dark:bg-dark dark:hover:bg-white/30${fileManagement.multiSelectMode ? ' outline outline-2 outline-blue-400' : ''
                                    }`}
                                onClick={handleToggleMultiSelectMode}
                            >
                                <Unicons.UilCheckSquare size='24' />
                            </button>
                        )}
                        {fileManagement.selectedFiles.length !== 0 && (
                            <button
                                type='button'
                                title={fileManagement.currentCategory === 'trash' ? 'Khôi phục' : 'Xóa'}
                                className='flex items-center justify-center p-2 h-full aspect-square bg-white border border-gray-400 rounded shadow-inner hover:bg-gray-100 dark:bg-dark dark:hover:bg-white/30'
                                onClick={handleMoveFilesToTrash}
                            >
                                {fileManagement.currentCategory === 'trash' ? (
                                    <Unicons.UilRedo size='24' />
                                ) : (
                                    <Unicons.UilTrash size='24' className='text-red-400' />
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {fileManagement.currentCategory === 'trash' && files.length !== 0 && (
                    <div className='col-span-12 lg:col-span-4 xl:col-span-3 2xl:col-span-3 self-center'>
                        <button
                            type='button'
                            className='flex items-center justify-center gap-1 w-fit text-red-400 hover:opacity-80'
                            onClick={handleEmptyTrash}
                        >
                            <Unicons.UilTrash size='20' />
                            <span>Dọn thùng rác</span>
                        </button>
                    </div>
                )}
                {/* End: Action buttons */}
            </section>
            {/* End: Control bar section */}

            {/* Start: File items section */}
            {settings.fileViewMode === 'grid' ? (
                <>
                    {isLoading ? (
                        <Unicons.UilSpinner
                            size='48'
                            className='animate-spin animate-infinite animate-duration-1000 mx-auto dark:text-white'
                        />
                    ) : (
                        <section className='grid grid-cols-12 gap-4 -m-1 p-1 pb-4 overflow-y-auto no-scrollbar'>
                            {files.map((file) => (
                                <FileGridItem key={file.id} file={file} />
                            ))}
                        </section>
                    )}
                </>
            ) : (
                <>
                    {isLoading ? (
                        <Unicons.UilSpinner
                            size='48'
                            className='animate-spin animate-infinite animate-duration-1000 mx-auto dark:text-white'
                        />
                    ) : (
                        <section className='-m-1 p-1 pb-4 overflow-y-auto no-scrollbar'>
                            {files.map((file) => (
                                <FileRowItem key={file.id} file={file} />
                            ))}
                        </section>
                    )}
                </>
            )}
            {/* End: File items section */}
            <div className='relative'>
                <div className='absolute -top-6 left-0 right-0 h-4 bg-gradient-to-t from-white dark:from-black to-transparent'></div>
                <Pager
                    metadata={metadata}
                    increasePageNumber={() => {
                        dispatch(increaseFilePageNumber());
                    }}
                    decreasePageNumber={() => {
                        dispatch(decreaseFilePageNumber());
                    }}
                    setPageNumber={(pageNumber) => {
                        dispatch(setFilePageNumber(pageNumber));
                    }}
                    setPageSize={(pageSize) => {
                        dispatch(setFilePageSize(pageSize));
                    }}
                />
            </div>
        </section>
    );
}
