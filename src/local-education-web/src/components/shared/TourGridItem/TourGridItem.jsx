/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import * as Unicons from '@iconscout/react-unicons';
import { toast } from 'react-toastify';

/* Components */
import { Fade } from '@components/shared';

/* Redux */
import {
    setSelectedTourInfo,
    setShowChangeTourTitleModal,
    triggerUpdateTours
} from '@redux/features/admin/tourManagement';

/* Services */
import { useTourServices } from '@services/admin';

export default function TourItem({ tour }) {
    /* Hooks */
    const dispatch = useDispatch();

    /* Services */
    const tourServices = useTourServices();

    /* States */
    const [showTourOptions, setShowTourOptions] = useState(false);

    /* Refs */
    const tourOptionsRef = useRef(null);
    const tourOptionsButtonRef = useRef(null);

    /* Functions */
    const closeTourOptions = () => {
        setShowTourOptions(false);
    };

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
    const handleToggleTourOptions = () => {
        setShowTourOptions((state) => !state);
    };
    const handleCloseTourOptionsOnMouseDown = (e) => {
        if (e.target.closest('button') === tourOptionsButtonRef.current) return;
        if (tourOptionsRef.current && !tourOptionsRef.current.contains(e.target)) closeTourOptions();
    };
    const handleChangeTitle = async () => {
        dispatch(setShowChangeTourTitleModal(true));
        dispatch(setSelectedTourInfo({ id: tour.id, title: tour.title }));
        closeTourOptions();
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
        if (!confirm(`Sau khi xoá không thể khôi phục. Xác nhận xoá tour '${tour.title}'?`)) return;

        const deleteResult = await tourServices.deleteTourById(tour.id);

        handleAfterUpdateTour(
            deleteResult.isSuccess,
            deleteResult.errors[0] || '',
            `Xoá tour '${tour.title}' thành công.`
        );
    };

    /* Side effects */
    /* Close Tour's Options when clicking outside */
    useEffect(() => {
        document.addEventListener('mousedown', handleCloseTourOptionsOnMouseDown);

        return () => {
            document.removeEventListener('mousedown', handleCloseTourOptionsOnMouseDown);
        };
    }, []);

    return (
        <div className='flex flex-col gap-2 p-4 w-full aspect-[4/3] bg-gray-200 rounded-md shadow-lg dark:bg-dark border dark:border-gray-700'>
            <Link
                to={`/admin/tours/${tour.urlSlug}`}
                className='flex-1 overflow-hidden flex items-center justify-center bg-gray-50 rounded dark:bg-gray-400'
            >
                {tour.urlPreview ? (
                    <img
                        src={`${import.meta.env.VITE_API_ENDPOINT}/${tour.urlPreview}`}
                        alt={tour.urlSlug}
                        className='w-full h-full object-center object-cover drop-shadow'
                    />
                ) : (
                    <Unicons.UilImage size='80' className='text-gray-400 dark:text-gray-500 drop-shadow' />
                )}
            </Link>
            <Link
                to={`/admin/tours/${tour.urlSlug}`}
                title={tour.title}
                className='inline-block font-semibold text-lg truncate line-clamp-1 hover:opacity-80'
            >
                {tour.title}
            </Link>
            <div className='relative flex items-center justify-between gap-2'>
                <div className='flex items-center gap-1'>
                    <Unicons.UilCalender size='18' />
                    <span>
                        {new Date(tour.createdDate).toLocaleString('vi-vn', {
                            dateStyle: 'short'
                        })}
                    </span>
                </div>
                <div className='flex items-center gap-2'>
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
                    <button ref={tourOptionsButtonRef} type='button' onClick={handleToggleTourOptions}>
                        <Unicons.UilEllipsisH size='24' />
                    </button>
                </div>
                <AnimatePresence>
                    {showTourOptions && (
                        <Fade
                            ref={tourOptionsRef}
                            duration={0.1}
                            className='absolute right-8 flex flex-col py-1 bg-white rounded shadow-2xl

                            dark:bg-dark border dark:border-gray-700 dark:after:border-l-dark dark:before:inline-block dark:before:border-l-gray-600

                            after:absolute after:top-1/2 after:left-full after:-translate-y-1/2 after:border-8 after:border-transparent after:border-l-white

                            before:hidden before:absolute before:top-1/2 before:-right-[17px] before:-translate-y-1/2 before:border-8 before:border-transparent before:border-l-white'
                        >
                            {!tour.isDeleted ? (
                                <>
                                    <button
                                        type='button'
                                        className='flex items-center gap-1 px-2 py-1 text-left hover:opacity-80'
                                    >
                                        <Unicons.UilEye size='16' />
                                        <span>Xem</span>
                                    </button>
                                    <button
                                        type='button'
                                        className='flex items-center gap-1 px-2 py-1 text-left hover:opacity-80'
                                        onClick={handleChangeTitle}
                                    >
                                        <Unicons.UilPen size='16' />
                                        <span>Đổi tên</span>
                                    </button>
                                    <button
                                        type='button'
                                        className='flex items-center gap-1 px-2 py-1 text-left text-red-500 hover:opacity-80'
                                        onClick={handleToggleTourDeletedStatus}
                                    >
                                        <Unicons.UilTrash size='16' />
                                        <span>Xóa</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type='button'
                                        className='flex items-center gap-1 px-2 py-1 text-left hover:opacity-80'
                                        onClick={handleToggleTourDeletedStatus}
                                    >
                                        <Unicons.UilRedo size='16' />
                                        <span>Khôi phục</span>
                                    </button>
                                    <button
                                        type='button'
                                        className='flex items-center gap-1 px-2 py-1 text-left text-red-500 hover:opacity-80'
                                        onClick={handleDeleteTour}
                                    >
                                        <Unicons.UilTrash size='16' />
                                        <span>Xóa hoàn toàn</span>
                                    </button>
                                </>
                            )}
                        </Fade>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
