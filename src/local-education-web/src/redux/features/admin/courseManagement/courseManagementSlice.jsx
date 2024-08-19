/* Libraries */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    coursesQueries: {
        Keyword: '',
        IsDeleted: false,
        IsPublished: false,
        NonPublished: false,
        PageNumber: 1,
        PageSize: 10,
        SortColumn: 'createdDate',
        SortOrder: 'desc'
    },
    isUpdateCourses: false
};
const courseManagementSlice = createSlice({
    name: 'courseManagement',
    initialState,
    reducers: {
        setCourseKeyword: (state, action) => {
            state.coursesQueries.Keyword = action.payload;
        },
        showAllCourses: (state) => {
            state.coursesQueries.IsPublished = false;
            state.coursesQueries.NonPublished = false;
            state.coursesQueries.IsDeleted = false;
        },
        showPublishedCourses: (state) => {
            state.coursesQueries.IsPublished = true;
            state.coursesQueries.NonPublished = false;
            state.coursesQueries.IsDeleted = false;
        },
        showNonPublishedCourses: (state) => {
            state.coursesQueries.IsPublished = false;
            state.coursesQueries.NonPublished = true;
            state.coursesQueries.IsDeleted = false;
        },
        showDeletedCourses: (state) => {
            state.coursesQueries.IsPublished = false;
            state.coursesQueries.NonPublished = false;
            state.coursesQueries.IsDeleted = true;
        },
        increaseCoursePageNumber: (state) => {
            state.coursesQueries.PageNumber = Number.parseInt(state.coursesQueries.PageNumber) + 1;
        },
        decreaseCoursePageNumber: (state) => {
            if (state.coursesQueries.PageNumber > 1)
                state.coursesQueries.PageNumber = Number.parseInt(state.coursesQueries.PageNumber) - 1;
        },
        setCoursePageNumber: (state, action) => {
            state.coursesQueries.PageNumber = Number.parseInt(action.payload);
        },
        setCoursePageSize: (state, action) => {
            state.coursesQueries.PageSize = action.payload;
        },
        setCourseSortColumn: (state, action) => {
            state.coursesQueries.SortColumn = action.payload;
        },
        toggleCourseSortOrder: (state) => {
            state.coursesQueries.SortOrder = state.coursesQueries.SortOrder === 'desc' ? 'asc' : 'desc';
        },
        triggerUpdateCourses: (state) => {
            state.isUpdateCourses = !state.isUpdateCourses;
        }
    }
});

export const courseManagementReducer = courseManagementSlice.reducer;
export const selectCourseManagement = (state) => state.courseManagement;
export const {
    setCourseKeyword,
    showAllCourses,
    showPublishedCourses,
    showNonPublishedCourses,
    showDeletedCourses,
    increaseCoursePageNumber,
    decreaseCoursePageNumber,
    setCoursePageNumber,
    setCoursePageSize,
    setCourseSortColumn,
    toggleCourseSortOrder,
    triggerUpdateCourses
} = courseManagementSlice.actions;
