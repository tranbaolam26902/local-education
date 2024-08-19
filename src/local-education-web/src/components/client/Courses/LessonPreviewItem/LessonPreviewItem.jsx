/* Libraries */
import { Link } from 'react-router-dom';

export default function LessonPreviewItem({ lesson }) {
    return (
        <div className='sticky z-0 top-[9.5rem] lg:top-[11.5rem] flex flex-col gap-y-2 bg-white dark:bg-black rounded-lg'>
            <div className='flex justify-between px-6 py-3 bg-gray-200 dark:bg-dark rounded-lg shadow-inner'>
                <h3 className='flex-1 font-semibold text-md'>
                    Chương {lesson.index}: {lesson.title}
                </h3>
                <div className='flex items-center gap-x-2 h-fit'>
                    {lesson.isVr && (
                        <Link
                            to={`/tours/${lesson.tourSlug}`}
                            className='px-3 font-semibold text-sm text-white bg-blue-400 rounded-full drop-shadow shadow-inner hover:bg-opacity-70 transition duration-300'
                        >
                            VR
                        </Link>
                    )}
                    <span>{lesson.totalSlide} bài học</span>
                </div>
            </div>
            <div className='flex flex-col gap-y-1 divide-y divide-gray-200 dark:divide-gray-800'>
                {lesson.slides.map((slide) => (
                    <div key={slide.id} className='px-6 py-2'>
                        Bài {slide.index}: {slide.title}
                    </div>
                ))}
            </div>
        </div>
    );
}
