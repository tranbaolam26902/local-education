/* Libraries */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    darkMode: true,
    tourViewMode: 'grid',
    fileViewMode: 'grid'
};
const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        loadSettings: (state) => {
            const settings = JSON.parse(localStorage.getItem('settings'));

            if (settings !== null) {
                state.darkMode = settings.darkMode;
                state.tourViewMode = settings.tourViewMode;
                state.fileViewMode = settings.fileViewMode;
            }
            document.querySelector('html').classList.toggle('dark', state.darkMode);
        },
        saveSettings: (state) => {
            localStorage.setItem('settings', JSON.stringify(state));
        },
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },
        toggleTourViewMode: (state) => {
            state.tourViewMode = state.tourViewMode === 'grid' ? 'row' : 'grid';
        },
        toggleFileViewMode: (state) => {
            state.fileViewMode = state.fileViewMode === 'grid' ? 'row' : 'grid';
        }
    }
});

export const settingsReducer = settingsSlice.reducer;
export const selectSettings = (state) => state.settings;
export const { loadSettings, saveSettings, toggleDarkMode, toggleTourViewMode, toggleFileViewMode } =
    settingsSlice.actions;
