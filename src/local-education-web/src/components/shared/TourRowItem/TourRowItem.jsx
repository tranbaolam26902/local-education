/* Libraries */
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Unicons from '@iconscout/react-unicons';
import { toast } from 'react-toastify';

/* Redux */
import {
    setSelectedTourInfo,
    setShowChangeTourTitleModal,
    triggerUpdateTours
} from '@redux/features/admin/tourManagement';

/* Services */
import { useTourServices } from '@services/admin';

export default function TourRowItem({ tour }) {
    /* Hooks */
    const dispatch = useDispatch();

    /* Services */
    const tourServices = useTourServices();

    /* Event handlers */
    const handleAfterUpdateTour = (isSuccess, error, successMessage) => {
        if (isSuccess) {
            dispatch(triggerUpdateTours());
            toast.success(successMessage);
        } else toast.error(error);
    };
    const handleToggleTourPublishedStatus = async () => {
        const toggleResult = await tourServices.toggleTourPublishedStatusById(tour.id);

        handleAfterUpdateTour(
            toggleResult.isSuccess,
            toggleResult.errors[0] || '',
            `Cập nhật tour '${tour.title}' thành công.`
        );
    };
    const handleToggleTourDeletedStatus = async () => {
        const toggleResult = await tourServices.toggleTourDeletedStatusById(tour.id);

        handleAfterUpdateTour(
            toggleResult.isSuccess,
            toggleResult.errors[0] || '',
            tour.isDeleted
                ? `Khôi phục tour '${tour.title}' thành công.`
                : `Chuyển tour '${tour.title}' vào thùng rác thành công.`
        );
    };
    const handleDeleteTour = async () => {
        if (!confirm(`Sau khi xoá không thể khôi phục. Xác nhận xoá tour ${tour.title}?`)) return;

        const deleteResult = await tourServices.deleteTourById(tour.id);

        handleAfterUpdateTour(
            deleteResult.isSuccess,
            deleteResult.errors[0] || '',
            `Xoá tour '${tour.title}' thành công.`
        );
    };
    const handleChangeTourTitle = () => {
        dispatch(setShowChangeTourTitleModal(true));
        dispatch(setSelectedTourInfo({ id: tour.id, title: tour.title }));
    };

    return (
        <div className='flex items-center gap-4 p-4 min-w-[45rem] odd:bg-gray-100 dark:odd:bg-dark rounded hover:bg-gray-200 dark:hover:bg-gray-900'>
            <Link
                to={`/admin/tours/${tour.urlSlug}`}
                className='flex items-center justify-center h-16 aspect-[2/1] bg-gray-300 rounded dark:bg-gray-400 drop-shadow'
            >
                {tour.urlPreview ? (
                    <img
                        src={`${import.meta.env.VITE_API_ENDPOINT}/${tour.urlPreview}`}
                        alt={tour.urlSlug}
                        className='h-full object-center object-coverw'
                    />
                ) : (
                    <Unicons.UilImage size='32' className='text-gray-400 dark:text-gray-500' />
                )}
            </Link>
            <Link
                to={`/admin/tours/${tour.urlSlug}`}
                title={tour.title}
                className='flex-1 inline-block font-semibold text-lg truncate line-clamp-1 hover:opacity-80'
            >
                {tour.title}
            </Link>
            {!tour.isDeleted ? (
                <button
                    type='button'
                    title={tour.isPublished ? 'Nhấn để chuyển thành Nháp' : 'Nhấn để chuyển thành Xuất bản'}
                    className={`px-2 text-sm text-white ${tour.isPublished ? 'bg-blue-400' : 'bg-gray-400'
                        } rounded hover:opacity-80`}
                    onClick={handleToggleTourPublishedStatus}
                >
                    {tour.isPublished ? 'Công khai' : 'Riêng tư'}
                </button>
            ) : (
                <button
                    type='button'
                    title='Nhấn để Khôi phục'
                    className='px-2 text-sm text-white bg-red-400 rounded hover:opacity-80'
                    onClick={handleToggleTourDeletedStatus}
                >
                    Thùng rác
                </button>
            )}
            <div className='flex items-center gap-1'>
                <Unicons.UilCalender size='18' />
                <span>{new Date(tour.createdDate).toLocaleString('vi-VN', { dateStyle: 'short' })}</span>
            </div>
            {!tour.isDeleted ? (
                <>
                    <button type='button' title='Xem' className='text-gray-600 dark:text-white hover:opacity-80'>
                        <Unicons.UilEye size='24' />
                    </button>
                    <button
                        type='button'
                        title='Đổi tên'
                        className='text-gray-600 dark:text-white hover:opacity-80'
                        onClick={handleChangeTourTitle}
                    >
                        <Unicons.UilPen size='24' />
                    </button>
                    <button
                        type='button'
                        title='Xóa'
                        className='text-red-500 hover:opacity-80'
                        onClick={handleToggleTourDeletedStatus}
                    >
                        <Unicons.UilTrash size='24' />
                    </button>
                </>
            ) : (
                <>
                    <button
                        type='button'
                        title='Khôi phục'
                        className='text-gray-600 dark:text-white hover:opacity-80'
                        onClick={handleToggleTourDeletedStatus}
                    >
                        <Unicons.UilRedo size='24' />
                    </button>
                    <button
                        type='button'
                        title='Xóa'
                        className='text-red-500 hover:opacity-80'
                        onClick={handleDeleteTour}
                    >
                        <Unicons.UilTrash size='24' />
                    </button>
                </>
            )}
        </div>
    );
}
