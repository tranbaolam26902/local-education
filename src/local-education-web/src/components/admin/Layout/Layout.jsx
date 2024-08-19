/* Libraries */
import { Outlet } from 'react-router-dom';

/* Components */
import { FileManagementModal } from '@components/admin';
import Header from './Header';

export default function Layout() {
    return (
        <>
            <Header />
            <Outlet />
            <FileManagementModal />
        </>
    );
}
