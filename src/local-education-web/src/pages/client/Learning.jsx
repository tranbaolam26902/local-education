/* Libraries */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoaderData, useParams, useSearchParams } from 'react-router-dom';
import * as uuid from 'uuid';

/* Redux */
import { selectLearning, setCurrentSlideId, setProgress } from '@redux/features/client/learning';
import { selectAuth } from '@redux/features/shared/auth';

/* Services */
import { useProgressServices } from '@services/client';
import { getCourseBySlug, getSlideById } from '@services/shared';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import {
    ClientLessonsContent,
    ClientLessonsFooter,
    ClientLessonsHeader,
    ClientLessonsSidebar
} from '@components/client';
import { PageTransition } from '@components/shared';

export default function Learning() {
    /* Hooks */
    const params = useParams();
    const dispatch = useDispatch();
    const { course, lessons } = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();

    /* Services */
    const progressServices = useProgressServices();

    /* States */
    const learningSlice = useSelector(selectLearning);
    const auth = useSelector(selectAuth);

    /* Functions */
    const setFirstSlide = () => {
        dispatch(setCurrentSlideId(lessons[0].slides[0].id));
    };
    const setLatestCompletedSlide = (slides) => {
        const slideIds = lessons.map((lesson) => lesson.slides.map((slide) => slide.id)).flat(1);
        const lastCompletedSlideId = slides[slides.length - 1].id;
        const indexOfLastCompletedSlideId = slideIds.indexOf(lastCompletedSlideId);

        if (indexOfLastCompletedSlideId === slideIds.length - 1)
            dispatch(setCurrentSlideId(lastCompletedSlideId)); // Set slide after latest completed slide
        else dispatch(setCurrentSlideId(slideIds[indexOfLastCompletedSlideId + 1])); // Set latest completed slide || Course finished
    };
    const getProgress = async () => {
        const courseResult = await getCourseBySlug(params.slug);
        if (!courseResult.isSuccess) return;

        const progressResult = await progressServices.getCompletePercentage(courseResult.result.id);
        if (!progressResult.isSuccess) {
            dispatch(setProgress(null));
            return;
        }

        dispatch(setProgress(progressResult.result));

        return progressResult.result;
    };
    const getLastCompletedSlide = async () => {
        const progress = await getProgress();
        const slides = progress.slides;

        if (slides && slides.length !== 0) setLatestCompletedSlide(slides);
        else if (lessons.length !== 0 && lessons[0].slides && lessons[0].slides.length !== 0) setFirstSlide();
    };
    const mapSlideIntoSearchParams = () => {
        if (learningSlice.currentSlideId === uuid.NIL) return;

        searchParams.set('id', learningSlice.currentSlideId);
        setSearchParams(searchParams, { replace: true });
    };
    const reloadProgressOnSlideChange = () => {
        if (!auth.accessToken) {
            dispatch(setProgress(null));
            return;
        }

        getProgress();
    };
    const setPageTitleBySlideTitle = async () => {
        if (learningSlice.currentSlideId === uuid.NIL) return;

        const slideResult = await getSlideById(learningSlice.currentSlideId);

        if (slideResult.isSuccess) document.title = getSubPageTitle(slideResult.result.title);
    };

    /* Side effects */
    /* - Get slide id from search params if existed.
     * - If user is not logged in, get first slide
     * - If user is logged in, get the slide after last complete slide */
    useEffect(() => {
        const urlId = searchParams.get('id');
        if (urlId) dispatch(setCurrentSlideId(urlId));
        else if (!auth.accessToken) {
            setFirstSlide();
            dispatch(setProgress(null));
        } else getLastCompletedSlide();
    }, []);
    /* Slide change side effects */
    useEffect(() => {
        mapSlideIntoSearchParams();
        reloadProgressOnSlideChange();
        setPageTitleBySlideTitle();
    }, [learningSlice.currentSlideId]);

    return (
        <PageTransition className='fixed inset-0 w-screen h-[100dvh] dark:text-white dark:bg-black'>
            <ClientLessonsHeader course={course} />
            <section className='absolute top-[3.75rem] left-0 right-0 bottom-[3.125rem]'>
                <ClientLessonsContent />
                <ClientLessonsSidebar lessons={lessons} />
            </section>
            <ClientLessonsFooter lessons={lessons} />
        </PageTransition>
    );
}
