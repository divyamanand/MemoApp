import { EndpointBuilder } from '@reduxjs/toolkit/query';
import { questionApi } from '../questionApi';
import { ApiResponse } from '../types';

export const deleteQuestionEndpoint = (
  build: EndpointBuilder<any, 'Questions', 'questionApi'>,
) =>
  build.mutation<ApiResponse, string>({
    query: (id) => ({
      url: `/api/v1/delete-question/${id}`,
      method: 'DELETE',
    }),

    async onQueryStarted(id, { dispatch, queryFulfilled }) {
      // Optimistic update for both Questions and Revisions cache
      const patchQuestions = dispatch(
        questionApi.util.updateQueryData('getQuestions', undefined, (draft) => {
          draft.pages.forEach((page) => {
            if (page?.data?.questions) {
              page.data.questions = page.data.questions.filter(
                (q) => q._id !== id,
              );
            }
          });
        }),
      );

      try {
        await queryFulfilled;
      } catch {
        patchQuestions.undo();
      }
    },

    invalidatesTags: (result, error, id) => [
      { type: 'Questions', id: 'LIST' },
      { type: 'Questions', id },
    ],
  });
