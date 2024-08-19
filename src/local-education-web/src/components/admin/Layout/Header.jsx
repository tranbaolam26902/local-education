/* Libraries */
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as Unicons from '@iconscout/react-unicons';

/* Hooks */
import { useLogout } from '@hooks/shared';

/* Redux */
import { enableFileManagementModal } from '@redux/features/admin/fileManagement';

/* Components */
import { Container, DarkModeSwitcher } from '@components/shared';
import MobileNavbar from './MobileNavbar';

export default function Header() {
    /* Hooks */
    const logout = useLogout();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    /* States */
    const [showMobileNavbar, setShowMobileNavbar] = useState(false);

    /* Event handlers */
    const handleShowFileManagementModal = () => {
        dispatch(enableFileManagementModal());
    };
    const handleShowMobileNavbar = () => {
        setShowMobileNavbar(true);
    };
    const handleCloseMobileNavbar = () => {
        setShowMobileNavbar(false);
    };
    const handleLogout = async () => {
        const logoutResult = await logout();

        if (logoutResult.isSuccess) navigate('/account/login', { state: { from: location } });
    };

    return (
        <header className='sticky top-0 z-40 bg-white shadow-md dark:bg-black dark:text-white dark:outline dark:outline-1 dark:outline-gray-500'>
            <Container className='flex items-center justify-between gap-x-4 h-[3.75rem]'>
                {/* Start: Default navbar */}
                <nav className='flex-grow hidden md:flex items-center justify-between'>
                    <section className='flex items-center gap-x-4'>
                        <Link to='/admin' className='font-semibold hover:opacity-70'>
                            Dashboard
                        </Link>
                        <button
                            type='button'
                            disabled={location.pathname === '/admin/users'} // Prevent clear search params when click multiple times on this link
                            className='font-semibold cursor-pointer hover:opacity-70'
                            onClick={() => {
                                navigate('/admin/users'); // Prevent clear search params when click multiple times on this link
                            }}
                        >
                            Tài khoản
                        </button>
                        <button
                            type='button'
                            disabled={location.pathname === '/admin/tours'} // Prevent clear search params when click multiple times on this link
                            className='font-semibold cursor-pointer hover:opacity-70'
                            onClick={() => {
                                navigate('/admin/tours'); // Prevent clear search params when click multiple times on this link
                            }}
                        >
                            Tours
                        </button>
                        <button
                            type='button'
                            disabled={location.pathname === '/admin/courses'} // Prevent clear search params when click multiple times on this link
                            className='font-semibold cursor-pointer hover:opacity-70'
                            onClick={() => {
                                navigate('/admin/courses'); // Prevent clear search params when click multiple times on this link
                            }}
                        >
                            Khoá học
                        </button>
                        <button
                            type='button'
                            disabled={location.pathname === '/admin/lessons'} // Prevent clear search params when click multiple times on this link
                            className='font-semibold cursor-pointer hover:opacity-70'
                            onClick={() => {
                                navigate('/admin/lessons'); // Prevent clear search params when click multiple times on this link
                            }}
                        >
                            Chương
                        </button>
                        <button
                            type='button'
                            disabled={location.pathname === '/admin/slides'} // Prevent clear search params when click multiple times on this link
                            className='font-semibold cursor-pointer hover:opacity-70'
                            onClick={() => {
                                navigate('/admin/slides'); // Prevent clear search params when click multiple times on this link
                            }}
                        >
                            Bài học
                        </button>
                    </section>
                    <section className='flex items-center gap-x-4'>
                        <button
                            type='button'
                            className='font-semibold hover:opacity-70'
                            onClick={handleShowFileManagementModal}
                        >
                            Media
                        </button>
                        <button
                            type='button'
                            onClick={handleLogout}
                            className='font-semibold text-red-400 hover:opacity-70'
                        >
                            Đăng xuất
                        </button>
                    </section>
                </nav>
                {/* End: Default navbar */}

                {/* Start: Mobile navbar */}
                <button type='button' className='md:hidden' onClick={handleShowMobileNavbar}>
                    <Unicons.UilBars size='32' />
                </button>
                <MobileNavbar show={showMobileNavbar} handleClose={handleCloseMobileNavbar} />
                {/* End: Mobile navbar */}
                <DarkModeSwitcher />
            </Container>
        </header>
    );
}
