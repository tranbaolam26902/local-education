/* Libraries */
import React from 'react';
import { easeInOut, motion } from 'framer-motion';

const Fade = React.forwardRef((props, ref) => {
    /* Props */
    const { duration, children, ...passProps } = props;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, transition: { duration, ease: easeInOut } }}
            animate={{ opacity: 1, transition: { duration, ease: easeInOut } }}
            exit={{ opacity: 0, transition: { duration, ease: easeInOut } }}
            {...passProps}
        >
            {children}
        </motion.div>
    );
});

Fade.displayName = 'Fade';
export default Fade;
