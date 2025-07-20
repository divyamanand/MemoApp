import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/store/store'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_SERVER,
    prepareHeaders: (headers, {getState}) => {
                const accessToken = (getState() as RootState).auth.accessToken
                headers.set("Authorization", `Bearer ${accessToken}`)
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
