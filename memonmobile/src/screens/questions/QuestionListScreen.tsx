import React from 'react';
import { ScrollView } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppHeader from '../../components/AppHeader';
import TextInputField from '../../components/TextInputField';
import QuestionListItem from '../../components/QuestionListItem';
import BottomNav from '../../components/BottomNav';
import IconButton from '@/src/components/IconButton';

const QuestionsListScreen = () => (
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
      <QuestionListItem
        title="Solve Quadratic Equations"
        category="Math"
        time="5m"
        difficultyColor="yellow"
      />
      <QuestionListItem
        title="Calculate Projectile Motion"
        category="Physics"
        time="10m"
        difficultyColor="green"
        completed
      />
    </ScrollView>
    <BottomNav activeRoute="review" onNavigate={() => {}} />
  </PaperProvider>
);

export default QuestionsListScreen;
