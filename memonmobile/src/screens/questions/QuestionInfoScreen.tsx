import React from 'react';
import { ScrollView, View } from 'react-native';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import AppHeader from '../../components/AppHeader';
import ContentCard from '../../components/ContentCard';
import TagChip from '../../components/TagChip';
import LineChart from '../../components/LineChart';
import StreakChart from '../../components/StreakChart';
import BottomNav from '../../components/BottomNav';

const QuestionInfoScreen = () => (
  <PaperProvider>
    <AppHeader title="Question Info" onBack={() => {}} />
    <ScrollView>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Unraveling the Mystery of Photosynthesis
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <TagChip label="Biology" color="blue" />
        <TagChip label="Easy" color="green" />
      </View>
      <ContentCard title="Insights" content={<Text>Practiced 5 times</Text>} />
      <ContentCard
        title="Revision History"
        content={<LineChart data={[10, 20, 30]} />}
      />
      <ContentCard
        title="Streak"
        content={
          <StreakChart
            streaks={[50, 40, 20, 60, 50, 40, 100]}
            days={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
          />
        }
      />
    </ScrollView>
    <BottomNav activeRoute="review" onNavigate={() => {}} />
  </PaperProvider>
);

export default QuestionInfoScreen;
