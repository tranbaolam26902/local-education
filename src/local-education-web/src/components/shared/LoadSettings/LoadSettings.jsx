/* Libraries */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* Redux */
import { loadSettings, selectSettings } from '@redux/features/shared/settings';

export default function LoadSettings() {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const settings = useSelector(selectSettings);

    /* Side effects */
    useEffect(() => {
        dispatch(loadSettings());
    }, [dispatch, settings]);

    return (
        <>
            <Outlet />
            <ToastContainer
                autoClose={4000}
                pauseOnFocusLoss={false}
                limit={4}
                draggablePercent={60}
                position='top-right'
            />
        </>
    );
}
