import { useAppSelector } from "@/store/hooks";
import axios from "axios"

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_SERVER,
    headers: {
        "Content-Type": "application/json",
        "x-client-type": "mobile",
    }
})

axios.interceptors.request.use(config => {
  const {accessToken} = useAppSelector(state => state.auth)
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});