/* Libraries */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isWaitingPin: false,
    isNewPin: false,
    isEditingPin: false,
    isEditedMap: false,
    addingPinMessage: 'Chọn toạ độ trên bản đồ để tiếp tục',
    editingPin: {
        name: '',
        top: 0,
        left: 0,
        sceneIndex: 0,
        title: '',
        thumbnailPath: ''
    },
    pins: [],
    mapPath: '',
    isShowOnStartUp: false,
    isUpdateMap: false
};
const editMapSlice = createSlice({
    name: 'editMap',
    initialState,
    reducers: {
        resetEditMapSlice: (state) => {
            state.isWaitingPin = initialState.isWaitingPin;
            state.isNewPin = initialState.isNewPin;
            state.isEditingPin = initialState.isEditingPin;
            state.isEditedMap = initialState.isEditedMap;
            state.addingPinMessage = initialState.addingPinMessage;
            state.editingPin = initialState.editingPin;
        },
        disableIsWaitingPin: (state) => {
            state.isWaitingPin = false;
        },
        enableIsWaitingPin: (state) => {
            state.isWaitingPin = true;
        },
        disableIsNewPin: (state) => {
            state.isNewPin = false;
        },
        enableIsNewPin: (state) => {
            state.isNewPin = true;
        },
        disableIsEditingPin: (state) => {
            state.isEditingPin = false;
        },
        enableIsEditingPin: (state) => {
            state.isEditingPin = true;
        },
        disableIsEditedMap: (state) => {
            state.isEditedMap = false;
        },
        enableIsEditedMap: (state) => {
            state.isEditedMap = true;
        },
        setAddingPinMessage: (state, action) => {
            state.addingPinMessage = action.payload;
        },
        resetAddingPinMessage: (state) => {
            state.addingPinMessage = initialState.addingPinMessage;
        },
        setEditingPin: (state, action) => {
            state.editingPin = action.payload;
        },
        resetEditingPin: (state) => {
            state.editingPin = initialState.editingPin;
        },
        setPins: (state, action) => {
            state.pins = action.payload;
        },
        addPin: (state, action) => {
            state.pins.push(action.payload);
        },
        removePin: (state, action) => {
            state.pins = state.pins.filter((pin) => pin.name !== action.payload);
        },
        removePinBySceneIndex: (state, action) => {
            state.pins = state.pins.filter((pin) => pin.sceneIndex !== action.payload);
            state.isEditedMap = true;
        },
        editPin: (state, action) => {
            state.pins = state.pins.map((pin) => {
                if (pin.name === action.payload.name) pin = action.payload;
                return pin;
            });
        },
        setMapPath: (state, action) => {
            state.mapPath = action.payload;
        },
        setIsShowOnStartUp: (state, action) => {
            state.isShowOnStartUp = action.payload;
        },
        triggerUpdateMap: (state) => {
            state.isUpdateMap = !state.isUpdateMap;
        }
    }
});

export const editMapReducer = editMapSlice.reducer;
export const selectEditMap = (state) => state.editMap;
export const {
    resetEditMapSlice,
    disableIsWaitingPin,
    enableIsWaitingPin,
    disableIsNewPin,
    enableIsNewPin,
    disableIsEditingPin,
    enableIsEditingPin,
    disableIsEditedMap,
    enableIsEditedMap,
    setAddingPinMessage,
    resetAddingPinMessage,
    setEditingPin,
    resetEditingPin,
    setPins,
    addPin,
    removePin,
    removePinBySceneIndex,
    editPin,
    setMapPath,
    setIsShowOnStartUp,
    triggerUpdateMap
} = editMapSlice.actions;
