/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Unicons from '@iconscout/react-unicons';

/* Components */
import { Input } from '@components/admin';

/* Hooks */
import { useDebounce } from '@hooks/shared';

/* Redux */
import { saveSettings, selectSettings, toggleTourViewMode } from '@redux/features/shared/settings';
import {
    selectTourManagement,
    showAllTours,
    showPublishedTours,
    showNonPublishedTours,
    showDeletedTours,
    setTourSortColumn,
    toggleTourSortOrder,
    setTourKeyword,
    triggerUpdateTours,
    setTourSortOrder
} from '@redux/features/admin/tourManagement';

/* Services */
import { useTourServices } from '@services/admin';
import { useSearchParams } from 'react-router-dom';

export default function ControlSection() {
    /* States */
    const settings = useSelector(selectSettings);
    const tourManagement = useSelector(selectTourManagement);
    const [searchKeyword, setSearchKeyword] = useState('');

    /* Hooks */
    const dispatch = useDispatch();
    const debounceSearchKeyword = useDebounce(searchKeyword, 500);
    const [searchParams, _] = useSearchParams();

    /* Services */
    const tourServices = useTourServices();

    /* Refs */
    const searchKeywordRef = useRef(null);

    /* Functions */
    const clearSearchKeyword = () => {
        setSearchKeyword('');
    };

    /* Event handlers */
    const handleChangeSortColumn = (e) => {
        dispatch(setTourSortColumn(e.target.value));
    };
    const handleToggleSortOrder = () => {
        dispatch(toggleTourSortOrder());
    };
    const handleToggleTourViewMode = () => {
        dispatch(toggleTourViewMode());
        dispatch(saveSettings());
    };
    const handleEmptyTrash = async () => {
        if (!confirm('Sau khi xoá không thể khôi phục. Xác nhận xoá?')) return;

        const emptyTrashResult = await tourServices.emptyTrash();

        if (emptyTrashResult.isSuccess) dispatch(triggerUpdateTours());
        else alert(emptyTrashResult.errors[0]);
    };

    /* Side effects */
    /* Set tours queries from search params */
    useEffect(() => {
        const urlIsPublished = searchParams.get('IsPublished');
        const urlNonPublished = searchParams.get('NonPublished');
        const urlIsDeleted = searchParams.get('IsDeleted');
        const urlSortColumn = searchParams.get('SortColumn');
        const urlSortOrder = searchParams.get('SortOrder');

        if (urlIsPublished === 'true' && urlNonPublished === 'true' && urlIsDeleted === 'false')
            dispatch(showAllTours());
        if (urlIsPublished === 'true' && urlNonPublished === 'false' && urlIsDeleted === 'false')
            dispatch(showPublishedTours());
        if (urlIsPublished === 'false' && urlNonPublished === 'true' && urlIsDeleted === 'false')
            dispatch(showNonPublishedTours());
        if (urlIsPublished === 'false' && urlNonPublished === 'true' && urlIsDeleted === 'true')
            dispatch(showDeletedTours());
        if (urlSortColumn) dispatch(setTourSortColumn(urlSortColumn));
        if (urlSortOrder) dispatch(setTourSortOrder(urlSortOrder));
    }, []);
    /* Debounce search keyword */
    useEffect(() => {
        dispatch(setTourKeyword(searchKeyword.trim()));
    }, [debounceSearchKeyword]);

    return (
        <section className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-2'>
            {/* Start: Search section */}
            <Input
                ref={searchKeywordRef}
                value={searchKeyword}
                placeholder='Tìm kiếm tour...'
                rightIcon={<Unicons.UilSearch size='20' className='dark:text-white' />}
                clearInput={clearSearchKeyword}
                onChange={(e) => {
                    setSearchKeyword(e.target.value);
                }}
            />
            {/* End: Search section */}

            {/* Start: Sort section */}
            <div className='flex items-center gap-x-2'>
                <select
                    className='px-4 py-2 w-full h-full bg-white border border-gray-400 rounded shadow-inner appearance-none dark:bg-dark'
                    onChange={handleChangeSortColumn}
                    value={tourManagement.toursQueries.SortColumn}
                >
                    <option value='createdDate'>Sắp xếp theo Ngày</option>
                    <option value='title'>Sắp xếp theo Tiêu đề</option>
                    <option value='viewCount'>Sắp xếp theo Lượt xem</option>
                </select>
                <button
                    type='button'
                    title='Đảo ngược hướng sắp xếp'
                    className='flex items-center justify-center p-2 h-full aspect-square bg-white border border-gray-400 rounded shadow-inner hover:bg-gray-100 dark:bg-dark dark:hover:bg-white/30'
                    onClick={handleToggleSortOrder}
                >
                    {tourManagement.toursQueries.SortOrder === 'asc' ? (
                        <Unicons.UilSortAmountUp size='24' />
                    ) : (
                        <Unicons.UilSortAmountDown size='24' />
                    )}
                </button>
                <button
                    type='button'
                    title={settings.tourViewMode === 'grid' ? 'Bố cục kiểu danh sách' : 'Bố cục kiểu lưới'}
                    className='flex items-center justify-center p-2 h-full aspect-square bg-white border border-gray-400 rounded shadow-inner hover:bg-gray-100 dark:bg-dark dark:hover:bg-white/30'
                    onClick={handleToggleTourViewMode}
                >
                    {settings.tourViewMode === 'grid' ? (
                        <Unicons.UilColumns size='24' className='rotate-90' />
                    ) : (
                        <Unicons.UilApps size='24' />
                    )}
                </button>
            </div>
            {/* End: Sort section */}

            {/* Start: Filter section */}
            <div className='md:col-span-2 flex flex-wrap items-center gap-2'>
                <button
                    type='button'
                    className={`md:px-4 p-2 font-semibold rounded ${tourManagement.toursQueries.IsPublished &&
                            tourManagement.toursQueries.NonPublished &&
                            !tourManagement.toursQueries.IsDeleted
                            ? 'text-white bg-gray-500 shadow cursor-default'
                            : 'hover:bg-gray-100 dark:hover:bg-white/20'
                        }`}
                    onClick={() => {
                        dispatch(showAllTours());
                    }}
                >
                    <span>Tất cả</span>
                </button>
                <button
                    type='button'
                    className={`md:px-4 p-2 font-semibold rounded ${tourManagement.toursQueries.IsPublished &&
                            !tourManagement.toursQueries.NonPublished &&
                            !tourManagement.toursQueries.IsDeleted
                            ? 'text-white bg-gray-500 shadow cursor-default'
                            : 'hover:bg-gray-100 dark:hover:bg-white/20'
                        }`}
                    onClick={() => {
                        dispatch(showPublishedTours());
                    }}
                >
                    <span>Công khai</span>
                </button>
                <button
                    type='button'
                    className={`md:px-4 p-2 font-semibold rounded ${!tourManagement.toursQueries.IsPublished &&
                            tourManagement.toursQueries.NonPublished &&
                            !tourManagement.toursQueries.IsDeleted
                            ? 'text-white bg-gray-500 shadow cursor-default'
                            : 'hover:bg-gray-100 dark:hover:bg-white/20'
                        }`}
                    onClick={() => {
                        dispatch(showNonPublishedTours());
                    }}
                >
                    <span>Riêng tư</span>
                </button>
                <button
                    type='button'
                    className={`md:px-4 p-2 font-semibold rounded ${!tourManagement.toursQueries.IsPublished &&
                            tourManagement.toursQueries.NonPublished &&
                            tourManagement.toursQueries.IsDeleted
                            ? 'text-white bg-gray-500 shadow cursor-default'
                            : 'hover:bg-gray-100 dark:hover:bg-white/20'
                        }`}
                    onClick={() => {
                        dispatch(showDeletedTours());
                    }}
                >
                    <span>Thùng rác</span>
                </button>
                {tourManagement.toursQueries.IsDeleted && (
                    <button
                        type='button'
                        className='flex items-center gap-1 w-fit font-semibold text-red-400 rounded hover:opacity-80'
                        onClick={handleEmptyTrash}
                    >
                        <Unicons.UilTrash size='20' />
                        <span>Dọn thùng rác</span>
                    </button>
                )}
            </div>
            {/* End: Filter section */}
        </section>
    );
}
