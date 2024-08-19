/* Libraries */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Unicons from '@iconscout/react-unicons';

/* Redux */
import { selectLearning } from '@redux/features/client/learning';
import { selectAuth } from '@redux/features/shared/auth';

/* Components */
import { DarkModeSwitcher } from '@components/shared';

export default function Header({ course }) {
    /* Hooks */
    const navigate = useNavigate();

    /* States */
    const auth = useSelector(selectAuth);
    const learningSlice = useSelector(selectLearning);
    const [percentage, setPercentage] = useState(0);

    /* Event handlers */
    const handleGoBack = () => {
        if (window.history.length > 2) navigate(-1);
        else navigate('/');
    };

    /* Side effects */
    /* Get course complete percentage if user is logged in */
    useEffect(() => {
        if (
            !learningSlice.progress ||
            learningSlice.progress.completed === null ||
            learningSlice.progress.completed === undefined
        )
            return;
        setPercentage(Math.round(learningSlice.progress.completed));
    }, [learningSlice.progress]);

    return (
        <header className='absolute z-10 top-0 left-0 right-0 h-[3.75rem] flex bg-white dark:bg-black dark:outline dark:outline-1 dark:outline-gray-500 shadow'>
            <button
                type='button'
                title='Quay lại'
                className='flex items-center justify-center h-full aspect-square hover:animate-float-left'
                onClick={handleGoBack}
            >
                <Unicons.UilAngleLeft size='32' />
            </button>
            <section className='flex-grow flex items-center justify-between gap-x-4'>
                <h1 className='flex-1 font-semibold text-lg line-clamp-1'>{course.title}</h1>
                <div className='flex items-center gap-x-4 mr-6'>
                    {auth.accessToken && (
                        <div className='flex items-center gap-x-2'>
                            <span className='hidden sm:inline-flex text-sm'>Hoàn thành</span>
                            <div className='relative overflow-hidden w-10 aspect-square bg-nature-green rounded-full'>
                                <span
                                    className='absolute inset-0 bg-gray-300'
                                    style={{ bottom: `${percentage}%` }}
                                ></span>
                                <span className='absolute inset-1.5 flex items-center justify-center font-semibold text-xs bg-white dark:bg-black rounded-full'>
                                    {percentage}
                                </span>
                            </div>
                        </div>
                    )}
                    <DarkModeSwitcher />
                </div>
            </section>
        </header>
    );
}
