/* Libraries */
import { useEffect } from 'react';
import * as Unicons from '@iconscout/react-unicons';
import { useDispatch, useSelector } from 'react-redux';
import * as THREE from 'three';
import { MODES } from 'panolens';

/* Assets */
import audios from '@assets/audios';

/* Redux */
import {
    disableAutoRotate,
    disableCardboardMode,
    disableMap,
    disableScenesList,
    enableAutoRotate,
    enableCardboardMode,
    enableMap,
    enableScenesList,
    muteBGM,
    selectTour,
    toggleTourControlBar,
    unmuteBGM
} from '@redux/features/client/tour';

/* Utils */
import CONTROL_BAR_OPTIONS from '@utils/constants/ControlBar';

export default function ControlBar({ viewerRef, tour }) {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const tourSlice = useSelector(selectTour);

    /* Functions */
    const getSceneByIndex = (index) => tour.scenes.find((scene) => scene.index === index);

    /* Event handlers */
    const handleAutoRotate = () => {
        if (tourSlice.autoRotate) dispatch(disableAutoRotate());
        else dispatch(enableAutoRotate());
    };
    const handleZoomIn = () => {
        var currentZoom = viewerRef.current.camera.fov;
        var newZoom = currentZoom - CONTROL_BAR_OPTIONS.ZOOM_LEVEL;
        if (newZoom < CONTROL_BAR_OPTIONS.ZOOM_MIN) newZoom = CONTROL_BAR_OPTIONS.ZOOM_MIN;
        viewerRef.current.setCameraFov(newZoom);
    };
    const handleZoomOut = () => {
        var currentZoom = viewerRef.current.camera.fov;
        var newZoom = currentZoom + CONTROL_BAR_OPTIONS.ZOOM_LEVEL;
        if (newZoom > CONTROL_BAR_OPTIONS.ZOOM_MAX) newZoom = CONTROL_BAR_OPTIONS.ZOOM_MAX;
        viewerRef.current.setCameraFov(newZoom);
    };
    const handleShowScenesList = () => {
        if (!tourSlice.showScenesList) dispatch(enableScenesList());
        else dispatch(disableScenesList());
    };
    const handleShowMap = () => {
        if (!tourSlice.showMap) dispatch(enableMap());
        else dispatch(disableMap());
    };
    const handleMuteBGM = () => {
        if (!tourSlice.isMuteBGM) dispatch(muteBGM());
        else dispatch(unmuteBGM());
    };
    const handleResetInitialView = () => {
        const currentScene = getSceneByIndex(tourSlice.currentSceneIndex);
        viewerRef.current.tweenControlCenter(
            new THREE.Vector3(currentScene.x * -1, currentScene.y, currentScene.z),
            1000
        );
        dispatch(disableAutoRotate());
    };
    const handleExitCardboardMode = () => {
        if (document.fullscreenElement) document.exitFullscreen(); // Exit fullscreen mode

        dispatch(disableCardboardMode());

        // Remove exit fullscreen button from viewer
        const viewer = document.getElementById('panorama-container');
        const btn = document.getElementById('btn-exit-fullscreen');
        viewer.removeChild(btn);
    };
    const handleEnableCardboardMode = () => {
        if (tourSlice.isCardboardMode) return;

        dispatch(enableCardboardMode());

        const viewer = document.getElementById('panorama-container');
        if (!viewer) return;

        viewer.requestFullscreen(); // Enter fullscreen mode

        // Add exit fullscreen button to viewer
        const exitButton = document.createElement('button');
        exitButton.id = 'btn-exit-fullscreen';
        exitButton.type = 'button';
        exitButton.classList = 'fixed top-2 right-2 font-bold text-white';
        exitButton.innerHTML = `&#x2715;`;
        exitButton.addEventListener('touchstart', handleExitCardboardMode);
        exitButton.addEventListener('click', handleExitCardboardMode);
        viewer.appendChild(exitButton);
    };

    /* Side effects */
    /* Handle auto rotate */
    useEffect(() => {
        if (!viewerRef.current) return;

        if (tourSlice.autoRotate) viewerRef.current.enableAutoRate();
        else viewerRef.current.disableAutoRate();
    }, [tourSlice.autoRotate]);
    /* Handle audio autoplay */
    useEffect(() => {
        if (tourSlice.currentSceneIndex === -1) return;

        const audio = document.querySelector('#scene-audio');
        if (!audio) return;

        const scene = getSceneByIndex(tourSlice.currentSceneIndex);
        if (scene.audio === null) {
            audio.src = audios.silence;
            return;
        }

        audio.src = `${import.meta.env.VITE_API_ENDPOINT}/${scene.audio.path}`;
        audio.loop = scene.audio.loopAudio;
        if (scene.audio.autoPlay) {
            dispatch(unmuteBGM());
            audio.play();
        } else dispatch(muteBGM());
    }, [tourSlice.currentSceneIndex]);
    /* Handle mute BGM */
    useEffect(() => {
        const audio = document.querySelector('#scene-audio');
        if (!audio) return;

        if (tourSlice.isMuteBGM) audio.pause();
        else audio.play();
    }, [tourSlice.isMuteBGM]);
    /* Handle toggle view mode */
    useEffect(() => {
        if (!viewerRef.current) return;

        if (tourSlice.isCardboardMode) {
            viewerRef.current.enableControl(1); // Enable sensor
            viewerRef.current.enableEffect(MODES.CARDBOARD); // Enable cardboard mode
        } else {
            viewerRef.current.enableControl(0); // Disable sensor
            viewerRef.current.enableEffect(MODES.NORMAL); // Disable cardboard mode
        }
    }, [tourSlice.isCardboardMode]);

    return (
        <section
            className={`absolute z-10 left-0 right-0 bottom-0 flex items-center justify-center px-6 py-2 w-full bg-white dark:bg-black dark:text-white dark:outline dark:outline-1 dark:outline-gray-500 transition-transform duration-200 ${!tourSlice.isShowControlBar ? ' translate-y-full' : ''
                }`}
        >
            <button
                type='button'
                title={`${tourSlice.isShowControlBar ? 'Ẩn' : 'Hiện'}`}
                className='absolute left-1/2 bottom-full -translate-x-1/2 flex items-center justify-center px-4 h-6 bg-white rounded-t-sm dark:bg-black dark:border-t dark:border-gray-500'
                onClick={() => {
                    dispatch(toggleTourControlBar());
                }}
            >
                <Unicons.UilAngleDown
                    size='32'
                    className={`drop-shadow transition-transform duration-200 ${!tourSlice.isShowControlBar ? 'rotate-180' : ''
                        }`}
                />
                <span className='absolute translate-x-px right-full bottom-0 border-[12px] border-t-transparent border-l-transparent border-r-white border-b-white dark:border-r-black dark:border-b-black'></span>
                <span className='absolute -translate-x-px left-full bottom-0 border-[12px] border-t-transparent border-r-transparent border-l-white border-b-white dark:border-l-black dark:border-b-black'></span>
                <span className='dark:block hidden absolute -left-[28px] w-[34px] h-px bg-gray-500 -rotate-45'></span>
                <span className='dark:block hidden absolute -right-[28px] w-[34px] h-px bg-gray-500 rotate-45'></span>
                <span className='dark:block hidden absolute top-full w-32 h-px bg-black'></span>
            </button>
            <div className='flex items-center gap-4'>
                <button
                    type='button'
                    title={`${tourSlice.autoRotate ? 'Tắt tự động xoay' : 'Bật tự động xoay'}`}
                    className='hover:opacity-80'
                    onClick={handleAutoRotate}
                >
                    <Unicons.UilRotate360 size='32' className={`${tourSlice.autoRotate && 'text-blue-400'}`} />
                </button>
                <button type='button' title='Phóng to' className='hover:opacity-80' onClick={handleZoomIn}>
                    <Unicons.UilSearchPlus size='32' />
                </button>
                <button type='button' title='Thu nhỏ' className='hover:opacity-80' onClick={handleZoomOut}>
                    <Unicons.UilSearchMinus size='32' />
                </button>
                <button
                    type='button'
                    title='Danh sách địa điểm'
                    className='hover:opacity-80'
                    onClick={handleShowScenesList}
                >
                    <Unicons.UilAirplay size='32' className={`${tourSlice.showScenesList && 'text-blue-400'}`} />
                </button>
                {tour.atlas.path && (
                    <button type='button' title='Bản đồ' className='hover:opacity-80' onClick={handleShowMap}>
                        <Unicons.UilMap size='32' className={`${tourSlice.showMap && 'text-blue-400'}`} />
                    </button>
                )}
                <button
                    type='button'
                    title={tourSlice.isMuteBGM ? 'Bật nhạc nền' : 'Tắt nhạc nền'}
                    className='hover:opacity-80'
                    onClick={handleMuteBGM}
                >
                    {tourSlice.isMuteBGM ? <Unicons.UilVolumeMute size='32' /> : <Unicons.UilVolumeUp size='32' />}
                </button>
                <audio id='scene-audio' hidden muted={tourSlice.isMuteBGM}>
                    <source src={audios.silence} type='audio/mp3' />
                </audio>
                <button
                    type='button'
                    title='Quay lại điểm ban đầu'
                    className='hover:opacity-80'
                    onClick={handleResetInitialView}
                >
                    <Unicons.UilPower size='32' />
                </button>
                <button
                    type='button'
                    title='Chuyển chế độ xem'
                    className='hover:opacity-80'
                    onClick={tourSlice.isCardboardMode ? handleExitCardboardMode : handleEnableCardboardMode}
                >
                    {tourSlice.isCardboardMode ? (
                        <Unicons.UilPanoramaH size='32' />
                    ) : (
                        <Unicons.UilVoicemailRectangle size='32' />
                    )}
                </button>
            </div>
        </section>
    );
}
