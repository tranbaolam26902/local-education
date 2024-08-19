/* Libraries */
import React, { useState } from 'react';

/* Assets */
import { icons } from '@assets/icons';

const Input = React.forwardRef((props, ref) => {
    /* Props */
    const { id, label, type, optional, message, className, onFocus, onBlur, ...passProps } = props;

    /* States */
    const [showPassword, setShowPassword] = useState(false);
    const [showRevealButton, setShowRevealButton] = useState(false);

    /* Event handlers */
    const handleFocusInput = () => {
        setShowRevealButton(true);
        if (onFocus) onFocus();
    };
    const handleBlurInput = () => {
        setShowRevealButton(false);
        if (onBlur) onBlur();
    };
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleMouseDownButtonReveal = (e) => {
        e.preventDefault(); /* Prevent from hiding the reveal password button when clicking on it */
    };

    return (
        <div className='flex-1 relative flex flex-col'>
            <div>
                {label && (
                    <label htmlFor={id} className='text-sm mr-1 w-fit cursor-pointer select-none'>
                        {label}
                    </label>
                )}
                {label && optional && <span className='text-sm text-secondary/50 italic'>(không bắt buộc)</span>}
            </div>
            <div className='relative'>
                <input
                    ref={ref}
                    id={id}
                    type={type === 'password' && showPassword ? 'text' : type ? type : 'text'}
                    className={`${type === 'password' ? 'pr-10 ' : ''}
                        ${message ? 'border-red ' : ''
                        }px-4 py-5 w-full text-white bg-nature-green transition-all duration-200 placeholder:text-white${className ? ' ' + className : ''
                        }`
                        .replace(/\s+/g, ' ')
                        .trim()}
                    onFocus={type === 'password' ? handleFocusInput : onFocus ? onFocus : () => { }}
                    onBlur={type === 'password' ? handleBlurInput : onBlur ? onBlur : () => { }}
                    {...passProps}
                />
                {type === 'password' && showRevealButton && (
                    <img
                        src={showPassword ? icons.eyeSlash : icons.eye}
                        alt='icon'
                        className='absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer'
                        onClick={handleShowPassword}
                        onMouseDown={handleMouseDownButtonReveal}
                    />
                )}
            </div>
            {message && <span className='text-sm text-red-600'>{message}</span>}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
