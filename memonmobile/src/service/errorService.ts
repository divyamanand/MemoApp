import axios from 'axios'
import { ErrorResponse } from '../constants/types'

export const handleError = (err: unknown): ErrorResponse => {
  if (axios.isAxiosError(err)) {
    const statusCode = err.response?.status
    const data = err.response?.data

    return {
      statusCode,
      message: data?.message ?? err.message ?? 'Something Went Wrong',
      errors: data?.errors ?? [],
      data: null,
      success: false,
      stack: err.stack,
    }
  }

  if (err instanceof Error) {
    return {
      message: err.message,
      errors: [],
      data: null,
      success: false,
      stack: err.stack,
    }
  }

  return {
    message: 'Something unexpected occurs. Retry after some time',
    errors: [],
    data: null,
    success: false,
  }
}
