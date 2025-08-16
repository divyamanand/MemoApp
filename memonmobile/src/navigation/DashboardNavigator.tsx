// src/navigation/DashboardNavigator.tsx
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '@/src/constants/types';
import { useTheme } from 'react-native-paper';
import DashboardScreen from '../screens/summary/DashboardScreen';
import SuggestionScreen from '../screens/questions/SuggestionScreen';
import TestScreen from '../screens/questions/TestScreen';
import RoadmapScreen from '../screens/summary/RoadmapScreen';
import TimelineScreen from '../screens/summary/TimelineScreen';

const DashboardNavigator: React.FC = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const colorScheme = useColorScheme();
  const { colors } = useTheme();
  const isDarkMode = colorScheme === 'dark';
  const barStyle = isDarkMode ?  'dark-content' : 'light-content';

  const withSafeArea = (Comp: React.ComponentType<any>) => (props: any) => (
    <SafeAreaView style={{ flex: 1 }}>
      <Comp {...props} />
    </SafeAreaView>
  );

  return (
    <>
      <StatusBar barStyle={barStyle} backgroundColor={colors.background} />
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="DashboardScreen">
        <Stack.Screen name="DashboardScreen" component={withSafeArea(DashboardScreen)} />
        <Stack.Screen name="Suggestions" component={withSafeArea(SuggestionScreen)} />
        <Stack.Screen name="Test" component={withSafeArea(TestScreen)} />
        <Stack.Screen name="Roadmap" component={withSafeArea(RoadmapScreen)} />
        <Stack.Screen name="Timeline" component={withSafeArea(TimelineScreen)} />
      </Stack.Navigator>
    </>
  );
};

export default DashboardNavigator;
