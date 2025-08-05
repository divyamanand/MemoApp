import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import TextInputField from '../../components/TextInputField';
import QuestionListItem from '../../components/QuestionListItem';
import { useGetQuestionsInfiniteQuery } from '@/src/features/questions/api/questionApi';
import { handleError } from '@/src/service/errorService';
import { handleReset } from '@/src/service/resetService';

const QuestionsListScreen = () => {
  const { data, error, isError } = useGetQuestionsInfiniteQuery({
    type: 'Questions',
  });

  useEffect(() => {
    if (isError) {
      const formattedError = handleError(error);

      if (formattedError.statusCode === 403) {
        handleReset(formattedError);
      }
    }
  }, [error, isError]);

  const allQuestions = data?.pages.flat() ?? [];

  return (
    <>
      <TextInputField
        label="Search questions"
        value=""
        onChangeText={() => {}}
        leftIcon="magnify"
      />
      <ScrollView>
        {allQuestions.map((page) =>
          page.data.questions.map((question) => (
            <QuestionListItem
              key={question._id}
              title={question.questionName}
              difficulty={question.difficulty}
            />
          )),
        )}
      </ScrollView>
    </>
  );
};

export default QuestionsListScreen;
