/* Libraries */
import { createSlice } from '@reduxjs/toolkit';
import * as uuid from 'uuid';

const initialState = {
    isGettingPosition: false,
    currentInfoHotspot: {
        infoId: uuid.NIL,
        lessonId: uuid.NIL,
        x: 0,
        y: 0,
        z: 0
    },
    isNewHotspot: false
};
const infoHotspotSlice = createSlice({
    name: 'infoHotspot',
    initialState,
    reducers: {
        enableGettingInfoHotspotPosition: (state) => {
            state.isGettingPosition = true;
        },
        disableGettingInfoHotspotPosition: (state) => {
            state.isGettingPosition = false;
        },
        setCurrentInfoHotspot: (state, action) => {
            state.currentInfoHotspot = action.payload;
        },
        resetCurrentInfoHotspot: (state) => {
            state.currentInfoHotspot = initialState.currentInfoHotspot;
        },
        enableIsNewInfoHotspot: (state) => {
            state.isNewHotspot = true;
        },
        disableIsNewInfoHotspot: (state) => {
            state.isNewHotspot = false;
        }
    }
});

export const infoHotspotReducer = infoHotspotSlice.reducer;
export const selectInfoHotspot = (state) => state.infoHotspot;
export const {
    enableGettingInfoHotspotPosition,
    disableGettingInfoHotspotPosition,
    setCurrentInfoHotspot,
    resetCurrentInfoHotspot,
    enableIsNewInfoHotspot,
    disableIsNewInfoHotspot
} = infoHotspotSlice.actions;
