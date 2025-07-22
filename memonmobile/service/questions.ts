import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from './api/axiosQuery';

export const questionApi = createApi({
    reducerPath: "questionsApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Questions", "Revisions"],
    endpoints: (build) => ({   

        getAllQuestions: build.query({
            query: () => ({
                url: "/api/v1/question/get-questions",
                method: "GET"
            }),
            providesTags: ["Questions"]
        }),

        addQuestion: build.mutation({
            query: (data) => ({
                url: "/api/v1/question/add-question",
                method: "POST",
                data,
            }),
            invalidatesTags: ["Questions"]
        }),

        getTodaysRevisions: build.query({
            query: () => ({
                url: "/api/v1/question/todays-revisions",
                method: "GET"
            }),
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
