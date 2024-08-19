import { useEffect, useRef } from 'react';
import { ImagePanorama, Infospot, Viewer } from 'panolens';
import { useDispatch, useSelector } from 'react-redux';
import { useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as THREE from 'three';

/* Assets */
import { icons } from '@assets/icons';

/* Redux */
import {
    disableScenesList,
    enableMap,
    resetSlides,
    selectTour,
    setSlides,
    setUserCurrentSceneIndex,
    showInfoHotspotDetailModal
} from '@redux/features/client/tour';

/* Services */
import { getLessonById, getSlidesByLessonId } from '@services/shared';

/* Utils */
import { findPanoramaById, findPanoramaBySrc } from '@utils/panoramas';
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { ControlBar, InfoHotspotPreview, LinkHotspotPreview, Map, ScenesList } from '@components/client';
import { PageTransition, SlideDetailModal } from '@components/shared';

export default function Tour() {
    /* Hooks */
    const { tour } = useLoaderData();
    const dispatch = useDispatch();

    /* States */
    const tourSlice = useSelector(selectTour);

    /* Refs */
    const viewerElementRef = useRef(null);
    const viewerRef = useRef(null);

    /* Functions */
    const getSceneByIndex = (index) => tour.scenes.find((scene) => scene.index === index);
    const renderLinkHotspots = (scene, panorama) => {
        scene.linkHotspots.forEach((hotspot) => {
            const spot = new Infospot(500, icons.linkHotspot);
            const destinationScene = getSceneByIndex(hotspot.sceneIndex);

            spot.linkId = hotspot.linkId;
            spot.position.set(hotspot.x, hotspot.y, hotspot.z);
            spot.addHoverElement(LinkHotspotPreview({ ...destinationScene, title: hotspot.title }), 150);
            spot.addEventListener('touchstart', () => {
                if (!destinationScene) return;

                dispatch(setUserCurrentSceneIndex(destinationScene.index));
            });
            spot.addEventListener('click', () => {
                if (!destinationScene) return;

                dispatch(setUserCurrentSceneIndex(destinationScene.index));
            });
            panorama.add(spot);
        });
    };
    const renderInfoHotspots = (scene, panorama) => {
        scene.infoHotspots.forEach(async (hotspot) => {
            const spot = new Infospot(500);
            const lesson = await getLessonById(hotspot.lessonId);

            spot.infoId = hotspot.infoId;
            spot.position.set(hotspot.x, hotspot.y, hotspot.z);
            spot.addHoverElement(InfoHotspotPreview(lesson.result), 150);
            spot.addEventListener('touchstart', async () => {
                // Fetch lesson api and open modal
                const slides = await getSlidesByLessonId(lesson.result.id);

                if (slides.result.length !== 0) {
                    dispatch(setSlides(slides.result));
                    dispatch(showInfoHotspotDetailModal());
                } else {
                    toast.error('Không tìm thấy nội dung.');
                    dispatch(resetSlides());
                }
            });
            spot.addEventListener('click', async () => {
                // Fetch lesson api and open modal
                const slides = await getSlidesByLessonId(lesson.result.id);

                if (slides.result.length !== 0) {
                    dispatch(setSlides(slides.result));
                    dispatch(showInfoHotspotDetailModal());
                } else {
                    toast.error('Không tìm thấy nội dung.');
                    dispatch(resetSlides());
                }
            });
            panorama.add(spot);
        });
    };
    /* Load scene into panorama and render its link hotspots */
    const loadScene = (scene) => {
        let panorama, existedPanorama;

        existedPanorama = findPanoramaBySrc(viewerRef, `${import.meta.env.VITE_API_ENDPOINT}/${scene.urlImage}`);
        if (!existedPanorama) {
            panorama = new ImagePanorama(`${import.meta.env.VITE_API_ENDPOINT}/${scene.urlImage}`);
            renderLinkHotspots(scene, panorama);
            renderInfoHotspots(scene, panorama);
        } else panorama = existedPanorama;

        panorama.addEventListener('enter-fade-start', function() {
            viewerRef.current.tweenControlCenter(new THREE.Vector3(scene.x * -1, scene.y, scene.z), 0);
        }); // Set scene initial view position

        existedPanorama = findPanoramaById(viewerRef, panorama.uuid);
        if (!existedPanorama) viewerRef.current.add(panorama);
        viewerRef.current.setPanorama(panorama);
    };
    const initPanoramaViewer = () => {
        if (tour.scenes.length) dispatch(setUserCurrentSceneIndex(tour.scenes[0].index)); // Load tour's first scene
        if (tour.atlas.isShowOnStartUp) dispatch(enableMap()); // Show map on startup

        viewerRef.current = new Viewer({
            container: viewerElementRef.current,
            cameraFov: 72,
            autoRotate: true,
            autoHideInfospot: false,
            autoRotateSpeed: 0.4,
            autoRotateActivationDuration: 1000
        });
        viewerRef.current.toggleControlBar(); // Hide control bar
        dispatch(disableScenesList()); // disable scene list by default
    };
    const setPageTitle = () => {
        initPanoramaViewer();
        document.title = getSubPageTitle(tour.title);
    };

    /* Side effects */
    /* Init component side effects */
    useEffect(() => {
        setPageTitle();
    }, []);
    /* Load current scene */
    useEffect(() => {
        if (tourSlice.currentSceneIndex !== -1) loadScene(getSceneByIndex(tourSlice.currentSceneIndex));
    }, [tourSlice.currentSceneIndex]);

    return (
        <>
            <PageTransition className='fixed inset-0 z-0 overflow-hidden w-full mt-[3.75rem] dark:text-white'>
                <div id='panorama-container' className={`absolute inset-0 flex`}>
                    <div className={`${tourSlice.isCardboardMode ? 'block' : 'hidden'} w-40 h-full bg-black`}></div>
                    <div
                        id='panorama'
                        ref={viewerElementRef}
                        className={`flex-grow ${tourSlice.isCardboardMode ? 'my-auto w-4/5 h-4/5' : ''}`}
                    ></div>
                    <div className={`${tourSlice.isCardboardMode ? 'block' : 'hidden'} w-40 h-full bg-black`}></div>
                </div>
                <ControlBar viewerRef={viewerRef} tour={tour} />
                <ScenesList />
                <Map map={tour.atlas} />
            </PageTransition>
            <SlideDetailModal />
        </>
    );
}
