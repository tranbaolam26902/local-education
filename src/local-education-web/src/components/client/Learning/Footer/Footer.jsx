/* Libraries */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as uuid from 'uuid';
import * as Unicons from '@iconscout/react-unicons';

/* Redux */
import {
    clearIncorrectQuestions,
    selectLearning,
    setCurrentSlideId,
    setIncorrectQuestions,
    toggleSidebar
} from '@redux/features/client/learning';
import { selectAuth } from '@redux/features/shared/auth';

/* Services */
import { useProgressServices } from '@services/client';
import { getSlideById } from '@services/shared';

export default function Footer({ lessons }) {
    /* Hooks */
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /* Services */
    const progressServices = useProgressServices();

    /* States */
    const auth = useSelector(selectAuth);
    const learningSlice = useSelector(selectLearning);
    const [slideIds, setSlideIds] = useState([]);
    const [hasToAnswer, setHasToAnswer] = useState(false);

    /* Functions */
    const hasPreviousSlide = () => slideIds.indexOf(learningSlice.currentSlideId) > 0;
    const hasNextSlide = () =>
        slideIds.indexOf(learningSlice.currentSlideId) !== -1 &&
        slideIds.indexOf(learningSlice.currentSlideId) < slideIds.length - 1;

    /* Event handlers */
    const handleToggleSidebar = () => {
        dispatch(toggleSidebar());
    };
    const handleGoBackSlide = () => {
        const slideIndex = slideIds.indexOf(learningSlice.currentSlideId);

        if (hasPreviousSlide()) dispatch(setCurrentSlideId(slideIds[slideIndex - 1]));
    };
    const handleNextSlide = async () => {
        const slideIndex = slideIds.indexOf(learningSlice.currentSlideId);

        if (auth.accessToken) await progressServices.completeSlide(learningSlice.currentSlideId);

        if (!hasNextSlide()) {
            navigate('/learning/finished');
            return;
        }

        dispatch(setCurrentSlideId(slideIds[slideIndex + 1]));
    };
    const handleValidateAnswers = async () => {
        if (!hasToAnswer) return;

        const answersResult = await progressServices.completeSlide(learningSlice.currentSlideId, learningSlice.answers);

        if (answersResult.isSuccess) {
            setHasToAnswer(false);
            dispatch(clearIncorrectQuestions());
            toast.success('Xin chúc mừng, bạn đã hoàn thành bài học!');
        } else {
            setHasToAnswer(true);
            if (answersResult.statusCode === 406) {
                toast.warning(answersResult.errors[0]);
                return;
            }
            dispatch(setIncorrectQuestions(answersResult.result.incorrects));
            toast.warning(answersResult.errors[0]);
        }
    };

    /* Side effects */
    /* Get course slide ids */
    useEffect(() => {
        if (lessons.length <= 0) return;
        setSlideIds(lessons.map((lesson) => lesson.slides.map((slide) => slide.id)).flat(1));
    }, []);
    useEffect(() => {
        if (learningSlice.currentSlideId === uuid.NIL || !auth.accessToken) return;

        const handleCheckAnswerRequired = async () => {
            const slideResult = await getSlideById(learningSlice.currentSlideId);

            if (slideResult.isSuccess) {
                setHasToAnswer(slideResult.result.minPoint > 0);
            }
        };

        handleCheckAnswerRequired();
    }, [learningSlice.currentSlideId]);

    return (
        <footer className='absolute z-10 left-0 right-0 bottom-0 flex items-center justify-between gap-x-2 sm:gap-x-4 px-6 h-[3.125rem] bg-white dark:bg-black shadow-reverse dark:outline dark:outline-1 dark:outline-gray-500'>
            <section className='flex-grow opacity-0'>
                <button type='button'>
                    <Unicons.UilBars size='24' />
                </button>
            </section>
            <section className='grid grid-cols-2 gap-x-2 sm:gap-x-4'>
                <button
                    type='button'
                    disabled={!hasPreviousSlide()}
                    className={`flex items-center justify-center gap-x-1 sm:pl-2 pr-2 sm:pr-4 ${hasPreviousSlide() ? 'hover:opacity-70 hover:-translate-x-1' : 'opacity-50'
                        } transition duration-300`}
                    onClick={handleGoBackSlide}
                >
                    <Unicons.UilAngleLeft size='24' />
                    <span className='font-semibold text-xs sm:text-base uppercase'>Bài trước</span>
                </button>
                {hasToAnswer ? (
                    <button
                        type='button'
                        className={`flex items-center justify-center gap-x-1 pl-2 sm:pl-4 sm:pr-2 py-1 text-nature-green dark:text-light-green border-2 border-nature-green dark:border-light-green rounded-lg drop-shadow shadow-inner hover:opacity-70 hover:translate-x-1 transition duration-300`}
                        onClick={handleValidateAnswers}
                    >
                        <span className='font-semibold text-xs sm:text-base uppercase'>Kiểm tra</span>
                        <Unicons.UilAngleRight size='24' />
                    </button>
                ) : (
                    <button
                        type='button'
                        className={`flex items-center justify-center gap-x-1 pl-2 sm:pl-4 sm:pr-2 py-1 text-nature-green dark:text-light-green border-2 border-nature-green dark:border-light-green rounded-lg drop-shadow shadow-inner hover:opacity-70 hover:translate-x-1 transition duration-300`}
                        onClick={handleNextSlide}
                    >
                        <span className='font-semibold text-xs sm:text-base uppercase'>
                            {hasNextSlide() ? 'Bài sau' : 'Hoàn thành'}
                        </span>
                        <Unicons.UilAngleRight size='24' />
                    </button>
                )}
            </section>
            <section className='flex-grow flex items-center justify-end'>
                <button
                    type='button'
                    title={learningSlice.isShowSidebar ? 'Thu nhỏ' : 'Mở rộng'}
                    className='p-1.5 border border-gray-200 rounded-full shadow-lg hover:opacity-70 transition duration-300'
                    onClick={handleToggleSidebar}
                >
                    <Unicons.UilBars size='24' />
                </button>
            </section>
        </footer>
    );
}
