/* Libraries */
import React from 'react';
import * as Unicons from '@iconscout/react-unicons';

const Input = React.forwardRef((props, ref) => {
    /* Props */
    const { id, type, label, message, placeholder, value, defaultValue, onChange, rightIcon, autoFocus, clearInput, disabled } = props;

    /* Event handlers */
    const handleClearInput = () => {
        clearInput();
        ref.current.focus();
    };

    return (
        <div className='relative flex flex-col gap-y-1 w-full'>
            {label && (
                <label htmlFor={id} className='cursor-pointer w-fit font-semibold'>
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                ref={ref}
                value={value}
                defaultValue={defaultValue}
                autoFocus={autoFocus}
                disabled={disabled}
                placeholder={placeholder}
                className={`px-4 py-2${clearInput && value !== '' ? ' pr-12 ' : ' '}w-full border ${message ? 'border-red-400' : 'border-gray-400'
                    } ${disabled ? 'border-transparent' : ''} rounded shadow-inner dark:bg-dark`}
                onChange={onChange}
            />
            {message && <span className='italic text-red-400'>{message}</span>}
            {clearInput && value !== '' && (
                <button
                    type='button'
                    tabIndex={-1}
                    className='absolute bottom-px right-4 -translate-y-1/2'
                    onClick={handleClearInput}
                >
                    <Unicons.UilTimesCircle size='20' />
                </button>
            )}
            {rightIcon && value === '' && <div className='absolute top-1/2 right-4 -translate-y-1/2'>{rightIcon}</div>}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
