/* Libraries */
import { Link } from 'react-router-dom';

export default function CourseItem({ course }) {
    return (
        <div className='flex flex-col gap-x-8 gap-y-4 rounded-xl bg-gray-100 p-4 shadow-inner drop-shadow dark:bg-dark lg:flex-row lg:p-8 lg:even:flex-row-reverse'>
            <Link
                to={`/courses/${course.urlSlug}`}
                className='group/image relative flex-1 overflow-hidden rounded-lg shadow-inner drop-shadow-lg'
            >
                <img
                    src={`${import.meta.env.VITE_API_ENDPOINT}/${course.urlPath}`}
                    alt={course.title}
                    className='aspect-video w-full object-cover object-center transition duration-300 group-hover/image:scale-105 group-hover/image:blur-sm'
                />
                <div className='absolute bottom-4 left-4 right-4 rounded-lg border-2 border-white/20 bg-black/40 p-2 text-white drop-shadow-lg transition duration-300 group-hover/image:backdrop-blur md:p-4'>
                    <h2 title={course.title} className='relative z-10 line-clamp-1 text-lg font-bold xl:text-xl'>
                        {course.title}
                    </h2>
                </div>
            </Link>
            <div className='flex flex-1 flex-col gap-y-4'>
                <div className='flex-grow'>
                    <p className='line-clamp-4 text-lg italic text-neutral-600 dark:text-neutral-300 lg:line-clamp-6'>
                        {course.description}
                    </p>
                </div>
                <div className='flex items-center justify-between text-sm font-semibold uppercase'>
                    <span className='font-bold opacity-0'>{course.totalLesson} Chương</span>
                    <Link
                        to={`/courses/${course.urlSlug}`}
                        className='rounded-xl bg-black px-4 py-2 text-xs font-bold text-white transition duration-300 hover:bg-opacity-70 dark:bg-white dark:text-black dark:hover:bg-gray-200'
                    >
                        Xem chi tiết
                    </Link>
                </div>
            </div>
        </div>
    );
}
