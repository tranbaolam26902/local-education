/* Libraries */
import { createSlice } from '@reduxjs/toolkit';
import * as uuid from 'uuid';

const initialState = {
    isGettingPosition: false,
    currentLinkHotspot: {
        linkId: uuid.NIL,
        sceneIndex: -1,
        title: '',
        x: 0,
        y: 0,
        z: 0
    },
    isNewHotspot: false
};
const linkHotspotSlice = createSlice({
    name: 'linkHotspot',
    initialState,
    reducers: {
        enableGettingLinkHotspotPosition: (state) => {
            state.isGettingPosition = true;
        },
        disableGettingLinkHotspotPosition: (state) => {
            state.isGettingPosition = false;
        },
        setCurrentLinkHotspot: (state, action) => {
            state.currentLinkHotspot = action.payload;
        },
        resetCurrentLinkHotspot: (state) => {
            state.currentLinkHotspot = initialState.currentLinkHotspot;
        },
        enableIsNewLinkHotspot: (state) => {
            state.isNewHotspot = true;
        },
        disableIsNewLinkHotspot: (state) => {
            state.isNewHotspot = false;
        }
    }
});

export const linkHotspotReducer = linkHotspotSlice.reducer;
export const selectLinkHotspot = (state) => state.linkHotspot;
export const {
    enableGettingLinkHotspotPosition,
    disableGettingLinkHotspotPosition,
    setCurrentLinkHotspot,
    resetCurrentLinkHotspot,
    enableIsNewLinkHotspot,
    disableIsNewLinkHotspot
} = linkHotspotSlice.actions;
