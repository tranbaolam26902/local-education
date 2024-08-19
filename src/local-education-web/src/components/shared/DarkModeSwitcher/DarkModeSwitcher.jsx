/* Libraries */
import { useDispatch, useSelector } from 'react-redux';

/* Assets */
import { icons } from '@assets/icons';

/* Redux */
import { saveSettings, selectSettings, toggleDarkMode } from '@redux/features/shared/settings';

export default function DarkModeSwitcher() {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const settings = useSelector(selectSettings);

    /* Event handlers */
    const handleToggleDarkMode = (e) => {
        e.stopPropagation();
        dispatch(toggleDarkMode());
        dispatch(saveSettings());
    };

    return (
        <div
            className='relative w-14 h-8 bg-gray-50 dark:bg-gray-600 rounded-full cursor-pointer shadow-inner drop-shadow'
            onClick={handleToggleDarkMode}
        >
            <input type='checkbox' hidden value={settings.darkMode} />
            <img
                src={icons.moon}
                alt='moon'
                className='absolute top-1/2 left-2 w-4 -translate-y-1/2 select-none drop-shadow'
            />
            <img
                src={icons.sun}
                alt='sun'
                className='absolute top-1/2 right-2 w-4 -translate-y-1/2 select-none drop-shadow'
            />
            <span
                className={`absolute top-1 left-1 bottom-1 dark:translate-x-full aspect-square bg-gray-600 dark:bg-gray-50 rounded-full shadow-inner drop-shadow transition duration-200`}
            ></span>
        </div>
    );
}
