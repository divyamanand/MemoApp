import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    questions: {},
    revisions: [],
    error: null,
    success: false,
}

const questionSlice = createSlice({
    name: "questions",
    initialState,
    reducers : {
        setQuestions: (state, action) => {
            state.questions = action.payload
        },
        deleteAllQuestions: () => initialState,
        setRevisions: (state, action) => {
            state.revisions = action.payload
        }
    }
})

export const { setQuestions, deleteAllQuestions, setRevisions } = questionSlice.actions
export default questionSlice.reducer