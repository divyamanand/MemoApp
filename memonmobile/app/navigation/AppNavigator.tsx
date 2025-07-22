import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { RootStackParamList } from './types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import LoginScreen from '../screens/auth/LoginScreen';
import RevisionScreen from '../screens/questions/RevisionScreen';
import QuestionScreen from '../screens/questions/QuestionScreen';
import AboutScreen from '../screens/AboutScreen';
import HelpScreen from '../screens/HelpScreen';
import { useGetAndRefreshToken } from '@/hooks/useGetAndRefreshToken';
import { useGetUserDetailsQuery } from '@/service/auth';
import { setCredentials } from '@/features/auth/authSlice';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {

    const {tokenValid} = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()

    if (!tokenValid) return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="About" component={AboutScreen}/>
            <Stack.Screen name = "Help" component={HelpScreen}/>
        </Stack.Navigator>
    )
    
    const { data } = useGetUserDetailsQuery(undefined, 
        {
            skip: !tokenValid,
            refetchOnReconnect: true,
        })

    useEffect(() => {
        if (data) dispatch(setCredentials(data))
    }, [data, dispatch])

    return (
        <Stack.Navigator initialRouteName='Dashboard'>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Revision" component={RevisionScreen} />
            <Stack.Screen name="Question" component={QuestionScreen} />
            <Stack.Screen name="About" component={AboutScreen}/>
            <Stack.Screen name = "Help" component={HelpScreen}/>
        </Stack.Navigator>
    )
}


export default AppNavigator;
