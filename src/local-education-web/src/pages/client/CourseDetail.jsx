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
        <PageTransition className='min-h-[calc(100svh-3.75rem)] dark:text-white dark:bg-black'>
            <Container className='flex flex-col gap-y-8 md:gap-y-12 py-8 md:py-12'>
                <div className='relative grid grid-cols-1 xl:grid-cols-3 gap-8'>
                    {/* Start: Course detail section */}
                    <section className='xl:col-span-2 flex flex-col gap-y-8'>
                        <h1 className='font-bold text-2xl md:text-3xl lg:text-4xl'>{course.title}</h1>

                        <p>{course.description}</p>

                        {/* Start: Course content section */}
                        <div className='-mt-4 lg:-mt-8'>
                            <div className='sticky z-10 top-[3.75rem] flex flex-col gap-y-2 py-4 lg:py-8 bg-white dark:bg-black'>
                                <h2 className='font-bold text-xl'>Nội dung khóa học</h2>

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
                        <div className='sticky top-[6.75rem] flex flex-col gap-y-8 items-center'>
                            <img
                                src={`${import.meta.env.VITE_API_ENDPOINT}/${course.urlPath}`}
                                alt={course.title}
                                className='w-full object-center object-cover rounded-xl drop-shadow shadow-inner'
                            />
                            {lessons.length !== 0 ? (
                                <button
                                    type='button'
                                    className='px-6 py-3 font-bold text-white uppercase bg-gradient-to-tl from-nature-green via-nature-green to-light-green rounded-full drop-shadow shadow-inner hover:opacity-80 transition duration-300'
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
                                    className='px-6 py-3 font-bold text-white uppercase bg-nature-green rounded-full drop-shadow shadow-inner opacity-50'
                                >
                                    Bắt đầu học
                                </button>
                            )}
                            {auth.accessToken && (
                                <div className='flex flex-col gap-y-2 items-center w-full'>
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
                                    <div className='overflow-hidden relative w-full h-2 bg-gray-200 rounded-full'>
                                        <span
                                            className='absolute top-0 left-0 bottom-0 bg-nature-green'
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
