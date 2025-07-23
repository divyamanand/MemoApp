import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import DashboardScreen from '../screens/DashboardScreen'
import ProfileScreen from '../screens/ProfileScreen'
import SettingsScreen from '../screens/settings/SettingsScreen'
import { RootStackParamList } from '@/src/constants/types'
import { useAppSelector } from '@/src/store/hooks'
import LoginScreen from '../screens/auth/LoginScreen'
import RevisionScreen from '../screens/questions/RevisionScreen'
import QuestionScreen from '../screens/questions/QuestionScreen'
import AboutScreen from '../screens/AboutScreen'
import HelpScreen from '../screens/HelpScreen'
import { useVerifyUser } from '../hooks/useVerifyUser'

const AppNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>()
  const { tokenValid } = useAppSelector(state => state.auth)
  const userStatus = useVerifyUser()

  if (!tokenValid || userStatus == 'loggedOut')
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
      </Stack.Navigator>
    )

  return (
    <Stack.Navigator initialRouteName="Dashboard">
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Revision" component={RevisionScreen} />
      <Stack.Screen name="Question" component={QuestionScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
    </Stack.Navigator>
  )
}

export default AppNavigator
