/* Libraries */
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { PageTransition } from '@components/shared';

export default function NotFound() {
    /* States */
    const errorCode = '404';
    const digits = '0123456789';

    /* Refs */
    const errorCodeRef = useRef(null);

    /* Functions */
    const randomTextEffect = () => {
        let iteration = 0;

        const interval = setInterval(() => {
            if (!errorCodeRef.current) return;
            errorCodeRef.current.innerText = errorCodeRef.current.innerText
                .split('')
                .map((_, index) => {
                    if (index < iteration) {
                        return errorCode[index];
                    }

                    return digits[Math.floor(Math.random() * digits.length)];
                })
                .join('');

            if (iteration >= errorCode.length) {
                clearInterval(interval);
            }

            iteration += 1 / 8;
        }, 40);
    };
    const setPageTitle = () => {
        document.title = getSubPageTitle('404 - Không tìm thấy trang');
    };

    /* Side effects */
    /* Init component side effects */
    useEffect(() => {
        randomTextEffect();
        setPageTitle();
    }, []);

    return (
        <PageTransition className='fixed inset-0 z-50 flex flex-col items-center pt-40 font-mono text-center px-6 md:px-10 w-screen h-[100svh] bg-white dark:bg-black dark:text-white'>
            <p ref={errorCodeRef} className='text-9xl font-bold text-gray'>
                {errorCode}
            </p>
            <p className='mb-12 text-xl md:text-2xl font-bold uppercase'>Trang không tồn tại.</p>
            <Link
                to='/'
                className='flex items-center justify-center gap-1 px-4 py-2 w-fit font-semibold text-2xl text-white bg-nature-green rounded drop-shadow hover:opacity-80'
            >
                Quay về trang chủ
            </Link>
        </PageTransition>
    );
}
