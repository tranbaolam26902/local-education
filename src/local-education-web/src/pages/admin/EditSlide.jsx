/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-toastify';
import * as Unicons from '@iconscout/react-unicons';
import * as uuid from 'uuid';

/* Redux */
import {
    disableMultiSelectModeButton,
    enableFileManagementModal,
    selectFileManagement,
    setAllowedCategory,
    setSelectFileCallback
} from '@redux/features/admin/fileManagement';
import { setSlides, showInfoHotspotDetailModal } from '@redux/features/client/tour';

/* Services */
import { useCourseServices, useLessonServices, useQuestionServices, useSlideServices } from '@services/admin';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { Input } from '@components/admin';
import { Container, SlideDetailModal } from '@components/shared';

export default function EditSlide() {
    /* Hooks */
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    /* Services */
    const courseServices = useCourseServices();
    const lessonServices = useLessonServices();
    const slideServices = useSlideServices();
    const questionServices = useQuestionServices();

    /* States */
    const fileManagement = useSelector(selectFileManagement);
    const [errorMessages, setErrorMessages] = useState([]);
    const [courses, setCourses] = useState([]);
    const [courseId, setCourseId] = useState(uuid.NIL);
    const [courseIdMessage, setCourseIdMessage] = useState('');
    const [lessons, setLessons] = useState([]);
    const [lessonId, setLessonId] = useState(uuid.NIL);
    const [lessonIdMessage, setLessonIdMessage] = useState('');
    const [slide, setSlide] = useState(null);
    const [index, setIndex] = useState('');
    const [title, setTitle] = useState('');
    const [titleMessage, setTitleMessage] = useState('');
    const [content, setContent] = useState('');
    const [contentMessage, setContentMessage] = useState('');
    const [layout, setLayout] = useState('full');
    const [isChangedMedia, setIsChangedMedia] = useState(false);
    const [media, setMedia] = useState({ thumbnailPath: '', urlPath: '' });
    const [mediaMessage, setMediaMessage] = useState('');
    const [hasChanged, setHasChanged] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [isValidated, setIsValidated] = useState(false);
    const [requiredQuestions, setRequiredQuestions] = useState(0);
    const [isChangedQuestionFile, setIsChangedQuestionFile] = useState(false);
    const [currentQuestionFileIndex, setCurrentQuestionFileIndex] = useState(0);
    const [isChangedImportFile, setIsChangedImportFile] = useState(false);

    /* Refs */
    const indexRef = useRef(null);
    const titleRef = useRef(null);
    const contentRef = useRef(null);

    /* Functions */
    const getAllCourses = async () => {
        const coursesResult = await courseServices.getAllCourses();

        if (coursesResult.isSuccess) setCourses(coursesResult.result);
        else setCourses([]);
    };
    const getLessons = async (id) => {
        if (id === uuid.NIL) return;

        const lessonsResult = await lessonServices.getLessonsByCourseId(id);

        if (lessonsResult.isSuccess) setLessons(lessonsResult.result);
        else setLessons([]);
    };
    const getSlide = async (id) => {
        const slideResult = await slideServices.getSlideById(id);

        if (slideResult.isSuccess) setSlide(slideResult.result);
        else navigate('/404');
    };
    const validateSlide = () => {
        let valid = true;

        if (!slide && courseId === uuid.NIL) {
            setCourseIdMessage('Khóa học không được để trống.');
            valid = false;
        }
        if (!slide && lessonId === uuid.NIL) {
            setLessonIdMessage('Chương không được để trống.');
            valid = false;
        }
        if (title.trim() === '') {
            setTitleMessage('Tiêu đề không được để trống.');
            valid = false;
        }
        if (layout !== 'media' && contentRef.current.getContent().trim() === '') {
            setContentMessage('Nội dung không được để trống.');
            valid = false;
        }
        if (layout !== 'text' && !media.path) {
            setMediaMessage('Media không được để trống.');
            valid = false;
        }

        return valid;
    };
    const setPageTitle = () => {
        if (id) document.title = getSubPageTitle('Chỉnh sửa bài học');
        else document.title = getSubPageTitle('Thêm bài học');
    };
    const getLastQuestionIndex = () =>
        questions.length > 0 ? Number.parseInt(questions[questions.length - 1].index) : 1;
    const getLastOptionIndex = (questionIndex) => {
        const question = questions.find((question) => question.index === questionIndex);
        return question.options[question.options.length - 1].index;
    };
    const getQuestionsData = () => {
        const result = questions.map((question) => {
            question.content = document.querySelector(`#question-${question.index}`).value;
            question.options = question.options.map((option) => {
                option.content = document.querySelector(`#question-${question.index}-option-${option.index}`).value;
                return option;
            });
            question.indexCorrect =
                Number.parseInt(
                    document.querySelector(`input[name='question-${question.index}-correct-option']:checked`)?.value
                ) || 0;

            return question;
        });
        return result;
    };
    const validateQuestions = () => {
        var isValid = true;

        questions.forEach((question) => {
            if (question.indexCorrect === 0 || question.content === '') {
                isValid = false;
            }
            question.options.forEach((option) => {
                if (option.content === '') {
                    isValid = false;
                }
            });
            if (requiredQuestions < 0 || requiredQuestions > questions.length || isNaN(requiredQuestions)) {
                isValid = false;
            }
        });

        return isValid;
    };
    const getQuestionsBySlideId = async () => {
        if (!id) return;

        const questionsResult = await questionServices.getSlideQuestions(id);

        setQuestions(questionsResult.result);
    };

    /* Event handlers */
    const handleSelectCourse = (e) => {
        setCourseId(e.target.value);
        if (e.target.value === uuid.NIL) {
            setCourseIdMessage('Vui lòng chọn khóa học.');
            setLessons([]);
        } else setCourseIdMessage('');
    };
    const handleSelectLesson = (e) => {
        setLessonId(e.target.value);
        if (e.target.value === uuid.NIL) setLessonIdMessage('Vui lòng chọn chương.');
        else setLessonIdMessage('');
    };
    const handleSelectLayout = (e) => {
        setLayout(e.target.value);
    };
    const handleSelectFile = () => {
        dispatch(
            setSelectFileCallback(() => {
                setIsChangedMedia(true);
            })
        );
        dispatch(disableMultiSelectModeButton());
        dispatch(enableFileManagementModal(true));
    };
    const handleDeleteMedia = () => {
        setMedia({ thumbnailPath: '', path: '' });
        setHasChanged(true);
    };
    const handleViewContent = () => {
        const editingSlide = {
            title: title.trim(),
            content: contentRef.current.getContent(),
            index,
            thumbnailPath: media.thumbnailPath,
            urlPath: media.path,
            layout
        };

        dispatch(setSlides([editingSlide]));
        dispatch(showInfoHotspotDetailModal());
    };
    const handleExport = async () => {
        const exportResult = await questionServices.exportQuestionsToExcel({
            fileName: slide.title,
            questions
        });

        if (exportResult.isSuccess) {
            toast.success('Lưu danh sách câu hỏi thành công');
        } else {
            toast.error(exportResult.error[0]);
        }
    };
    const handleImport = () => {
        dispatch(
            setSelectFileCallback(() => {
                setIsChangedImportFile(true);
            })
        );
        dispatch(disableMultiSelectModeButton());
        dispatch(setAllowedCategory('others'));
        dispatch(enableFileManagementModal(true));
    };
    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            {
                index: getLastQuestionIndex() + 1,
                content: '',
                options: [
                    {
                        index: 1,
                        content: ''
                    },
                    {
                        index: 2,
                        content: ''
                    }
                ],
                indexCorrect: 0,
                url: ''
            }
        ]);
    };
    const handleDeleteQuestion = (index) => {
        if (!window.confirm(`Xác nhận xoá câu hỏi ${index}?`)) return;
        setQuestions(questions.filter((question) => question.index !== index));
    };
    const handleAddOption = (questionIndex) => {
        setQuestions(
            questions.map((question) => {
                if (question.index === questionIndex)
                    question.options.push({
                        index: getLastOptionIndex(questionIndex) + 1,
                        content: ''
                    });
                return question;
            })
        );
    };
    const handleDeleteOption = (questionIndex, answerIndex) => {
        if (!window.confirm(`Xác nhận xoá đáp án ${answerIndex} của câu hỏi ${questionIndex}?`)) return;
        setQuestions(
            questions.map((question) => {
                if (question.index === questionIndex) {
                    question.options = question.options.filter((option) => option.index !== answerIndex);
                }
                return question;
            })
        );

        const correctOptionRadio = document.querySelector(`#question-${questionIndex}-correct-option-${answerIndex}`);
        if (correctOptionRadio.checked)
            document.querySelector(
                `#question-${questionIndex}-correct-option-${
                    questions.find((question) => question.index === questionIndex).options[0].index
                }`
            ).checked = true;
    };
    const handleSelectQuestionImage = (questionIndex) => {
        setCurrentQuestionFileIndex(questionIndex);
        dispatch(
            setSelectFileCallback(() => {
                setIsChangedQuestionFile(true);
            })
        );
        dispatch(setAllowedCategory('images'));
        dispatch(disableMultiSelectModeButton());
        dispatch(enableFileManagementModal(true));
    };
    const handleDeleteQuestionImage = (questionIndex) => {
        setQuestions(
            questions.map((question) => {
                if (question.index === questionIndex) {
                    question.url = '';
                }
                return question;
            })
        );
    };
    const handleGoBack = () => {
        if (hasChanged) if (!confirm('Chưa lưu thay đổi. Xác nhận trở về?')) return;
        navigate(-1);
    };
    const handleSaveSlide = async (e) => {
        e.preventDefault();
        if (!validateSlide()) return;

        const newSlide = {
            title: title.trim(),
            content: layout !== 'media' ? contentRef.current.getContent() : title.trim(),
            urlPath: media.path,
            thumbnailPath: media.thumbnailPath,
            layout: document.querySelector('input[name="layout"]:checked').value
        };
        if (Number.parseInt(index) > 0) newSlide.index = Number.parseInt(index);

        if (questions.length > 0) {
            getQuestionsData();
            if (!validateQuestions()) {
                toast.warn('Thông tin câu hỏi không hợp lệ.');
                setIsValidated(true);
                return;
            } else {
                setIsValidated(false);
            }
        }

        if (slide) {
            // Edit slide
            const saveResult = await slideServices.updateSlide({ ...newSlide, id: slide.id });

            if (saveResult.isSuccess) {
                toast.success('Lưu slide thành công.');
                setErrorMessages([]);
                setHasChanged(false);

                const questionResult = await questionServices.addOrUpdateQuestion(
                    slide.id,
                    requiredQuestions,
                    questions
                );

                if (!questionResult.isSuccess) {
                    toast.error(questionResult.errors[0]);
                }
            } else setErrorMessages(saveResult.errors);
        } else {
            // Add new slide
            const saveResult = await slideServices.addSlideToLesson(newSlide, lessonId);

            if (saveResult.isSuccess) {
                const questionResult = await questionServices.addOrUpdateQuestion(
                    saveResult.result.id,
                    requiredQuestions,
                    questions
                );

                if (!questionResult.isSuccess) {
                    toast.error(questionResult.errors[0]);
                }

                toast.success('Thêm chương mới thành công.');
                navigate('/admin/slides', { state: { courseId, lessonId } });
                setHasChanged(false);
            } else setErrorMessages(saveResult.errors);
        }
    };

    /* Side effects */
    /* Init component side effects */
    useEffect(() => {
        if (!slide) getAllCourses();
        setPageTitle();
        getQuestionsBySlideId();
    }, []);
    /* Get selected course lessons */
    useEffect(() => {
        getLessons(courseId);
    }, [courseId]);
    /* Handle select file */
    useEffect(() => {
        if (!isChangedMedia) return;
        const selectedFile = fileManagement.selectedResult[0];
        if (!selectedFile) return;

        setMedia(selectedFile);
        setIsChangedMedia(false);
        setHasChanged(true);
    }, [isChangedMedia]);
    /* Handle select import questions file */
    useEffect(() => {
        if (!isChangedImportFile) return;
        const selectedFile = fileManagement.selectedResult[0];
        if (!selectedFile) return;

        const getQuestionsFromFile = async () => {
            const questionsResult = await questionServices.importQuestionsFromExcel(selectedFile.id);

            if (questionsResult.isSuccess) {
                setQuestions(questionsResult.result);
            } else {
                toast.error(questionsResult.errors[0]);
            }
        };
        getQuestionsFromFile();

        setIsChangedImportFile(false);
        setHasChanged(true);
    }, [isChangedImportFile]);
    /* Handle sync required questions with number of questions */
    useEffect(() => {
        setRequiredQuestions(Math.round(questions.length / 2));
    }, [questions, questions.length]);
    /* Handle select question file */
    useEffect(() => {
        if (!isChangedQuestionFile) return;
        const selectedFile = fileManagement.selectedResult[0];
        if (!selectedFile) return;

        setQuestions(
            questions.map((question) => {
                if (question.index === currentQuestionFileIndex) {
                    question.url = selectedFile.path;
                }

                return question;
            })
        );
        setIsChangedQuestionFile(false);
        setHasChanged(true);
    }, [isChangedQuestionFile]);
    /* Get slide for editing */
    useEffect(() => {
        if (id) getSlide(id);
        if (!location.state) return;

        setCourseId(location.state.courseId);
        setLessonId(location.state.lessonId);
    }, [id]);
    /* Set slide value to controls */
    useEffect(() => {
        if (!slide) return;

        setIndex(slide.index);
        setTitle(slide.title);
        setContent(slide.content);
        setMedia({ path: slide.urlPath, thumbnailPath: slide.thumbnailPath });
        setLayout(slide.layout);
        setRequiredQuestions(slide.minPoint);
        document.querySelector(`input[name=layout][value=${slide.layout}]`).checked = true;
    }, [slide]);

    return (
        <section className='min-h-[calc(100svh-3.75rem)] dark:bg-black dark:text-white'>
            <Container className='flex flex-col gap-y-4 py-4'>
                {
                    <div className='flex items-center justify-between'>
                        <h1 className='text-2xl font-semibold'>{id ? 'Chỉnh sửa bài học' : 'Thêm bài học mới'}</h1>
                        <button
                            type='button'
                            className='flex items-center gap-x-1 text-sm font-semibold hover:opacity-80'
                            onClick={handleViewContent}
                        >
                            <Unicons.UilEye size='24' />
                            <span>Xem trước</span>
                        </button>
                    </div>
                }

                <form className='grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2' onSubmit={handleSaveSlide}>
                    {/* Start: Left section */}
                    <section className='flex flex-col gap-y-4'>
                        {errorMessages.map((errorMessage) => (
                            <h6 key={errorMessage} className='text-center text-lg italic text-red-400'>
                                {errorMessage}
                            </h6>
                        ))}
                        {/* Start: Selects section */}
                        {!slide && (
                            <>
                                <div className='flex flex-col gap-y-2'>
                                    <span className='font-semibold'>Chọn khóa học</span>
                                    <select
                                        className={`h-full w-full border bg-white px-4 py-2 ${
                                            courseIdMessage ? 'border-red-400' : 'border-gray-400'
                                        } appearance-none rounded shadow-inner dark:bg-dark`}
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
                                    {courseIdMessage && (
                                        <span className='text-sm italic text-red-400'>{courseIdMessage}</span>
                                    )}
                                </div>
                                <div className='flex flex-col gap-y-2'>
                                    <span className='font-semibold'>Chọn chương</span>
                                    <select
                                        disabled={courseId === uuid.NIL}
                                        className={`h-full w-full border bg-white px-4 py-2 ${
                                            lessonIdMessage ? 'border-red-400' : 'border-gray-400'
                                        } appearance-none rounded shadow-inner dark:bg-dark`}
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
                                    {lessonIdMessage && (
                                        <span className='text-sm italic text-red-400'>{lessonIdMessage}</span>
                                    )}
                                </div>
                            </>
                        )}
                        {/* End: Selects section */}

                        {/* Start: Input section */}
                        <Input
                            ref={indexRef}
                            id='index'
                            label='Số thứ tự'
                            placeholder='Nhập số thứ tự...'
                            required
                            type='number'
                            value={index}
                            onChange={(e) => {
                                setIndex(e.target.value);
                                setHasChanged(true);
                            }}
                            clearInput={() => {
                                setTitle('');
                                setHasChanged(true);
                            }}
                        />
                        <Input
                            ref={titleRef}
                            id='title'
                            label='Tiêu đề'
                            placeholder='Nhập tên tiêu đề...'
                            required
                            value={title}
                            message={titleMessage}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setTitleMessage('');
                                setHasChanged(true);
                            }}
                            clearInput={() => {
                                setTitle('');
                                setHasChanged(true);
                            }}
                        />
                        {/* End: Input section */}

                        {/* Start: Select layout section */}
                        <section className='flex flex-col gap-y-1'>
                            <span className='font-semibold'>Bố cục</span>
                            <div className='flex items-center gap-x-4'>
                                <div className='flex flex-col items-center'>
                                    <div className='flex items-center gap-x-1'>
                                        <input
                                            type='radio'
                                            id='layout-1'
                                            name='layout'
                                            value='full'
                                            defaultChecked
                                            className='cursor-pointer'
                                            onChange={handleSelectLayout}
                                        />
                                        <label htmlFor='layout-1' className='cursor-pointer'>
                                            Đầy đủ
                                        </label>
                                    </div>
                                    <label htmlFor='layout-1' className='cursor-pointer'>
                                        <Unicons.UilWebSection size='48' />
                                    </label>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <div className='flex items-center gap-x-1'>
                                        <input
                                            type='radio'
                                            id='layout-2'
                                            name='layout'
                                            value='media'
                                            className='cursor-pointer'
                                            onChange={handleSelectLayout}
                                        />
                                        <label htmlFor='layout-2' className='cursor-pointer'>
                                            Media
                                        </label>
                                    </div>
                                    <label htmlFor='layout-2' className='cursor-pointer'>
                                        <Unicons.UilPanoramaHAlt size='48' />
                                    </label>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <div className='flex items-center gap-x-1'>
                                        <input
                                            type='radio'
                                            id='layout-3'
                                            name='layout'
                                            value='text'
                                            className='cursor-pointer'
                                            onChange={handleSelectLayout}
                                        />
                                        <label htmlFor='layout-3' className='cursor-pointer'>
                                            Văn bản
                                        </label>
                                    </div>
                                    <label htmlFor='layout-3' className='cursor-pointer'>
                                        <Unicons.UilDocumentLayoutLeft size='48' />
                                    </label>
                                </div>
                            </div>
                        </section>
                        {/* End: Select layout section */}

                        {/* Start: Select media section */}
                        <section className='flex flex-col gap-y-2'>
                            <div className='flex items-center justify-between'>
                                <label htmlFor='media' className='w-fit cursor-pointer font-semibold'>
                                    Media
                                </label>
                                {media.path && (
                                    <button
                                        type='button'
                                        className='text-sm font-semibold text-red-400'
                                        onClick={handleDeleteMedia}
                                    >
                                        Xóa media
                                    </button>
                                )}
                            </div>
                            {media.path ? (
                                <div className='relative overflow-hidden rounded'>
                                    <img
                                        src={`${import.meta.env.VITE_API_ENDPOINT}/${media.thumbnailPath}`}
                                        alt='media'
                                        className='w-full'
                                    />
                                    <button
                                        type='button'
                                        className='absolute inset-0 flex items-center justify-center bg-gray-950 bg-opacity-60 text-xl font-semibold text-white opacity-0 hover:opacity-100'
                                        onClick={handleSelectFile}
                                    >
                                        Đổi media
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        id='media'
                                        type='button'
                                        className={`flex aspect-video flex-col items-center justify-center border-2 border-dashed ${
                                            mediaMessage ? 'border-red-400' : 'border-gray-600 dark:border-white'
                                        } rounded-lg shadow-inner transition-transform duration-200 hover:opacity-80`}
                                        onClick={handleSelectFile}
                                    >
                                        <Unicons.UilImage size='128' />
                                        <span className='text-xl font-semibold'>Chọn media</span>
                                    </button>
                                    {mediaMessage && (
                                        <span className='text-sm italic text-red-400'>{mediaMessage}</span>
                                    )}
                                </>
                            )}
                        </section>
                        {/* End: Select media section */}

                        {/* Start: Content section */}
                        <section className='flex flex-col gap-y-1.5'>
                            {layout !== 'media' && (
                                <>
                                    <label className='w-fit cursor-pointer font-semibold'>Nội dung</label>
                                    {contentMessage && (
                                        <span className='text-sm italic text-red-400'>{contentMessage}</span>
                                    )}
                                    <Editor
                                        onInit={(_, editor) => (contentRef.current = editor)}
                                        apiKey={import.meta.env.VITE_TINY_MCE_API_KEY}
                                        init={{
                                            plugins:
                                                'anchor autolink charmap codesample emoticons image link lists media searchreplace visualblocks wordcount fullscreen table',
                                            toolbar:
                                                'undo redo | blocks fontfamily fontsize | bold strikethrough | link image media | align lineheight | numlist bullist indent outdent | emoticons charmap | fullscreen table italic underline',
                                            toolbar_mode: 'wrap',
                                            height: 720
                                        }}
                                        initialValue={content}
                                        onChange={() => {
                                            setContentMessage('');
                                        }}
                                    />
                                </>
                            )}
                        </section>
                        {/* End: Content section */}
                    </section>
                    {/* End: Left section */}

                    {/* Start: Right section */}
                    <section className='flex flex-col gap-y-2'>
                        {/* Add question */}
                        <div className='flex justify-between gap-x-4'>
                            <label className='w-fit cursor-pointer whitespace-nowrap font-semibold'>
                                Danh sách câu hỏi
                            </label>
                            <div className='flex flex-wrap items-center justify-end gap-x-4 gap-y-2'>
                                <button
                                    type='button'
                                    className='text-sm font-semibold text-gray-500'
                                    onClick={handleExport}
                                >
                                    Xuất ra Excel
                                </button>
                                <button
                                    type='button'
                                    className='text-sm font-semibold text-nature-green'
                                    onClick={handleImport}
                                >
                                    Nhập từ Excel
                                </button>
                                <button
                                    type='button'
                                    className='text-sm font-semibold text-blue-400'
                                    onClick={handleAddQuestion}
                                >
                                    + Thêm câu hỏi
                                </button>
                            </div>
                        </div>
                        {/* Count & required questions */}
                        <div className='flex items-start justify-between gap-4'>
                            <span>Tổng số câu hỏi: {questions.length}</span>
                            <div className='flex flex-col items-end'>
                                <div>
                                    <label htmlFor='correct-required'>Số câu đúng tối thiểu:</label>
                                    <input
                                        id='correct-required'
                                        type='number'
                                        value={requiredQuestions}
                                        max={questions.length}
                                        className={`ml-2 w-8 border bg-white px-1 text-center dark:bg-black ${
                                            isValidated && requiredQuestions === ''
                                                ? 'border-red-400'
                                                : 'border-gray-500'
                                        } rounded-md`}
                                        onChange={(e) => {
                                            setRequiredQuestions(e.target.value);
                                        }}
                                    />
                                </div>
                                {isValidated && requiredQuestions === '' && (
                                    <span className='italic text-red-400'>
                                        Số câu đúng tối thiểu không được để trống.
                                    </span>
                                )}
                                {isValidated && requiredQuestions > questions.length && (
                                    <span className='italic text-red-400'>
                                        Số câu đúng không được vượt quá số câu hỏi.
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Start: Questions section */}
                        <section className='mt-2 flex flex-col gap-y-8'>
                            {questions.map((question, questionIndex) => (
                                <div
                                    key={question?.id || `question-${question.index}-${question.content}`}
                                    className='flex flex-col gap-y-2 rounded-md border border-gray-400 p-4'
                                >
                                    <div className='flex flex-col gap-y-2'>
                                        <div className='flex items-center justify-between gap-x-4'>
                                            <span className='font-semibold'>Câu hỏi {questionIndex + 1}</span>
                                            <button
                                                type='button'
                                                className='text-sm font-semibold text-red-400'
                                                onClick={() => handleDeleteQuestion(question.index)}
                                            >
                                                Xoá câu hỏi
                                            </button>
                                        </div>
                                        <div className='flex flex-col gap-y-1'>
                                            <button
                                                type='button'
                                                className='w-fit cursor-pointer font-semibold'
                                                onClick={() => handleSelectQuestionImage(question.index)}
                                            >
                                                Ảnh minh hoạ
                                            </button>
                                            <div className='group relative overflow-hidden rounded'>
                                                {question.url ? (
                                                    <>
                                                        <button
                                                            type='button'
                                                            className='absolute inset-0 flex items-center justify-center bg-gray-950 bg-opacity-60 text-xl font-semibold text-white opacity-0 hover:opacity-100'
                                                            onClick={() => handleSelectQuestionImage(question.index)}
                                                        >
                                                            Đổi ảnh
                                                        </button>
                                                        <button
                                                            type='button'
                                                            className='absolute right-2 top-2 z-10 rounded-full bg-gray-400 px-2 py-1 text-sm font-semibold text-white hover:opacity-70'
                                                            onClick={() => handleDeleteQuestionImage(question.index)}
                                                        >
                                                            Xoá ảnh
                                                        </button>
                                                        <img
                                                            src={`${import.meta.env.VITE_API_ENDPOINT}/${question.url}`}
                                                            alt='thumbnail'
                                                            className='w-full'
                                                        />
                                                    </>
                                                ) : (
                                                    <button
                                                        type='button'
                                                        className='flex w-full items-center justify-center gap-x-2 rounded-md border border-dashed border-gray-400 bg-white py-2 shadow-inner hover:opacity-70 dark:bg-dark'
                                                        onClick={() => handleSelectQuestionImage(question.index)}
                                                    >
                                                        <Unicons.UilImage size='24' />
                                                        <span>Thêm ảnh</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-y-1'>
                                            <label
                                                htmlFor={`question-${question.index}`}
                                                className='w-fit cursor-pointer font-semibold'
                                            >
                                                Nội dung
                                            </label>
                                            <textarea
                                                id={`question-${question.index}`}
                                                rows={2}
                                                placeholder={`Nhập nội dung câu hỏi ${questionIndex + 1}`}
                                                defaultValue={question.content}
                                                className={`w-full border px-4 py-2 ${
                                                    question.content === '' && isValidated
                                                        ? 'border-red-400'
                                                        : 'border-gray-400'
                                                } resize-none rounded shadow-inner outline-none dark:bg-dark`}
                                            ></textarea>
                                            {question.content === '' && isValidated && (
                                                <span className='-mt-1 italic text-red-400'>
                                                    Nội dung câu hỏi không được để trống.
                                                </span>
                                            )}
                                        </div>
                                        {question.options.map((option, optionIndex) => (
                                            <div
                                                key={`question-${question.index}-option-${option.index}`}
                                                className='relative'
                                            >
                                                <Input
                                                    id={`question-${question.index}-option-${option.index}`}
                                                    label={`Đáp án ${optionIndex + 1}`}
                                                    placeholder={`Nhập nội dung đáp án ${optionIndex + 1}`}
                                                    message={
                                                        isValidated && option.content === ''
                                                            ? 'Đáp án không được để trống.'
                                                            : ''
                                                    }
                                                    defaultValue={option.content}
                                                />
                                                {question.options.length > 2 && (
                                                    <button
                                                        type='button'
                                                        className='absolute right-0 top-0 text-sm font-semibold text-gray-500 dark:text-white'
                                                        onClick={() => handleDeleteOption(question.index, option.index)}
                                                    >
                                                        Xoá đáp án
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className='flex items-center justify-between gap-x-4'>
                                        {' '}
                                        <div className='flex grow flex-wrap items-center gap-x-3'>
                                            <span className='w-max font-semibold'>Đáp án đúng:</span>
                                            {question.options.map((option, optionIndex) => (
                                                <div key={`question-${question.index}-correct-option-${option.index}`}>
                                                    <input
                                                        id={`question-${question.index}-correct-option-${option.index}`}
                                                        type='radio'
                                                        name={`question-${question.index}-correct-option`}
                                                        value={option.index}
                                                        defaultChecked={option.index === question.indexCorrect}
                                                    />
                                                    <label
                                                        htmlFor={`question-${question.index}-correct-option-${option.index}`}
                                                        className='pl-1'
                                                    >
                                                        {optionIndex + 1}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type='button'
                                            className='whitespace-nowrap text-sm font-semibold text-green-400'
                                            onClick={() => handleAddOption(question.index)}
                                        >
                                            + Thêm đáp án
                                        </button>
                                    </div>
                                    {question.indexCorrect === 0 && isValidated && (
                                        <span className='-mt-2 italic text-red-400'>
                                            Đáp án đúng không được để trống.
                                        </span>
                                    )}
                                </div>
                            ))}
                        </section>
                        {/* End: Questions section */}
                    </section>
                    {/* End: Quiz section */}

                    {/* Start: Buttons section */}
                    <div className='flex items-center justify-end gap-x-4'>
                        <button
                            type='button'
                            className='px-4 py-2 font-semibold hover:opacity-80'
                            onClick={handleGoBack}
                        >
                            Trở về
                        </button>
                        <button
                            type='submit'
                            className='min-w-[6rem] rounded bg-nature-green px-4 py-2 font-semibold text-white hover:opacity-80'
                            onClick={handleSaveSlide}
                        >
                            Lưu
                        </button>
                    </div>
                    {/* End: Buttons section */}
                </form>
            </Container>
            <SlideDetailModal />
        </section>
    );
}
