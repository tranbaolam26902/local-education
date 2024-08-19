/* Libraries */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

/* Assets */
import { images } from '@assets/images';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { Container, PageTransition } from '@components/shared';

export default function Finished() {
    /* Functions */
    const setPageTitle = () => {
        document.title = getSubPageTitle('Chúc mừng hoàn thành khóa học');
    };

    /* Side effects */
    /* Init component side effects */
    useEffect(() => {
        setPageTitle();
    }, []);

    return (
        <PageTransition>
            <Container className='flex flex-col items-center gap-y-8 py-16 min-h-[calc(100svh-3.75rem)] bg-white dark:bg-black dark:text-white'>
                <img src={images.finishedCourse} alt='finished-course' className='w-4/5 sm:w-auto' />
                <h1 className='font-semibold text-2xl text-center'>
                    Chúc mừng
                    <br className='inline sm:hidden' /> bạn đã hoàn thành khóa học!
                </h1>
                <Link
                    to='/courses'
                    className='px-8 py-3 font-semibold text-lg text-white uppercase bg-gradient-to-br from-light-green via-nature-green to-nature-green rounded-full shadow-lg hover:opacity-70 transition duration-300'
                >
                    Khám phá khóa học khác
                </Link>
            </Container>
        </PageTransition>
    );
}
