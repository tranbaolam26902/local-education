/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Parser } from 'html-to-react';
import * as uuid from 'uuid';

/* Redux */
import { selectAuth } from '@redux/features/shared/auth';
import { addOrUpdateAnswer, clearAnswers, selectLearning, setSlideQuestions } from '@redux/features/client/learning';

/* Services */
import { getSlideById, getSlideQuestions } from '@services/shared';

/* Utils */
import { getFileType } from '@utils/files';
import { extractFileName } from '@utils/strings';

export default function Content() {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const auth = useSelector(selectAuth);
    const learningSlice = useSelector(selectLearning);
    const [slide, setSlide] = useState({});
    const [questions, setQuestions] = useState([]);

    /* Refs */
    const containerRef = useRef(null);
    const textRef = useRef(null);

    /* Functions */
    const getSlide = async () => {
        const slideResult = await getSlideById(learningSlice.currentSlideId);

        if (slideResult.isSuccess) setSlide(slideResult.result);
        else setSlide({});
    };
    const getQuestions = async (slideId) => {
        const questionsResult = await getSlideQuestions(slideId);

        setQuestions(questionsResult.result);
        dispatch(setSlideQuestions(questionsResult.result));
        dispatch(clearAnswers());
    };
    const isIncorrectAnswer = (questionIndex, optionIndex) => {
        if (
            learningSlice.incorrectQuestions.length > 0 &&
            learningSlice.incorrectQuestions.find(
                (q) => q.questionIndex === questionIndex && q.optionIndex !== optionIndex
            )
        )
            return true;
        return false;
    };

    /* Event handlers */
    const handleSelectAnswer = (e) => {
        const indexes = e.target.value.split('|');
        const questionIndex = indexes[0];
        const optionIndex = indexes[1];

        dispatch(addOrUpdateAnswer({ questionIndex, optionIndex }));
    };

    /* Side effects */
    /* Get slide by id and reset scroll position */
    useEffect(() => {
        if (learningSlice.currentSlideId === uuid.NIL) return;

        getSlide();
        containerRef.current.scrollTo(0, 0);
        textRef.current.scrollTo(0, 0);
        getQuestions(learningSlice.currentSlideId);
    }, [learningSlice.currentSlideId]);

    return (
        <main
            ref={containerRef}
            className={`overflow-y-auto xl:overflow-y-hidden absolute z-0 top-0 left-0 bottom-0 right-0 xl:grid xl:grid-cols-3 flex flex-col ${learningSlice.isShowSidebar ? 'xl:right-96' : ''
                } transition-all duration-300`}
        >
            {/* Start: Left section */}
            <section
                className={`relative ${slide.layout === 'full'
                        ? 'xl:col-span-2'
                        : slide.layout === 'media'
                            ? 'xl:col-span-3 h-full'
                            : slide.layout === 'text'
                                ? 'hidden'
                                : ''
                    } bg-dark`}
            >
                {slide.urlPath ? (
                    getFileType(extractFileName(slide.urlPath).extension) === 'image' ? (
                        <div className='relative flex items-center justify-center w-full h-full'>
                            <img
                                src={`${import.meta.env.VITE_API_ENDPOINT}/${slide.urlPath}`}
                                alt={slide.title}
                                className='xl:absolute max-w-full max-h-full object-contain'
                            />
                        </div>
                    ) : getFileType(extractFileName(slide.urlPath).extension) === 'video' ? (
                        <video controls className='w-full h-full'>
                            <source src={`${import.meta.env.VITE_API_ENDPOINT}/${slide.urlPath}`} type='video/mp4' />
                        </video>
                    ) : getFileType(extractFileName(slide.urlPath).extension) === 'audio' ? (
                        <audio controls className='xl:absolute xl:bottom-0 my-4 px-6 w-full'>
                            <source src={`${import.meta.env.VITE_API_ENDPOINT}/${slide.urlPath}`} type='audio/mp3' />
                        </audio>
                    ) : null
                ) : null}
            </section>
            {/* End: Left section */}

            {/* Start: Right section */}
            <section
                ref={textRef}
                className={`${slide.layout === 'full'
                        ? 'xl:col-span-1'
                        : slide.layout === 'media'
                            ? 'hidden'
                            : slide.layout === 'text'
                                ? 'overflow-y-auto xl:col-span-3 h-full'
                                : ''
                    } xl:overflow-y-auto p-6`}
            >
                <div className='relative my-4 xl:mt-0'>
                    <div className='absolute z-10 -top-3 -left-3 flex items-center justify-center h-10 aspect-square font-bold text-2xl text-white bg-gradient-to-br from-white via-blue-300 to-blue-300 rounded-full'>
                        {slide.index}
                    </div>
                    <h1 className='pl-10 pr-8 py-2 font-bold text-2xl border border-gray-200 rounded-2xl drop-shadow-md shadow-inner'>
                        {slide.title}
                    </h1>
                </div>
                <div className='max-w-full dark:text-white prose dark:prose-heading:text-white dark:prose-lead:text-white dark:prose-h1:text-white dark:prose-h2:text-white dark:prose-h3:text-white dark:prose-h4:text-white dark:prose-p:text-white dark:prose-a:text-white dark:prose-blockquote:text-white dark:prose-figure:text-white dark:prose-figcaption:text-white dark:prose-strong:text-white dark:prose-em:text-white dark:prose-code:text-white dark:prose-pre:text-white dark:prose-ol:text-white dark:prose-ul:text-white dark:prose-li:text-white dark:prose-table:text-white dark:prose-thead:text-white dark:prose-tr:text-white dark:prose-th:text-white dark:prose-td:text-white'>
                    {Parser().parse(
                        slide.content
                            ?.toString()
                            .replaceAll('https://localhost:7272', import.meta.env.VITE_API_ENDPOINT)
                    )}
                </div>
                {auth.accessToken && questions.length > 0 && (
                    <>
                        <hr className='mt-3' />
                        <div className='flex flex-col gap-y-4 mt-3'>
                            <div className='flex items-center justify-between gap-x-4'>
                                <h2 className='font-bold text-2xl'>Câu hỏi</h2>
                                <span>
                                    Yêu cầu: {slide.minPoint}/{questions.length} câu
                                </span>
                            </div>
                            {questions.map((question, questionIndex) => (
                                <div key={question.id} className='flex flex-col gap-y-4'>
                                    <h4 className='font-semibold text-xl'>Câu hỏi {questionIndex + 1}</h4>
                                    {question.url && (
                                        <img src={`${import.meta.env.VITE_API_ENDPOINT}/${question.url}`} alt='img' />
                                    )}
                                    <h4 className='font-semibold text-lg'>{question.content}</h4>
                                    <div className='flex flex-col gap-y-4'>
                                        {question.options.map((option) => (
                                            <div key={option.id}>
                                                <input
                                                    id={option.id}
                                                    type='radio'
                                                    name={`question-${question.index}-correct-option`}
                                                    value={`${question.index}|${option.index}`}
                                                    onChange={handleSelectAnswer}
                                                />
                                                <label
                                                    id={`${option.id}-label`}
                                                    htmlFor={option.id}
                                                    className={`pl-1 ${isIncorrectAnswer(question.index, option.index) > 0 &&
                                                            learningSlice.incorrectQuestions.length > 0
                                                            ? 'text-red-400'
                                                            : ''
                                                        }`}
                                                >
                                                    {option.content}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}
