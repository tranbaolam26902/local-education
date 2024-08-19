/* Libraries */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Unicons from '@iconscout/react-unicons';
import * as uuid from 'uuid';

/* Redux */
import {
    clearSelectedFiles,
    hideDeletedFiles,
    resetCurrentFile,
    selectFileManagement,
    setCurrentCategory,
    setFileFolderId,
    setFilePageNumber,
    showDeletedFiles,
    toggleMultiSelectMode
} from '@redux/features/admin/fileManagement';

/* Services */
import { useFileServices } from '@services/admin';

export default function CategorySection() {
    /* Hooks */
    const dispatch = useDispatch();

    /* Services */
    const fileServices = useFileServices();

    /* States */
    const fileManagement = useSelector(selectFileManagement);
    const [categories, setCategories] = useState([]);

    /* Functions */
    const getCategories = async () => {
        const categoriesResult = await fileServices.getFolders();

        if (categoriesResult.isSuccess) setCategories(categoriesResult.result);
    };
    const getCategoryIcon = (slug) => {
        switch (slug) {
            case 'images':
                return <Unicons.UilImage size='20' />;
            case 'videos':
                return <Unicons.UilVideo size='20' />;
            case 'audios':
                return <Unicons.UilMusicNote size='20' />;
            case 'others':
                return <Unicons.UilFileAlt size='20' />;
        }
    };
    const getCategoryBySlug = (slug) => categories.find((category) => category.slug === slug);
    const renderCategoryBySlug = (slug) => {
        const category = getCategoryBySlug(slug);
        if (category)
            return (
                <button
                    id={category.id}
                    key={category.id}
                    type='button'
                    value={category.slug}
                    className={`flex items-center gap-x-2 px-3 py-2 rounded ${fileManagement.currentCategory === category.slug
                            ? 'text-white bg-gray-500'
                            : 'hover:bg-gray-100 dark:hover:bg-white/20'
                        }`}
                    onClick={handleChangeCategory}
                >
                    {getCategoryIcon(category.slug)}
                    <span>{category.name}</span>
                </button>
            );
    };

    /* Event handlers */
    const handleChangeCategory = (e) => {
        const button = e.target.closest('button');
        dispatch(setCurrentCategory(button.value));
        dispatch(setFileFolderId(button.id));
        if (button.value === 'trash') dispatch(showDeletedFiles());
        else dispatch(hideDeletedFiles());
    };

    /* Side effects */
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
    /* Show allowed category files */
    useEffect(() => {
        if (fileManagement.allowedCategory && categories) {
            const category = getCategoryBySlug(fileManagement.allowedCategory);
            if (category) {
                dispatch(setCurrentCategory(category.slug));
                dispatch(setFileFolderId(category.id));
            }
        }
    }, [fileManagement.allowedCategory, categories]);

    return (
        <section className='col-span-2 hidden lg:flex flex-col gap-y-4 px-4 pt-1'>
            <h2 className='font-bold text-xl'>Danh mục</h2>
            {categories.length !== 0 &&
                (fileManagement.allowedCategory !== '' ? (
                    renderCategoryBySlug(fileManagement.allowedCategory)
                ) : (
                    <div className='flex flex-col'>
                        <button
                            id={uuid.NIL}
                            type='button'
                            value='all'
                            className={`flex items-center gap-x-2 px-3 py-[0.5625rem] rounded ${fileManagement.currentCategory === 'all'
                                    ? 'text-white bg-gray-500'
                                    : 'hover:bg-gray-100 dark:hover:bg-white/20'
                                }`}
                            onClick={handleChangeCategory}
                        >
                            <Unicons.UilEstate size='20' />
                            <span>Tất cả</span>
                        </button>
                        <hr className='my-2 bg-gray-200' />
                        {categories.map((category) => renderCategoryBySlug(category.slug))}
                        <button
                            id={uuid.NIL}
                            type='button'
                            value='trash'
                            className={`flex items-center gap-x-2 px-3 py-2 rounded ${fileManagement.currentCategory === 'trash'
                                    ? 'text-white bg-gray-500'
                                    : 'hover:bg-gray-100 dark:hover:bg-white/20'
                                }`}
                            onClick={handleChangeCategory}
                        >
                            <Unicons.UilTrash size='20' />
                            <span>Thùng rác</span>
                        </button>
                    </div>
                ))}
        </section>
    );
}
