/* Libraries */
import { createSlice } from '@reduxjs/toolkit';

const initialState = { isUpdateLessons: false };
const lessonManagementSlice = createSlice({
    name: 'lessonManagement',
    initialState,
    reducers: {
        triggerUpdateLessons: (state) => {
            state.isUpdateLessons = !state.isUpdateLessons;
        }
    }
});

export const lessonManagementReducer = lessonManagementSlice.reducer;
export const selectLessonManagement = (state) => state.lessonManagement;
export const { triggerUpdateLessons } = lessonManagementSlice.actions;
