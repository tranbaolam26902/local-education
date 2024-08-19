/* Libraries */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/* Assets */
import { images } from '@assets/images';

/* Hooks */
import { useLogin } from '@hooks/shared';

/* Services */
import { axios } from '@services/shared';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { Button, Input, PageTransition } from '@components/shared';

export default function SignUp() {
    /* Hooks */
    const login = useLogin();
    const navigate = useNavigate();

    /* States */
    const [errorMessages, setErrorMessages] = useState([]);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');
    const [email, setEmail] = useState('');
    const [emailMessage, setEmailMessage] = useState('');

    /* Functions */
    const validatePassword = () => {
        if (password.trim() === '' || confirmPassword.trim() === '') return;

        if (password !== confirmPassword) {
            setConfirmPasswordMessage('Mật khẩu và Xác nhận mật khẩu không trùng khớp.');
            return false;
        }

        return true;
    };
    const validateEmail = () => {
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            setEmailMessage('Email không đúng định dạng.');
            return false;
        }

        return true;
    };
    const validateSignUp = () => {
        if (!validatePassword() || !validateEmail()) return false;

        return true;
    };
    const signUp = async () => {
        const { data } = await axios.post('/api/users/register', {
            name,
            email,
            password,
            username
        });

        return data;
    };
    const setPageTitle = () => {
        document.title = getSubPageTitle('Đăng ký');
    };

    /* Event handlers */
    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!validateSignUp()) return;

        const signUpResult = await signUp();

        if (signUpResult.isSuccess) {
            await login(username, password);
            navigate('/');
        } else setErrorMessages(signUpResult.errors);
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
                className='absolute bottom-0 -z-10 w-full min-h-[111px] object-cover'
            />
            <h1 className='mb-16 text-4xl md:text-5xl lg:text-[4rem] font-semibold text-nature-green capitalize'>
                Đăng ký
            </h1>
            {errorMessages.map((errorMessage, index) => (
                <span key={index} className='mb-4 text-red-600'>
                    {errorMessage}
                </span>
            ))}
            <form className='flex flex-col gap-8 w-full max-w-3xl' onSubmit={handleSignUp}>
                <div className='flex flex-col gap-3'>
                    <Input
                        autoFocus
                        placeholder='Họ và tên'
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                    <Input
                        type='email'
                        placeholder='Email'
                        value={email}
                        message={emailMessage}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailMessage('');
                        }}
                        onBlur={validateEmail}
                    />
                    <Input
                        placeholder='Tài khoản'
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    />
                    <Input
                        type='password'
                        placeholder='Mật khẩu'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setConfirmPasswordMessage('');
                        }}
                        onBlur={validatePassword}
                    />
                    <Input
                        type='password'
                        placeholder='Xác nhận mật khẩu'
                        value={confirmPassword}
                        message={confirmPasswordMessage}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setConfirmPasswordMessage('');
                        }}
                        onBlur={validatePassword}
                    />
                </div>
                <Button
                    type='submit'
                    disabled={
                        name.trim() === '' ||
                        username.trim() === '' ||
                        password.trim() === '' ||
                        confirmPassword.trim() === '' ||
                        password !== confirmPassword ||
                        email.trim() === '' ||
                        !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)
                    }
                    className='py-4 w-full bg-brown text-center font-semibold text-white'
                >
                    Đăng ký
                </Button>
            </form>
            <Link to='/account/login' className='mt-9 text-sm text-botega-green'>
                Đăng nhập
            </Link>
        </PageTransition>
    );
}
