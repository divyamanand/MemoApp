import { EndpointBuilder } from '@reduxjs/toolkit/query';
import { questionApi } from '../questionApi';
import { ApiResponse, ResponseQuestion } from '../types';
import { PostQuestion } from '@/src/constants/types';

export const addQuestionEndpoint = (
  build: EndpointBuilder<any, 'Questions' | 'Revisions', 'questionApi'>,
) =>
  build.mutation<ApiResponse<ResponseQuestion>, PostQuestion>({
    query: (data) => ({
      url: '/api/v1/question/add-question',
      method: 'POST',
      data,
    }),
    async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      const patchResult = dispatch(
        questionApi.util.updateQueryData('getQuestions', undefined, (draft) => {
          const lastPage = draft.pages[draft.pages.length - 1];

          const optimisticQuestion: PostQuestion = {
            ...arg,
            isPending: true,
          };

          if (lastPage?.data?.questions) {
            lastPage.data.questions.push(optimisticQuestion);
            if (lastPage.data.metadata) {
              lastPage.data.metadata.totalPages += 1;
            }
          } else {
            draft.pages.push({
              data: {
                questions: [optimisticQuestion],
                metadata: {
                  page: 1,
                  pageSize: 10,
                  totalPages: 1,
                  totalQuestions: lastPage.data.metadata.totalQuestions + 1,
                },
              },
            });
          }
        }),
      );

      try {
        const { data: apiResponse } = await queryFulfilled;
        const questionData = apiResponse.data;

        dispatch(
          questionApi.util.updateQueryData(
            'getQuestions',
            undefined,
            (draft) => {
              for (const page of draft.pages) {
                const questionIndex = page.data?.questions?.findIndex(
                  (q) => q._id === arg._id,
                );
                if (
                  questionIndex !== undefined &&
                  questionIndex > -1 &&
                  page.data?.questions
                ) {
                  page.data.questions[questionIndex] = questionData;
                  break;
                }
              }
            },
          ),
        );
      } catch {
        patchResult.undo();
      }
    },
    invalidatesTags: [{ type: 'Questions', id: 'LIST' }],
  });
