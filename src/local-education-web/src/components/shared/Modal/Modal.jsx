/* Libraries */
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

/* Components */
import { Fade } from '@components/shared';

export default function Modal({ show, handleClose, children }) {
    /* Side effects */
    /* Prevent scrolling when modal is opened */
    useEffect(() => {
        if (show) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
    }, [show]);

    return (
        <AnimatePresence>
            {show && (
                <Fade
                    duration={0.2}
                    className='fixed z-50 top-0 left-0 flex items-center justify-center w-screen h-[100dvh]'
                >
                    <div
                        className='absolute inset-0 bg-black/30 dark:bg-black/40 cursor-pointer'
                        onClick={handleClose}
                    ></div>
                    <div className='relative z-10'>{children}</div>
                </Fade>
            )}
        </AnimatePresence>
    );
}
