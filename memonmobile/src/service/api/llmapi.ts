import { handleError } from '../errorService';
import { api } from './api';

type RecommendedTagsResponse = { tags: string[] };

export const getRecommendedTags = async (
  topicDescription: string,
): Promise<RecommendedTagsResponse> => {
  try {
    const { data } = await api.get<RecommendedTagsResponse>(
      '/api/v1/ai/recommended-topic',
      {
        params: { description: topicDescription }, // query param
      },
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};
