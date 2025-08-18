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

export const getGeneratedQuestions = async (tags: string[]) => {
  try {
    const { data } = await api.get('/api/v1/ai/generated-questions', {
      params: { tags },
      paramsSerializer: (params) =>
        params.tags
          .map((t: string) => `tags=${encodeURIComponent(t)}`)
          .join('&'),
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
