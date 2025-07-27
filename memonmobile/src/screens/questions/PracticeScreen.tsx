import React from 'react';
import { View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppHeader from '../../components/AppHeader';
import CircularProgress from '../../components/CircularProgress';
import ContentCard from '../../components/ContentCard';
import PrimaryButton from '../../components/PrimaryButton';
import BottomNav from '../../components/BottomNav';
import IconButton from '@/src/components/IconButton';
import { useGetQuestionsInfiniteQuery } from '@/src/features/questions/api/questionApi';

const PracticeScreen = () => {
  const { data } = useGetQuestionsInfiniteQuery('revisions');

  const allRevisions = data?.pages.flat();

  return (
    <PaperProvider>
      <AppHeader
        title="Practice"
        onBack={() => {}}
        actions={<IconButton icon="cog" onPress={() => {}} />}
      />
      <View>
        <CircularProgress progress={0.2} label="2/10" />
        {allRevisions?.map((page) =>
          page.data?.questions?.map((question) => (
            <ContentCard
              title={question.questionName}
              key={question._id + question.questionName}
              content={question.formData}
              completed={question.upcomingRevisions[0].completed}
            />
          )),
        )}
        <PrimaryButton label="Start Timer" onPress={() => {}} icon="timer" />
      </View>
      <BottomNav activeRoute="practice" onNavigate={() => {}} />
    </PaperProvider>
  );
};

export default PracticeScreen;
