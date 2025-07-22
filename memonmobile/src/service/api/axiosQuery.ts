import type { AxiosRequestConfig } from 'axios';
import { api } from './api';

interface AxiosBaseQueryArgs {
  url: string;
  method: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
}

export const axiosBaseQuery =
  ({ baseURL = process.env.EXPO_PUBLIC_SERVER } = {}) =>
  async ({ url, method, data, params, headers }: AxiosBaseQueryArgs) => {
    try {
      const result = await api({
        url: baseURL + url,
        method,
        data,
        params,
        headers
      });
      return { data: result.data };
    } catch (error: any) {
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message,
        },
      };
    }
  };