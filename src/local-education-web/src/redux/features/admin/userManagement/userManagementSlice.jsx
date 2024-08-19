/* Libraries */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    usersQueries: {
        Keyword: '',
        PageNumber: 1,
        PageSize: 10,
        SortColumn: 'createdDate',
        SortOrder: 'desc'
    },
    isUpdateUsers: false
};
const userManagementSlice = createSlice({
    name: 'userManagement',
    initialState,
    reducers: {
        setUserKeyword: (state, action) => {
            state.usersQueries.Keyword = action.payload;
        },
        increaseUserPageNumber: (state) => {
            state.usersQueries.PageNumber = Number.parseInt(state.usersQueries.PageNumber) + 1;
        },
        decreaseUserPageNumber: (state) => {
            if (state.usersQueries.PageNumber > 1)
                state.usersQueries.PageNumber = Number.parseInt(state.usersQueries.PageNumber) - 1;
        },
        setUserPageNumber: (state, action) => {
            state.usersQueries.PageNumber = Number.parseInt(action.payload);
        },
        setUserPageSize: (state, action) => {
            state.usersQueries.PageSize = action.payload;
        },
        setUserSortColumn: (state, action) => {
            state.usersQueries.SortColumn = action.payload;
        },
        toggleUserSortOrder: (state) => {
            state.usersQueries.SortOrder = state.usersQueries.SortOrder === 'desc' ? 'asc' : 'desc';
        },
        setUserSortOrder: (state, action) => {
            state.usersQueries.SortOrder = action.payload;
        },
        triggerUpdateUsers: (state) => {
            state.isUpdateUsers = !state.isUpdateUsers;
        }
    }
});

export const userManagementReducer = userManagementSlice.reducer;
export const selectUserManagement = (state) => state.userManagement;
export const {
    setUserKeyword,
    increaseUserPageNumber,
    decreaseUserPageNumber,
    setUserPageNumber,
    setUserPageSize,
    setUserSortColumn,
    toggleUserSortOrder,
    setUserSortOrder,
    triggerUpdateUsers
} = userManagementSlice.actions;
