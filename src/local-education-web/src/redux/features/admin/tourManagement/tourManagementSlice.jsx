/* Libraries */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    showCreateTourModal: false,
    showChangeTourTitleModal: false,
    selectedTourInfo: {
        id: '',
        title: ''
    },
    toursQueries: {
        Keyword: '',
        AuthorName: '',
        IsDeleted: false,
        IsPublished: true,
        NonPublished: true,
        PageNumber: 1,
        PageSize: 10,
        SortColumn: 'createdDate',
        SortOrder: 'desc'
    },
    isUpdateTours: true
};
const tourManagementSlice = createSlice({
    name: 'tourManagement',
    initialState,
    reducers: {
        resetTourQueries: (state) => {
            state.toursQueries = initialState.toursQueries;
        },
        setShowCreateTourModal: (state, action) => {
            state.showCreateTourModal = action.payload;
        },
        setShowChangeTourTitleModal: (state, action) => {
            state.showChangeTourTitleModal = action.payload;
        },
        setSelectedTourInfo: (state, action) => {
            state.selectedTourInfo = action.payload;
        },
        setTourKeyword: (state, action) => {
            state.toursQueries.Keyword = action.payload;
        },
        showAllTours: (state) => {
            state.toursQueries.IsPublished = true;
            state.toursQueries.NonPublished = true;
            state.toursQueries.IsDeleted = false;
        },
        showPublishedTours: (state) => {
            state.toursQueries.IsPublished = true;
            state.toursQueries.NonPublished = false;
            state.toursQueries.IsDeleted = false;
        },
        showNonPublishedTours: (state) => {
            state.toursQueries.IsPublished = false;
            state.toursQueries.NonPublished = true;
            state.toursQueries.IsDeleted = false;
        },
        showDeletedTours: (state) => {
            state.toursQueries.IsPublished = false;
            state.toursQueries.NonPublished = true;
            state.toursQueries.IsDeleted = true;
        },
        increaseTourPageNumber: (state) => {
            state.toursQueries.PageNumber = Number.parseInt(state.toursQueries.PageNumber) + 1;
        },
        decreaseTourPageNumber: (state) => {
            if (state.toursQueries.PageNumber > 1)
                state.toursQueries.PageNumber = Number.parseInt(state.toursQueries.PageNumber) - 1;
        },
        setTourPageNumber: (state, action) => {
            state.toursQueries.PageNumber = Number.parseInt(action.payload);
        },
        setTourPageSize: (state, action) => {
            state.toursQueries.PageSize = action.payload;
        },
        setTourSortColumn: (state, action) => {
            state.toursQueries.SortColumn = action.payload;
        },
        toggleTourSortOrder: (state) => {
            state.toursQueries.SortOrder = state.toursQueries.SortOrder === 'desc' ? 'asc' : 'desc';
        },
        setTourSortOrder: (state, action) => {
            state.toursQueries.SortOrder = action.payload;
        },
        triggerUpdateTours: (state) => {
            state.isUpdateTours = !state.isUpdateTours;
        }
    }
});

export const tourManagementReducer = tourManagementSlice.reducer;
export const selectTourManagement = (state) => state.tourManagement;
export const {
    resetTourQueries,
    setShowCreateTourModal,
    setShowChangeTourTitleModal,
    setSelectedTourInfo,
    setTourKeyword,
    showAllTours,
    showPublishedTours,
    showNonPublishedTours,
    showDeletedTours,
    increaseTourPageNumber,
    decreaseTourPageNumber,
    setTourPageNumber,
    setTourPageSize,
    setTourSortColumn,
    toggleTourSortOrder,
    setTourSortOrder,
    triggerUpdateTours
} = tourManagementSlice.actions;
