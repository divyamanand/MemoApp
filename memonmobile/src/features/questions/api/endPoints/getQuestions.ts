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
    'Questions' | 'Revisions' | 'Revision',
    'questionApi'
  >,
) =>
  build.infiniteQuery<
    PaginatedApiResponse<ResponseQuestion>,
    string,
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
      url: `/api/v1/questions?page=${page}&pageSize=${pageSize}&type=${queryArg}`,
      method: 'GET',
    }),
    transformResponse: (
      response: AxiosResponse,
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
          ]),
        );
        return [{ type: 'Revisions', id: 'LIST' }, ...revisionTags];
      }

      if (arg === 'questions') {
        const questionTags = pages.flatMap((page) =>
          (page.data?.questions ?? []).map(({ _id }) => ({
            type: 'Questions' as const,
            id: _id,
          })),
        );
        return [{ type: 'Questions', id: 'LIST' }, ...questionTags];
      }

      return [];
    },
  });
