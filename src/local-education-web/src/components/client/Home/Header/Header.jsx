/* Libraries */
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Unicons from '@iconscout/react-unicons';

/* Hooks */
import { useLogout } from '@hooks/shared';

/* Redux */
import { selectAuth } from '@redux/features/shared/auth';

/* Components */
import { DarkModeSwitcher, Modal } from '@components/shared';

export default function Header() {
    /* Hooks */
    const logout = useLogout();
    const location = useLocation();
    const navigate = useNavigate();

    /* States */
    const auth = useSelector(selectAuth);
    const [showMobileNavbar, setShowMobileNavbar] = useState(false);

    /* Event handlers */
    const handleLogout = async () => {
        const logoutResult = await logout();

        if (logoutResult.isSuccess) navigate('/account/login', { state: { from: location } });
        handleCloseMobileNavbar();
    };
    const handleShowMobileNavbar = () => {
        setShowMobileNavbar(true);
    };
    const handleCloseMobileNavbar = () => {
        setShowMobileNavbar(false);
    };

    return (
        <header className='w-full'>
            <nav className='flex items-center justify-between gap-x-4 py-4 w-full text-white'>
                <div className='flex-1'>
                    <Link to='/' className='font-bold font-serif text-3xl md:text-4xl'>
                        DLU
                    </Link>
                </div>

                {/* Start: Desktop navbar section */}
                <div className='hidden md:flex items-center gap-x-4'>
                    <a href='#about' className='font-semibold uppercase'>
                        Giới thiệu
                    </a>
                    <Link to='/courses' className='font-semibold uppercase'>
                        Khóa học
                    </Link>
                    <Link to='/tours' className='font-semibold uppercase'>
                        Tour
                    </Link>
                </div>
                <div className='flex-1 hidden md:flex items-center justify-end gap-x-4'>
                    {auth.accessToken ? (
                        <Link to='/account/profile' className='font-semibold uppercase'>
                            Tài khoản
                        </Link>
                    ) : (
                        <>
                            <Link to='/account/login' className='font-semibold uppercase'>
                                Đăng nhập
                            </Link>
                            <Link to='/account/sign-up' className='font-semibold uppercase'>
                                Đăng ký
                            </Link>
                        </>
                    )}
                    <DarkModeSwitcher />
                </div>
                {/* End: Desktop navbar section */}

                {/* Start: Mobile navbar section */}
                <div className='md:hidden flex items-center gap-x-4'>
                    <DarkModeSwitcher />
                    <button type='button' onClick={handleShowMobileNavbar}>
                        <Unicons.UilBars size='32' />
                    </button>
                </div>
                <Modal show={showMobileNavbar} handleClose={handleCloseMobileNavbar}>
                    <nav className='fixed top-0 left-0 bottom-0 flex flex-col w-96 max-w-[80vw] text-black dark:text-white bg-white dark:bg-black dark:outline outline-1 outline-gray-500'>
                        <button
                            type='button'
                            className='self-end flex items-center gap-x-1 mr-4 mt-4 p-2 hover:opacity-70'
                            onClick={handleCloseMobileNavbar}
                        >
                            <Unicons.UilTimes size='24' />
                            <span className='font-semibold text-sm'>Đóng</span>
                        </button>
                        <div className='flex-grow flex flex-col'>
                            <a
                                href='#about'
                                className='block px-8 py-4 font-semibold text-lg hover:bg-gray-200 hover:bg-opacity-80 dark:hover:bg-gray-600'
                                onClick={handleCloseMobileNavbar}
                            >
                                Giới thiệu
                            </a>
                            <Link
                                to='/courses'
                                className='block px-8 py-4 font-semibold text-lg hover:bg-gray-200 hover:bg-opacity-80 dark:hover:bg-gray-600'
                                onClick={handleCloseMobileNavbar}
                            >
                                Khóa học
                            </Link>
                            <Link
                                to='/tours'
                                className='block px-8 py-4 font-semibold text-lg hover:bg-gray-200 hover:bg-opacity-80 dark:hover:bg-gray-600'
                                onClick={handleCloseMobileNavbar}
                            >
                                Tour
                            </Link>
                            {auth.accessToken ? (
                                <Link
                                    to='/account/profile'
                                    className='block px-8 py-4 font-semibold text-lg hover:bg-gray-200 hover:bg-opacity-80 dark:hover:bg-gray-600'
                                    onClick={handleCloseMobileNavbar}
                                >
                                    Tài khoản
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to='/account/login'
                                        className='block px-8 py-4 font-semibold text-lg hover:bg-gray-200 hover:bg-opacity-80 dark:hover:bg-gray-600'
                                        onClick={handleCloseMobileNavbar}
                                    >
                                        Đăng nhập
                                    </Link>
                                    <Link
                                        to='/account/sign-up'
                                        className='block px-8 py-4 font-semibold text-lg hover:bg-gray-200 hover:bg-opacity-80 dark:hover:bg-gray-600'
                                        onClick={handleCloseMobileNavbar}
                                    >
                                        Đăng ký
                                    </Link>
                                </>
                            )}
                        </div>
                        {auth.accessToken && (
                            <button
                                type='button'
                                onClick={handleLogout}
                                className='block px-8 py-4 font-semibold text-left text-lg text-red-400 hover:bg-gray-200 hover:bg-opacity-80 dark:hover:bg-gray-600'
                            >
                                Đăng xuất
                            </button>
                        )}
                    </nav>
                </Modal>
                {/* End: Mobile navbar section */}
            </nav>
        </header>
    );
}
