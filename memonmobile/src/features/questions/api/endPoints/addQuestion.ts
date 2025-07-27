import { EndpointBuilder } from '@reduxjs/toolkit/query';
import { nanoid } from '@reduxjs/toolkit';
import { questionApi } from '../questionApi';
import { ApiResponse, PostQuestion, ResponseQuestion } from '../types';

export const addQuestionEndpoint = (
  build: EndpointBuilder<
    any,
    'Questions',
    'questionApi'
  >,
) =>
  build.mutation<ApiResponse<ResponseQuestion>, PostQuestion>({
    query: (data) => ({
      url: '/api/v1/question/add-question',
      method: 'POST',
      body: data,
    }),
    async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      const tempId = nanoid();

      const patchResult = dispatch(
        questionApi.util.updateQueryData(
          'getQuestions',
          undefined,
          (draft) => {
            const lastPage = draft.pages[draft.pages.length - 1];

            const optimisticQuestion: ResponseQuestion = {
              ...arg,
              _id: tempId,
              upcomingRevisions: [],
              formData: arg.formData ?? {},
              createdAt: new Date(),
              updatedAt: new Date(),
              isPending: true,
            };

            if (lastPage?.data?.questions) {
              lastPage.data.questions.push(optimisticQuestion);
              if (lastPage.data.metadata) {
                lastPage.data.metadata.total += 1;
              }
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
          },
        ),
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
                  (q) => q._id === tempId,
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
