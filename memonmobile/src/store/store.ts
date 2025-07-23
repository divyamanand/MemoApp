import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/src/features/auth/authSlice'
import questionReducer from '@/src/features/questions/questionSlice'
import { authApi } from '@/src/service/auth'
import { questionApi } from '@/src/service/questions'

const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionReducer,
    [authApi.reducerPath]: authApi.reducer,
    [questionApi.reducerPath]: questionApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authApi.middleware).concat(questionApi.middleware),
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
