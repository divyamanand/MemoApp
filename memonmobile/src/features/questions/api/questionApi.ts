import { createApi } from '@reduxjs/toolkit/query/react';
import { getQuestionsEndpoint } from './endPoints/getQuestions';
import { addQuestionEndpoint } from './endPoints/addQuestion';
import { deleteQuestionEndpoint } from './endPoints/deleteQuestion';
import { axiosBaseQuery } from '../../axiosQuery';


export const questionApi = createApi({
  reducerPath: 'questionApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Questions', 'Revisions', 'Revision'],
  endpoints: (build) => ({
    getQuestions: getQuestionsEndpoint(build),
    addQuestion: addQuestionEndpoint(build),
    deleteQuestion: deleteQuestionEndpoint(build),
  }),
});

export const {
  useAddQuestionMutation,
  useGetQuestionsInfiniteQuery, 
  useDeleteQuestionMutation,
} = questionApi;
