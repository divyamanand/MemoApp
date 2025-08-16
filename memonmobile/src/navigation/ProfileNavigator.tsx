// src/navigation/ProfileNavigator.tsx
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { RootStackParamList } from '@/src/constants/types';
import ProfileScreen from '../screens/summary/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import HelpScreen from '../screens/summary/HelpScreen';
import ResetPassword from '../screens/auth/ResetPassword';
import EditProfileScreen from '../screens/auth/EditProfileScreen';

const ProfileNavigator: React.FC = () => {
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
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Profile">
        <Stack.Screen name="Profile" component={withSafeArea(ProfileScreen)} />
        <Stack.Screen name="Settings" component={withSafeArea(SettingsScreen)} />
        {/* <Stack.Screen name="Help" component={withSafeArea(HelpScreen)} /> */}
        <Stack.Screen name="EditProfile" component={withSafeArea(EditProfileScreen)} />
      </Stack.Navigator>
    </>
  );
};

export default ProfileNavigator;
