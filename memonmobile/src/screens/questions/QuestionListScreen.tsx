import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppHeader from '../../components/AppHeader';
import TextInputField from '../../components/TextInputField';
import QuestionListItem from '../../components/QuestionListItem';
import IconButton from '@/src/components/IconButton';
import { useGetQuestionsInfiniteQuery } from '@/src/features/questions/api/questionApi';
import { handleError } from '@/src/service/errorService';
import { useNavigation } from '@react-navigation/native';
import { resetApp } from '@/src/store/store';

const QuestionsListScreen = () => {
  const { data, isLoading, isError } = useGetQuestionsInfiniteQuery({type: "Questions"});


  // const navigation = useNavigation();

  // useEffect(() => {
  //   if (isError) {
  //     const formattedError = handleError(error);

  //     if (formattedError.statusCode === 401) {
  //       resetApp();
  //       navigation.navigate('Login');
  //     }
  //   }
  // }, [error, isError]);

  if (isLoading) console.log("loading")

  const allQuestions = data?.pages.flat() ?? [];

  console.log(allQuestions)

  return (
    <PaperProvider>
      {/* <AppHeader
        title="Questions"
        actions={<IconButton icon="plus" onPress={() => {}} />}
      /> */}
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
    </PaperProvider>
  );
};

export default QuestionsListScreen;

