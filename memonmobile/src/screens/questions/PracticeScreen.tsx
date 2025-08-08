import React from 'react';
import { View } from 'react-native';
import CircularProgress from '../../components/CircularProgress';
import ContentCard from '../../components/ContentCard';
import PrimaryButton from '../../components/PrimaryButton';
import { useGetRevisionsInfiniteQuery } from '@/src/features/questions/api/questionApi';

const PracticeScreen = () => {
  const { data } = useGetRevisionsInfiniteQuery(undefined);

  const allRevisions =
    data?.pages.flatMap((page) => page.data?.questions ?? []) ?? [];

  return (
    <View>
      <CircularProgress progress={0.2} label="2/10" />
      {allRevisions.map((question) => (
        <ContentCard
          title={question.questionName}
          key={question._id + question.questionName}
          completed={question.upcomingRevisions?.[0]?.completed ?? false}
        />
      ))}
      <PrimaryButton label="Start Timer" onPress={() => {}} icon="timer" />
    </View>
  );
};

export default PracticeScreen;
