import { MyBuilder } from '../types';

interface Tag {
  count: number;
  tag: string;
}

export const getQuestionTags = (build: MyBuilder) =>
  build.query<Tag[], void>({
    query: () => ({
      url: `/api/v1/question/tags`,
      method: 'GET',
    }),
    transformResponse: (res) => res.data,
    providesTags: (res) => [{ type: 'Questions', id: 'LIST' }],
  });
