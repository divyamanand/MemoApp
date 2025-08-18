// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, StatusBar, useColorScheme } from 'react-native';
import { RootStackParamList } from '@/src/constants/types';
import { useAppSelector } from '@/src/store/hooks';
import LoginScreen from '../screens/auth/LoginScreen';
import PracticeScreen from '../screens/questions/PracticeScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import DashboardNavigator from './DashboardNavigator';
import QuestionNavigator from './QuestionNavigator';
import ProfileNavigator from './ProfileNavigator';
import ResetPassword from '../screens/auth/ResetPassword';
import TopicScreen from '../screens/auth/TopicScreen';

const AppNavigator: React.FC = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const Tab = createBottomTabNavigator<RootStackParamList>();
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const barStyle = isDarkMode ? 'dark-content' : 'light-content';

  const { tokenValid, firstLogin } = useAppSelector((state) => state.app);

  if (!tokenValid) {
    return (
      <>
        <StatusBar barStyle={barStyle} backgroundColor={colors.background} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </Stack.Navigator>
      </>
    );
  }

  if (firstLogin) {
    return (
      <>
        <StatusBar barStyle={barStyle} backgroundColor={colors.background} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Topic" component={TopicScreen} />
        </Stack.Navigator>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle={barStyle} backgroundColor={colors.background} />
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
          component={DashboardNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
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
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="book-open-variant"
                size={size}
                color={color}
              />
            ),
          }}
        >
          {() => (
            <SafeAreaView style={styles.safe}>
              <PracticeScreen />
            </SafeAreaView>
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Question"
          component={QuestionNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="format-list-bulleted"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
});

export default AppNavigator;
