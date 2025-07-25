import { combineReducers } from '@reduxjs/toolkit';
import appReducer from '@/src/features/app/appSlice';
import questionReducer from '@/src/features/questions/questionSlice';
import { authApi } from '../features/auth/api/authService';
import { questionApi } from '../features/questions/api/questionApi';

export const rootReducer = combineReducers({
  app: appReducer,
  questions: questionReducer,
  [authApi.reducerPath]: authApi.reducer,
  [questionApi.reducerPath]: questionApi.reducer
})