import { EndpointBuilder } from '@reduxjs/toolkit/query';
import { questionApi } from '../questionApi'; // Import for dispatch in onQueryStarted
import { ApiResponse } from '../types';

export const deleteQuestionEndpoint = (
  build: EndpointBuilder<
    any,
    'Questions' | 'Revisions' | 'Revision',
    'questionApi'
  >,
) =>
  build.mutation<ApiResponse, string>({
    query: (id) => ({
      url: `api/v1/question/delete-question/${id}`,
      method: 'DELETE',
    }),
    async onQueryStarted(questionId, { dispatch, queryFulfilled }) {
      const patchResult = dispatch(
        questionApi.util.updateQueryData(
          'getQuestions',
          'Questions',
          (draft) => {
            draft.pages.forEach((page) => {
              if (!page?.data?.questions) return;
              page.data.questions = page.data.questions.filter(
                (q) => q._id !== questionId,
              );
            });
          },
        ),
      );

      try {
        await queryFulfilled;
      } catch {
        patchResult.undo();
      }
    },
    invalidatesTags: (result, error, id) => [{ type: 'Questions', id }],
  });
