import { AxiosResponse } from 'axios';
import { MyBuilder } from '../types';

export const getCompletedCountUptoDate = (build: MyBuilder) =>
  build.query<
    { totalCompleted: number },
    void
  >({
    query: () => ({
      url: `/api/v1/question/total-count`,
      method: 'GET',
    }),
    transformResponse: (response: AxiosResponse<{ totalCompleted: number }>) => response.data,
  });
