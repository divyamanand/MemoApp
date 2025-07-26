import React from 'react';
import { View } from 'react-native';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import AppHeader from '../../components/AppHeader';
import CircularProgress from '../../components/CircularProgress';
import ContentCard from '../../components/ContentCard';
import PrimaryButton from '../../components/PrimaryButton';
import BottomNav from '../../components/BottomNav';
import IconButton from '@/src/components/IconButton';

const PracticeScreen = () => (
  <PaperProvider>
    <AppHeader
      title="Practice"
      onBack={() => {}}
      actions={<IconButton icon="cog" onPress={() => {}} />}
    />
    <View>
      <CircularProgress progress={0.2} label="2/10" />
      <ContentCard
        title="Question Title"
        content={<Text>A detailed description...</Text>}
      />
      <PrimaryButton label="Start Timer" onPress={() => {}} icon="timer" />
    </View>
    <BottomNav activeRoute="practice" onNavigate={() => {}} />
  </PaperProvider>
);

export default PracticeScreen;
