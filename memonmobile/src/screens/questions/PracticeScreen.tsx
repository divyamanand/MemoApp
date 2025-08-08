import React from 'react';
import { View } from 'react-native';
import CircularProgress from '../../components/CircularProgress';
import ContentCard from '../../components/ContentCard';
import PrimaryButton from '../../components/PrimaryButton';
import { useGetRevisionsInfiniteQuery } from '@/src/features/questions/api/questionApi';

const PracticeScreen = () => {
  const { data } = useGetRevisionsInfiniteQuery(undefined);

  const allRevisions = data?.pages.flat() ?? [];
  console.log(allRevisions);

  return (
    <>
      <View>
        <CircularProgress progress={0.2} label="2/10" />
        {allRevisions?.map((page) =>
          page.data?.questions?.map((question) => (
            <ContentCard
              title={question.questionName}
              key={question._id + question.questionName}
              // content={question.formData || null}
              completed={question.upcomingRevisions[0].completed}
            />
          )),
        )}
        <PrimaryButton label="Start Timer" onPress={() => {}} icon="timer" />
      </View>
    </>
  );
};

export default PracticeScreen;
