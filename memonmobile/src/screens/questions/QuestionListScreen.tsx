import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppHeader from '../../components/AppHeader';
import TextInputField from '../../components/TextInputField';
import QuestionListItem from '../../components/QuestionListItem';
import BottomNav from '../../components/BottomNav';
import IconButton from '@/src/components/IconButton';
import { useGetQuestionsInfiniteQuery } from '@/src/features/questions/api/questionApi';
import { handleError } from '@/src/service/errorService';
import { useNavigation } from '@react-navigation/native';
import { resetApp } from '@/src/store/store';

const QuestionsListScreen = () => {
  const { data, error, isError } = useGetQuestionsInfiniteQuery('revisions');
  const navigation = useNavigation();

  useEffect(() => {
    if (isError) {
      const formattedError = handleError(error);

      if (formattedError.statusCode === 401) {
        resetApp();
        //raise totast
        navigation.navigate('Login');
      }
    }
  }, [error, isError]);

  const allQuestions = data?.pages.flat() ?? [];

  return (
    <PaperProvider>
      <AppHeader
        title="Questions"
        actions={<IconButton icon="plus" onPress={() => {}} />}
      />
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
      <BottomNav activeRoute="review" onNavigate={() => {}} />
    </PaperProvider>
  );
};

export default QuestionsListScreen;
