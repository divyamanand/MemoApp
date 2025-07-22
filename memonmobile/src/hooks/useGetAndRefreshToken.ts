import { useState, useEffect } from "react";
import { logoutUser } from "@/src/features/auth/authActions";
import { setAccessToken } from "@/src/features/auth/authSlice";
import { useAppDispatch } from "@/src/store/hooks";
import * as SecureStore from "expo-secure-store";
import { useUpdateAccessTokenMutation } from "@/src/service/auth";

export const useGetAndRefreshToken = () => {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<'booting' | 'loggedOut' | 'loggedIn'>('booting');
  const [updateAccessToken] = useUpdateAccessTokenMutation();

  const updateOnBoot = async () => {
        try {
          setStatus("booting")
          const res = await updateAccessToken().unwrap();
          await SecureStore.setItemAsync('accessToken', res.data.accessToken);
          dispatch(setAccessToken(res.data.accessToken));
          setStatus("loggedIn")
        } catch (e) {
          dispatch(logoutUser());
          setStatus('loggedOut');
        }
  }

  useEffect(() => {
        updateOnBoot()
  }, []);

  return status;
};
