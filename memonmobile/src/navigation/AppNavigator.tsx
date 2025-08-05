import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import { RootStackParamList } from '@/src/constants/types';
import { useAppSelector } from '@/src/store/hooks';
import LoginScreen from '../screens/auth/LoginScreen';
import QuestionScreen from '../screens/questions/QuestionInfoScreen';
import AboutScreen from '../screens/AboutScreen';
import HelpScreen from '../screens/HelpScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PracticeScreen from '../screens/questions/PracticeScreen';
import QuestionsListScreen from '../screens/questions/QuestionListScreen';

const AppNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const Tab = createBottomTabNavigator();
  const { tokenValid } = useAppSelector((state) => state.app);

  if (!tokenValid)
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
      </Stack.Navigator>
    );

  return (
    <Tab.Navigator initialRouteName="Dashboard">
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Practice" component={PracticeScreen} />
      <Tab.Screen name="Question" component={QuestionsListScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
