import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from "@/store/store"

export const questionApi = createApi({
    reducerPath: "questionsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.EXPO_PUBLIC_SERVER,
        prepareHeaders: (headers, {getState}) => {
            const accessToken = (getState() as RootState).auth.accessToken
            headers.set("Authorization", `Bearer ${accessToken}`)
            return headers
        },
    }),
    tagTypes: ["Questions", "Revisions"],
    endpoints: (build) => ({   

        getAllQuestions: build.query({
            query: () => "/api/v1/question/get-questions",
            providesTags: ["Questions"]
        }),

        addQuestion: build.mutation({
            query: (body) => ({
                url: "/api/v1/question/add-question",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Questions"]
        }),

        getTodaysRevisions: build.query({
            query: () => "/api/v1/question/todays-revisions",
            providesTags: ["Revisions"]
        }),

        deleteQuestion: build.mutation({
            query: (id) => ({
                url: `api/v1/question/delete-question/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Questions"]
        })
    })
})


export const {
  useGetAllQuestionsQuery,
  useAddQuestionMutation,
  useGetTodaysRevisionsQuery,
  useDeleteQuestionMutation
} = questionApi;
