import { combineReducers } from '@reduxjs/toolkit';
import appReducer from '@/src/features/app/appSlice';
import questionReducer from '@/src/features/questions/questionSlice';
import { authApi } from '../features/auth/api/authService';
import { questionApi } from '../features/questions/api/questionApi';

const appReducerCombined = combineReducers({
  app: appReducer,
  questions: questionReducer,
  [authApi.reducerPath]: authApi.reducer,
  [questionApi.reducerPath]: questionApi.reducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET') {
    state = undefined;
  }
  return appReducerCombined(state, action);
};

export default rootReducer;
