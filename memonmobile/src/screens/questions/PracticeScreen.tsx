import React, { useEffect } from 'react';
import { View } from 'react-native';
import CircularProgress from '../../components/CircularProgress';
import ContentCard from '../../components/ContentCard';
import PrimaryButton from '../../components/PrimaryButton';
import { useGetQuestionsInfiniteQuery } from '@/src/features/questions/api/questionApi';
import { handleError } from '@/src/service/errorService';
import { handleReset } from '@/src/service/resetService';

const PracticeScreen = () => {
  const { data, error, isError } = useGetQuestionsInfiniteQuery({
    type: 'Revisions',
  });

  useEffect(() => {
    if (isError) {
      const formattedError = handleError(error);

      if (formattedError.statusCode === 403) {
        handleReset(formattedError);
      }
    }
  }, [error, isError]);

  const allRevisions = data?.pages.flat() ?? [];

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
