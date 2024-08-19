/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/* Services */
import { axios } from '@services/shared';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { Input } from '@components/admin';
import { Container } from '@components/shared';

export default function AddUser() {
    /* Hooks */
    const navigate = useNavigate();

    /* States */
    const [errorMessages, setErrorMessages] = useState([]);
    const [name, setName] = useState('');
    const [nameMessage, setNameMessage] = useState('');
    const [email, setEmail] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [password, setPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [hasChanged, setHasChanged] = useState(false);

    /* Refs */
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    /* Functions */
    const validateUser = () => {
        let valid = true;

        if (name.trim() === '') {
            setNameMessage('Họ và tên không được để trống');
            valid = false;
        }
        if (email.trim() === '') {
            setEmailMessage('Email không được để trống');
            valid = false;
        }
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            setEmailMessage('Email không đúng định dạng.');
            valid = false;
        }
        if (username.trim() === '') {
            setUsernameMessage('Tài khoản không được để trống');
            valid = false;
        }
        if (password.trim() === '') {
            setPasswordMessage('Mật khẩu không được để trống');
            valid = false;
        }

        return valid;
    };
    const setPageTitle = () => {
        document.title = getSubPageTitle('Thêm tài khoản');
    };

    /* Event handlers */
    const handleGoBack = () => {
        if (hasChanged) if (!confirm('Chưa lưu thay đổi. Xác nhận trở về?')) return;
        navigate(-1);
    };
    const handleSaveUser = async (e) => {
        e.preventDefault();
        if (!validateUser()) return;

        const { data } = await axios.post('/api/users/register', {
            name,
            email,
            password,
            username
        });

        if (data.isSuccess) {
            toast.success('Thêm tài khoản mới thành công');
            navigate(-1);
        } else setErrorMessages(data.errors);
    };

    /* Side effects */
    /* Init component side effects */
    useEffect(() => {
        setPageTitle();
    }, []);

    return (
        <section className='min-h-[calc(100svh-3.75rem)] dark:bg-black dark:text-white'>
            <Container className='flex flex-col gap-y-4 py-4'>
                <h1 className='font-semibold text-2xl'>Thêm tài khoản mới</h1>
                <div className='grid grid-cols-2'>
                    <form className='flex flex-col gap-y-4'>
                        {errorMessages.map((errorMessage) => (
                            <h6 key={errorMessage} className='text-center text-lg text-red-400 italic'>
                                {errorMessage}
                            </h6>
                        ))}
                        <Input
                            ref={nameRef}
                            id='name'
                            label='Họ và tên'
                            placeholder='Nhập họ và tên...'
                            autoFocus
                            required
                            value={name}
                            message={nameMessage}
                            onChange={(e) => {
                                setName(e.target.value);
                                setNameMessage('');
                                setHasChanged(true);
                            }}
                            clearInput={() => {
                                setName('');
                                setHasChanged(true);
                            }}
                        />
                        <Input
                            ref={emailRef}
                            id='email'
                            label='Email'
                            placeholder='Nhập email...'
                            required
                            value={email}
                            message={emailMessage}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailMessage('');
                                setHasChanged(true);
                            }}
                            clearInput={() => {
                                setEmail('');
                                setHasChanged(true);
                            }}
                        />
                        <Input
                            ref={usernameRef}
                            id='username'
                            label='Tài khoản'
                            placeholder='Nhập tài khoản...'
                            required
                            value={username}
                            message={usernameMessage}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setUsernameMessage('');
                                setHasChanged(true);
                            }}
                            clearInput={() => {
                                setUsername('');
                                setHasChanged(true);
                            }}
                        />
                        <Input
                            ref={passwordRef}
                            password
                            id='password'
                            label='Mật khẩu'
                            placeholder='Nhập mật khẩu...'
                            required
                            value={password}
                            message={passwordMessage}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordMessage('');
                                setHasChanged(true);
                            }}
                            clearInput={() => {
                                setPassword('');
                                setHasChanged(true);
                            }}
                        />
                        <div className='flex items-center justify-end gap-x-4'>
                            <button
                                type='button'
                                className='px-4 py-2 font-semibold hover:opacity-80'
                                onClick={handleGoBack}
                            >
                                Trở về
                            </button>
                            <button
                                type='submit'
                                className='px-4 py-2 min-w-[6rem] font-semibold text-white bg-nature-green rounded hover:opacity-80'
                                onClick={handleSaveUser}
                            >
                                Lưu
                            </button>
                        </div>
                    </form>
                </div>
            </Container>
        </section>
    );
}
