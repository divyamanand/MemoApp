import React from 'react';
import { View } from 'react-native';
import { ProgressBar, Text } from 'react-native-paper';

interface CircularProgressProps {
  progress: number; // 0 to 1
  label: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  label,
}) => (
  <View style={{ position: 'relative', alignItems: 'center' }}>
    <ProgressBar
      progress={progress}
      style={{ width: 100, height: 100, borderRadius: 50 }}
    />
    <Text style={{ position: 'absolute', top: '40%' }}>{label}</Text>
  </View>
);

export default CircularProgress;
// Note: For true circular progress, consider 'react-native-circular-progress' library.
