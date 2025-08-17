// src/navigation/QuestionNavigator.tsx
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { RootStackParamList } from '@/src/constants/types';
import QuestionsListScreen from '../screens/questions/QuestionListScreen';
import AddQuestionScreen from '../screens/questions/AddQuestionScreen';
// import EditQuestionScreen from '../screens/questions/EditQuestionScreen';
import GenerateQuestionScreen from '../screens/questions/GenerateQuestionScreen';

const QuestionNavigator: React.FC = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const colorScheme = useColorScheme();
  const { colors } = useTheme();
  const isDarkMode = colorScheme === 'dark';
  const barStyle = isDarkMode ? 'dark-content' : 'light-content';

  const withSafeArea = (Comp: React.ComponentType<any>) => (props: any) => (
    <SafeAreaView style={{ flex: 1 }}>
      <Comp {...props} />
    </SafeAreaView>
  );

  return (
    <>
      <StatusBar barStyle={barStyle} backgroundColor={colors.background} />
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Questions"
      >
        <Stack.Screen
          name="Questions"
          component={withSafeArea(QuestionsListScreen)}
        />
        <Stack.Screen
          name="AddQuestion"
          component={withSafeArea(AddQuestionScreen)}
        />
        {/* <Stack.Screen name="EditQuestion" component={withSafeArea(EditQuestionScreen)} /> */}
        <Stack.Screen
          name="GenerateQuestion"
          component={withSafeArea(GenerateQuestionScreen)}
        />
      </Stack.Navigator>
    </>
  );
};

export default QuestionNavigator;
