/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import * as Unicons from '@iconscout/react-unicons';
import * as uuid from 'uuid';

/* Redux */
import { selectLessonManagement } from '@redux/features/admin/lessonManagement';

/* Services */
import { useCourseServices, useLessonServices } from '@services/admin';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { AdminLessonsItem } from '@components/admin';
import { Container, SlideDetailModal } from '@components/shared';

export default function Lessons() {
    /* Hooks */
    const [searchParams, setSearchParams] = useSearchParams();

    /* States */
    const lessonManagement = useSelector(selectLessonManagement);
    const [lessons, setLessons] = useState([]);
    const [courses, setCourses] = useState([]);
    const [courseId, setCourseId] = useState(uuid.NIL);
    const [isLoading, setIsLoading] = useState(false);

    /* Refs */
    const selectCourseRef = useRef(null);

    /* Services */
    const courseServices = useCourseServices();
    const lessonServices = useLessonServices();

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
        setIsLoading(true);
        const lessonsResult = await lessonServices.getLessonsByCourseId(id);

        if (lessonsResult.isSuccess) setLessons(lessonsResult.result);
        else setLessons([]);
        setIsLoading(false);
    };
    const setPageTitle = () => {
        document.title = getSubPageTitle('Quản lý bài học');
    };

    /* Event handlers */
    const handleSelectCourse = (e) => {
        setCourseId(e.target.value);
    };

    /* Side effects */
    /* Init component side effects */
    useEffect(() => {
        getAllCourses();
        setPageTitle();
    }, []);
    /* Sync courseId with searchParams */
    useEffect(() => {
        if (courseId === uuid.NIL) {
            setLessons([]);
            setSearchParams({}, { replace: true });
        } else setSearchParams({ courseId }, { replace: true });
    }, [courseId]);
    /* Get selected course lessons */
    useEffect(() => {
        const id = searchParams.get('courseId');
        if (!id) {
            setLessons([]);
            return;
        }

        getLessons(id);
        setCourseId(id);
    }, [searchParams, lessonManagement.isUpdateLessons]);

    return (
        <section className='min-h-[calc(100svh-3.75rem)] dark:bg-black dark:text-white'>
            <Container className='flex flex-col gap-4 py-4'>
                <h1 className='font-semibold text-2xl'>Danh sách chương</h1>
                <section className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-2'>
                    {/* Start: Sort section */}
                    <div className='flex items-center gap-x-2'>
                        <select
                            ref={selectCourseRef}
                            className='px-4 py-2 w-full h-full bg-white border border-gray-400 rounded shadow-inner appearance-none dark:bg-dark'
                            value={courseId}
                            onChange={handleSelectCourse}
                        >
                            <option value={uuid.NIL}>-- Chọn khóa học --</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* End: Sort section */}

                    {/* Start: Add button */}
                    <Link
                        to='/admin/lessons/create'
                        className='flex items-center gap-x-1 px-4 py-2 w-fit text-white bg-nature-green rounded hover:opacity-80'
                        state={{ courseId }}
                    >
                        <Unicons.UilPlus size='24' />
                        <span>Thêm mới</span>
                    </Link>
                    {/* End: Add button */}
                </section>

                {/* Start: Lessons section */}
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
                                <div className='col-span-3'>Mô tả</div>
                                <div className='col-span-2'>Ảnh bìa</div>
                                <div className='col-span-2'>Tour</div>
                                <div className='col-span-1'>Thao tác</div>
                            </div>
                            {lessons.map((lesson) => (
                                <AdminLessonsItem key={lesson.id} lesson={lesson} />
                            ))}
                        </div>
                    </section>
                )}
                {/* End: Lessons section */}
            </Container>
            <SlideDetailModal />
        </section>
    );
}
