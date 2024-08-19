/* Libraries */
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

/* Redux */
import { triggerUpdateLessons } from '@redux/features/admin/lessonManagement';
import { setSlides, showInfoHotspotDetailModal } from '@redux/features/client/tour';

/* Services */
import { useLessonServices } from '@services/admin';
import { getSlidesByLessonId, getTourBySlug } from '@services/shared';

export default function LessonItem({ lesson }) {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const [tour, setTour] = useState(null);

    /* Services */
    const lessonServices = useLessonServices();

    /* Functions */
    const getTour = async () => {
        if (!lesson.tourSlug) return;
        const tourResult = await getTourBySlug(lesson.tourSlug);

        if (tourResult.isSuccess) setTour(tourResult.result);
        else setTour(null);
    };

    /* Event handlers */
    const handleViewContent = async () => {
        const slides = await getSlidesByLessonId(lesson.id);

        dispatch(setSlides(slides.result));
        dispatch(showInfoHotspotDetailModal());
    };
    const handleTogglePublished = async () => {
        const toggleResult = await lessonServices.togglePublished(lesson.id);

        if (toggleResult.isSuccess) {
            toast.success('Chuyển trạng thái thành công.');
            dispatch(triggerUpdateLessons());
        } else toast.error('Chuyển trạng thái thất bại.');
    };
    const handleDelete = async () => {
        if (!confirm('Tất cả slides liên quan đều sẽ bị mất. Xác nhận xoá bài học?')) return;

        const deleteResult = await lessonServices.deleteLesson(lesson.id);

        if (deleteResult.isSuccess) {
            toast.success('Xoá bài học thành công.');
            dispatch(triggerUpdateLessons());
        } else toast.error(`Xoá bài học thất bại. ${deleteResult.errors[0]}`);
    };

    /* Side effects */
    /* Get referenced tour */
    useEffect(() => {
        getTour();
    }, []);

    return (
        <div className='grid grid-cols-12 p-2 odd:bg-gray-100 dark:odd:bg-dark'>
            <div className='col-span-1 pr-1 text-center'>
                <span>{lesson.index}</span>
            </div>
            <Link
                to={`/admin/lessons/edit/${lesson.id}`}
                className='col-span-3 px-1 font-semibold text-blue-500 underline hover:opacity-80'
            >
                {lesson.title}
            </Link>
            <div className='col-span-3 px-1'>
                <p className='line-clamp-4'>{lesson.description}</p>
            </div>
            <div className='col-span-2 px-1 text-center'>
                {lesson.urlPath ? (
                    <img
                        src={`${import.meta.env.VITE_API_ENDPOINT}/${lesson.thumbnailPath}`}
                        alt={lesson.title}
                        className='aspect-video object-center object-cover w-full rounded'
                    />
                ) : (
                    '(Trống)'
                )}
            </div>
            {tour ? (
                <Link
                    to={`/admin/tours/${tour.urlSlug}`}
                    className='col-span-2 px-1 text-center text-blue-500 underline hover:opacity-80'
                >
                    {tour.title}
                </Link>
            ) : (
                <div className='col-span-2 px-1 text-center'>(Trống)</div>
            )}
            <div className='col-span-1 flex flex-col gap-y-2 pl-1'>
                <button
                    type='button'
                    className='py-2 h-fit font-semibold text-white bg-nature-green rounded hover:opacity-80'
                    onClick={handleViewContent}
                >
                    Xem
                </button>
                <button
                    type='button'
                    title='Chuyển trạng thái'
                    className={`py-2 h-fit font-semibold text-white ${lesson.isPublished ? 'bg-blue-400' : 'bg-gray-400'
                        } rounded hover:opacity-80`}
                    onClick={handleTogglePublished}
                >
                    {lesson.isPublished ? 'Công khai' : 'Riêng tư'}
                </button>
                <button
                    type='button'
                    className='py-2 h-fit font-semibold text-white bg-red-400 rounded hover:opacity-80'
                    onClick={handleDelete}
                >
                    Xoá
                </button>
            </div>
        </div>
    );
}
