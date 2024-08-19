/* Libraries */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    coursesQueries: {
        PageNumber: 1
    },
    isUpdateCourses: false
};
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        increaseProfileCoursePageNumber: (state) => {
            state.coursesQueries.PageNumber = Number.parseInt(state.coursesQueries.PageNumber) + 1;
        },
        decreaseProfileCoursePageNumber: (state) => {
            if (state.coursesQueries.PageNumber > 1)
                state.coursesQueries.PageNumber = Number.parseInt(state.coursesQueries.PageNumber) - 1;
        },
        setProfileCoursePageNumber: (state, action) => {
            state.coursesQueries.PageNumber = Number.parseInt(action.payload);
        },
        triggerUpdateProfileCourses: (state) => {
            state.isUpdateCourses = !state.isUpdateCourses;
        }
    }
});

export const profileReducer = profileSlice.reducer;
export const selectProfile = (state) => state.profile;
export const {
    increaseProfileCoursePageNumber,
    decreaseProfileCoursePageNumber,
    setProfileCoursePageNumber,
    triggerUpdateProfileCourses
} = profileSlice.actions;
