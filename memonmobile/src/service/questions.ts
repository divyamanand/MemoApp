import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from './api/axiosQuery'

type Question = {
  _id: string
  question: string
}

type Metadata = {
  total: number
  page: number
  pageSize: number
}

type TransformedResponse = {
  questions: Question[]
  metadata: Metadata
}

export const questionApi = createApi({
  reducerPath: 'questionApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Questions', 'Revisions'],
  endpoints: build => ({
    getAllQuestions: build.infiniteQuery<TransformedResponse, string, number>({
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam) => lastPageParam + 1,
        getPreviousPageParam: (firstPage, allPages, firstPageParam) =>
          firstPageParam > 0 ? firstPageParam - 1 : undefined,
      },
      query: ({ pageParam }) => ({
        url: `/api/v1/get-questions?page=${pageParam}`,
        method: 'GET',
      }),
      keepUnusedDataFor: Infinity,
      transformResponse: (response: any): TransformedResponse => response.data,
      providesTags: result =>
        result
          ? [
              ...result.questions.map(q => ({ type: 'Questions' as const, id: q._id })),
              { type: 'Questions', id: 'LIST' },
            ]
          : [{ type: 'Questions', id: 'LIST' }],
    }),

    addQuestion: build.mutation({
      query: data => ({
        url: '/api/v1/question/add-question',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Questions'],
    }),

    getTodaysRevisions: build.infiniteQuery<TransformedResponse, string, number>({
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam) => lastPageParam + 1,
        getPreviousPageParam: (firstPage, allPages, firstPageParam) =>
          firstPageParam > 0 ? firstPageParam - 1 : undefined,
      },
      query: ({ pageParam }) => ({
        url: `/api/v1/todays-revisions?page=${pageParam}`,
        method: 'GET',
      }),
      keepUnusedDataFor: Infinity,
      transformResponse: (response: any): TransformedResponse => ({
        questions: response.data.questions,
        metadata: response.data.metadata,
      }),
      providesTags: result =>
        result
          ? [
              ...result.questions.map(q => ({ type: 'Questions' as const, id: q._id })),
              ...result.questions.map(q => ({ type: 'Revisions' as const, id: q._id })),
              { type: 'Questions', id: 'LIST' },
              { type: 'Revisions', id: 'LIST' },
            ]
          : [
              { type: 'Questions', id: 'LIST' },
              { type: 'Revisions', id: 'LIST' },
            ],
    }),

    deleteQuestion: build.mutation({
      query: id => ({
        url: `api/v1/question/delete-question/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Questions'],
    }),
  }),
})

export const {
  useGetAllQuestionsInfiniteQuery,
  useAddQuestionMutation,
  useGetTodaysRevisionsInfiniteQuery,
  useDeleteQuestionMutation,
} = questionApi
