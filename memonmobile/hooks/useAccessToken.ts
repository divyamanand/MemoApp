import { logoutUser } from "@/features/auth/authActions";
import { setAccessToken } from "@/features/auth/authSlice"
import { useAppDispatch } from "@/store/hooks"
import * as SecureStore from 'expo-secure-store'
import { useEffect } from "react";

export const useAccessToken = () => {
  const dispatch = useAppDispatch();
  const loadAccessToken = async () => {
      const storedAccessToken = await SecureStore.getItemAsync("accessToken");
      if (storedAccessToken) {
        dispatch(setAccessToken(storedAccessToken));
      } else {
        dispatch(setAccessToken(null))
        dispatch(logoutUser())
      }
    };
    
  useEffect(() => {
    loadAccessToken();
  }, []);
};
