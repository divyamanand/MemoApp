import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../service/api/api';
import * as SecureStorage from 'expo-secure-store';
import { ErrorResponse } from '@/src/constants/types';
import { handleError } from '@/src/service/errorService';
import { handleApiResponse } from '@/src/service/responseService';
import { handleReset } from '@/src/service/resetService';

const authHandler = async (
  endpoint: string,
  payload: any,
  rejectWithValue: any,
) => {
  try {
    const response = await api.post(endpoint, payload);
    const { data } = handleApiResponse(response);

    const { accessToken, refreshToken, user } = data;

    await SecureStorage.setItemAsync('accessToken', accessToken);
    await SecureStorage.setItemAsync('refreshToken', refreshToken);
    console.log(user);
    return user;
  } catch (error) {
    const formattedError: ErrorResponse = handleError(error);
    return rejectWithValue(formattedError);
  }
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    return authHandler('/api/v1/user/login', payload, rejectWithValue);
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
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
