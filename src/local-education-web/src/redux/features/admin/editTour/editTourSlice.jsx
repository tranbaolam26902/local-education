/* Libraries */
import { createSlice } from '@reduxjs/toolkit';
import * as uuid from 'uuid';

const initialState = {
    editingTour: {
        createdDate: '',
        id: '',
        isDeleted: false,
        isPublished: false,
        scenes: [],
        title: '',
        urlPreview: '',
        username: '',
        viewCount: 0
    },
    currentScene: {
        index: -1,
        x: 0,
        y: 0,
        z: 0,
        urlPreview: '',
        urlImage: '',
        title: '',
        linkHotspots: [],
        infoHotspots: [],
        audio: null
    },
    hasChanges: false,
    currentDestinationScene: null,
    lessonParentCourseId: uuid.NIL,
    currentDestinationLessonId: uuid.NIL,
    isUpdatePanorama: {}
};
const editTourSlice = createSlice({
    name: 'editTour',
    initialState,
    reducers: {
        setEditingTour: (state, action) => {
            state.editingTour = action.payload;
        },
        setStartUpScene: (state, action) => {
            const firstScene = state.editingTour.scenes[0];
            const currentScene = state.editingTour.scenes.find((scene) => scene.index === action.payload);

            state.editingTour.scenes = state.editingTour.scenes.map((scene) => {
                if (scene.index === action.payload) scene = { ...firstScene, index: action.payload };
                return scene;
            });
            state.editingTour.scenes[0] = { ...currentScene, index: firstScene.index };
            state.currentScene = state.editingTour.scenes[0];
        },
        addScene: (state, action) => {
            state.editingTour.scenes.push(action.payload);
        },
        editScene: (state, action) => {
            state.editingTour.scenes = state.editingTour.scenes.map((scene) => {
                if (scene.index === action.payload.index) scene = action.payload;
                return scene;
            });
        },
        deleteScene: (state, action) => {
            state.editingTour.scenes = state.editingTour.scenes.filter((scene) => scene.index !== action.payload);
        },
        setCurrentEditingScene: (state, action) => {
            state.currentScene = action.payload;
        },
        resetCurrentEditingScene: (state) => {
            state.currentScene = initialState.currentScene;
        },
        enabledHasChangesScenes: (state) => {
            state.hasChanges = true;
        },
        disableHasChangesScenes: (state) => {
            state.hasChanges = false;
        },
        setCurrentDestinationScene: (state, action) => {
            state.currentDestinationScene = action.payload;
        },
        resetCurrentDestinationScene: (state) => {
            state.currentDestinationScene = initialState.currentDestinationScene;
        },
        setLessonParentCourseId: (state, action) => {
            state.lessonParentCourseId = action.payload;
        },
        resetLessonParentCourseId: (state) => {
            state.lessonParentCourseId = initialState.lessonParentCourseId;
        },
        setCurrentDestinationLessonId: (state, action) => {
            state.currentDestinationLessonId = action.payload;
        },
        resetCurrentDestinationLessonId: (state) => {
            state.currentDestinationLessonId = initialState.currentDestinationLessonId;
        },
        addOrUpdateLinkHotspot: (state, action) => {
            state.editingTour.scenes.forEach((scene) => {
                if (scene.index === action.payload.sceneIndex) {
                    const hotspot = scene.linkHotspots.find(
                        (linkHotspot) => linkHotspot.linkId === action.payload.linkHotspot.linkId
                    );

                    if (!hotspot) {
                        scene.linkHotspots.push(action.payload.linkHotspot);
                    } else {
                        scene.linkHotspots.forEach((linkHotspot) => {
                            if (linkHotspot.linkId === action.payload.linkHotspot.linkId) {
                                linkHotspot.sceneIndex = action.payload.linkHotspot.sceneIndex;
                                linkHotspot.title = action.payload.linkHotspot.title;
                            }
                        });
                    }
                }
            });
        },
        removeLinkHotspotsByDestinationSceneIndex: (state, action) => {
            state.editingTour.scenes = state.editingTour.scenes.map((scene) => {
                scene.linkHotspots = scene.linkHotspots.filter((linkHotspot) => {
                    if (linkHotspot.sceneIndex !== action.payload) return linkHotspot;
                    else if (state.currentScene.index === scene.index) {
                        state.currentScene.linkHotspots = state.currentScene.linkHotspots.filter(
                            (spot) => spot.sceneIndex !== action.payload
                        );
                        state.isUpdatePanorama = {};
                    }
                });
                return scene;
            });
        },
        addOrUpdateInfoHotspot: (state, action) => {
            state.editingTour.scenes.forEach((scene) => {
                if (scene.index === action.payload.sceneIndex) {
                    const hotspot = scene.infoHotspots.find(
                        (infoHotspot) => infoHotspot.infoId === action.payload.infoHotspot.infoId
                    );

                    if (!hotspot) {
                        scene.infoHotspots.push(action.payload.infoHotspot);
                    } else {
                        scene.infoHotspots.forEach((infoHotspot) => {
                            if (infoHotspot.infoId === action.payload.infoHotspot.infoId) {
                                infoHotspot.lessonId = action.payload.infoHotspot.lessonId;
                            }
                        });
                    }
                }
            });
        }
    }
});

export const editTourReducer = editTourSlice.reducer;
export const selectEditTour = (state) => state.editTour;
export const {
    setEditingTour,
    setStartUpScene,
    addScene,
    editScene,
    deleteScene,
    setCurrentEditingScene,
    resetCurrentEditingScene,
    enabledHasChangesScenes,
    disableHasChangesScenes,
    setCurrentDestinationScene,
    resetCurrentDestinationScene,
    setLessonParentCourseId,
    resetLessonParentCourseId,
    setCurrentDestinationLessonId,
    resetCurrentDestinationLessonId,
    addOrUpdateLinkHotspot,
    removeLinkHotspotsByDestinationSceneIndex,
    addOrUpdateInfoHotspot
} = editTourSlice.actions;
