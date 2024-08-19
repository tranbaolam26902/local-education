/* Libraries */
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

/* Assets */
import { images } from '@assets/images';

/* Hooks */
import { useLogin } from '@hooks/shared';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { Button, Input, PageTransition } from '@components/shared';

export default function Login() {
    /* Hooks */
    const login = useLogin();
    const navigate = useNavigate();
    const location = useLocation();

    /* States */
    const [errorMessages, setErrorMessages] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    /* Functions */
    const setPageTitle = () => {
        document.title = getSubPageTitle('Đăng nhập');
    };

    /* Event handlers */
    const handleLogin = async (e) => {
        e.preventDefault();

        const loginResult = await login(username, password);

        if (loginResult.isSuccess) {
            let from = location.state?.from?.pathname;
            if (from === '/account/login' || from === '/account/sign-up' || !from) from = '/'; // Get location before login to restore after login. If it doesn't exist, navigate user to home page after login

            navigate(from, { replace: true });
        } else setErrorMessages(loginResult.errors);
    };

    /* Side effects */
    /* Init component side effects */
    useEffect(() => {
        setPageTitle();
    }, []);

    return (
        <PageTransition className='fixed inset-0 flex flex-col items-center justify-center px-6 h-[100svh] bg-light-yellow'>
            <img
                src={images.loginBackgroundPattern}
                alt='back-ground-pattern'
                className='absolute bottom-0 -z-10 w-full object-cover'
            />
            <h1 className='mb-16 text-4xl md:text-5xl lg:text-[4rem] font-semibold text-nature-green capitalize'>
                Đăng nhập
            </h1>
            {errorMessages.map((errorMessage, index) => (
                <span key={index} className='mb-4 text-red-600'>
                    {errorMessage}
                </span>
            ))}
            <form className='flex flex-col gap-8 w-full max-w-3xl' onSubmit={handleLogin}>
                <div className='flex flex-col gap-3'>
                    <Input
                        autoFocus
                        placeholder='Tài khoản'
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    />
                    <Input
                        type='password'
                        placeholder='Mật khẩu'
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                </div>
                <Button
                    type='submit'
                    disabled={username.trim() === '' || password.trim() === ''}
                    className='py-4 w-full bg-brown text-center font-semibold text-white'
                >
                    Đăng nhập
                </Button>
            </form>
            <div className='flex gap-4 mt-9'>
                <Link to='/account/sign-up' className='text-sm text-botega-green'>
                    Đăng ký tài khoản
                </Link>
                <Link className='text-sm text-botega-green'>Quên mật khẩu?</Link>
            </div>
        </PageTransition>
    );
}
