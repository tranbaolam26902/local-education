/* Libraries */
import { Outlet } from 'react-router-dom';

/* Components */
import { GoToTop } from '@components/shared';
import Header from './Header';

export default function Layout() {
    return (
        <>
            <Header />
            <Outlet />
            <GoToTop />
        </>
    );
}
