import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import DashboardScreen from '../screens/DashboardScreen';
import { RootStackParamList } from '@/src/constants/types';
import { useAppSelector } from '@/src/store/hooks';
import LoginScreen from '../screens/auth/LoginScreen';
import AboutScreen from '../screens/AboutScreen';
import HelpScreen from '../screens/HelpScreen';
import PracticeScreen from '../screens/questions/PracticeScreen';
import QuestionsListScreen from '../screens/questions/QuestionListScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import RegisterScreen from '../screens/auth/RegisterScreen';

const AppNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const Tab = createBottomTabNavigator();
  const { tokenValid } = useAppSelector((state) => state.app);
  const { colors } = useTheme();

  if (!tokenValid)
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    );

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.outline,
          borderTopWidth: 0.5,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={SafeDashboard}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name="view-dashboard"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Practice"
        component={SafePractice}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name="book-open-variant"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Question"
        component={SafeQuestionsList}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const SafeDashboard = () => (
  <SafeAreaView style={styles.safe}>
    <DashboardScreen />
  </SafeAreaView>
);

const SafePractice = () => (
  <SafeAreaView style={styles.safe}>
    <PracticeScreen />
  </SafeAreaView>
);

const SafeQuestionsList = () => (
  <SafeAreaView style={styles.safe}>
    <QuestionsListScreen />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: { flex: 1 },
});

export default AppNavigator;
