import { api } from '@/src/service/api/api';
import type { AxiosRequestConfig } from 'axios';

interface AxiosBaseQueryArgs {
  url: string;
  method: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
}

export const axiosBaseQuery =
  () =>
  async ({ url, method, data, params, headers }: AxiosBaseQueryArgs) => {
    try {
      const result = await api({
        url,
        method,
        data,
        params,
        headers,
      });
      // console.log(url, method, data, params, headers)r
      return { data: result.data };
    } catch (error: any) {
      console.log(error);
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message,
        },
      };
    }
  };
