/* Libraries */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import * as Unicons from '@iconscout/react-unicons';
import * as uuid from 'uuid';

/* Redux */
import { selectSlideManagement } from '@redux/features/admin/slideManagement';

/* Services */
import { useCourseServices, useLessonServices, useSlideServices } from '@services/admin';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { AdminSlideItem } from '@components/admin';
import { Container, SlideDetailModal } from '@components/shared';

export default function Slides() {
    /* Hooks */
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    /* States */
    const slideManagement = useSelector(selectSlideManagement);
    const [courses, setCourses] = useState([]);
    const [courseId, setCourseId] = useState(uuid.NIL);
    const [lessons, setLessons] = useState([]);
    const [lessonId, setLessonId] = useState(uuid.NIL);
    const [slides, setSlides] = useState([]);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    /* Services */
    const courseServices = useCourseServices();
    const lessonServices = useLessonServices();
    const slideServices = useSlideServices();

    /* Functions */
    const getAllCourses = async () => {
        const coursesResult = await courseServices.getAllCourses();

        if (coursesResult.isSuccess) {
            setCourses(coursesResult.result);

            const urlCourseId = searchParams.get('courseId');

            if (coursesResult.result.length > 0 && !urlCourseId) setCourseId(coursesResult.result[0].id);
        } else setCourses([]);
    };
    const getLessons = async (id) => {
        const lessonsResult = await lessonServices.getLessonsByCourseId(id);

        if (lessonsResult.isSuccess) {
            setLessons(lessonsResult.result);

            const urlLessonId = searchParams.get('lessonId');

            if (lessonsResult.result.length > 0 && !urlLessonId) setLessonId(lessonsResult.result[0].id);
        } else setLessons([]);
    };
    const getSlides = async (id) => {
        setIsLoading(true);
        const slidesResult = await slideServices.getSlidesByLessonId(id);

        if (slidesResult.isSuccess) setSlides(slidesResult.result);
        else setSlides([]);
        setIsLoading(false);
    };
    const setPageTitle = () => {
        document.title = getSubPageTitle('Quản lý slides');
    };

    /* Event handlers */
    const handleSelectCourse = (e) => {
        setCourseId(e.target.value);
    };
    const handleSelectLesson = (e) => {
        setLessonId(e.target.value);
    };

    /* Side effects */
    /* Init component side effects */
    useEffect(() => {
        getAllCourses();
        setPageTitle();
    }, []);
    /* Get courseId and lessonId from searchParams on first load */
    useEffect(() => {
        if (!isFirstLoad) return;
        setIsFirstLoad(false);

        const urlCourseId = searchParams.get('courseId');
        if (urlCourseId) setCourseId(urlCourseId);

        const urlLessonId = searchParams.get('lessonId');
        if (urlLessonId) setLessonId(urlLessonId);
    }, [searchParams]);
    /* Get courseId after adding new slide */
    useEffect(() => {
        if (!location.state) return;
        setCourseId(location.state.courseId);
    }, [location.state]);
    /* Get selected course lessons
     * and map it to searchParams */
    useEffect(() => {
        if (isFirstLoad) return;

        if (!searchParams.get('lessonId')) setLessonId(uuid.NIL); // Reset lessonId if searchParams not included lessonId
        if (courseId === uuid.NIL) {
            // Reset lessonId and clear lessons if courseId is NIL
            searchParams.delete('courseId');
            setLessonId(uuid.NIL);
            setLessons([]);
        } else {
            getLessons(courseId);
            searchParams.set('courseId', courseId);
            if (location.state) setLessonId(location.state.lessonId); // Get lessonId after adding new slide
        }
        setSearchParams(searchParams, { replace: true });
    }, [courseId]);
    /* Get selected lesson slides
     * and map it to searchParams */
    useEffect(() => {
        if (isFirstLoad) return;

        if (lessonId === uuid.NIL) {
            // Delete lessonId in searchParams if lessonId is NIL
            searchParams.delete('lessonId');
            setSlides([]);
        } else {
            searchParams.set('lessonId', lessonId);
            getSlides(lessonId);
        }
        setSearchParams(searchParams, { replace: true });
    }, [lessonId, slideManagement.isUpdateSlides]);

    return (
        <section className='min-h-[calc(100svh-3.75rem)] dark:bg-black dark:text-white'>
            <Container className='flex flex-col gap-4 py-4'>
                <h1 className='font-semibold text-2xl'>Danh sách bài học</h1>
                <section className='grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2'>
                    {/* Start: Sort section */}
                    <div className='flex items-center gap-x-2'>
                        <select
                            className='px-4 py-2 w-full h-full bg-white border border-gray-400 rounded shadow-inner appearance-none dark:bg-dark'
                            onChange={handleSelectCourse}
                            value={courseId}
                        >
                            <option value={uuid.NIL}>-- Chọn khóa học --</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                        <select
                            disabled={courseId === uuid.NIL}
                            className='px-4 py-2 w-full h-full bg-white border border-gray-400 rounded shadow-inner appearance-none dark:bg-dark'
                            onChange={handleSelectLesson}
                            value={lessonId}
                        >
                            <option value={uuid.NIL}>-- Chọn chương --</option>
                            {lessons.map((lesson) => (
                                <option key={lesson.id} value={lesson.id}>
                                    {lesson.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* End: Sort section */}

                    {/* Start: Add button */}
                    <Link
                        to='/admin/slides/create'
                        className='flex items-center gap-x-1 px-4 py-2 w-fit text-white bg-nature-green rounded hover:opacity-80'
                        state={{ courseId, lessonId }}
                    >
                        <Unicons.UilPlus size='24' />
                        <span>Thêm mới</span>
                    </Link>
                    {/* End: Add button */}
                </section>

                {/* Start: Slides section */}
                {isLoading ? (
                    <Unicons.UilSpinner
                        size='48'
                        className='animate-spin animate-infinite animate-duration-1000 mx-auto dark:text-white'
                    />
                ) : (
                    <section className='overflow-x-auto border border-gray-400 dark:border-gray-800 rounded-lg'>
                        <div className='min-w-[76.875rem]'>
                            <div className='grid grid-cols-12 px-2 py-1 font-semibold text-white text-center bg-gray-400 dark:bg-dark'>
                                <div className='col-span-1'>STT</div>
                                <div className='col-span-3'>Tiêu đề</div>
                                <div className='col-span-4'>Nội dung</div>
                                <div className='col-span-2'>Media</div>
                                <div className='col-span-1'>Bố cục</div>
                                <div className='col-span-1'>Thao tác</div>
                            </div>
                            {slides.map((slide) => (
                                <AdminSlideItem key={slide.id} slide={slide} />
                            ))}
                        </div>
                    </section>
                )}
                {/* End: Slides section */}
            </Container>
            <SlideDetailModal />
        </section>
    );
}
