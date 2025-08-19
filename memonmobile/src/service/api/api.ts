import { ErrorResponse } from '@/src/constants/types';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import * as SecureStorage from 'expo-secure-store';
import { handleError } from '../errorService';
import { handleReset } from '../resetService';
import { handleApiResponse } from '../responseService';

const { API_URL } = Constants.expoConfig?.extra || {};

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-client-type': 'mobile',
  },
});

api.interceptors.request.use(
  async (config) => {
    const accessToken = await SecureStorage.getItemAsync('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const statusCode = error.response?.status || 500;
    if (statusCode === 401 && !originalRequest._retry) {
      console.log('Token Expiration Detected');
      originalRequest._retry = true;
      try {
        const refreshToken = await SecureStorage.getItemAsync('refreshToken');
        console.log(
          'Trying to refresh token. RefreshToken found',
          refreshToken,
        );
        if (refreshToken) {
          console.log(
            'Trying to refresh token. RefreshToken found',
            refreshToken,
          );
          const res = await axios.post(
            `${api.defaults.baseURL}/api/v1/user/refresh-token`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
                'Content-Type': 'application/json',
                'x-client-type': 'mobile',
              },
            },
          );

          const formattedData = handleApiResponse(res);

          const newAccessToken = formattedData.data.accessToken;
          const newRefreshToken = formattedData.data.refreshToken;

          await SecureStorage.setItemAsync(
            'accessToken',
            String(newAccessToken),
          );
          await SecureStorage.setItemAsync(
            'refreshToken',
            String(newRefreshToken),
          );

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };

          return api(originalRequest);
        }
      } catch (refreshError: any) {
        console.log('error refreshing token', refreshError);
        await handleReset();
        const formattedError: ErrorResponse = handleError(refreshError);
        return Promise.reject(formattedError);
      }
    }

    const formattedError: ErrorResponse = handleError(error);
    return Promise.reject(formattedError);
  },
);
