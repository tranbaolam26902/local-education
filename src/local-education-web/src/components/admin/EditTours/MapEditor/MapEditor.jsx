/* Libraries */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import * as Unicons from '@iconscout/react-unicons';

/* Assets */
import { images } from '@assets/images';

/* Redux */
import {
    addPin,
    disableIsWaitingPin,
    enableIsEditedMap,
    enableIsEditingPin,
    resetAddingPinMessage,
    resetCurrentDestinationScene,
    selectEditMap,
    selectPaneManagement,
    setAddingPinMessage,
    setCurrentDestinationScene,
    setEditingPin
} from '@redux/features/admin/editTour';

/* Components */
import { Fade } from '@components/shared';
import MapPane from '../MapPane/MapPane';

export default function MapEditor() {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const editMap = useSelector(selectEditMap);
    const paneManagement = useSelector(selectPaneManagement);

    /* Event handlers */
    const handleAddPin = (e) => {
        if (editMap.pins.some((pin) => pin.name === e.target?.id)) {
            dispatch(setAddingPinMessage('Toạ độ này đã được sử dụng vui lòng chọn toạ độ khác.'));
            return;
        }

        dispatch(resetAddingPinMessage());
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const top = (y / rect.height) * 100;
        const left = (x / rect.width) * 100;
        const name = `pin-${top}-${left}`;
        const pin = {
            name,
            top,
            left
        };

        dispatch(disableIsWaitingPin());
        dispatch(enableIsEditingPin());
        dispatch(enableIsEditedMap());
        dispatch(setEditingPin(pin));
        dispatch(addPin(pin));
        dispatch(resetCurrentDestinationScene());
    };
    const handleSelectMap = () => {
        const btnSelectMap = document.querySelector('#btn-select-map');
        if (btnSelectMap) btnSelectMap.click();
    };

    /* Side effects */
    useEffect(() => {
        if (editMap.editingPin.sceneIndex !== undefined)
            dispatch(
                setCurrentDestinationScene({
                    index: editMap.editingPin.sceneIndex,
                    title: editMap.editingPin.title,
                    urlPreview: editMap.editingPin.thumbnailPath
                })
            );
    }, [editMap.editingPin]);

    return (
        <AnimatePresence>
            {paneManagement.isShowMapEditor && (
                <Fade duration={0.2} className='absolute inset-0 flex w-full h-full bg-black/40'>
                    <div className='absolute top-0 left-0 right-96 bottom-0 flex items-center justify-center p-8'>
                        {editMap.mapPath !== '' ? (
                            <div className='relative'>
                                <img
                                    src={`${import.meta.env.VITE_API_ENDPOINT}/${editMap.mapPath}`}
                                    alt='map'
                                    className='max-h-[48rem] border border-white rounded'
                                />
                                <div
                                    id='map-canvas'
                                    className='absolute inset-5'
                                    onClick={editMap.isWaitingPin && !editMap.isEditingPin ? handleAddPin : () => { }}
                                >
                                    {editMap.pins.map((pin) => (
                                        <div
                                            id={pin.name}
                                            key={pin.name}
                                            className='group hover:z-10 absolute w-16 h-16 -translate-x-1/2 -translate-y-3/4'
                                            style={{ top: `${pin.top}%`, left: `${pin.left}%` }}
                                            role='button'
                                            onClick={() => {
                                                if (editMap.isNewPin) return;

                                                dispatch(setEditingPin(pin));
                                                dispatch(enableIsEditingPin());
                                            }}
                                        >
                                            <img
                                                src={images.pin}
                                                alt={pin.name}
                                                className={`pointer-events-none ${editMap.editingPin.name !== pin.name ? 'opacity-70' : ''
                                                    }`}
                                            />
                                            {pin.thumbnailPath && (
                                                <div className='hidden group-hover:block absolute -top-full left-1/2 -translate-x-1/2 -translate-y-1/2 w-28'>
                                                    <img
                                                        src={`${import.meta.env.VITE_API_ENDPOINT}/${pin.thumbnailPath
                                                            }`}
                                                        className='rounded-full aspect-square object-center object-cover outline outline-2 outline-white'
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <button
                                type='button'
                                className='flex items-center justify-center gap-4 px-16 py-8 border-4 border-dashed border-white rounded-lg hover:opacity-80'
                                onClick={handleSelectMap}
                            >
                                <Unicons.UilMap size='32' className='text-white' />
                                <span className='font-semibold text-lg text-white'>Chọn bản đồ</span>
                            </button>
                        )}
                    </div>
                    <MapPane />
                </Fade>
            )}
        </AnimatePresence>
    );
}
