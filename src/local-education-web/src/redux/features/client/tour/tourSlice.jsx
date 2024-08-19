/* Libraries */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    toursQueries: {
        Keyword: '',
        PageNumber: 1
    },
    currentSceneIndex: -1,
    isShowControlBar: true,
    autoRotate: true,
    showScenesList: false,
    showMap: false,
    isMuteBGM: false,
    isCardboardMode: false,
    slides: null,
    isShowInfoHotspotDetailModal: false
};
const tourSlice = createSlice({
    name: 'tour',
    initialState,
    reducers: {
        setClientTourKeyword: (state, action) => {
            state.toursQueries.Keyword = action.payload;
        },
        increaseClientTourPageNumber: (state) => {
            state.toursQueries.PageNumber = Number.parseInt(state.toursQueries.PageNumber) + 1;
        },
        decreaseClientTourPageNumber: (state) => {
            if (state.toursQueries.PageNumber > 1)
                state.toursQueries.PageNumber = Number.parseInt(state.toursQueries.PageNumber) - 1;
        },
        setClientTourPageNumber: (state, action) => {
            state.toursQueries.PageNumber = Number.parseInt(action.payload);
        },
        setUserCurrentSceneIndex: (state, action) => {
            state.currentSceneIndex = action.payload;
        },
        enableTourControlBar: (state) => {
            state.isShowControlBar = true;
        },
        disableTourControlBar: (state) => {
            state.isShowControlBar = false;
        },
        toggleTourControlBar: (state) => {
            state.isShowControlBar = !state.isShowControlBar;
        },
        disableAutoRotate: (state) => {
            state.autoRotate = false;
        },
        enableAutoRotate: (state) => {
            state.autoRotate = true;
        },
        enableScenesList: (state) => {
            state.showScenesList = true;
        },
        disableScenesList: (state) => {
            state.showScenesList = false;
        },
        enableMap: (state) => {
            state.showMap = true;
        },
        disableMap: (state) => {
            state.showMap = false;
        },
        muteBGM: (state) => {
            state.isMuteBGM = true;
        },
        unmuteBGM: (state) => {
            state.isMuteBGM = false;
        },
        enableCardboardMode: (state) => {
            state.isCardboardMode = true;
        },
        disableCardboardMode: (state) => {
            state.isCardboardMode = false;
        },
        setSlides: (state, action) => {
            state.slides = action.payload;
        },
        resetSlides: (state) => {
            state.slides = initialState.slides;
        },
        showInfoHotspotDetailModal: (state) => {
            state.isShowInfoHotspotDetailModal = true;
        },
        hideInfoHotspotDetailModal: (state) => {
            state.isShowInfoHotspotDetailModal = false;
            state.slides = initialState.slides;
        }
    }
});

export const tourReducer = tourSlice.reducer;
export const selectTour = (state) => state.tour;
export const {
    setClientTourKeyword,
    increaseClientTourPageNumber,
    decreaseClientTourPageNumber,
    setClientTourPageNumber,
    setUserCurrentSceneIndex,
    enableControlBar,
    disableControlBar,
    toggleTourControlBar,
    disableAutoRotate,
    enableAutoRotate,
    enableScenesList,
    disableScenesList,
    enableMap,
    disableMap,
    muteBGM,
    unmuteBGM,
    enableCardboardMode,
    disableCardboardMode,
    setSlides,
    resetSlides,
    showInfoHotspotDetailModal,
    hideInfoHotspotDetailModal
} = tourSlice.actions;
