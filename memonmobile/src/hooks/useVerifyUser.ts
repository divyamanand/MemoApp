import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/src/store/hooks';
import * as SecureStore from 'expo-secure-store';
import { resetUser, setCredentials } from '../features/app/appSlice';
import { handleApiResponse } from '../service/responseService';
import { useGetUserDetailsQuery } from '../features/auth/api/authService';

export const useVerifyUser = () => {
  const [status, setStatus] = useState<'booting' | 'loggedOut' | 'loggedIn'>(
    'booting',
  );
  const dispatch = useAppDispatch();

  const { data, isError, isFetching, isSuccess } = useGetUserDetailsQuery();

  useEffect(() => {
    const manageUser = async () => {
      if (isFetching) {
        setStatus('booting');
        return;
      }

      if (isError) {
        dispatch(resetUser());
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        setStatus('loggedOut');
        return;
      }

      if (isSuccess && data) {
        const { data: user } = handleApiResponse(data);
        dispatch(setCredentials(user));
        setStatus('loggedIn');
      }
    };

    manageUser();
  }, [data, isError, isFetching, isSuccess]);

  return status;
};
