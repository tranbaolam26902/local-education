/* Libraries */
import { useDispatch, useSelector } from 'react-redux';

/* Redux */
import { selectEditTour, setCurrentDestinationScene } from '@redux/features/admin/editTour';

export default function DestinationSceneItem({ scene }) {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const editTour = useSelector(selectEditTour);

    /* Event handlers */
    const handleSelect = () => {
        dispatch(setCurrentDestinationScene(scene));
    };

    return (
        <div
            className={`relative cursor-pointer${editTour.currentDestinationScene?.index === scene.index
                    ? ' outline outline-4 -outline-offset-4 outline-nature-green rounded'
                    : ''
                }`}
            role='button'
            onClick={handleSelect}
        >
            <img
                src={`${import.meta.env.VITE_API_ENDPOINT}/${scene.urlPreview}`}
                alt={scene.title}
                className='w-full aspect-[2/1] rounded'
            />
            <div className='absolute left-2 right-2 bottom-2 flex items-center gap-x-1 px-4 h-8 bg-black/40 rounded-full cursor-default'>
                {editTour.currentDestinationScene?.index === scene.index && (
                    <span className='-ml-2 px-1.5 py-px text-xs bg-nature-green text-white rounded-full drop-shadow'>
                        Đã chọn
                    </span>
                )}
                <h6 className='flex-1 inline-block text-white truncate line-clamp-1'>{scene.title}</h6>
            </div>
        </div>
    );
}
