/* Libraries */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isShowMobileNavbar: false
};
const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        showClientMobileNavbar: (state) => {
            state.isShowMobileNavbar = true;
        },
        hideClientMobileNavbar: (state) => {
            state.isShowMobileNavbar = false;
        }
    }
});

export const layoutReducer = layoutSlice.reducer;
export const selectLayout = (state) => state.layout;
export const { showClientMobileNavbar, hideClientMobileNavbar } = layoutSlice.actions;
