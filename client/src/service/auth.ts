import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER,
    credentials: "include",
    prepareHeaders: (headers) => {
      return headers
    },
  }),
  endpoints: (build) => ({
    getUserDetails: build.query<any, void>({
      query: () => ({
        url: "/api/v1/user/getCurrentUser",
        method: "GET"
      })
    }),

    updateAccessToken: build.query({
      query: () => ({
          url: "/api/v1/user/refresh-token",
          method: "POST",
      }),
      }),
    })
})

export const {
    useGetUserDetailsQuery,
    useUpdateAccessTokenQuery
} = authApi
