/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as Unicons from '@iconscout/react-unicons';

/* Hooks */
import { useDebounce } from '@hooks/shared';

/* Redux */
import {
    decreaseClientCoursePageNumber,
    increaseClientCoursePageNumber,
    selectCourse,
    setClientCourseKeyword,
    setClientCoursePageNumber,
    setClientCoursePageSize
} from '@redux/features/client/course';

/* Services */
import { getCoursesByQueries } from '@services/shared';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { Input } from '@components/admin';
import { ClientCourseItem } from '@components/client';
import { Container, PageTransition, Pager } from '@components/shared';

export default function Courses() {
    /* States */
    const courseSlice = useSelector(selectCourse);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [courses, setCourses] = useState([]);
    const [metadata, setMetadata] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    /* Hooks */
    const dispatch = useDispatch();
    const debounceSearchKeyword = useDebounce(searchKeyword, 500);
    const [searchParams, setSearchParams] = useSearchParams();

    /* Refs */
    const searchKeywordRef = useRef(null);

    /* Functions */
    const clearSearchKeyword = () => {
        setSearchKeyword('');
    };
    const getCourses = async () => {
        setIsLoading(true);
        const coursesResult = await getCoursesByQueries(searchParams.toString());

        if (coursesResult.isSuccess) {
            setCourses(coursesResult.result.items);
            setMetadata(coursesResult.result.metadata);
        } else {
            setCourses([]);
            setMetadata({});
        }
        setIsLoading(false);
    };

    /* Side effects */
    /* Debounce search keyword */
    useEffect(() => {
        dispatch(setClientCourseKeyword(searchKeyword.trim()));
    }, [debounceSearchKeyword]);
    /* Get courses queries from search params if existed */
    useEffect(() => {
        const urlPageNumber = searchParams.get('PageNumber');
        const urlPageSize = searchParams.get('PageSize');

        if (urlPageNumber) dispatch(setClientCoursePageNumber(urlPageNumber));
        if (urlPageSize) dispatch(setClientCoursePageSize(urlPageSize));
    }, []);
    /* Map courses queries to search params */
    useEffect(() => {
        setSearchParams(courseSlice.coursesQueries, { replace: true });
    }, [courseSlice.coursesQueries]);
    /* Get courses when search params changes */
    useEffect(() => {
        getCourses();
    }, [searchParams]);
    /* Set page title */
    useEffect(() => {
        document.title = getSubPageTitle('Khóa học');
    }, []);

    return (
        <PageTransition className='min-h-[calc(100svh-3.75rem)] dark:text-white dark:bg-black'>
            <Container className='flex flex-col gap-y-8 md:gap-y-12 py-8 md:py-16'>
                <h1 className='font-bold text-2xl md:text-3xl lg:text-4xl text-center uppercase'>Danh sách khóa học</h1>

                {/* Start: Search section */}
                <section className='mx-auto w-full md:w-4/5 lg:w-3/5 xl:w-1/2'>
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
                </section>
                {/* End: Search section */}

                {/* Start: Courses section */}
                {isLoading ? (
                    <Unicons.UilSpinner
                        size='48'
                        className='animate-spin animate-infinite animate-duration-1000 mx-auto dark:text-white'
                    />
                ) : (
                    <section className='flex flex-col gap-y-6'>
                        {courses.map((course) => (
                            <ClientCourseItem key={course.id} course={course} />
                        ))}
                        {/* Start: Pagination section */}
                        <Pager
                            hidePageSize
                            metadata={metadata}
                            increasePageNumber={() => {
                                dispatch(increaseClientCoursePageNumber());
                            }}
                            decreasePageNumber={() => {
                                dispatch(decreaseClientCoursePageNumber());
                            }}
                            setPageNumber={(pageNumber) => {
                                dispatch(setClientCoursePageNumber(pageNumber));
                            }}
                            setPageSize={(pageSize) => {
                                dispatch(setClientCoursePageSize(pageSize));
                            }}
                        />
                        {/* End: Pagination section */}
                    </section>
                )}
                {/* End: Courses section */}
            </Container>
        </PageTransition>
    );
}
