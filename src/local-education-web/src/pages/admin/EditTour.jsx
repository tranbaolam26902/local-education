/* Libraries */
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* Hooks */
import { useExitPrompt } from '@hooks/admin';

/* Redux */
import {
    resetAllPanesToDefault,
    selectEditTour,
    selectInfoHotspot,
    selectLinkHotspot,
    selectPaneManagement
} from '@redux/features/admin/editTour';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import {
    AudioPane,
    ControlOverlay,
    InfoHotspotPane,
    LinkHotspotPane,
    MapEditor,
    SceneEditor,
    ScenePane
} from '@components/admin';

export default function EditTour() {
    /* Hooks */
    const dispatch = useDispatch();
    const [_, setShowExitPrompt] = useExitPrompt();

    /* States */
    const paneManagement = useSelector(selectPaneManagement);
    const editTour = useSelector(selectEditTour);
    const linkHotspot = useSelector(selectLinkHotspot);
    const infoHotspot = useSelector(selectInfoHotspot);

    /* Refs */
    const viewerElementRef = useRef(null);
    const viewerRef = useRef(null);

    /* Functions */
    const resetPageSettings = () => {
        dispatch(resetAllPanesToDefault());
        document.body.style.overflow = 'hidden';
    };
    const setPageTitle = () => {
        document.title = getSubPageTitle('Chỉnh sửa tour');
    };

    /* Side effects */
    /* Init component side effects */
    useEffect(() => {
        resetPageSettings();
        setPageTitle();
    }, []);
    /* Prevent reload if changes are performed */
    useEffect(() => {
        setShowExitPrompt(editTour.hasChanges);

        return () => {
            setShowExitPrompt(false);
        };
    }, [editTour.hasChanges]);

    return (
        <section className='fixed inset-0 z-0 overflow-hidden w-full mt-[3.75rem] dark:text-white'>
            <SceneEditor viewerElementRef={viewerElementRef} viewerRef={viewerRef} />
            <ScenePane />
            {!paneManagement.disableScenePane && !linkHotspot.isGettingPosition && (
                <ControlOverlay viewerRef={viewerRef} />
            )}
            {linkHotspot.isGettingPosition && (
                <span className='fixed left-1/2 bottom-4 -translate-x-1/2 px-8 py-2 font-semibold text-lg text-white bg-gray-800/40 rounded'>
                    Chọn vị trí cho điểm liên kết
                </span>
            )}
            {infoHotspot.isGettingPosition && (
                <span className='fixed left-1/2 bottom-4 -translate-x-1/2 px-8 py-2 font-semibold text-lg text-white bg-gray-800/40 rounded'>
                    Chọn vị trí cho điểm thông tin
                </span>
            )}
            <LinkHotspotPane viewerRef={viewerRef} />
            <InfoHotspotPane viewerRef={viewerRef} />
            <AudioPane />
            <MapEditor />
        </section>
    );
}
