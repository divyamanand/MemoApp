import React from 'react';
import { ScrollView} from 'react-native';
import { Provider as PaperProvider} from 'react-native-paper';
import AppHeader from '../../components/AppHeader';
import BottomNav from '../../components/BottomNav';
import QuestionCard from '@/src/components/QuestionCard';
import { ResponseQuestion } from '@/src/constants/types';

interface QuestionInfoScreenProps {
  question: ResponseQuestion;
}

const QuestionInfoScreen: React.FC<QuestionInfoScreenProps> = ({ question }) => (
  <PaperProvider>
    <AppHeader title="Question Info" onBack={() => {}} />
    <ScrollView>
      <QuestionCard
        title={question.questionName}
        content={question.formData}
        // revisionHistory={question.revisionHistory}
        upcominRevisions={question.upcomingRevisions}
        key={question._id}
        tags={question.tags}
      />
    </ScrollView>
    <BottomNav activeRoute="review" onNavigate={() => {}} />
  </PaperProvider>
);

export default QuestionInfoScreen;
