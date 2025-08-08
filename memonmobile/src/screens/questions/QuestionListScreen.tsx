import React from 'react';
import { ScrollView } from 'react-native';
import TextInputField from '../../components/TextInputField';
import QuestionListItem from '../../components/QuestionListItem';
import { useGetQuestionsInfiniteQuery } from '@/src/features/questions/api/questionApi';

const QuestionsListScreen = () => {
  const { data } = useGetQuestionsInfiniteQuery(undefined);

  const allQuestions = data?.pages.flat() ?? [];

  console.log('Questions', allQuestions);

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
