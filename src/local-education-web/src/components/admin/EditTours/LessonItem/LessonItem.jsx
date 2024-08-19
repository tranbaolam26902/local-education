/* Libraries */
import * as Unicons from '@iconscout/react-unicons';
import { useDispatch, useSelector } from 'react-redux';

/* Redux */
import { selectEditTour, setCurrentDestinationLessonId } from '@redux/features/admin/editTour';

export default function LessonItem({ lesson, isUsed }) {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const editTour = useSelector(selectEditTour);

    /* Event handlers */
    const handleSelectLesson = () => {
        if (isUsed) return;
        dispatch(setCurrentDestinationLessonId(lesson.id));
    };

    return (
        <div
            className={`relative cursor-pointer ${editTour.currentDestinationLessonId === lesson.id &&
                'outline outline-4 -outline-offset-4 outline-nature-green'
                } rounded`}
            role='button'
            onClick={handleSelectLesson}
        >
            {lesson.urlPath ? (
                <img
                    src={`${import.meta.env.VITE_API_ENDPOINT}/${lesson.urlPath}`}
                    alt={lesson.title}
                    className='aspect-video object-center object-cover rounded'
                />
            ) : (
                <div className='flex items-center justify-center aspect-video bg-gray-200 dark:bg-gray-400 rounded'>
                    <Unicons.UilImage size='80' className='text-gray-400 dark:text-gray-500 drop-shadow' />
                </div>
            )}
            <div className='absolute left-2 right-2 bottom-2 flex items-center gap-x-1 px-4 h-8 bg-black/40 rounded-full cursor-default'>
                {editTour.currentDestinationLessonId === lesson.id && (
                    <span className='-ml-2 px-1.5 py-px text-xs bg-nature-green text-white rounded-full drop-shadow'>
                        Đã chọn
                    </span>
                )}
                <h6 className='flex-1 inline-block text-white truncate line-clamp-1'>{lesson.title}</h6>
            </div>
            {isUsed && editTour.currentDestinationLessonId !== lesson.id && (
                <div className='absolute inset-0 flex items-center justify-center font-semibold text-lg text-red-400 bg-black bg-opacity-60 rounded cursor-not-allowed outline outline-1 outline-white'>
                    Đã được sử dụng
                </div>
            )}
        </div>
    );
}
