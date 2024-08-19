/* Libraries */
import { useEffect, useState } from 'react';
import * as Unicons from '@iconscout/react-unicons';
import { AnimatePresence, easeInOut, motion } from 'framer-motion';

export default function GoToTop() {
    /* States */
    const [show, setShow] = useState(false);

    /* Event handlers */
    const handleScrollToTop = () => {
        window.scrollTo(0, 0);
    };
    const handleShowScrollButton = () => {
        if (window.scrollY > 200) setShow(true);
        else setShow(false);
    };

    /* Side effects */
    useEffect(() => {
        window.addEventListener('scroll', handleShowScrollButton);

        return () => {
            window.removeEventListener('scroll', handleShowScrollButton);
        };
    }, []);
    return (
        <AnimatePresence>
            {show && (
                <motion.button
                    initial={{ opacity: 0, transition: { duration: 0.2, ease: easeInOut } }}
                    animate={{ opacity: 1, transition: { duration: 0.2, ease: easeInOut } }}
                    exit={{ opacity: 0, transition: { duration: 0.2, ease: easeInOut } }}
                    type='button'
                    className='fixed bottom-6 md:bottom-6 right-6 p-3 aspect-square bg-white dark:bg-black border border-gray-300 rounded-lg drop-shadow shadow-inner hover:animate-float'
                    onClick={handleScrollToTop}
                >
                    <Unicons.UilArrowUp size='32' className='text-black dark:text-white' />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
