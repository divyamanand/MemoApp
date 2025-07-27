import { EndpointBuilder } from '@reduxjs/toolkit/query';
import { AxiosResponse } from 'axios';
import {
  InitialPageParam,
  PaginatedApiResponse,
  ResponseQuestion,
} from '../types';
import { handleApiResponse } from '@/src/service/responseService';

export const getQuestionsEndpoint = (
  build: EndpointBuilder<
    any,
    'Questions',
    'questionApi'
  >,
) =>
  build.infiniteQuery<
    PaginatedApiResponse<ResponseQuestion>,
    void,
    InitialPageParam
  >({
    infiniteQueryOptions: {
      initialPageParam: {
        page: 1,
        pageSize: 10,
      },
      getNextPageParam: (lastPage, _allPages, lastPageParam) => {
        const nextPage = lastPageParam.page + 1;
        const remainingPages = (lastPage.data?.metadata.total ?? 0) - nextPage;

        if (remainingPages < 0) return undefined;

        return {
          ...lastPageParam,
          page: nextPage,
        };
      },
      getPreviousPageParam: (firstPage, _allPages, firstPageParam) => {
        const prevPage = firstPageParam.page - 1;
        return prevPage < 0 ? undefined : { ...firstPageParam, page: prevPage };
      },
    },
    query: ({ queryArg, pageParam: { page, pageSize } }) => ({
      url: `/api/v1/questions?page=${page}&pageSize=${pageSize}`,
      method: 'GET',
    }),
    transformResponse: (
      response: AxiosResponse,
    ): PaginatedApiResponse<ResponseQuestion> => handleApiResponse(response),
    keepUnusedDataFor: Infinity,
    providesTags: (result, _, arg) => {
      const pages = result?.pages ?? [];
      // const today = new Date().toDateString()

      const questionTags = pages.flatMap((page) =>
        (page.data?.questions ?? []).map(({ _id }) => ({
          type: 'Questions' as const,
          id: _id,
        }))
      );

    //   const revisionQuestions = pages.flatMap((page) => 
    //   (page.data?.questions ?? []).filter(({upcomingRevisions}) => 
    //     upcomingRevisions && new Date(upcomingRevisions[0].date).toDateString() === today)
    // )

    //   const revisionTags  = revisionQuestions.length > 0? [{type: "Questions" as const, id: "TODAY"}] : [] 
      return [{ type: 'Questions', id: 'LIST' }, ...questionTags];
    },
  });
