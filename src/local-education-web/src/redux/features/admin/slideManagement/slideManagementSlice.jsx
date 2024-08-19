/* Libraries */
import { createSlice } from '@reduxjs/toolkit';

const initialState = { isUpdateSlides: false };
const slideManagementSlice = createSlice({
    name: 'slideManagement',
    initialState,
    reducers: {
        triggerUpdateSlides: (state) => {
            state.isUpdateSlides = !state.isUpdateSlides;
        }
    }
});

export const slideManagementReducer = slideManagementSlice.reducer;
export const selectSlideManagement = (state) => state.slideManagement;
export const { triggerUpdateSlides } = slideManagementSlice.actions;
