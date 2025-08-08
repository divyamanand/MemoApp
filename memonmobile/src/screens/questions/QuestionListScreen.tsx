import React from 'react';
import { ScrollView } from 'react-native';
import TextInputField from '../../components/TextInputField';
import QuestionListItem from '../../components/QuestionListItem';
import { useGetQuestionsInfiniteQuery } from '@/src/features/questions/api/questionApi';

const QuestionsListScreen = () => {
  const { data } = useGetQuestionsInfiniteQuery(undefined);

  const allQuestions =
    data?.pages.flatMap((page) => page.data?.questions ?? []) ?? [];

  return (
    <>
      <TextInputField
        label="Search questions"
        value=""
        onChangeText={() => {}}
        leftIcon="magnify"
      />
      <ScrollView>
        {allQuestions.map((question) => (
          <QuestionListItem
            key={question._id}
            title={question.questionName}
            difficulty={question.difficulty}
          />
        ))}
      </ScrollView>
    </>
  );
};

export default QuestionsListScreen;
