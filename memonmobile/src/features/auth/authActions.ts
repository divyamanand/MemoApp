import { ErrorResponse } from '@/src/constants/types';
import { handleError } from '@/src/service/errorService';
import { handleReset } from '@/src/service/resetService';
import { handleApiResponse } from '@/src/service/responseService';
import { createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStorage from 'expo-secure-store';
import { api } from '../../service/api/api';

const authHandler = async (
  endpoint: string,
  payload: any,
  rejectWithValue: any,
) => {
  try {
    const response = await api.post(endpoint, payload);
    const { data } = handleApiResponse(response);

    const { accessToken, refreshToken, user } = data;
    console.log('Token from api', accessToken, refreshToken);
    await SecureStorage.setItemAsync('accessToken', String(accessToken));
    await SecureStorage.setItemAsync('refreshToken', String(refreshToken));
    return user;
  } catch (error) {
    const formattedError: ErrorResponse = handleError(error);
    return rejectWithValue(formattedError);
  }
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    return authHandler('/api/v1/user/login', payload, rejectWithValue);
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    payload: { name: string; email: string; password: string },
    { rejectWithValue },
  ) => {
    return authHandler('/api/v1/user/register', payload, rejectWithValue);
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/user/logout', {});
      await handleReset();
      return handleApiResponse(response);
    } catch (error) {
      const formattedError: ErrorResponse = handleError(error);
      return rejectWithValue(formattedError);
    }
  },
);
