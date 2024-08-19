/* Libraries */
import { createSlice } from '@reduxjs/toolkit';
import * as uuid from 'uuid';

const initialState = {
    isShowSidebar: true,
    currentSlideId: uuid.NIL,
    progress: null,
    questions: [],
    answers: [],
    incorrectQuestions: []
};
const learningSlice = createSlice({
    name: 'learning',
    initialState,
    reducers: {
        resetLearningSlice: (state) => {
            state.isShowSidebar = initialState.isShowSidebar;
            state.currentSlideId = initialState.currentSlideId;
        },
        showSidebar: (state) => {
            state.isShowSidebar = true;
        },
        hideSidebar: (state) => {
            state.isShowSidebar = false;
        },
        toggleSidebar: (state) => {
            state.isShowSidebar = !state.isShowSidebar;
        },
        setCurrentSlideId: (state, action) => {
            state.currentSlideId = action.payload;
        },
        setProgress: (state, action) => {
            state.progress = action.payload;
        },
        setSlideQuestions: (state, action) => {
            state.questions = action.payload;
        },
        setAnswers: (state, action) => {
            state.answers = action.payload;
        },
        addOrUpdateAnswer: (state, action) => {
            if (
                state.answers.length === 0 ||
                !state.answers.find((answer) => answer.questionIndex === action.payload.questionIndex)
            ) {
                state.answers.push({ questionIndex: action.payload.questionIndex, optionIndex: action.payload.optionIndex });
            } else {
                state.answers = state.answers.map((answer) => {
                    if (answer.questionIndex === action.payload.questionIndex) {
                        answer.optionIndex = action.payload.optionIndex;
                    }
                    return answer;
                });
            }
        },
        clearAnswers: (state) => {
            state.answers = [];
        },
        setIncorrectQuestions: (state, action) => {
            state.incorrectQuestions = action.payload;
        },
        clearIncorrectQuestions: (state) => {
            state.incorrectQuestions = [];
        }
    }
});

export const learningReducer = learningSlice.reducer;
export const selectLearning = (state) => state.learning;
export const {
    resetLearningSlice,
    showSidebar,
    hideSidebar,
    toggleSidebar,
    setCurrentSlideId,
    setProgress,
    setSlideQuestions,
    setAnswers,
    addOrUpdateAnswer,
    clearAnswers,
    setIncorrectQuestions,
    clearIncorrectQuestions
} = learningSlice.actions;
