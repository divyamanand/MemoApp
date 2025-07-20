import store from "@/store/store";
import axios from "axios"

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_SERVER,
    headers: {
        "Content-Type": "application/json",
        "x-client-type": "mobile",
    }
})

axios.interceptors.request.use(config => {
  const accessToken = store.getState().auth.accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || "Something Went Wrong",
      errors: error?.response?.data?.errors || [],
      success: false,
      data: null,
      stack: error.stack || "",
    };
    return Promise.reject(customError);
  }
);