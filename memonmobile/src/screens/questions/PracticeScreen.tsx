import React from 'react';
import { View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppHeader from '../../components/AppHeader';
import CircularProgress from '../../components/CircularProgress';
import ContentCard from '../../components/ContentCard';
import PrimaryButton from '../../components/PrimaryButton';
import IconButton from '@/src/components/IconButton';
import { useGetQuestionsInfiniteQuery } from '@/src/features/questions/api/questionApi';

const PracticeScreen = () => {
  const { data } = useGetQuestionsInfiniteQuery({type: "Revisions"},
    {
      refetchOnMountOrArgChange: true
    }
  );

  const allRevisions = data?.pages.flat() ?? [];

  console.log(allRevisions)

  return (
    <PaperProvider>
      {/* <AppHeader
        title="Practice"
        onBack={() => {}}
        actions={<IconButton icon="cog" onPress={() => {}} />}
      /> */}
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
    </PaperProvider>
  );
};

export default PracticeScreen;
