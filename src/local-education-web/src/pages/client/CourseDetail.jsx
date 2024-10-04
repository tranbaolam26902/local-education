/* Libraries */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/* Redux */
import { resetLearningSlice, selectLearning, setProgress } from '@redux/features/client/learning';
import { selectAuth } from '@redux/features/shared/auth';

/* Services */
import { useCourseServices } from '@services/admin';
import { useProgressServices } from '@services/client';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { LessonPreviewItem } from '@components/client';
import { Container, PageTransition } from '@components/shared';

export default function CourseDetail() {
    /* Hooks */
    const { course, lessons } = useLoaderData();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /* Services */
    const courseServices = useCourseServices();
    const progressServices = useProgressServices();

    /* States */
    const auth = useSelector(selectAuth);
    const learningSlice = useSelector(selectLearning);

    /* Functions */
    const enrollCourse = async () => {
        const enrollResult = await courseServices.enrollCourse(course.id);

        if (enrollResult.isSuccess) return true;

        toast.error(enrollResult.errors[0]);
        return false;
    };
    const getProgress = async () => {
        const progressResult = await progressServices.getCompletePercentage(course.id);

        if (progressResult.isSuccess) dispatch(setProgress(progressResult.result));
        else setProgress(null);
    };

    /* Event handlers */
    const handleEnroll = async () => {
        if (auth.accessToken && !(await enrollCourse())) return;

        dispatch(resetLearningSlice());
        navigate(`/learning/${course.urlSlug}`);
    };

    /* Side effects */
    /* Scroll to top after navigate on mobile devices */
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    /* Get progress if user is logged in */
    useEffect(() => {
        dispatch(setProgress(null));
        if (!auth.accessToken) return;

        getProgress();
    }, []);
    /* Set page title */
    useEffect(() => {
        document.title = getSubPageTitle(course.title);
    }, []);

    return (
        <PageTransition className='min-h-[calc(100svh-3.75rem)] dark:bg-black dark:text-white'>
            <Container className='flex flex-col gap-y-8 py-8 md:gap-y-12 md:py-12'>
                <div className='relative grid grid-cols-1 gap-8 xl:grid-cols-3'>
                    {/* Start: Course detail section */}
                    <section className='flex flex-col gap-y-8 xl:col-span-2'>
                        <h1 className='text-2xl font-bold md:text-3xl lg:text-4xl'>{course.title}</h1>

                        <p>{course.description}</p>

                        {/* Start: Course content section */}
                        <div className='-mt-4 lg:-mt-8'>
                            <div className='sticky top-[3.75rem] z-10 flex flex-col gap-y-2 bg-white py-4 dark:bg-black lg:py-8'>
                                <h2 className='text-xl font-bold'>Nội dung khóa học</h2>

                                <div className='flex items-center gap-x-3'>
                                    <span>
                                        <b>{course.totalLesson}</b> chương
                                    </span>
                                    <span>&#x2022;</span>
                                    <span>
                                        <b>{lessons.reduce((acc, current) => acc + current.totalSlide, 0)}</b> bài học
                                    </span>
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                {lessons.map((lesson) => (
                                    <LessonPreviewItem key={lesson.id} lesson={lesson} />
                                ))}
                            </div>
                        </div>
                        {/* End: Course content section */}
                    </section>
                    {/* End: Course detail section */}

                    {/* Start: Course enrollment section */}
                    <section className=''>
                        <div className='sticky top-[6.75rem] flex flex-col items-center gap-y-8'>
                            <img
                                src={`${import.meta.env.VITE_API_ENDPOINT}/${course.urlPath}`}
                                alt={course.title}
                                className='w-full rounded-xl object-cover object-center shadow-inner drop-shadow'
                            />
                            {lessons.length > 0 && lessons.reduce((acc, current) => acc + current.totalSlide, 0) > 0 ? (
                                <button
                                    type='button'
                                    className='rounded-full bg-gradient-to-tl from-nature-green via-nature-green to-light-green px-6 py-3 font-bold uppercase text-white shadow-inner drop-shadow transition duration-300 hover:opacity-80'
                                    onClick={handleEnroll}
                                >
                                    {!learningSlice.progress || learningSlice.progress.completed === 0
                                        ? 'Bắt đầu học'
                                        : 'Tiếp tục học'}
                                </button>
                            ) : (
                                <button
                                    disabled
                                    type='button'
                                    className='rounded-full bg-nature-green px-6 py-3 font-bold uppercase text-white opacity-50 shadow-inner drop-shadow'
                                >
                                    Bắt đầu học
                                </button>
                            )}
                            {auth.accessToken && (
                                <div className='flex w-full flex-col items-center gap-y-2'>
                                    <h6 className='flex gap-x-1 font-semibold'>
                                        <span>Hoàn thành</span>
                                        <span>
                                            {learningSlice.progress && learningSlice.progress.slides
                                                ? learningSlice.progress.slides.length
                                                : 0}
                                        </span>
                                        <span>/</span>
                                        <span>{lessons.reduce((acc, current) => acc + current.totalSlide, 0)}</span>
                                    </h6>
                                    <div className='relative h-2 w-full overflow-hidden rounded-full bg-gray-200'>
                                        <span
                                            className='absolute bottom-0 left-0 top-0 bg-nature-green'
                                            style={{
                                                width: learningSlice.progress
                                                    ? `${Math.round(learningSlice.progress.completed)}%`
                                                    : 0
                                            }}
                                        ></span>
                                    </div>
                                    <span>
                                        {learningSlice.progress ? Math.round(learningSlice.progress.completed) : 0}%
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>
                    {/* End: Course enrollment section */}
                </div>
            </Container>
        </PageTransition>
    );
}
