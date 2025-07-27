import { createApi } from '@reduxjs/toolkit/query/react';
import { getQuestionsEndpoint } from './endPoints/getQuestions';
import { addQuestionEndpoint } from './endPoints/addQuestion';
import { deleteQuestionEndpoint } from './endPoints/deleteQuestion';
import { axiosBaseQuery } from '../../axiosQuery';
import { updateRevisionEndPoint } from './endPoints/updateRevision';
import { updateQuestionEndPoint } from './endPoints/updateQuestion';

export const questionApi = createApi({
  reducerPath: 'questionApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Questions'],
  endpoints: (build) => ({
    getQuestions: getQuestionsEndpoint(build),
    addQuestion: addQuestionEndpoint(build),
    deleteQuestion: deleteQuestionEndpoint(build),
    updateRevision: updateRevisionEndPoint(build),
    updateQuestion: updateQuestionEndPoint(build),
  }),
});

export const {
  useAddQuestionMutation,
  useGetQuestionsInfiniteQuery,
  useDeleteQuestionMutation,
  useUpdateQuestionMutation,
  useUpdateRevisionMutation
} = questionApi;
