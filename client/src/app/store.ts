import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/auth/authSlice"
import questionsReducer from '../features/questions/questionSlice'
import { authApi } from '../service/auth'
import { questionApi } from '../service/questions'

const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [questionApi.reducerPath]: questionApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
  .concat(authApi.middleware)
  .concat(questionApi.middleware),
})

export default store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
