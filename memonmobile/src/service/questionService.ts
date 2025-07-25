import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api/axiosQuery';
import {
  ApiResponse,
  PaginatedApiResponse,
  PostQuestion,
  ResponseQuestion,
} from '../constants/types';
import { AxiosResponse } from 'axios';
import { handleApiResponse } from './responseService';
import { nanoid } from '@reduxjs/toolkit';

type InitialPageParam = {
  page: number;
  pageSize: number;
};

export const questionApi = createApi({
  reducerPath: 'questionApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Questions', 'Revisions', 'Revision'],
  endpoints: (build) => ({
    getQuestions: build.infiniteQuery<
      PaginatedApiResponse<ResponseQuestion>,
      string,
      InitialPageParam
    >({
      infiniteQueryOptions: {
        initialPageParam: {
          page: 1,
          pageSize: 10,
        },
        getNextPageParam: (
          lastPage,
          _allPages,
          lastPageParam
        ) => {
          const nextPage = lastPageParam.page + 1;
          const remainingPages = lastPage.data?.metadata.total - nextPage;

          if (remainingPages < 0) return undefined;

          return {
            ...lastPageParam,
            page: nextPage,
          };
        },
        getPreviousPageParam: (
          firstPage,
          _allPages,
          firstPageParam
        ) => {
          const prevPage = firstPageParam.page - 1;
          return prevPage < 0 ? undefined : { ...firstPageParam, page: prevPage };
        },
      },
      query: ({ queryArg, pageParam: { page, pageSize } }) => ({
        url: `/api/v1/questions?page=${page}&pageSize=${pageSize}&type=${queryArg}`,
        method: 'GET',
      }),
      transformResponse: (
        response: AxiosResponse
      ): PaginatedApiResponse<ResponseQuestion> => handleApiResponse(response),
      keepUnusedDataFor: Infinity,
      providesTags: (result, _, arg) => {
        const pages = result?.pages ?? [];

        if (arg === 'revisions') {
          const revisionTags = pages.flatMap((page) =>
            (page.data?.questions ?? []).flatMap(({ _id, upcomingRevisions }) => [
              { type: 'Revisions' as const, id: _id },
              ...(upcomingRevisions ?? []).map(({ _id: revisionId }) => ({
                type: 'Revision' as const,
                id: revisionId,
              })),
            ])
          );
          return [{ type: 'Revisions', id: 'LIST' }, ...revisionTags];
        }

        if (arg === 'questions') {
          const questionTags = pages.flatMap((page) =>
            (page.data?.questions ?? []).map(({ _id }) => ({
              type: 'Questions' as const,
              id: _id,
            }))
          );
          return [{ type: 'Questions', id: 'LIST' }, ...questionTags];
        }

        return [];
      },
    }),

    addQuestion: build.mutation<ApiResponse<ResponseQuestion>, PostQuestion>({
      query: (data) => ({
        url: '/api/v1/question/add-question',
        method: 'POST',
        body: data,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const tempId = nanoid();

        const patchResult = dispatch(
          questionApi.util.updateQueryData('getQuestions', "questions", (draft) => {
            const lastPage = draft.pages[draft.pages.length - 1];

            const optimisticQuestion: ResponseQuestion = {
              ...arg,
              _id: tempId,
              upcomingRevisions: [],
              formData: arg.formData ?? {},
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            if (lastPage?.data?.questions) {
              lastPage.data.questions.push(optimisticQuestion);
              lastPage.data.metadata.total += 1;
            } else {
              draft.pages.push({
                data: {
                  questions: [optimisticQuestion],
                  metadata: {
                    page: 1,
                    pageSize: 10,
                    total: 1,
                  },
                },
              });
            }
          })
        );

        try {
          const { data: apiResponse } = await queryFulfilled;
          const questionData = apiResponse.data

          dispatch(
            questionApi.util.updateQueryData('getQuestions', "questions", (draft) => {
              for (const page of draft.pages) {
                const questionIndex = page.data?.questions?.findIndex(
                  (q) => q._id === tempId
                );
                if (questionIndex !== undefined && questionIndex > -1 && page.data?.questions) {
                  page.data.questions[questionIndex] = questionData;
                  break;
                }
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: [{type: "Questions", id: "LIST"}],
    }),

    // deleteQuestion: build.mutation({
    //   query: (id) => ({
    //     url: `api/v1/question/delete-question/${id}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['Questions'],
    // }),
  }),
});

export const {
  useAddQuestionMutation,
  useGetQuestionsInfiniteQuery,
  // useDeleteQuestionMutation,
} = questionApi;
