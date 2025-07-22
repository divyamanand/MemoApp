type ApiResponse<T = any> = {
  statusCode: number
  data: T
  message: string
  success: boolean
}

type ApiErrorResponse = {
  statusCode: number
  message: string
  errors: any[]
  success: false
  data: null
  stack?: string
}

export const useResponse = <T = any>(res: unknown): ApiResponse<T> => {
  const responseData = (res as any)?.data ?? res

  if (responseData?.success === true) {
    return {
      statusCode: responseData.statusCode || 200,
      data: responseData.data,
      message: responseData.message || "Success",
      success: true,
    }
  }

  throw {
    statusCode: responseData?.statusCode || 500,
    message: responseData?.message || "Something went wrong",
    errors: responseData?.errors || [],
    success: false,
    data: null,
    stack: responseData?.stack || "",
  } as ApiErrorResponse
}
