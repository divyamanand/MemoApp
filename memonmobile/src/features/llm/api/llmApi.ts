// src/services/question/index.ts (or wherever you create the API)
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../axiosQuery';

export const llmApi = createApi({
  reducerPath: 'llmApi',
  baseQuery: axiosBaseQuery(),
  //   tagTypes: ['Questions', 'Revisions'],
  endpoints: (build) => ({}),
});

export const {} = llmApi;
