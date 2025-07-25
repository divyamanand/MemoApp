import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/api/authService';
import { questionApi } from '../features/questions/api/questionApi';
import AsyncStorage from "@react-native-async-storage/async-storage"
import {persistReducer} from "redux-persist"
import { rootReducer } from './reducers';
import persistStore from 'redux-persist/es/persistStore';


const persistConfig = {
  key : "root",
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
      .concat(authApi.middleware)
      .concat(questionApi.middleware),
});

export const persistor = persistStore(store)
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
