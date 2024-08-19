/* Libraries */
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as Unicons from '@iconscout/react-unicons';

/* Assets */
import { images } from '@assets/images';

/* Assets */
import { useLogout } from '@hooks/shared';

/* Redux */
import { showClientMobileNavbar } from '@redux/features/client/layout';
import { selectAuth } from '@redux/features/shared/auth';

/* Components */
import { Container, DarkModeSwitcher } from '@components/shared';
import MobileNavbar from './MobileNavbar';

export default function Header() {
    /* Hooks */
    const logout = useLogout();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    /* States */
    const auth = useSelector(selectAuth);

    /* Event handlers */
    const handleGoBack = () => {
        if (window.history.length > 2) navigate(-1);
        else navigate('/');
    };
    const handleShowMobileNavbar = () => {
        dispatch(showClientMobileNavbar());
    };
    const handleLogout = async () => {
        const logoutResult = await logout();

        if (logoutResult.isSuccess) navigate('/account/login', { state: { from: location } });
    };

    /* Side effects */
    useEffect(() => {
        window.addEventListener('load', function() {
            setTimeout(function() {
                // This hides the address bar:
                window.scrollTo(0, 1);
            }, 0);
        });
    }, []);

    return (
        <header className='sticky top-0 z-20 bg-white shadow-md dark:bg-black dark:text-white dark:outline dark:outline-1 dark:outline-gray-500'>
            <Container className='flex items-center justify-between gap-x-4 h-[3.75rem]'>
                <section className='lg:flex-1 flex items-center gap-x-2'>
                    <Link to='/'>
                        <img src={images.logo} alt='logo' className='w-10' />
                    </Link>
                    <button type='button' className='flex items-center hover:animate-float-left' onClick={handleGoBack}>
                        <Unicons.UilAngleLeft size='24' />
                        <span className='font-semibold text-sm'>Quay lại</span>
                    </button>
                </section>
                <section className='hidden md:flex items-center gap-x-4'>
                    <Link to='/' className='font-semibold hover:opacity-70'>
                        Trang chủ
                    </Link>
                    <Link to='/courses' className='font-semibold hover:opacity-70'>
                        Khóa học
                    </Link>
                    <Link to='/tours' className='font-semibold hover:opacity-70'>
                        Tour
                    </Link>
                </section>
                <section className='flex-1 hidden md:flex items-center justify-end gap-x-2'>
                    {auth.accessToken ? (
                        <div className='flex items-center gap-x-4'>
                            <Link to='/account/profile' className='font-semibold hover:opacity-70'>
                                Trang cá nhân
                            </Link>
                            <button
                                type='button'
                                onClick={handleLogout}
                                className='font-semibold text-red-400 hover:opacity-70'
                            >
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <div className='flex items-center gap-x-4'>
                            <Link
                                to='/account/login'
                                state={{ from: location }}
                                className='font-semibold hover:opacity-70'
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to='/account/sign-up'
                                className='px-5 py-1.5 font-semibold text-white bg-gradient-to-tl from-nature-green via-nature-green to-light-green rounded-full drop-shadow shadow-inner hover:opacity-80'
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}
                    <DarkModeSwitcher />
                </section>
                <div className='md:hidden flex items-center gap-x-2'>
                    <DarkModeSwitcher />
                    <button type='button' onClick={handleShowMobileNavbar}>
                        <Unicons.UilBars size='32' />
                    </button>
                </div>
            </Container>
            <MobileNavbar />
        </header>
    );
}
