/* Libraries */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    disableScenePane: false,
    isShowScenePane: true,
    isShowLinkHotspotPane: false,
    isShowInfoHotspotPane: false,
    isShowAudioPane: false,
    isShowMapEditor: false
};
const paneManagementSlice = createSlice({
    name: 'paneManagement',
    initialState,
    reducers: {
        resetAllPanesToDefault: (state) => {
            state.disableScenePane = initialState.disableScenePane;
            state.isShowScenePane = initialState.isShowScenePane;
            state.isShowLinkHotspotPane = initialState.isShowLinkHotspotPane;
            state.isShowInfoHotspotPane = initialState.isShowInfoHotspotPane;
            state.isShowAudioPane = initialState.isShowAudioPane;
            state.isShowMapEditor = initialState.isShowMapEditor;
        },
        showScenePane: (state) => {
            state.isShowScenePane = true;
        },
        hideScenePane: (state) => {
            state.isShowScenePane = false;
        },
        toggleShowScenePane: (state) => {
            state.isShowScenePane = !state.isShowScenePane;
        },
        showLinkHotspotPane: (state) => {
            state.isShowLinkHotspotPane = true;
            state.disableScenePane = true;
        },
        hideLinkHotspotPane: (state) => {
            state.isShowLinkHotspotPane = false;
            state.disableScenePane = false;
        },
        showInfoHotspotPane: (state) => {
            state.isShowInfoHotspotPane = true;
            state.disableScenePane = true;
        },
        hideInfoHotspotPane: (state) => {
            state.isShowInfoHotspotPane = false;
            state.disableScenePane = false;
        },
        showAudioPane: (state) => {
            state.isShowAudioPane = true;
            state.disableScenePane = true;
        },
        disableAudioPane: (state) => {
            state.isShowAudioPane = false;
            state.disableScenePane = false;
        },
        showMapEditor: (state) => {
            state.isShowMapEditor = true;
            state.disableScenePane = true;
        },
        hideMapEditor: (state) => {
            state.isShowMapEditor = false;
            state.disableScenePane = false;
        },
        disableScenePane: (state) => {
            state.disableScenePane = true;
        }
    }
});

export const paneManagementReducer = paneManagementSlice.reducer;
export const selectPaneManagement = (state) => state.paneManagement;
export const {
    resetAllPanesToDefault,
    showScenePane,
    hideScenePane,
    toggleShowScenePane,
    showLinkHotspotPane,
    hideLinkHotspotPane,
    showInfoHotspotPane,
    hideInfoHotspotPane,
    showAudioPane,
    disableAudioPane,
    showMapEditor,
    hideMapEditor,
    disableScenePane
} = paneManagementSlice.actions;
