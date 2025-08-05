import { ErrorResponse } from '@/src/constants/types';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import * as SecureStorage from 'expo-secure-store';
import { handleError } from '../errorService';

export const api = axios.create({
  baseURL: 'http://172.27.70.123:5000',
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
    console.error(error);
    if (statusCode === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await SecureStorage.getItemAsync('refreshToken');
        if (refreshToken) {
          const res = await axios.post(
            `${api.defaults.baseURL}/refresh-token`,
            { refreshToken },
          );

          const newAccessToken = res.data.accessToken;
          const newRefreshToken = res.data.refreshToken;

          await SecureStorage.setItemAsync('accessToken', newAccessToken);
          await SecureStorage.setItemAsync('refreshToken', newRefreshToken);

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };

          return api(originalRequest);
        }
      } catch (refreshError: any) {
        const formattedError: ErrorResponse = handleError(refreshError);
        return Promise.reject(formattedError);
      }
    }

    const formattedError: ErrorResponse = handleError(error);
    return Promise.reject(formattedError);
  },
);
