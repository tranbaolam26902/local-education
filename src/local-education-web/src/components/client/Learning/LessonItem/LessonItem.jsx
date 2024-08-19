/* Libraries */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Unicons from '@iconscout/react-unicons';
import * as uuid from 'uuid';

/* Redux */
import { selectLearning, setCurrentSlideId } from '@redux/features/client/learning';
import { selectAuth } from '@redux/features/shared/auth';

export default function LessonItem({ lesson }) {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const auth = useSelector(selectAuth);
    const learningSlice = useSelector(selectLearning);
    const [showSlides, setShowSlides] = useState(false);
    const [totalFinished, setTotalFinished] = useState(0);

    /* Functions */
    const isCompletedSlide = (id) => {
        if (!learningSlice.progress || !learningSlice.progress.slides) return false;

        return learningSlice.progress.slides.find((slide) => slide.id === id);
    };
    const canActiveSlide = (slide, lesson, index) => {
        var result = false;

        if (isCompletedSlide(slide.id) || slide.id === learningSlice.currentSlideId) {
            result = true;
        }
        if (index > 0 && isCompletedSlide(lesson.slides[index - 1].id)) {
            result = true;
        }
        if (!auth.accessToken) {
            result = true;
        }

        return result;
    };

    /* Event handlers */
    const handleToggleShowSlides = () => {
        setShowSlides((state) => !state);
    };

    /* Side effects */
    /* Auto expand lesson's slide */
    useEffect(() => {
        if (learningSlice.currentSlideId === uuid.NIL) return;

        if (lesson.slides.find((slide) => slide.id === learningSlice.currentSlideId)) setShowSlides(true);
    }, [learningSlice.currentSlideId]);
    /* Count total finished slide */
    useEffect(() => {
        if (!learningSlice.progress || !learningSlice.progress.slides) return;

        let count = 0;
        lesson.slides.forEach((slide) => {
            if (learningSlice.progress.slides.find((s) => s.id === slide.id)) count += 1;
        });
        setTotalFinished(count);
    }, [learningSlice.progress]);

    return (
        <>
            <div
                role='button'
                className='sticky top-0 z-10 flex gap-x-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-dark dark:hover:bg-gray-800'
                onClick={handleToggleShowSlides}
            >
                <div className='flex-1 flex flex-col gap-y-4'>
                    <h4 className='font-semibold'>
                        Chương {lesson.index}: {lesson.title}
                    </h4>
                    <h6 className={`text-sm${auth.accessToken ? '' : lesson.isVr ? ' opacity-0' : ' hidden'}`}>
                        <span>Hoàn thành {totalFinished}</span>
                        <span>/</span>
                        <span>{lesson.slides.length}</span>
                    </h6>
                    {lesson.isVr && (
                        <Link
                            to={`/tours/${lesson.tourSlug}`}
                            className='absolute right-6 bottom-4 flex items-center gap-x-1 px-3 font-semibold text-sm text-white bg-blue-400 rounded-full drop-shadow shadow-inner hover:bg-opacity-70 transition duration-300'
                        >
                            <span>Khám phá VR</span>
                            <Unicons.UilArrowRight size='24' />
                        </Link>
                    )}
                </div>
                {showSlides ? <Unicons.UilAngleUp size='32' /> : <Unicons.UilAngleDown size='32' />}
            </div>
            {showSlides &&
                lesson.slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        id={slide.id}
                        role='button'
                        className={`flex items-center gap-x-4 px-8 py-3 ${learningSlice.currentSlideId === slide.id
                                ? 'bg-green-100 bg-opacity-40 cursor-default'
                                : 'bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-800'
                            } ${canActiveSlide(slide, lesson, index) ? '' : ' opacity-40 cursor-default'}`}
                        onClick={() => {
                            if (learningSlice.currentSlideId !== slide.id && canActiveSlide(slide, lesson, index))
                                dispatch(setCurrentSlideId(slide.id));
                        }}
                    >
                        <h4 className='flex-grow'>
                            Bài {slide.index}: {slide.title}
                        </h4>
                        <span
                            className={`p-px text-white bg-nature-green rounded-full${isCompletedSlide(slide.id) ? '' : ' opacity-0'
                                }`}
                        >
                            <Unicons.UilCheck size='14' />
                        </span>
                    </div>
                ))}
        </>
    );
}
