/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Unicons from '@iconscout/react-unicons';

/* Redux */
import {
    decreaseProfileCoursePageNumber,
    increaseProfileCoursePageNumber,
    selectProfile,
    setProfileCoursePageNumber
} from '@redux/features/client/profile';

/* Services */
import { useProfileServices, useProgressServices } from '@services/client';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { Input } from '@components/admin';
import { Container, PageTransition, Pager } from '@components/shared';

function CourseItem({ course }) {
    return (
        <div className='flex flex-col gap-y-2 p-4 md:p-6 bg-white dark:bg-black border dark:border-gray-500 drop-shadow shadow-inner rounded-xl'>
            <Link
                to={`/courses/${course.urlSlug}`}
                className='text-lg font-bold text-neutral-600 dark:text-white line-clamp-2 hover:opacity-70'
            >
                {course.title}
            </Link>
            <p className='text-neutral-500 text-sm dark:text-neutral-300 line-clamp-4'>
                {course.description}
            </p>
            <Link to={`/courses/${course.urlSlug}`} className='overflow-hidden rounded-xl'>
                <img
                    src={`${import.meta.env.VITE_API_ENDPOINT}/${course.urlPath}`}
                    alt={course.title}
                    className='w-full aspect-video object-cover hover:scale-105 transition duration-300'
                />
            </Link>
            <div className='flex items-center justify-between gap-x-2'>
                <span>Hoàn thành {Math.round(course.completed)}%</span>
                <Link
                    to={`/courses/${course.urlSlug}`}
                    className='px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold hover:shadow-2xl hover:bg-opacity-70 dark:hover:bg-gray-200'
                >
                    Tiếp tục học
                </Link>
            </div>
            <div className='overflow-hidden relative w-full h-2 bg-gray-200 rounded-full'>
                <span
                    className='absolute top-0 left-0 bottom-0 bg-nature-green'
                    style={{
                        width: `${Math.round(course.completed)}%`
                    }}
                ></span>
            </div>
        </div>
    );
}

export default function Profile() {
    /* Hooks */
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    /* Services */
    const profileServices = useProfileServices();
    const progressServices = useProgressServices();

    /* States */
    const profileSlice = useSelector(selectProfile);
    // Profiles
    const [isDisableEdit, setIsDisableEdit] = useState(true);
    const [profile, setProfile] = useState({});
    const [name, setName] = useState('');
    const [nameMessage, setNameMessage] = useState('');
    const [email, setEmail] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneMessage, setPhoneMessage] = useState('');
    const [address, setAddress] = useState('');
    const [addressMessage, setAddressMessage] = useState('');
    const [profileMessages, setProfileMessages] = useState([]);
    // Passwords
    const [isDisableChangePassword, setIsDisableChangePassword] = useState(true);
    const [currentPassword, setCurrentPassword] = useState('');
    const [currentPasswordMessage, setCurrentPasswordMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordMessage, setNewPasswordMessage] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');
    const [passwordMessages, setPasswordMessages] = useState([]);
    // Courses
    const [courses, setCourses] = useState([]);
    const [metadata, setMetadata] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    /* Refs */
    // Profiles
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const addressRef = useRef(null);

    // Passwords
    const currentPasswordRef = useRef(null);
    const newPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    /* Functions */
    // Profiles
    const handleGetProfile = async () => {
        const profileResult = await profileServices.getProfile();

        if (profileResult.isSuccess) {
            setProfile(profileResult.result);
            mapProfileToInputs(profileResult.result);
        } else setProfile({});
    };
    const mapProfileToInputs = (profile) => {
        if (profile.name) setName(profile.name);
        if (profile.email) setEmail(profile.email);
        if (profile.phone) setPhone(profile.phone);
        if (profile.address) setAddress(profile.address);
    };
    const clearProfileMessages = () => {
        setNameMessage('');
        setEmailMessage('');
        setPhoneMessage('');
        setAddressMessage('');
        setProfileMessages([]);
    };
    const validateProfile = () => {
        let isValid = true;

        if (name.trim() === '') {
            setNameMessage('Họ và tên không được để trống.');
            isValid = false;
        }
        if (email.trim() === '') {
            setEmailMessage('Email không được để trống.');
            isValid = false;
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            setEmailMessage('Email không đúng định dạng.');
            isValid = false;
        }

        return isValid;
    };
    // Passwords
    const clearPasswordMessages = () => {
        setCurrentPasswordMessage('');
        setNewPasswordMessage('');
        setConfirmPasswordMessage('');
        setPasswordMessages([]);
    };
    const validatePassword = () => {
        let isValid = true;

        if (currentPassword.trim() === '') {
            setCurrentPasswordMessage('Mật khẩu hiện tại không được để trống.');
            isValid = false;
        }
        if (newPassword.trim() === '') {
            setNewPasswordMessage('Mật khẩu mới không được để trống.');
            isValid = false;
        }
        if (confirmPassword.trim() === '') {
            setConfirmPasswordMessage('Xác nhận mật khẩu không được để trống.');
            isValid = false;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMessages(['Mật khẩu mới và xác nhận mật khẩu không trùng khớp.']);
            isValid = false;
        }

        return isValid;
    };
    // Courses
    const getCourses = async () => {
        setIsLoading(true);
        const coursesResult = await progressServices.getProgress(searchParams.toString());

        if (coursesResult.isSuccess) {
            setCourses(coursesResult.result.items);
            setMetadata(coursesResult.result.metadata);
        } else {
            setCourses([]);
            setMetadata({});
        }
        setIsLoading(false);
    };
    const getPageNumberFromSearchParams = () => {
        const urlPageNumber = searchParams.get('PageNumber');

        if (urlPageNumber) dispatch(setProfileCoursePageNumber(urlPageNumber));
    };
    const setPageTitle = () => {
        document.title = getSubPageTitle('Trang cá nhân');
    };

    /* Event handlers */
    // Profiles
    const handleEnableUpdateProfile = () => {
        setIsDisableEdit(false);
    };
    const handleDisableUpdateProfile = () => {
        setIsDisableEdit(true);
        clearProfileMessages();
    };
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!validateProfile()) return;

        const data = {
            name,
            email,
            phone,
            address
        };

        const saveResult = await profileServices.updateProfile(data);

        if (saveResult.isSuccess) {
            setProfile(saveResult.result);
            mapProfileToInputs(saveResult.result);

            toast.success('Lưu thông tin cá nhân thành công.');

            handleDisableUpdateProfile();
        } else setProfileMessages(saveResult.errors);
    };
    const handleCancelEditProfile = () => {
        mapProfileToInputs(profile);
        handleDisableUpdateProfile();
    };
    // Passwords
    const handleEnableChangePassword = () => {
        setIsDisableChangePassword(false);
    };
    const handleDisableChangePassword = () => {
        setIsDisableChangePassword(true);
        clearPasswordMessages();
    };
    const handleSavePassword = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        const data = {
            oldPassword: currentPassword,
            newPassword,
            confirmPassword
        };

        const changePasswordResult = await profileServices.changePassword(data);

        if (changePasswordResult.isSuccess) {
            handleCancelChangePassword();

            toast.success('Đổi mật khẩu thành công.');
        } else setPasswordMessages(changePasswordResult.errors);
    };
    const handleCancelChangePassword = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        handleDisableChangePassword();
    };

    /* Side effects */
    // Profiles
    /* Init component side effects */
    useEffect(() => {
        handleGetProfile();
        getPageNumberFromSearchParams();
        setPageTitle();
    }, []);
    // Courses
    /* Get courses queries from search params if existed */
    /* Map courses queries to search params */
    useEffect(() => {
        setSearchParams(profileSlice.coursesQueries, { replace: true });
    }, [profileSlice.coursesQueries]);
    /* Get courses when search params changes or manual triggered */
    useEffect(() => {
        getCourses();
    }, [searchParams, profileSlice.isUpdateCourses]);

    return (
        <PageTransition className='min-h-[calc(100svh-3.75rem)] dark:text-white dark:bg-black'>
            <Container className='flex flex-col gap-y-8 md:gap-y-12 py-8 md:py-16'>
                <h1 className='font-bold text-2xl md:text-3xl lg:text-4xl text-center uppercase'>Trang cá nhân</h1>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Start: Left section */}
                    <section className='flex flex-col gap-y-8'>
                        {/* Start: Profile section */}
                        <form
                            className='flex flex-col gap-y-4 p-8 bg-white dark:bg-black border dark:border-gray-500 rounded-xl drop-shadow shadow-inner'
                            onSubmit={handleSaveProfile}
                        >
                            <div className='flex items-center justify-between gap-x-2'>
                                <h2 className='font-semibold text-lg'>Thông tin cá nhân</h2>
                                {isDisableEdit && (
                                    <button
                                        type='button'
                                        className='font-semibold text-sm'
                                        onClick={handleEnableUpdateProfile}
                                    >
                                        Chỉnh sửa
                                    </button>
                                )}
                            </div>
                            {profileMessages.length > 0 &&
                                profileMessages.map((errorMessage) => (
                                    <h6 key={errorMessage} className='italic text-center text-red-400'>
                                        {errorMessage}
                                    </h6>
                                ))}
                            <Input
                                ref={nameRef}
                                id='name'
                                label='Họ và tên'
                                required
                                disabled={isDisableEdit}
                                value={name}
                                message={nameMessage}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setNameMessage('');
                                }}
                                clearInput={
                                    isDisableEdit
                                        ? false
                                        : () => {
                                            setName('');
                                        }
                                }
                            />
                            <Input
                                ref={emailRef}
                                id='email'
                                label='Email'
                                type='email'
                                required
                                disabled={isDisableEdit}
                                value={email}
                                message={emailMessage}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailMessage('');
                                }}
                                clearInput={
                                    isDisableEdit
                                        ? false
                                        : () => {
                                            setEmail('');
                                        }
                                }
                            />
                            <Input
                                ref={phoneRef}
                                id='phone'
                                label='Số điện thoại'
                                disabled={isDisableEdit}
                                value={phone}
                                message={phoneMessage}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    setPhoneMessage('');
                                }}
                                clearInput={
                                    isDisableEdit
                                        ? false
                                        : () => {
                                            setPhone('');
                                        }
                                }
                            />
                            <Input
                                ref={addressRef}
                                id='address'
                                label='Địa chỉ'
                                disabled={isDisableEdit}
                                value={address}
                                message={addressMessage}
                                onChange={(e) => {
                                    setAddress(e.target.value);
                                    setAddressMessage('');
                                }}
                                clearInput={
                                    isDisableEdit
                                        ? false
                                        : () => {
                                            setAddress('');
                                        }
                                }
                            />
                            {!isDisableEdit && (
                                <div className='flex items-center justify-end gap-x-8'>
                                    <button
                                        type='button'
                                        className='font-semibold hover:opacity-70 transition'
                                        onClick={handleCancelEditProfile}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type='submit'
                                        className='px-8 py-2 font-semibold text-white bg-nature-green rounded-lg drop-shadow shadow-inner hover:opacity-70 transition'
                                        onClick={handleSaveProfile}
                                    >
                                        Lưu
                                    </button>
                                </div>
                            )}
                        </form>
                        {/* End: Profile section */}

                        {/* Start: Change password section */}
                        <form
                            className='flex flex-col gap-y-4 p-8 bg-white dark:bg-black border dark:border-gray-500 rounded-xl drop-shadow shadow-inner'
                            onSubmit={handleSavePassword}
                        >
                            <div className='flex items-center justify-between gap-x-2'>
                                <h2 className='font-semibold text-lg'>Tài khoản</h2>
                                {isDisableChangePassword && (
                                    <button
                                        type='button'
                                        className='font-semibold text-sm'
                                        onClick={handleEnableChangePassword}
                                    >
                                        Đổi mật khẩu
                                    </button>
                                )}
                            </div>
                            {passwordMessages.length > 0 &&
                                passwordMessages.map((passwordMessage) => (
                                    <h6 key={passwordMessage} className='italic text-center text-red-400'>
                                        {passwordMessage}
                                    </h6>
                                ))}
                            <Input
                                ref={currentPasswordRef}
                                type='password'
                                id='current-password'
                                label='Mật khẩu hiện tại'
                                disabled={isDisableChangePassword}
                                value={currentPassword}
                                message={currentPasswordMessage}
                                onChange={(e) => {
                                    setCurrentPassword(e.target.value);
                                    setCurrentPasswordMessage('');
                                }}
                                clearInput={
                                    isDisableChangePassword
                                        ? false
                                        : () => {
                                            setCurrentPassword('');
                                        }
                                }
                            />
                            <Input
                                ref={newPasswordRef}
                                type='password'
                                id='new-password'
                                label='Mật khẩu mới'
                                disabled={isDisableChangePassword}
                                value={newPassword}
                                message={newPasswordMessage}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setNewPasswordMessage('');
                                }}
                                clearInput={
                                    isDisableChangePassword
                                        ? false
                                        : () => {
                                            setNewPassword('');
                                        }
                                }
                            />
                            <Input
                                ref={confirmPasswordRef}
                                type='password'
                                id='confirm-password'
                                label='Xác nhận mật khẩu'
                                disabled={isDisableChangePassword}
                                value={confirmPassword}
                                message={confirmPasswordMessage}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setConfirmPasswordMessage('');
                                }}
                                clearInput={
                                    isDisableChangePassword
                                        ? false
                                        : () => {
                                            setConfirmPassword('');
                                        }
                                }
                            />
                            {!isDisableChangePassword && (
                                <div className='flex items-center justify-end gap-x-8'>
                                    <button
                                        type='button'
                                        className='font-semibold hover:opacity-70 transition'
                                        onClick={handleCancelChangePassword}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type='submit'
                                        className='px-8 py-2 font-semibold text-white bg-nature-green rounded-lg drop-shadow shadow-inner hover:opacity-70 transition'
                                        onClick={handleSavePassword}
                                    >
                                        Lưu
                                    </button>
                                </div>
                            )}
                        </form>
                        {/* End: Change password section */}
                    </section>
                    {/* End: Left section */}

                    {/* Start: Right section */}
                    <section className='flex flex-col gap-y-6 p-8 bg-white dark:bg-black border dark:border-gray-500 rounded-xl drop-shadow shadow-inner'>
                        <h2 className='font-semibold text-lg'>Khóa học đã tham gia</h2>

                        {/* Start: Courses section */}
                        {isLoading ? (
                            <Unicons.UilSpinner
                                size='48'
                                className='animate-spin animate-infinite animate-duration-1000 mx-auto dark:text-white'
                            />
                        ) : (
                            <div className='grid md:grid-cols-2 gap-4'>
                                {courses.map((course) => (
                                    <CourseItem
                                        key={course.id}
                                        course={{
                                            id: course.courseId,
                                            title: course.title,
                                            description: course.description,
                                            thumbnailPath: course.thumbnailPath,
                                            urlPath: course.urlPath,
                                            urlSlug: course.urlSlug,
                                            completed: course.completed
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                        {/* End: Courses section */}

                        {/* Start: Pagination section */}
                        <Pager
                            hidePageSize
                            metadata={metadata}
                            increasePageNumber={() => {
                                dispatch(increaseProfileCoursePageNumber());
                            }}
                            decreasePageNumber={() => {
                                dispatch(decreaseProfileCoursePageNumber());
                            }}
                            setPageNumber={(pageNumber) => {
                                dispatch(setProfileCoursePageNumber(pageNumber));
                            }}
                        />
                        {/* End: Pagination section */}
                    </section>
                    {/* End: Right section */}
                </div>
            </Container>
        </PageTransition>
    );
}
