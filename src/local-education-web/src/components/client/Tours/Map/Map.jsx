/* Libraries */
import { useDispatch, useSelector } from 'react-redux';

/* Assets */
import { images } from '@assets/images';

/* Redux */
import { disableMap, selectTour, setUserCurrentSceneIndex } from '@redux/features/client/tour';

/* Components */
import { Modal } from '@components/shared';

export default function Map({ map }) {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const tourSlice = useSelector(selectTour);

    /* Event handlers */
    const handleCloseMap = () => {
        dispatch(disableMap());
    };

    return (
        <Modal show={tourSlice.showMap} handleClose={handleCloseMap}>
            <section className='relative max-w-[80vw] max-h-[80vh]'>
                <img src={`${import.meta.env.VITE_API_ENDPOINT}/${map.path}`} alt={map.bb} className='max-h-[80vh] border border-white rounded-lg' />
                <div className='absolute inset-5'>
                    {map.pins.map((pin) => (
                        <div
                            id={pin.name}
                            key={pin.id}
                            className='group hover:z-10 absolute w-16 h-16 -translate-x-1/2 -translate-y-3/4'
                            style={{ top: `${pin.top}%`, left: `${pin.left}%` }}
                            role='button'
                            onClick={() => {
                                if (tourSlice.currentSceneIndex === pin.sceneIndex) return;

                                dispatch(setUserCurrentSceneIndex(pin.sceneIndex));
                                dispatch(disableMap());
                            }}
                        >
                            <img src={images.pin} alt={pin.name} />
                            {pin.thumbnailPath && (
                                <div className='hidden group-hover:block absolute -top-full left-1/2 -translate-x-1/2 -translate-y-1/2 w-28'>
                                    <img
                                        src={`${import.meta.env.VITE_API_ENDPOINT}/${pin.thumbnailPath}`}
                                        className='rounded-full aspect-square object-center object-cover outline outline-4 outline-white shadow'
                                    />
                                    <span className='absolute left-1/2 -bottom-1 -translate-x-1/2 px-4 py-1 w-max font-semibold text-sm text-white bg-dark rounded'>
                                        {pin.title}
                                    </span>
                                    <span className='absolute top-full left-1/2 -translate-x-1/2 w-full h-4'></span>
                                </div>
                            )}
                            {tourSlice.currentSceneIndex === pin.sceneIndex && (
                                <span className='absolute left-1/2 -translate-x-1/2 px-2 w-max font-semibold text-sm text-white bg-blue-500 rounded-full border-2 border-white'>
                                    Hiện tại
                                </span>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    type='button'
                    className='absolute top-4 right-4 px-4 py-2 font-semibold text-white bg-dark rounded-full shadow'
                    onClick={handleCloseMap}
                >
                    Đóng
                </button>
            </section>
        </Modal>
    );
}
