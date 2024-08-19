/* Libraries */
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

/* Redux */
import { triggerUpdateSlides } from '@redux/features/admin/slideManagement';
import { setSlides, showInfoHotspotDetailModal } from '@redux/features/client/tour';

/* Services */
import { useSlideServices } from '@services/admin';

export default function SlideItem({ slide }) {
    /* Hooks */
    const dispatch = useDispatch();

    /* Services */
    const slideServices = useSlideServices();

    /* Event handlers */
    const handleViewContent = () => {
        dispatch(setSlides([slide]));
        dispatch(showInfoHotspotDetailModal());
    };
    const handleTogglePublished = async () => {
        const toggleResult = await slideServices.togglePublished(slide.id);

        if (toggleResult.isSuccess) {
            toast.success('Chuyển trạng thái thành công.');
            dispatch(triggerUpdateSlides());
        } else toast.error('Chuyển trạng thái thất bại.');
    };
    const handleDelete = async () => {
        if (!confirm('Sau khi xóa không thể khôi phục. Xác nhận xoá slide?')) return;

        const deleteResult = await slideServices.deleteSlide(slide.id);

        if (deleteResult.isSuccess) {
            toast.success('Xoá slide thành công.');
            dispatch(triggerUpdateSlides());
        } else toast.error(`Xoá slide thất bại. ${deleteResult.errors[0]}`);
    };

    return (
        <div className='grid grid-cols-12 p-2 odd:bg-gray-100 dark:odd:bg-dark'>
            <div className='col-span-1 pr-1 text-center'>
                <span>{slide.index}</span>
            </div>
            <Link
                to={`/admin/slides/edit/${slide.id}`}
                className='col-span-3 px-1 font-semibold text-blue-500 underline hover:opacity-80'
            >
                {slide.title}
            </Link>
            <div className='col-span-4 px-1'>
                <p className='line-clamp-4'>{slide.content}</p>
            </div>
            <div className='col-span-2 px-1'>
                {slide.urlPath ? (
                    <img
                        src={`${import.meta.env.VITE_API_ENDPOINT}/${slide.thumbnailPath}`}
                        alt={slide.title}
                        className='aspect-video object-center object-cover w-full rounded'
                    />
                ) : (
                    '(Trống)'
                )}
            </div>
            <div className='col-span-1 px-1 text-center'>
                {slide.layout === 'full' ? 'Đầy đủ' : slide.layout === 'media' ? 'Media' : 'Văn bản'}
            </div>
            <div className='col-span-1 flex flex-col gap-y-2 pl-1'>
                <button
                    type='button'
                    className='py-2 h-fit font-semibold text-white bg-nature-green rounded hover:opacity-80'
                    onClick={handleViewContent}
                >
                    Xem
                </button>
                <button
                    type='button'
                    title='Chuyển trạng thái'
                    className={`py-2 h-fit font-semibold text-white ${slide.isPublished ? 'bg-blue-400' : 'bg-gray-400'
                        } rounded hover:opacity-80`}
                    onClick={handleTogglePublished}
                >
                    {slide.isPublished ? 'Công khai' : 'Riêng tư'}
                </button>
                <button
                    type='button'
                    className='py-2 h-fit font-semibold text-white bg-red-400 rounded hover:opacity-80'
                    onClick={handleDelete}
                >
                    Xoá
                </button>
            </div>
        </div>
    );
}
