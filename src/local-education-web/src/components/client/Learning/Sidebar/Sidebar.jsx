/* Libraries */
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as uuid from 'uuid';

/* Redux */
import { selectLearning } from '@redux/features/client/learning';

/* Components */
import LessonItem from '../LessonItem/LessonItem';

export default function Sidebar({ lessons }) {
    /* States */
    const learningSlice = useSelector(selectLearning);

    /* Side effects */
    /* Scroll slide item in sidebar into view */
    useEffect(() => {
        if (learningSlice.currentSlideId === uuid.NIL) return;

        const slideElement = document.getElementById(learningSlice.currentSlideId);
        if (slideElement) slideElement.scrollIntoView({ block: 'center' });
    }, [learningSlice.currentSlideId]);

    return (
        <aside
            className={`absolute z-0 top-0 right-0 ${learningSlice.isShowSidebar ? 'translate-x-0' : 'translate-x-full'
                } bottom-0 flex flex-col w-96 max-w-[80vw] bg-white dark:bg-black shadow outline-1 outline-gray-500 ${learningSlice.isShowSidebar ? 'dark:outline' : ''
                } transition duration-300`}
        >
            <h3 className='sticky z-10 top-0 px-6 py-4 bg-white dark:bg-black font-semibold text-lg'>
                Nội dung khóa học
            </h3>
            <section className='flex-grow overflow-y-auto'>
                {lessons.map((lesson) => (
                    <LessonItem key={lesson.id} lesson={lesson} />
                ))}
            </section>
        </aside>
    );
}
