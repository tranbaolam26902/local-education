/* Libraries */
import { Link } from 'react-router-dom';

export default function CourseItem({ course }) {
    return (
        <div className='flex flex-col lg:flex-row lg:even:flex-row-reverse gap-x-8 gap-y-4 p-4 lg:p-8 bg-gray-100 dark:bg-dark rounded-xl drop-shadow shadow-inner'>
            <Link
                to={`/courses/${course.urlSlug}`}
                className='flex-1 relative overflow-hidden rounded-lg drop-shadow-lg shadow-inner group/image'
            >
                <img
                    src={`${import.meta.env.VITE_API_ENDPOINT}/${course.urlPath}`}
                    alt={course.title}
                    className='w-full aspect-video object-center object-cover group-hover/image:scale-105 group-hover/image:blur-sm transition duration-300'
                />
                <div className='absolute left-4 right-4 bottom-4 p-2 md:p-4 text-white bg-black/40 border-2 border-white/20 rounded-lg drop-shadow-lg group-hover/image:backdrop-blur transition duration-300'>
                    <h2 title={course.title} className='relative z-10 font-bold text-lg xl:text-xl line-clamp-1'>
                        {course.title}
                    </h2>
                </div>
            </Link>
            <div className='flex-1 flex flex-col gap-y-4'>
                <div className='flex-grow'>
                    <p className='text-lg text-neutral-600 dark:text-neutral-300 line-clamp-4 lg:line-clamp-6 italic'>
                        {course.description}
                    </p>
                </div>
                <div className='flex items-center justify-between font-semibold text-sm uppercase'>
                    <span className='font-bold'>{course.totalLesson} Chương</span>
                    <Link
                        to={`/courses/${course.urlSlug}`}
                        className='px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold hover:bg-opacity-70 dark:hover:bg-gray-200 transition duration-300'
                    >
                        Xem chi tiết
                    </Link>
                </div>
            </div>
        </div>
    );
}
