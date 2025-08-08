import React from 'react';
import { ScrollView } from 'react-native';
import TextInputField from '../../components/TextInputField';
import QuestionListItem from '../../components/QuestionListItem';
import { useGetQuestionsInfiniteQuery, useGetRevisionsInfiniteQuery } from '@/src/features/questions/api/questionApi';

const QuestionsListScreen = () => {
  const { data: questions } = useGetQuestionsInfiniteQuery(undefined);
  const { data: revisions } = useGetRevisionsInfiniteQuery(undefined);

  const allQuestions =
    questions?.pages.flatMap((page) => page.data?.questions ?? []) ?? [];

  const allRevisions = revisions?.pages.flatMap((page) => page.data?.questions ?? []) ?? []

  return (
    <>
      <TextInputField
        label="Search questions"
        value=""
        onChangeText={() => {}}
        leftIcon="magnify"
      />
      <ScrollView>
        {allRevisions.map((question) => (
          <QuestionListItem
            key={question._id}
            title={question.questionName}
            difficulty={question.difficulty}
          />
        ))}
      </ScrollView>
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
