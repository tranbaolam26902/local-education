/* Libraries */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    coursesQueries: {
        Keyword: '',
        PageNumber: 1,
        PageSize: 10
    }
};
const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        setClientCourseKeyword: (state, action) => {
            state.coursesQueries.Keyword = action.payload;
        },
        increaseClientCoursePageNumber: (state) => {
            state.coursesQueries.PageNumber = Number.parseInt(state.coursesQueries.PageNumber) + 1;
        },
        decreaseClientCoursePageNumber: (state) => {
            if (state.coursesQueries.PageNumber > 1)
                state.coursesQueries.PageNumber = Number.parseInt(state.coursesQueries.PageNumber) - 1;
        },
        setClientCoursePageNumber: (state, action) => {
            state.coursesQueries.PageNumber = Number.parseInt(action.payload);
        },
        setClientCoursePageSize: (state, action) => {
            state.coursesQueries.PageSize = action.payload;
        },
        setClientCourseSortColumn: (state, action) => {
            state.coursesQueries.SortColumn = action.payload;
        },
        toggleClientCourseSortOrder: (state) => {
            state.coursesQueries.SortOrder = state.coursesQueries.SortOrder === 'desc' ? 'asc' : 'desc';
        },
        setClientCourseSortOrder: (state, action) => {
            state.coursesQueries.SortOrder = action.payload;
        }
    }
});

export const courseReducer = courseSlice.reducer;
export const selectCourse = (state) => state.course;
export const {
    setClientCourseKeyword,
    increaseClientCoursePageNumber,
    decreaseClientCoursePageNumber,
    setClientCoursePageNumber,
    setClientCoursePageSize,
    setClientCourseSortColumn,
    toggleClientCourseSortOrder,
    setClientCourseSortOrder
} = courseSlice.actions;
