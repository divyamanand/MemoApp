import { EndpointBuilder } from '@reduxjs/toolkit/query';
import { ApiResponse } from '../types';
import { questionApi } from '../questionApi';

const wasQuestionUpdated = (draft: any, _id: string, data: object): boolean => {
  let updated = false;
  draft.pages?.forEach((page: any) => {
    page.data?.questions?.forEach((q: any) => {
      if (q._id === _id) {
        Object.assign(q, data);
        updated = true;
      }
    });
  });
  return updated;
};

export const updateQuestionEndPoint = (
  build: EndpointBuilder<any, 'Questions' | 'Revisions', 'questionApi'>,
) =>
  build.mutation<ApiResponse, { _id: string; data: object }>({
    query: ({ _id, data }) => ({
      url: `api/v1/question/update-question/${_id}`,
      method: 'PATCH',
      body: data,
    }),

    async onQueryStarted({ _id, data }, { dispatch, queryFulfilled }) {
      const updatedTypes: {type: "Questions" | "Revisions", id: string}[] = [];

      const patch = (type: 'Questions' | 'Revisions') =>
        dispatch(
          questionApi.util.updateQueryData('getQuestions', { type }, (draft: any) => {
            if (wasQuestionUpdated(draft, _id, data)) {
              updatedTypes.push({type, id:_id});
            }
          })
        );

      const patches = [patch('Questions'), patch('Revisions')];

      try {
        await queryFulfilled;

        updatedTypes.forEach(({type, id}) => {
          dispatch(
            questionApi.util.invalidateTags([{ type, id}])
          );
        });
      } catch {
        patches.forEach((p) => p.undo());
      }
    },
  });
