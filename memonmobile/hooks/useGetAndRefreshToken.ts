import { useState, useEffect } from "react";
import { logoutUser } from "@/features/auth/authActions";
import { setAccessToken } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";
import * as SecureStore from "expo-secure-store";
import { useUpdateAccessTokenMutation } from "@/service/auth";

export const useGetAndRefreshToken = () => {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<'booting' | 'loggedOut' | 'loggedIn'>('booting');
  const [updateAccessToken] = useUpdateAccessTokenMutation();

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) return setStatus('loggedOut');
      dispatch(setAccessToken(token));
      setStatus('loggedIn');
    })();
  }, []);


  useEffect(() => {
    if (status !== 'loggedIn') return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () =>
      timer = setTimeout(async () => {
        try {
          const res = await updateAccessToken().unwrap();
          await SecureStore.setItemAsync('accessToken', res.data.accessToken);
          dispatch(setAccessToken(res.data.accessToken));
          schedule();
        } catch (e) {
          clearTimeout(timer);
          dispatch(logoutUser());
          setStatus('loggedOut');
        }
      }, 15 * 60 * 1000);
    schedule();
    return () => clearTimeout(timer);
  }, [status, dispatch, updateAccessToken]);

  return status;
};
