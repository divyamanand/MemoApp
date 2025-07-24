import { Text, View } from 'react-native';
import React from 'react';
import { useAppSelector } from '@/src/store/hooks';

const RevisionScreen = () => {
  const { revisionQuestions } = useAppSelector((state) => state.questions);

  return (
    <View>
      <Text>RevisionScreen</Text>
    </View>
  );
};

export default RevisionScreen;
