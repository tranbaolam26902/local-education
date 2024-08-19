/* Libraries */
import { Link } from 'react-router-dom';

export default function Button({
    to,
    submit,
    accent,
    secondary,
    outline,
    disabled,
    full,
    className,
    children,
    onClick,
    ...passProps
}) {
    let Component = 'button';
    const props = {
        type: submit ? 'submit' : 'button',
        onClick,
        ...passProps
    };
    const styles = {
        accent: ' text-black bg-accent',
        secondary: ' text-primary bg-black',
        outline: ' text-black border border-1 border-black',
        disabled: ' opacity-50 cursor-default hover:opacity-50',
        full: ' w-full'
    };

    /* Replace 'button' with Link when 'to' is defined */
    if (to) {
        props.to = to;
        Component = Link;
    }
    /* Disable all events when 'disabled' is defined */
    if (disabled) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
        delete props.type;
        delete props.to;
        Component = 'div';
    }

    return (
        <Component
            className={`px-5 py-4 font-semibold text-center transition duration-200 select-none${accent ? styles.accent : ''
                }${secondary ? styles.secondary : ''}${outline ? styles.outline : ''}${disabled ? styles.disabled : ' hover:opacity-80'
                }${full ? styles.full : ''}${className ? ' ' + className : ''}`}
            {...props}
        >
            {children}
        </Component>
    );
}
