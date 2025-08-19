import { handleError } from '../errorService';
import { api } from './api';

type RecommendedTagsResponse = { tags: string[] };

export const getRecommendedTags = async (
  topicDescription: string,
): Promise<RecommendedTagsResponse> => {
  try {
    const { data } = await api.post<RecommendedTagsResponse>(
      '/api/v1/ai/recommended-topic',
      { topicDescription },
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getGeneratedQuestions = async (tags: string[]) => {
  try {
    const { data } = await api.post('/api/v1/ai/generated-questions', {
      tags,
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
