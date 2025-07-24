import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api/axiosQuery';
import { ErrorResponse, PaginatedApiResponse, Question } from '../constants/types';
import { AxiosResponse } from 'axios';
import { handleApiResponse } from './responseService';
import { handleError } from './errorService';

type InitialPageParam = {
  page: number;
  pageSize: number;
};

export const questionApi = createApi({
  reducerPath: 'questionApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Questions', 'Revisions', 'Revision'],
  endpoints: (build) => ({
    getTodaysRevisions: build.infiniteQuery<
      PaginatedApiResponse<Question>,
      void,
      InitialPageParam
    >({
      infiniteQueryOptions: {
        initialPageParam: {
          page: 1,
          pageSize: 10,
        },
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          const nextPage = lastPageParam.page + 1;
          const remainingPages = lastPage.data?.metadata.total - nextPage;

          if (remainingPages < 0) {
            return undefined;
          }

          return {
            ...lastPageParam,
            page: nextPage,
          };
        },
        getPreviousPageParam: (
          firstPage,
          allPages,
          firstPageParam,
          allPageParams,
        ) => {
          const prevPage = firstPageParam.page - 1;
          if (prevPage < 0) return undefined;

          return {
            ...firstPageParam,
            page: prevPage,
          };
        },
      },
      query: ({ pageParam: { page, pageSize } }) => ({
        url: `/api/v1/todays-revisions?page=${page}&pageSize=${pageSize}`,
        method: 'GET',
      }),
      transformResponse: (
        response: AxiosResponse,
      ): PaginatedApiResponse<Question> => handleApiResponse(response),
      transformErrorResponse: (response) : ErrorResponse => handleError(response),
      keepUnusedDataFor: Infinity,
      providesTags: (result) => {
        const pages = result?.pages ?? [];

        const tags = pages.flatMap((page) =>
          (page.data?.questions ?? []).flatMap(({ _id, upcomingRevisions }) => [
            { type: 'Revisions' as const, id: _id },
            ...(upcomingRevisions ?? []).map(({ _id: revisionId }) => ({
              type: 'Revision' as const,
              id: revisionId,
            })),
          ]),
        );
        return [{ type: 'Revisions' as const, id: 'LIST' }, ...tags];
      },
    }),

    // getAllQuestions: build.infiniteQuery<TransformedResponse, string, number>({
    //   infiniteQueryOptions: {
    //     initialPageParam: 0,
    //     getNextPageParam: (lastPage, allPages, lastPageParam) =>
    //       lastPageParam + 1,
    //     getPreviousPageParam: (firstPage, allPages, firstPageParam) =>
    //       firstPageParam > 0 ? firstPageParam - 1 : undefined,
    //   },
    //   query: ({ pageParam }) => ({
    //     url: `/api/v1/get-questions?page=${pageParam}`,
    //     method: 'GET',
    //   }),
    //   keepUnusedDataFor: Infinity,
    //   transformResponse: (response: any): TransformedResponse => response.data,
    //   providesTags: (result) =>
    //     result
    //       ? [
    //           ...result.questions.map((q) => ({
    //             type: 'Questions' as const,
    //             id: q._id,
    //           })),
    //           { type: 'Questions', id: 'LIST' },
    //         ]
    //       : [{ type: 'Questions', id: 'LIST' }],
    // }),

    addQuestion: build.mutation({
      query: (data) => ({
        url: '/api/v1/question/add-question',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Questions'],
    }),

    deleteQuestion: build.mutation({
      query: (id) => ({
        url: `api/v1/question/delete-question/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Questions'],
    }),
  }),
});

export const {
  // useGetAllQuestionsInfiniteQuery,
  useAddQuestionMutation,
  useGetTodaysRevisionsInfiniteQuery,
  useDeleteQuestionMutation,
} = questionApi;
