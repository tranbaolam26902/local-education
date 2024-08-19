/* Libraries */
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/* Components */
import Modal from '@components/shared/Modal/Modal';

/* Redux */
import {
    selectTourManagement,
    setShowCreateTourModal,
    setShowChangeTourTitleModal,
    triggerUpdateTours
} from '@redux/features/admin/tourManagement/tourManagementSlice';

/* Serivces */
import { useTourServices } from '@services/admin';

export default function TourTitleModal() {
    /* Hooks */
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /* Serivces */
    const tourServices = useTourServices();

    /* States */
    const tourManagement = useSelector(selectTourManagement);
    const [errorMessages, setErrorMessages] = useState([]);

    /* Refs */
    const tourTitleRef = useRef(null);

    /* Event handlers */
    const handleCloseTourTitleModal = () => {
        setErrorMessages([]);
        tourTitleRef.current.value = '';
        dispatch(setShowCreateTourModal(false));
        dispatch(setShowChangeTourTitleModal(false));
    };
    const handleSubmitTourTitleModal = async (e) => {
        e.preventDefault();

        if (tourManagement.showCreateTourModal) {
            const createResult = await tourServices.createTour(tourTitleRef.current.value.trim());

            if (createResult.isSuccess) {
                handleCloseTourTitleModal();
                toast.success('Tạo tour thành công.', { toastId: 'create-tour' });
                navigate(`/admin/tours/${createResult.result.urlSlug}`);
            } else setErrorMessages(createResult.errors);
        } else {
            if (tourManagement.selectedTourInfo.title === tourTitleRef.current.value.trim()) {
                handleCloseTourTitleModal();
                return;
            }

            const changeTitleResult = await tourServices.changeTourTitleById(
                tourManagement.selectedTourInfo.id,
                tourTitleRef.current.value.trim()
            );

            if (changeTitleResult.isSuccess) {
                handleCloseTourTitleModal();
                toast.success('Đổi tên tour thành công.', { toastId: 'edit-tour-title' });
                dispatch(triggerUpdateTours());
            } else setErrorMessages(changeTitleResult.errors);
        }
    };

    return (
        <Modal
            show={tourManagement.showCreateTourModal || tourManagement.showChangeTourTitleModal}
            handleClose={handleCloseTourTitleModal}
        >
            <form
                className='flex flex-col gap-8 p-8 w-96 max-w-[calc(100vw-3rem)] dark:text-white bg-white dark:bg-dark dark:border dark:border-gray-700 rounded-2xl shadow'
                onSubmit={handleSubmitTourTitleModal}
            >
                <h4 className='font-bold text-xl text-center uppercase'>
                    {tourManagement.showChangeTourTitleModal ? 'Đổi tên tour' : 'Tạo tour mới'}
                </h4>
                {errorMessages.map((errorMessage, index) => (
                    <h6 key={index} className='text-center text-red-400'>
                        {errorMessage}
                    </h6>
                ))}
                <input
                    ref={tourTitleRef}
                    type='text'
                    autoFocus
                    defaultValue={tourManagement.showChangeTourTitleModal ? tourManagement.selectedTourInfo.title : ''}
                    placeholder='Nhập tên tour...'
                    className='px-4 py-2 bg-white dark:bg-dark border border-gray-400 rounded shadow-inner'
                    onFocus={(e) => {
                        e.target.select();
                    }}
                />
                <div className='inline-grid grid-cols-2 gap-x-4'>
                    <button
                        type='button'
                        className='px-8 py-2 text-nature-green dark:text-light-green bg-white dark:bg-dark border border-nature-green dark:border-light-green rounded drop-shadow hover:bg-gray-50 dark:hover:bg-gray-900'
                        onClick={handleCloseTourTitleModal}
                    >
                        Huỷ
                    </button>
                    <button
                        type='submit'
                        className='px-8 py-2 text-white bg-nature-green rounded drop-shadow hover:opacity-80'
                    >
                        {tourManagement.showChangeTourTitleModal ? 'Lưu' : 'Tiếp tục'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
