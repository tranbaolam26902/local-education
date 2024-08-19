/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as Unicons from '@iconscout/react-unicons';

/* Hooks */
import { useDebounce } from '@hooks/shared';

/* Redux */
import {
    selectUserManagement,
    setUserKeyword,
    setUserSortColumn,
    setUserSortOrder,
    toggleUserSortOrder
} from '@redux/features/admin/userManagement';

/* Components */
import { Input } from '@components/admin';

export default function ControlSection() {
    /* States */
    const userManagement = useSelector(selectUserManagement);
    const [searchKeyword, setSearchKeyword] = useState('');

    /* Hooks */
    const dispatch = useDispatch();
    const [searchParams, _] = useSearchParams();
    const debounceSearchKeyword = useDebounce(searchKeyword, 500);

    /* Refs */
    const searchKeywordRef = useRef(null);

    /* Functions */
    const clearSearchKeyword = () => {
        setSearchKeyword('');
    };

    /* Event handlers */
    const handleChangeSortColumn = (e) => {
        dispatch(setUserSortColumn(e.target.value));
    };
    const handleToggleSortOrder = () => {
        dispatch(toggleUserSortOrder());
    };

    /* Side effects */
    /* Set users queries from search params */
    useEffect(() => {
        const urlSortColumn = searchParams.get('SortColumn');
        const urlSortOrder = searchParams.get('SortOrder');

        if (urlSortColumn) dispatch(setUserSortColumn(urlSortColumn));
        if (urlSortOrder) dispatch(setUserSortOrder(urlSortOrder));
    }, []);
    /* Debounce search keyword */
    useEffect(() => {
        dispatch(setUserKeyword(searchKeyword.trim()));
    }, [debounceSearchKeyword]);

    return (
        <section className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-2'>
            {/* Start: Search section */}
            <Input
                ref={searchKeywordRef}
                value={searchKeyword}
                placeholder='Tìm kiếm tài khoản...'
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
                    value={userManagement.usersQueries.SortColumn}
                    onChange={handleChangeSortColumn}
                >
                    <option value='name'>Sắp xếp theo Tên</option>
                    <option value='username'>Sắp xếp theo Tên tài khoản</option>
                    <option value='email'>Sắp xếp theo Email</option>
                    <option value='createdDate'>Sắp xếp theo Ngày tạo</option>
                </select>
                <button
                    type='button'
                    title='Đảo ngược hướng sắp xếp'
                    className='flex items-center justify-center p-2 h-full aspect-square bg-white border border-gray-400 rounded shadow-inner hover:bg-gray-100 dark:bg-dark dark:hover:bg-white/30'
                    onClick={handleToggleSortOrder}
                >
                    {userManagement.usersQueries.SortOrder === 'asc' ? (
                        <Unicons.UilSortAmountUp size='24' />
                    ) : (
                        <Unicons.UilSortAmountDown size='24' />
                    )}
                </button>
            </div>
            {/* End: Sort section */}

            {/* Start: Add button */}
            <Link
                to='/admin/users/create'
                className='flex items-center gap-x-1 px-4 py-2 w-fit text-white bg-nature-green rounded hover:opacity-80'
            >
                <Unicons.UilPlus size='24' />
                <span>Thêm mới</span>
            </Link>
            {/* End: Add button */}
        </section>
    );
}
