/* Libraries */
import { useDispatch, useSelector } from 'react-redux';

/* Redux */
import { selectTour, setUserCurrentSceneIndex } from '@redux/features/client/tour';

export default function SceneItem({ scene, isSearched }) {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const tourSlice = useSelector(selectTour);

    /* Event handlers */
    const handleSelectScene = () => {
        dispatch(setUserCurrentSceneIndex(scene.index));
    };

    return (
        <>
            <div
                className={`relative cursor-pointer rounded${tourSlice.currentSceneIndex === scene.index
                        ? ' outline outline-4 -outline-offset-4 outline-nature-green'
                        : ''
                    }
                `}
                role='button'
                onClick={handleSelectScene}
            >
                <img
                    src={`${import.meta.env.VITE_API_ENDPOINT}/${scene.urlPreview}`}
                    alt={scene.title}
                    className='w-full aspect-[2/1] rounded'
                />
                <div className='absolute left-2 right-2 bottom-2 flex items-center gap-x-1 px-4 h-8 bg-black/40 rounded-full cursor-default'>
                    {tourSlice.currentSceneIndex === scene.index && (
                        <span className='-ml-2 px-1.5 py-px font-semibold text-xs text-white bg-nature-green rounded-full drop-shadow'>
                            Hiện tại
                        </span>
                    )}
                    <h6 className='flex-1 inline-block text-white truncate line-clamp-1'>{scene.title}</h6>
                </div>
            </div>
            {isSearched && (scene.linkHotspots.length !== 0 || scene.infoHotspots.length !== 0) && (
                <div className='relative flex flex-col pl-2'>
                    {scene.linkHotspots.length !== 0 && (
                        <h6>
                            {scene.infoHotspots.length !== 0 ? '├─' : '└─'} Tìm thấy <b>{scene.linkHotspots.length}</b>{' '}
                            liên kết liên quan
                        </h6>
                    )}
                    {scene.infoHotspots.length !== 0 && (
                        <h6>
                            └─ Tìm thấy <b>{scene.infoHotspots.length}</b> thông tin liên quan
                        </h6>
                    )}
                </div>
            )}
        </>
    );
}
