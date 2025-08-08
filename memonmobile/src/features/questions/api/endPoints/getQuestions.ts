import { AxiosResponse } from 'axios';
import {
  InitialPageParam,
  MyBuilder,
  PaginatedApiResponse,
  ResponseQuestion,
} from '../types';
import { handleApiResponse } from '@/src/service/responseService';

export const getQuestionsEndpoint = (build: MyBuilder) =>
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
        const metadata = lastPage?.data?.metadata;
        const totalPages =
          (metadata?.totalPages ?? lastPageParam?.pageSize)
            ? Math.ceil(
                (metadata?.totalQuestions ?? 0) /
                  (lastPageParam.pageSize ?? 10),
              )
            : 1;
        const page = metadata?.page ?? lastPageParam?.page ?? 1;

        if (page < totalPages) {
          return {
            ...(lastPageParam ?? { page, pageSize: 10 }),
            page: page + 1,
          };
        }
        return undefined;
      },
      getPreviousPageParam: (firstPage, _allPages, firstPageParam) => {
        const currentPage =
          firstPage?.data?.metadata?.page ?? firstPageParam?.page ?? 1;
        const prevPage = currentPage - 1;
        if (prevPage >= 1) {
          return {
            ...(firstPageParam ?? { page: currentPage, pageSize: 10 }),
            page: prevPage,
          };
        }
        return undefined;
      },
    },
    query: ({ pageParam, queryArg }) => {
      const { page, pageSize } = pageParam;
      return {
        url: `/api/v1/question/questions?page=${page}&pageSize=${pageSize}`,
        method: 'GET',
      };
    },
    // transformResponse: (
    //   response: AxiosResponse,
    // ): PaginatedApiResponse<ResponseQuestion> => handleApiResponse(response).data,
    keepUnusedDataFor: Infinity,
    providesTags: (result, _, arg) => {
      const pages = result?.pages ?? [];

      const questionTags = pages.flatMap((page) =>
        (page.data?.questions ?? []).map(({ _id }) => ({
          type: 'Questions' as const,
          id: _id,
        })),
      );
      return [{ type: 'Questions', id: 'LIST' }, ...questionTags];
    },
  });
