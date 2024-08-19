/* Libraries */
import { createSlice } from '@reduxjs/toolkit';
import * as uuid from 'uuid';

const initialState = {
    showFileManagementModal: false,
    currentCategory: 'all',
    multiSelectMode: false,
    showFilePreviewModal: false,
    showMobileFilePreviewSection: false,
    currentFile: {
        id: '',
        name: '',
        path: '',
        thumbnailPath: '',
        createdDate: '',
        folderId: '',
        fileType: '',
        isDeleted: false,
        size: 0
    },
    selectedFiles: [],
    fileQueries: {
        Keyword: '',
        IsDeleted: false,
        FolderId: uuid.NIL,
        PageNumber: 1,
        PageSize: 20,
        SortColumn: 'createdDate',
        SortOrder: 'desc'
    },
    isUpdateFiles: false,
    isShowFileRenameModal: false,
    isSelectingFiles: false, // For showing Select button
    selectFileCallback: () => { }, // For selecting files
    selectedResult: [], // Get selected files
    allowedCategory: '', // Display single category
    showMultiSelectModeButton: true
};
const fileManagementSlice = createSlice({
    name: 'fileManagement',
    initialState,
    reducers: {
        resetFileManagementSlice: (state) => {
            state.showFileManagementModal = initialState.showFileManagementModal;
            state.currentCategory = initialState.currentCategory;
            state.multiSelectMode = initialState.multiSelectMode;
            state.showFilePreviewModal = initialState.showFilePreviewModal;
            state.showMobileFilePreviewSection = initialState.showMobileFilePreviewSection;
            state.currentFile = initialState.currentFile;
            state.selectedFiles = initialState.selectedFiles;
            state.fileQueries = initialState.fileQueries;
            state.isUpdateFiles = initialState.isUpdateFiles;
            state.isSelectingFiles = initialState.isSelectingFiles;
            state.allowedCategory = initialState.allowedCategory;
            state.showMultiSelectModeButton = initialState.showMultiSelectModeButton;
        },
        disableFileManagementModal: (state) => {
            state.showFileManagementModal = false;
        },
        enableFileManagementModal: (state, action) => {
            if (action.payload === true) state.isSelectingFiles = true;
            state.showFileManagementModal = true;
        },
        setCurrentCategory: (state, action) => {
            state.currentCategory = action.payload;
        },
        resetCategoryToDefault: (state) => {
            state.currentCategory = initialState.currentCategory;
        },
        toggleMultiSelectMode: (state) => {
            state.multiSelectMode = !state.multiSelectMode;
        },
        disableFilePreviewModal: (state) => {
            state.showFilePreviewModal = false;
        },
        enableFilePreviewModal: (state) => {
            state.showFilePreviewModal = true;
        },
        disableMobileFilePreviewSection: (state) => {
            state.showMobileFilePreviewSection = false;
        },
        enableMobileFilePreviewSection: (state) => {
            state.showMobileFilePreviewSection = true;
        },
        setCurrentFile: (state, action) => {
            state.currentFile = action.payload;
        },
        resetCurrentFile: (state) => {
            state.currentFile = initialState.currentFile;
        },
        addFileToSelectedList: (state, action) => {
            state.selectedFiles.push(action.payload);
        },
        removeFileFromSelectedList: (state, action) => {
            state.selectedFiles = state.selectedFiles.filter((selectedFile) => selectedFile.id !== action.payload.id);
        },
        clearSelectedFiles: (state) => {
            state.selectedFiles = initialState.selectedFiles;
        },
        resetFileQueries: (state) => {
            state.fileQueries = initialState.fileQueries;
        },
        setFileKeyword: (state, action) => {
            state.fileQueries.Keyword = action.payload;
        },
        showDeletedFiles: (state) => {
            state.fileQueries.IsDeleted = true;
        },
        hideDeletedFiles: (state) => {
            state.fileQueries.IsDeleted = false;
        },
        showAllFiles: (state) => {
            state.fileQueries.FolderId = initialState.fileQueries.FolderId;
        },
        setFileFolderId: (state, action) => {
            state.fileQueries.FolderId = action.payload;
        },
        increaseFilePageNumber: (state) => {
            state.fileQueries.PageNumber = Number.parseInt(state.fileQueries.PageNumber) + 1;
        },
        decreaseFilePageNumber: (state) => {
            if (state.fileQueries.PageNumber > 1)
                state.fileQueries.PageNumber = Number.parseInt(state.fileQueries.PageNumber) - 1;
        },
        setFilePageNumber: (state, action) => {
            state.fileQueries.PageNumber = Number.parseInt(action.payload);
        },
        setFilePageSize: (state, action) => {
            state.fileQueries.PageSize = action.payload;
        },
        setFileSortColumn: (state, action) => {
            state.fileQueries.SortColumn = action.payload;
        },
        toggleFileSortOrder: (state) => {
            state.fileQueries.SortOrder = state.fileQueries.SortOrder === 'desc' ? 'asc' : 'desc';
        },
        triggerUpdateFiles: (state) => {
            state.isUpdateFiles = !state.isUpdateFiles;
        },
        showFileRenameModal: (state) => {
            state.isShowFileRenameModal = true;
        },
        hideFileRenameModal: (state) => {
            state.isShowFileRenameModal = false;
        },
        enableIsSelectingFiles: (state) => {
            state.isSelectingFiles = true;
        },
        disableIsSelectingFiles: (state) => {
            state.isSelectingFiles = false;
        },
        setSelectFileCallback: (state, action) => {
            state.selectFileCallback = action.payload;
        },
        triggerSelectFileCallback: (state) => {
            state.selectedResult = state.selectedFiles;
            state.selectFileCallback();
        },
        setAllowedCategory: (state, action) => {
            state.allowedCategory = action.payload;
        },
        enableMultiSelectModeButton: (state) => {
            state.showMultiSelectModeButton = true;
        },
        disableMultiSelectModeButton: (state) => {
            state.showMultiSelectModeButton = false;
        }
    }
});

export const fileManagementReducer = fileManagementSlice.reducer;
export const selectFileManagement = (state) => state.fileManagement;
export const {
    resetFileManagementSlice,
    disableFileManagementModal,
    enableFileManagementModal,
    setCurrentCategory,
    resetCategoryToDefault,
    toggleMultiSelectMode,
    disableFilePreviewModal,
    enableFilePreviewModal,
    disableMobileFilePreviewSection,
    enableMobileFilePreviewSection,
    setCurrentFile,
    resetCurrentFile,
    addFileToSelectedList,
    removeFileFromSelectedList,
    clearSelectedFiles,
    resetFileQueries,
    setFileKeyword,
    showDeletedFiles,
    hideDeletedFiles,
    showAllFiles,
    setFileFolderId,
    increaseFilePageNumber,
    decreaseFilePageNumber,
    setFilePageNumber,
    setFilePageSize,
    setFileSortColumn,
    toggleFileSortOrder,
    triggerUpdateFiles,
    showFileRenameModal,
    hideFileRenameModal,
    enableIsSelectingFiles,
    disableIsSelectingFiles,
    setSelectFileCallback,
    triggerSelectFileCallback,
    setAllowedCategory,
    enableMultiSelectModeButton,
    disableMultiSelectModeButton
} = fileManagementSlice.actions;
