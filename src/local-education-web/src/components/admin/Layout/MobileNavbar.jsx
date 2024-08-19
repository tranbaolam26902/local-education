/* Libraries */
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Unicons from '@iconscout/react-unicons';

/* Hooks */
import { useLogout } from '@hooks/shared';

/* Redux */
import { enableFileManagementModal } from '@redux/features/admin/fileManagement';

/* Components */
import { Modal } from '@components/shared';

export default function MobileNavbar({ show, handleClose }) {
    /* Hooks */
    const logout = useLogout();
    const dispatch = useDispatch();

    /* Event handlers */
    const handleShowFileManagementModal = () => {
        handleClose();
        dispatch(enableFileManagementModal());
    };
    const handleLogout = async () => {
        const logoutResult = await logout();

        if (logoutResult.isSuccess) navigate('/account/login', { state: { from: location } });
    };

    return (
        <Modal show={show} handleClose={handleClose}>
            <section className='fixed top-0 left-0 bottom-0 flex flex-col w-96 max-w-[80vw] bg-white dark:bg-black dark:outline outline-1 outline-gray-500'>
                <button
                    type='button'
                    className='self-end flex items-center gap-x-1 mr-4 my-2 p-2 hover:opacity-70'
                    onClick={handleClose}
                >
                    <Unicons.UilTimes size='24' />
                    <span className='font-semibold text-sm'>Đóng</span>
                </button>
                <div className='flex-grow flex flex-col'>
                    <Link
                        to='/admin'
                        className='block px-8 py-4 font-semibold text-lg hover:bg-gray-200 hover:bg-opacity-80 dark:hover:bg-gray-600'
                        onClick={handleClose}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to='/admin/users'
                        className='block px-8 py-4 font-semibold text-lg hover:bg-gray-200 hover:bg-opacity-80 dark:hover:bg-gray-600'
                        onClick={handleClose}
                    >
                        Tài khoản
                    </Link>
                    <Link
                        to='/admin/tours'
                        className='block px-8 py-4 font-semibold text-lg hover:bg-gray-200 hover:bg-opacity-80 dark:hover:bg-gray-600'
                        onClick={handleClose}
                    >
                        Tours
                    </Link>
                    <Link
                        to='/admin/courses'
                        className='block px-8 py-4 font-semibold text-lg hover:bg-gray-200 hover:bg-opacity-80 dark:hover:bg-gray-600'
                        onClick={handleClose}
                    >
                        Khóa học
                    </Link>
                    <Link
                        to='/admin/lessons'
                        className='block px-8 py-4 font-semibold text-lg hover:bg-gray-200 hover:bg-opacity-80 dark:hover:bg-gray-600'
                        onClick={handleClose}
                    >
                        Chương
                    </Link>
                    <Link
                        to='/admin/slides'
                        className='block px-8 py-4 font-semibold text-lg hover:bg-gray-200 hover:bg-opacity-80 dark:hover:bg-gray-600'
                        onClick={handleClose}
                    >
                        Bài học
                    </Link>
                </div>
                <div className='flex flex-col'>
                    <button
                        type='button'
                        className='block px-8 py-4 font-semibold text-left text-lg hover:bg-gray-200 hover:bg-opacity-80 dark:hover:bg-gray-600'
                        onClick={handleShowFileManagementModal}
                    >
                        Media
                    </button>
                    <button
                        type='button'
                        onClick={handleLogout}
                        className='block px-8 py-4 font-semibold text-left text-lg text-red-600 hover:bg-gray-200 hover:bg-opacity-80 dark:hover:bg-gray-600'
                    >
                        Đăng xuất
                    </button>
                </div>
            </section>
        </Modal>
    );
}
