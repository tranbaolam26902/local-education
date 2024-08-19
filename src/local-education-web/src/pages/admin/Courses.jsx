/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import * as Unicons from '@iconscout/react-unicons';

/* Redux */
import {
    decreaseCoursePageNumber,
    increaseCoursePageNumber,
    selectCourseManagement,
    setCourseKeyword,
    setCoursePageNumber,
    setCoursePageSize,
    setCourseSortColumn,
    showAllCourses,
    showDeletedCourses,
    showNonPublishedCourses,
    showPublishedCourses,
    toggleCourseSortOrder
} from '@redux/features/admin/courseManagement';
import { useDebounce } from '@hooks/shared';

/* Services */
import { useCourseServices } from '@services/admin';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { AdminCourseItem, Input } from '@components/admin';
import { Container, Pager } from '@components/shared';

export default function Courses() {
    /* States */
    const courseManagement = useSelector(selectCourseManagement);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [courses, setCourses] = useState([]);
    const [metadata, setMetadata] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    /* Hooks */
    const dispatch = useDispatch();
    const debounceSearchKeyword = useDebounce(searchKeyword, 500);
    const [searchParams, setSearchParams] = useSearchParams();

    /* Services */
    const courseServices = useCourseServices();

    /* Refs */
    const searchKeywordRef = useRef(null);

    /* Functions */
    const clearSearchKeyword = () => {
        setSearchKeyword('');
    };
    const getCourses = async () => {
        setIsLoading(true);
        const coursesResult = await courseServices.getCoursesByQueries(searchParams.toString());

        if (coursesResult.isSuccess) {
            setCourses(coursesResult.result.items);
            setMetadata(coursesResult.result.metadata);
        } else {
            setCourses([]);
            setMetadata({});
        }
        setIsLoading(false);
    };
    const setPageTitle = () => {
        document.title = getSubPageTitle('Quản lý khóa học');
    };

    /* Event handlers */
    const handleChangeSortColumn = (e) => {
        dispatch(setCourseSortColumn(e.target.value));
    };
    const handleToggleSortOrder = () => {
        dispatch(toggleCourseSortOrder());
    };

    /* Side effects */
    /* Init component side effects */
    useEffect(() => {
        setPageTitle();
    }, []);
    useEffect(() => {
        dispatch(setCourseKeyword(searchKeyword.trim()));
    }, [debounceSearchKeyword]);
    useEffect(() => {
        setSearchParams(courseManagement.coursesQueries, { replace: true });
    }, [courseManagement.coursesQueries]);
    useEffect(() => {
        getCourses();
    }, [searchParams, courseManagement.isUpdateCourses]);

    return (
        <section className='min-h-[calc(100svh-3.75rem)] dark:bg-black dark:text-white'>
            <Container className='flex flex-col gap-4 py-4'>
                <h1 className='font-semibold text-2xl'>Danh sách Khóa học</h1>
                <section className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-2'>
                    {/* Start: Search section */}
                    <Input
                        ref={searchKeywordRef}
                        value={searchKeyword}
                        placeholder='Tìm kiếm khóa học...'
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
                            {courseManagement.coursesQueries.SortOrder === 'asc' ? (
                                <Unicons.UilSortAmountUp size='24' />
                            ) : (
                                <Unicons.UilSortAmountDown size='24' />
                            )}
                        </button>
                    </div>
                    {/* End: Sort section */}

                    {/* Start: Filter section */}
                    <div className='md:col-span-2 flex flex-wrap items-center gap-2'>
                        <button
                            type='button'
                            className={`md:px-4 p-2 font-semibold rounded ${!courseManagement.coursesQueries.IsPublished &&
                                    !courseManagement.coursesQueries.NonPublished &&
                                    !courseManagement.coursesQueries.IsDeleted
                                    ? 'text-white bg-gray-500 shadow cursor-default'
                                    : 'hover:bg-gray-100 dark:hover:bg-white/20'
                                }`}
                            onClick={() => {
                                dispatch(showAllCourses());
                            }}
                        >
                            <span>Tất cả</span>
                        </button>
                        <button
                            type='button'
                            className={`md:px-4 p-2 font-semibold rounded ${courseManagement.coursesQueries.IsPublished &&
                                    !courseManagement.coursesQueries.NonPublished &&
                                    !courseManagement.coursesQueries.IsDeleted
                                    ? 'text-white bg-gray-500 shadow cursor-default'
                                    : 'hover:bg-gray-100 dark:hover:bg-white/20'
                                }`}
                            onClick={() => {
                                dispatch(showPublishedCourses());
                            }}
                        >
                            <span>Công khai</span>
                        </button>
                        <button
                            type='button'
                            className={`md:px-4 p-2 font-semibold rounded ${!courseManagement.coursesQueries.IsPublished &&
                                    courseManagement.coursesQueries.NonPublished &&
                                    !courseManagement.coursesQueries.IsDeleted
                                    ? 'text-white bg-gray-500 shadow cursor-default'
                                    : 'hover:bg-gray-100 dark:hover:bg-white/20'
                                }`}
                            onClick={() => {
                                dispatch(showNonPublishedCourses());
                            }}
                        >
                            <span>Riêng tư</span>
                        </button>
                        <button
                            type='button'
                            className={`md:px-4 p-2 font-semibold rounded ${!courseManagement.coursesQueries.IsPublished &&
                                    !courseManagement.coursesQueries.NonPublished &&
                                    courseManagement.coursesQueries.IsDeleted
                                    ? 'text-white bg-gray-500 shadow cursor-default'
                                    : 'hover:bg-gray-100 dark:hover:bg-white/20'
                                }`}
                            onClick={() => {
                                dispatch(showDeletedCourses());
                            }}
                        >
                            <span>Thùng rác</span>
                        </button>
                    </div>
                    {/* End: Filter section */}

                    {/* Start: Add button */}
                    <Link
                        to='/admin/courses/create'
                        className='flex items-center gap-x-1 px-4 py-2 w-fit text-white bg-nature-green rounded hover:opacity-80'
                    >
                        <Unicons.UilPlus size='24' />
                        <span>Thêm mới</span>
                    </Link>
                    {/* End: Add button */}
                </section>

                {/* Start: Courses section */}
                {isLoading ? (
                    <Unicons.UilSpinner
                        size='48'
                        className='animate-spin animate-infinite animate-duration-1000 mx-auto dark:text-white'
                    />
                ) : (
                    <section className='overflow-x-auto border border-gray-400 dark:border-gray-800 rounded-lg'>
                        <div className='min-w-[76.875rem]'>
                            <div className='grid grid-cols-12 px-2 py-1 font-semibold text-white text-center bg-gray-400 dark:bg-dark'>
                                <div className='col-span-3'>Tiêu đề</div>
                                <div className='col-span-4'>Mô tả</div>
                                <div className='col-span-2'>Ảnh bìa</div>
                                <div className='col-span-1'>Ngày tạo</div>
                                <div className='col-span-1'>Số chương</div>
                                <div className='col-span-1'>Thao tác</div>
                            </div>
                            {courses.map((course) => (
                                <AdminCourseItem key={course.id} course={course} />
                            ))}
                        </div>
                    </section>
                )}
                {/* End: Courses section */}

                <Pager
                    metadata={metadata}
                    increasePageNumber={() => {
                        dispatch(increaseCoursePageNumber());
                    }}
                    decreasePageNumber={() => {
                        dispatch(decreaseCoursePageNumber());
                    }}
                    setPageNumber={(pageNumber) => {
                        dispatch(setCoursePageNumber(pageNumber));
                    }}
                    setPageSize={(pageSize) => {
                        dispatch(setCoursePageSize(pageSize));
                    }}
                />
            </Container>
        </section>
    );
}
