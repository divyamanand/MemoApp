import { Button, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useGetQuestionsInfiniteQuery } from '../service/questionService';
import { ErrorResponse } from '../constants/types';
import { handleError } from '../service/errorService';
import { useAppDispatch } from '../store/hooks';
import { resetUser } from '../features/auth/authSlice';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { data: revisions, error: revisionFetchError } =
    useGetQuestionsInfiniteQuery('revisions');

  useEffect(() => {
    const formattedError: ErrorResponse = handleError(revisionFetchError);

    if (formattedError.statusCode === 401) {
      dispatch(resetUser());
      navigation.navigate('Login');
    }
  }, [dispatch, revisionFetchError]);

  return (
    <View>
      <Text>DashboardScreen</Text>
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />

      <Button
        title="Settings"
        onPress={() => navigation.navigate('Settings')}
      />

      <Button title="Revise" onPress={() => navigation.navigate('Revision')} />

      <Button title="About" onPress={() => navigation.navigate('About')} />

      <Button title="Help" onPress={() => navigation.navigate('Help')} />
    </View>
  );
};

export default DashboardScreen;
