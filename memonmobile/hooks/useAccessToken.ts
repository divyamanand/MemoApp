import { setAccessToken } from "@/features/auth/authSlice"
import { useAppDispatch } from "@/store/hooks"
import * as SecureStorage from "expo-secure-store"
import { useEffect } from "react";

export const useAccessToken = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadAccessToken = async () => {
      const storedAccessToken = await SecureStorage.getItemAsync("accessToken");
      if (storedAccessToken) {
        dispatch(setAccessToken(storedAccessToken));
      }
    };

    loadAccessToken();
  }, [dispatch]);
};
