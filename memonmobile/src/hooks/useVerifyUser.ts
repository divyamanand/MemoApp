import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/src/store/hooks';
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
        setStatus('loggedOut');
        return;
      }

      if (isSuccess && data) {
        setStatus('loggedIn');
      }
    };

    manageUser();
  }, [data, isError, isFetching, isSuccess, dispatch]);

  return status;
};
