import { isAxiosError } from 'axios';
import { ErrorResponse } from '../constants/types';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const handleError = (err: unknown): ErrorResponse => {
  if (isRtkQueryError(err)) {
    const errorData = err.data as any;

    return {
      statusCode: typeof err.status === 'number' ? err.status : null,
      message: errorData?.message ?? 'Something went wrong',
      errors: errorData?.errors ?? [],
      data: null,
      success: false,
    };
  }

  if (isAxiosError(err)) {
    const statusCode = err.response?.status;
    const data = err.response?.data;

    return {
      statusCode,
      message: data?.message ?? err.message ?? 'Something Went Wrong',
      errors: data?.errors ?? [],
      data: null,
      success: false,
      stack: err.stack,
    };
  }

  if (err instanceof Error) {
    return {
      statusCode: null,
      message: err.message,
      errors: [],
      data: null,
      success: false,
      stack: err.stack,
    };
  }

  return {
    statusCode: null,
    message: 'Something unexpected occurred. Please try again later.',
    errors: [],
    data: null,
    success: false,
  };
};

const isRtkQueryError = (err: unknown): err is FetchBaseQueryError => {
  return (
    typeof err === 'object' && err !== null && 'status' in err && 'data' in err
  );
};
