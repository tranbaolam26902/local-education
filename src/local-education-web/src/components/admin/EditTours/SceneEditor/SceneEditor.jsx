/* Libraries */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ImagePanorama, Infospot, Viewer } from 'panolens';
import * as THREE from 'three';
import { v4 as uuid } from 'uuid';

/* Assets */
import { icons } from '@assets/icons';

/* Redux */
import {
    disableGettingLinkHotspotPosition,
    resetCurrentEditingScene,
    selectEditTour,
    selectLinkHotspot,
    setCurrentDestinationScene,
    setCurrentLinkHotspot,
    setCurrentEditingScene,
    showLinkHotspotPane,
    enableIsNewLinkHotspot,
    selectInfoHotspot,
    setCurrentInfoHotspot,
    disableGettingInfoHotspotPosition,
    enableIsNewInfoHotspot,
    showInfoHotspotPane,
    setCurrentDestinationLessonId
} from '@redux/features/admin/editTour';

/* Utils */
import { findPanoramaById, findPanoramaBySrc, getPositionOnPanorama } from '@utils/panoramas';

export default function SceneEditor(props) {
    const { viewerElementRef, viewerRef } = props;

    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const editTour = useSelector(selectEditTour);
    const linkHotspot = useSelector(selectLinkHotspot);
    const infoHotspot = useSelector(selectInfoHotspot);

    /* Functions */
    /* Render scene's saved link hotspots with click event for editing hotspot */
    const renderSceneSavedLinkHotspots = (scene, panorama) => {
        scene.linkHotspots.forEach((hotspot) => {
            const spot = new Infospot(500, icons.linkHotspot);

            spot.linkId = hotspot.linkId;
            spot.position.set(hotspot.x, hotspot.y, hotspot.z);
            spot.addEventListener('touchstart', () => {
                const destinationScene = editTour.editingTour.scenes.find(
                    (scene) => scene.index === hotspot.sceneIndex
                );
                if (!destinationScene) return;

                dispatch(setCurrentLinkHotspot(hotspot));
                dispatch(
                    setCurrentDestinationScene({
                        ...destinationScene,
                        title: hotspot.title
                    })
                );
                dispatch(showLinkHotspotPane());
                spot.focus();
            });
            spot.addEventListener('click', () => {
                const destinationScene = editTour.editingTour.scenes.find(
                    (scene) => scene.index === hotspot.sceneIndex
                );
                if (!destinationScene) return;

                dispatch(setCurrentLinkHotspot(hotspot));
                dispatch(
                    setCurrentDestinationScene({
                        ...destinationScene,
                        title: hotspot.title
                    })
                );
                dispatch(showLinkHotspotPane());
                spot.focus();
            });
            panorama.add(spot);
        });
    };
    /* Render scene's saved info hotspots with click event for editing hotspot */
    const renderSceneSavedInfoHotspots = (scene, panorama) => {
        scene.infoHotspots.forEach((hotspot) => {
            const spot = new Infospot(500);

            spot.infoId = hotspot.infoId;
            spot.position.set(hotspot.x, hotspot.y, hotspot.z);
            spot.addEventListener('touchstart', () => {
                dispatch(setCurrentInfoHotspot(hotspot));
                dispatch(setCurrentDestinationLessonId(hotspot.lessonId));
                dispatch(showInfoHotspotPane());
                spot.focus();
            });
            spot.addEventListener('click', () => {
                dispatch(setCurrentInfoHotspot(hotspot));
                dispatch(setCurrentDestinationLessonId(hotspot.lessonId));
                dispatch(showInfoHotspotPane());
                spot.focus();
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
            renderSceneSavedLinkHotspots(scene, panorama);
            renderSceneSavedInfoHotspots(scene, panorama);
        } else panorama = existedPanorama;

        panorama.addEventListener('enter-fade-start', function() {
            viewerRef.current.tweenControlCenter(new THREE.Vector3(scene.x * -1, scene.y, scene.z), 0);
        }); // Set scene initial view position

        existedPanorama = findPanoramaById(viewerRef, panorama.uuid);
        if (!existedPanorama) viewerRef.current.add(panorama);
        viewerRef.current.setPanorama(panorama);
    };

    /* Side effects */
    /* Handle add link hotspot to panorama */
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer?.panorama || !linkHotspot.isGettingPosition) return;

        viewer.panorama._listeners.click = [];
        viewer.panorama.addEventListener('touchstart', () => {
            const clickedPosition = getPositionOnPanorama(viewer);
            const linkHotspot = new Infospot(500, icons.linkHotspot);

            linkHotspot.linkId = uuid();
            linkHotspot.position.set(clickedPosition.x * -1, clickedPosition.y, clickedPosition.z);
            dispatch(
                setCurrentLinkHotspot({
                    linkId: linkHotspot.linkId,
                    x: clickedPosition.x * -1,
                    y: clickedPosition.y,
                    z: clickedPosition.z
                })
            );
            viewer.panorama.add(linkHotspot);
            linkHotspot.show();
            linkHotspot.focus();

            dispatch(disableGettingLinkHotspotPosition());
            dispatch(enableIsNewLinkHotspot());
            dispatch(showLinkHotspotPane());
        });
        viewer.panorama.addEventListener('click', () => {
            const clickedPosition = getPositionOnPanorama(viewer);
            const linkHotspot = new Infospot(500, icons.linkHotspot);

            linkHotspot.linkId = uuid();
            linkHotspot.position.set(clickedPosition.x * -1, clickedPosition.y, clickedPosition.z);
            dispatch(
                setCurrentLinkHotspot({
                    linkId: linkHotspot.linkId,
                    x: clickedPosition.x * -1,
                    y: clickedPosition.y,
                    z: clickedPosition.z
                })
            );
            viewer.panorama.add(linkHotspot);
            linkHotspot.show();
            linkHotspot.focus();

            dispatch(disableGettingLinkHotspotPosition());
            dispatch(enableIsNewLinkHotspot());
            dispatch(showLinkHotspotPane());
        });

        return () => {
            viewer.panorama._listeners.click = [];
        };
    }, [linkHotspot.isGettingPosition]);
    /* Handle add info hotspot to panorama */
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer?.panorama || !infoHotspot.isGettingPosition) return;

        viewer.panorama._listeners.click = [];
        viewer.panorama.addEventListener('touchstart', () => {
            const clickedPosition = getPositionOnPanorama(viewer);
            const infoHotspot = new Infospot(500);

            infoHotspot.infoId = uuid();
            infoHotspot.position.set(clickedPosition.x * -1, clickedPosition.y, clickedPosition.z);
            dispatch(
                setCurrentInfoHotspot({
                    infoId: infoHotspot.infoId,
                    x: clickedPosition.x * -1,
                    y: clickedPosition.y,
                    z: clickedPosition.z
                })
            );
            viewer.panorama.add(infoHotspot);
            infoHotspot.show();
            infoHotspot.focus();

            dispatch(disableGettingInfoHotspotPosition());
            dispatch(enableIsNewInfoHotspot());
            dispatch(showInfoHotspotPane());
        });
        viewer.panorama.addEventListener('click', () => {
            const clickedPosition = getPositionOnPanorama(viewer);
            const infoHotspot = new Infospot(500);

            infoHotspot.infoId = uuid();
            infoHotspot.position.set(clickedPosition.x * -1, clickedPosition.y, clickedPosition.z);
            dispatch(
                setCurrentInfoHotspot({
                    infoId: infoHotspot.infoId,
                    x: clickedPosition.x * -1,
                    y: clickedPosition.y,
                    z: clickedPosition.z
                })
            );
            viewer.panorama.add(infoHotspot);
            infoHotspot.show();
            infoHotspot.focus();

            dispatch(disableGettingInfoHotspotPosition());
            dispatch(enableIsNewInfoHotspot());
            dispatch(showInfoHotspotPane());
        });

        return () => {
            viewer.panorama._listeners.click = [];
        };
    }, [infoHotspot.isGettingPosition]);
    /* Initialize Panorama Viewer */
    useEffect(() => {
        viewerRef.current = new Viewer({
            container: viewerElementRef.current,
            cameraFov: 72,
            autoHideInfospot: false,
            autoRotateSpeed: 1,
            autoRotateActivationDuration: 1000,
            controlBar: false
        });
    }, []);
    /* Handle current scene when tour's scenes is changed */
    useEffect(() => {
        if (editTour.editingTour.scenes.length === 0) {
            dispatch(resetCurrentEditingScene());
            return;
        }

        // Assign first scene to current scene if it is deleted
        if (!editTour.editingTour.scenes.find((scene) => scene.index === editTour.currentScene.index))
            dispatch(setCurrentEditingScene(editTour.editingTour.scenes[0]));
    }, [editTour.editingTour.scenes]);
    /* Load current scene if existed */
    useEffect(() => {
        if (editTour.currentScene.urlImage) loadScene(editTour.currentScene);
        else viewerRef.current.dispose();
    }, [editTour.currentScene.urlImage, editTour.isUpdatePanorama]);
    /* Load first scene on change tour */
    useEffect(() => {
        if (editTour.editingTour.scenes.length !== 0) dispatch(setCurrentEditingScene(editTour.editingTour.scenes[0]));
    }, [editTour.editingTour.id]);

    return (
        <div
            id='panorama'
            ref={viewerElementRef}
            className={`w-full h-full${linkHotspot.isGettingPosition ? ' cursor-crosshair' : ''}`}
        ></div>
    );
}
