import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api/axiosQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getUserDetails: build.query<any, void>({
      query: () => ({
        url: '/api/v1/user/getCurrentUser',
        method: 'GET',
      }),
    })
  }),
});

export const {
  useGetUserDetailsQuery
} = authApi;
