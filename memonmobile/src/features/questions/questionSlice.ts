import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  allQuestions: {},
  revisionQuestions: {},
  revisions: [],
  error: null,
  success: false,
}

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setAllQuestions: (state, action) => {
      state.allQuestions = action.payload
    },
    setAllRevisionQuestions: (state, action) => {
      state.revisionQuestions = action.payload
    },
    deleteAllQuestions: () => initialState,
    setRevisions: (state, action) => {
      state.revisions = action.payload
    },
  },
})

export const { setAllQuestions, setAllRevisionQuestions, deleteAllQuestions, setRevisions } =
  questionSlice.actions
export default questionSlice.reducer
