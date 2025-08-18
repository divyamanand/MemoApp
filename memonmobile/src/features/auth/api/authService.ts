import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../axiosQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['User'],
  endpoints: (build) => ({
    getUserDetails: build.query<any, void>({
      query: () => ({
        url: '/api/v1/user/getCurrentUser',
        method: 'GET',
      }),
      keepUnusedDataFor: Infinity,
      providesTags: () => ['User'],
    }),

    updateUserDetails: build.mutation<any, any>({
      query: (data) => ({
        url: '/api/v1/user/update',
        method: 'PATCH',
        data,
      }),

      invalidatesTags: () => ['User'],
    }),
  }),
});

export const { useGetUserDetailsQuery, useUpdateUserDetailsMutation } = authApi;
