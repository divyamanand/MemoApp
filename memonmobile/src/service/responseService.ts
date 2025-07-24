import { AxiosResponse } from 'axios';
import { ApiResponse } from '../constants/types';

export const handleApiResponse = <T = any>(
  res: AxiosResponse,
): ApiResponse<T> => {
  return {
    statusCode: res.status,
    data: res.data?.data ?? ({} as T),
    message: res.data?.message ?? res.statusText ?? 'Response received',
    success: res.data?.success ?? true,
  };
};
