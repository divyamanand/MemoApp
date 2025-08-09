// src/services/question/index.ts (or wherever you create the API)
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../axiosQuery';
import { getQuestionsEndpoint } from './endPoints/getQuestions';
import { addQuestionEndpoint } from './endPoints/addQuestion';
import { deleteQuestionEndpoint } from './endPoints/deleteQuestion';
import { updateRevisionEndPoint } from './endPoints/updateRevision';
import { updateQuestionEndPoint } from './endPoints/updateQuestion';
import { getRevisionsEndpoint } from './endPoints/getRevisions';
import { getCompletedCountUptoDate } from './endPoints/countCompletedUptoDate';

export const questionApi = createApi({
  reducerPath: 'questionApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Questions', 'Revisions'], // keep this in sync with providesTags above
  endpoints: (build) => ({
    getQuestions: getQuestionsEndpoint(build),
    getRevisions: getRevisionsEndpoint(build),
    addQuestion: addQuestionEndpoint(build),
    deleteQuestion: deleteQuestionEndpoint(build),
    updateRevision: updateRevisionEndPoint(build),
    updateQuestion: updateQuestionEndPoint(build),
    getCountTillDate: getCompletedCountUptoDate(build),
  }),
});

export const {
  useGetQuestionsInfiniteQuery,
  useGetRevisionsInfiniteQuery,
  useAddQuestionMutation,
  useDeleteQuestionMutation,
  useUpdateQuestionMutation,
  useUpdateRevisionMutation,
  useGetCountTillDateQuery,
} = questionApi;
