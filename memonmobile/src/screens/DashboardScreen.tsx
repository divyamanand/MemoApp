import { Button, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRevisions } from '../hooks/useRevisions';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const revisionStatus = useRevisions();

  useEffect(() => {
    if (revisionStatus === 'loggedOut') navigation.navigate('Login');
  }, [revisionStatus]);

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
