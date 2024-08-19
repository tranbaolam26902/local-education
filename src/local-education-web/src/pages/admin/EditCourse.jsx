/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import * as Unicons from '@iconscout/react-unicons';
import { toast } from 'react-toastify';

/* Redux */
import {
    disableMultiSelectModeButton,
    enableFileManagementModal,
    selectFileManagement,
    setAllowedCategory,
    setCurrentCategory,
    setSelectFileCallback
} from '@redux/features/admin/fileManagement';

/* Services */
import { useCourseServices } from '@services/admin';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { Input } from '@components/admin';
import { Container } from '@components/shared';

export default function EditCourse() {
    /* Hooks */
    const { slug } = useParams();
    const loaderData = useLoaderData();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /* States */
    const fileManagement = useSelector(selectFileManagement);
    const [title, setTitle] = useState('');
    const [titleMessage, setTitleMessage] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionMessage, setDescriptionMessage] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);
    const [isChangedImage, setIsChangedImage] = useState(false);
    const [image, setImage] = useState({ thumbnailPath: '', urlPath: '' });
    const [hasChanged, setHasChanged] = useState(false);

    /* Refs */
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);

    /* Services */
    const courseServices = useCourseServices();

    /* Functions */
    const validateCourse = () => {
        let valid = true;

        if (title.trim() === '') {
            setTitleMessage('Tiêu đề không được để trống.');
            valid = false;
        }

        return valid;
    };
    const setPageTitle = () => {
        if (loaderData) document.title = getSubPageTitle('Chỉnh sửa khóa học');
        else document.title = getSubPageTitle('Thêm khóa học');
    };

    /* Event handlers */
    const handleSelectFile = () => {
        dispatch(
            setSelectFileCallback(() => {
                setIsChangedImage(true);
            })
        );
        dispatch(setAllowedCategory('images'));
        dispatch(setCurrentCategory('images'));
        dispatch(disableMultiSelectModeButton());
        dispatch(enableFileManagementModal(true));
    };
    const handleDeleteImage = () => {
        setImage({ thumbnailPath: '', path: '' });
        setHasChanged(true);
    };
    const handleGoBack = () => {
        if (hasChanged) if (!confirm('Chưa lưu thay đổi. Xác nhận trở về?')) return;
        navigate(-1);
    };
    const handleSaveCourse = async (e) => {
        e.preventDefault();
        if (!validateCourse()) return;

        const course = {
            title: title.trim(),
            description: description.trim(),
            thumbnailPath: image.thumbnailPath,
            urlPath: image.path
        };

        if (loaderData) {
            // Edit course
            const saveResult = await courseServices.updateCourse({ ...course, id: loaderData.course.id });

            if (saveResult.isSuccess) {
                toast.success('Lưu khóa học thành công.');
                setErrorMessages([]);
                setHasChanged(false);
            } else setErrorMessages(saveResult.errors);
        } else {
            // Add new course
            const saveResult = await courseServices.addCourse(course);

            if (saveResult.isSuccess) {
                toast.success('Thêm khóa học mới thành công.');
                navigate('/admin/courses');
                setHasChanged(false);
            } else setErrorMessages(saveResult.errors);
        }
    };

    /* Side effects */
    /* Init component side effects */
    useEffect(() => {
        setPageTitle();
    }, []);
    /* Handle select file */
    useEffect(() => {
        if (!isChangedImage) return;
        const selectedFile = fileManagement.selectedResult[0];
        if (!selectedFile) return;

        setImage(selectedFile);
        setIsChangedImage(false);
        setHasChanged(true);
    }, [isChangedImage]);
    /* Get course data for editing */
    useEffect(() => {
        if (!loaderData) return;

        const { course } = loaderData;

        setTitle(course.title);
        setDescription(course.description);
        setImage({ thumbnailPath: course.thumbnailPath, path: course.urlPath });
    }, [loaderData]);

    return (
        <section className='min-h-[calc(100svh-3.75rem)] dark:bg-black dark:text-white'>
            <Container className='flex flex-col gap-y-4 py-4'>
                <h1 className='font-semibold text-2xl'>{slug ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}</h1>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                    <form className='flex flex-col gap-y-4' onSubmit={handleSaveCourse}>
                        {errorMessages.map((errorMessage) => (
                            <h6 key={errorMessage} className='text-center text-lg text-red-400 italic'>
                                {errorMessage}
                            </h6>
                        ))}
                        <Input
                            ref={titleRef}
                            id='title'
                            label='Tiêu đề'
                            placeholder='Nhập tên tiêu đề...'
                            autoFocus
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
                        <div className='flex flex-col gap-y-1'>
                            <label htmlFor='description' className='font-semibold w-fit cursor-pointer'>
                                Mô tả
                            </label>
                            <textarea
                                ref={descriptionRef}
                                id='description'
                                placeholder='Nhập mô tả...'
                                value={description}
                                rows={4}
                                className={`px-4 py-2 w-full border ${descriptionMessage ? 'border-red-400' : 'border-gray-400'
                                    } outline-none rounded shadow-inner dark:bg-dark resize-none`}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    setDescriptionMessage('');
                                    setHasChanged(true);
                                }}
                            />
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <div className='flex items-center justify-between'>
                                <label htmlFor='course-image' className='cursor-pointer w-fit font-semibold'>
                                    Ảnh bìa
                                </label>
                                {image.path && (
                                    <button
                                        type='button'
                                        className='font-semibold text-red-400 text-sm'
                                        onClick={handleDeleteImage}
                                    >
                                        Xóa ảnh bìa
                                    </button>
                                )}
                            </div>
                            {image.path ? (
                                <div className='relative rounded overflow-hidden'>
                                    <img
                                        src={`${import.meta.env.VITE_API_ENDPOINT}/${image.path}`}
                                        alt='course-image'
                                        className='w-full'
                                    />
                                    <button
                                        type='button'
                                        className='absolute inset-0 flex items-center justify-center font-semibold text-xl text-white bg-gray-950 bg-opacity-60 opacity-0 hover:opacity-100'
                                        onClick={handleSelectFile}
                                    >
                                        Đổi ảnh bìa
                                    </button>
                                </div>
                            ) : (
                                <button
                                    id='course-image'
                                    type='button'
                                    className='flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-600 dark:border-white rounded-lg transition-transform duration-200 hover:opacity-80 shadow-inner'
                                    onClick={handleSelectFile}
                                >
                                    <Unicons.UilImage size='128' />
                                    <span className='font-semibold text-xl'>Chọn ảnh bìa</span>
                                </button>
                            )}
                        </div>
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
                                className='px-4 py-2 min-w-[6rem] font-semibold text-white bg-nature-green rounded hover:opacity-80'
                                onClick={handleSaveCourse}
                            >
                                Lưu
                            </button>
                        </div>
                    </form>
                </div>
            </Container>
        </section>
    );
}
