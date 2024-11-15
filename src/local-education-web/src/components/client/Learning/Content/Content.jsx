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
            className={`absolute bottom-0 left-0 right-0 top-0 z-0 overflow-y-auto ${
                learningSlice.isShowSidebar ? 'xl:right-96' : ''
            } transition-all duration-300`}
        >
            {/* Start: Media section */}
            <section className='flex items-center justify-center bg-dark'>
                {slide.urlPath ? (
                    getFileType(extractFileName(slide.urlPath).extension) === 'image' ? (
                        <img
                            src={`${import.meta.env.VITE_API_ENDPOINT}/${slide.urlPath}`}
                            alt={slide.title}
                            className='max-h-full max-w-full object-contain'
                        />
                    ) : getFileType(extractFileName(slide.urlPath).extension) === 'video' ? (
                        <video controls className='max-h-full max-w-full px-[8%]'>
                            <source src={`${import.meta.env.VITE_API_ENDPOINT}/${slide.urlPath}`} type='video/mp4' />
                        </video>
                    ) : getFileType(extractFileName(slide.urlPath).extension) === 'audio' ? (
                        <audio controls className='m-6 w-full'>
                            <source src={`${import.meta.env.VITE_API_ENDPOINT}/${slide.urlPath}`} type='audio/mp3' />
                        </audio>
                    ) : null
                ) : null}
            </section>
            {/* End: Media section */}

            <section className='mx-auto flex max-w-3xl flex-col gap-y-4 p-4'>
                <h1 className='text-justify text-lg font-bold uppercase'>
                    Bài {slide.index}: {slide.title}
                </h1>

                {/* Start: Content section */}
                <section ref={textRef} className={`${slide.layout === 'media' ? 'hidden' : ''}`}>
                    <div className='dark:prose-heading:text-white prose max-w-full break-words dark:text-white dark:prose-h1:text-white dark:prose-h2:text-white dark:prose-h3:text-white dark:prose-h4:text-white dark:prose-p:text-white dark:prose-a:text-white dark:prose-blockquote:text-white dark:prose-figure:text-white dark:prose-figcaption:text-white dark:prose-strong:text-white dark:prose-em:text-white dark:prose-code:text-white dark:prose-pre:text-white dark:prose-ol:text-white dark:prose-ul:text-white dark:prose-li:text-white dark:prose-table:text-white dark:prose-thead:text-white dark:prose-tr:text-white dark:prose-th:text-white dark:prose-td:text-white dark:prose-lead:text-white'>
                        {Parser().parse(
                            slide.content
                                ?.toString()
                                .replaceAll('https://localhost:7272', import.meta.env.VITE_API_ENDPOINT)
                        )}
                    </div>
                </section>
                {/* End: Content section */}

                <hr
                    className={`${slide.layout === 'full' && auth.accessToken && questions.length > 0 ? '' : 'hidden'}`}
                />

                {/* Start: Content section */}
                {auth.accessToken && questions.length > 0 && (
                    <section>
                        <div className='flex flex-col gap-y-4'>
                            <div className='flex items-center justify-between gap-x-4'>
                                <h2 className='font-bold'>Trắc nghiệm</h2>
                                <span>
                                    Yêu cầu: đúng {slide.minPoint}/{questions.length} câu
                                </span>
                            </div>
                            {questions.map((question, questionIndex) => (
                                <div key={question.id} className='flex flex-col gap-y-4'>
                                    <h4 className='font-semibold'>Câu hỏi {questionIndex + 1}</h4>
                                    {question.url && (
                                        <img src={`${import.meta.env.VITE_API_ENDPOINT}/${question.url}`} alt='img' />
                                    )}
                                    <h4 className='font-semibold'>{question.content}</h4>
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
                                                    className={`pl-1 ${
                                                        isIncorrectAnswer(question.index, option.index) > 0 &&
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
                    </section>
                )}
            </section>
            {/* End: Questions section */}
        </main>
    );
}
