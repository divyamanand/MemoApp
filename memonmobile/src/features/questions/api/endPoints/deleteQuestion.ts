import { EndpointBuilder } from '@reduxjs/toolkit/query';
import { questionApi } from '../questionApi';
import { ApiResponse } from '../types';

const wasQuestionRemoved = (draft: any, id: string): boolean => {
  let removed = false;
  draft.pages.forEach((page: any) => {
    if (page?.data?.questions) {
      const originalLength = page.data.questions.length;
      page.data.questions = page.data.questions.filter((q: any) => q._id !== id);
      if (page.data.questions.length !== originalLength) {
        removed = true;
      }
    }
  });
  return removed;
};

export const deleteQuestionEndpoint = (
  build: EndpointBuilder<any, 'Questions' | 'Revisions', 'questionApi'>
) =>
  build.mutation<ApiResponse, string>({
    query: (id) => ({
      url: `/api/v1/delete-question/${id}`,
      method: 'DELETE',
    }),

    async onQueryStarted(id, { dispatch, queryFulfilled }) {
      const updatedTypes: {type: "Questions" | "Revisions", id: string}[] = [];

      const patch = (type: 'Questions' | 'Revisions') =>
        dispatch(
          questionApi.util.updateQueryData('getQuestions', { type }, (draft: any) => {
            if (wasQuestionRemoved(draft, id)) {
              updatedTypes.push({type, id});
            }
          })
        );

      const patches = [patch('Questions'), patch('Revisions')];

      try {
        await queryFulfilled;

        updatedTypes.forEach(({type, id}) => {
          dispatch(
            questionApi.util.invalidateTags([
              { type, id },
              { type, id: 'LIST' },
            ])
          );
        });
      } catch {
        patches.forEach((p) => p.undo());
      }
    },
  });
