/* Libraries */
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Unicons from '@iconscout/react-unicons';

/* Logout */
import { useLogout } from '@hooks/shared';

/* Redux */
import { hideClientMobileNavbar, selectLayout } from '@redux/features/client/layout';
import { selectAuth } from '@redux/features/shared/auth';

/* Components */
import { Modal } from '@components/shared';

export default function MobileNavbar() {
    /* Hooks */
    const dispatch = useDispatch();
    const logout = useLogout();
    const location = useLocation();
    const navigate = useNavigate();

    /* States */
    const layoutSlice = useSelector(selectLayout);
    const auth = useSelector(selectAuth);

    /* Event handlers */
    const handleLogout = async () => {
        const logoutResult = await logout();

        if (logoutResult.isSuccess) navigate('/account/login', { state: { from: location } });
        handleCloseMobileNavbar();
    };
    const handleCloseMobileNavbar = () => {
        dispatch(hideClientMobileNavbar());
    };

    return (
        <Modal show={layoutSlice.isShowMobileNavbar} handleClose={handleCloseMobileNavbar}>
            <nav className='fixed z-20 top-0 left-0 bottom-0 flex flex-col w-96 max-w-[80vw] text-black dark:text-white bg-white dark:bg-black dark:outline outline-1 outline-gray-500'>
                <button
                    type='button'
                    className='self-end flex items-center gap-x-1 mr-4 mt-4 p-2 hover:opacity-70'
                    onClick={handleCloseMobileNavbar}
                >
                    <Unicons.UilTimes size='24' />
                    <span className='font-semibold text-sm'>Đóng</span>
                </button>
                <div className='flex-grow flex flex-col'>
                    <Link
                        to='/'
                        className='block px-8 py-4 font-semibold text-lg hover:bg-gray-200 hover:bg-opacity-80 dark:hover:bg-gray-600'
                        onClick={handleCloseMobileNavbar}
                    >
                        Trang chủ
                    </Link>
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
    );
}
