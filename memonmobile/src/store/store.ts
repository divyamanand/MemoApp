import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/api/authService';
import { questionApi } from '../features/questions/api/questionApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import rootReducer from './reducers';
import persistStore from 'redux-persist/es/persistStore';
import * as SecureStore from 'expo-secure-store';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(questionApi.middleware),
});

export const persistor = persistStore(store);

export const resetApp = async () => {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
  store.dispatch({ type: 'RESET' });
  persistor.purge();
};

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
