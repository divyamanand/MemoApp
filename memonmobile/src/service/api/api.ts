import { setAccessToken } from "@/src/features/auth/authSlice"
import store from "@/src/store/store"
import axios, { AxiosError, AxiosRequestConfig } from "axios"
import * as SecureStorage from "expo-secure-store"

type ApiErrorResponse = {
  statusCode: number
  message: string
  errors: any[]
  success: false
  data: null
  stack?: string
}

export const api = axios.create({
  baseURL: "http://172.27.70.123:5000",
  headers: {
    "Content-Type": "application/json",
    "x-client-type": "mobile",
  }
})

api.interceptors.request.use(
  async config => {
    const accessToken = await SecureStorage.getItemAsync("accessToken")
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  error => Promise.reject(error)
)

api.interceptors.response.use(
  response => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
    const statusCode = error.response?.status || 500


    if (statusCode === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = await SecureStorage.getItemAsync("refreshToken")
        if (refreshToken) {
          const res = await axios.post(`${api.defaults.baseURL}/refresh-token`, { refreshToken })

          const newAccessToken = res.data.accessToken
          const newRefreshToken = res.data.refreshToken

          await SecureStorage.setItemAsync("accessToken", newAccessToken)
          await SecureStorage.setItemAsync("refreshToken", newRefreshToken)

          store.dispatch(setAccessToken(newAccessToken))
          
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          }

          return api(originalRequest)
        }
      } catch (refreshError: any) {
        const err = refreshError as AxiosError<ApiErrorResponse>
        return Promise.reject({
          statusCode: err.response?.data?.statusCode || 500,
          message: err.response?.data?.message || "Token Refresh Failed",
          errors: err.response?.data?.errors || [],
          success: false,
          data: null,
          stack: err.stack || "",
        })
      }
    }

    return Promise.reject({
      statusCode: error.response?.data?.statusCode || 500,
      message: error.response?.data?.message || "Something Went Wrong",
      errors: error.response?.data?.errors || [],
      success: false,
      data: null,
      stack: error.stack || "",
    })
  }
)
