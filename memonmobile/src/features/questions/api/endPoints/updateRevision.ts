import { EndpointBuilder } from '@reduxjs/toolkit/query';
import { ApiResponse } from '../types';
import { questionApi } from '../questionApi';

export const updateRevisionEndPoint = (
  build: EndpointBuilder<
    any,
    'Questions' | 'Revisions' | 'Revision',
    'questionApi'
  >,
) =>
  build.mutation<ApiResponse, { questionId: string; revisionId: string }>({
    query: ({ questionId, revisionId }) => ({
      url: `api/v1/question/mark-revision/${questionId}/${revisionId}`,
      method: 'PATCH',
    }),
    async onQueryStarted(
      { questionId, revisionId },
      { dispatch, queryFulfilled },
    ) {
      const patchResult = dispatch(
        questionApi.util.updateQueryData(
          'getQuestions',
          'Revisions',
          (draft) => {
            draft.pages.forEach((page) => {
              page.data.questions.forEach((question) => {
                if (question._id === questionId) {
                  question.upcomingRevisions.forEach((rev) => {
                    if (rev._id === revisionId) {
                      rev.completed = !rev.completed;
                    }
                  });
                }
              });
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
    invalidatesTags: (result, error, { questionId, revisionId }) => [
      { type: 'Revision', id: revisionId },
    ],
  });
