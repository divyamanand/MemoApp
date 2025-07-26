import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

interface StreakChartProps {
  streaks: number[]; // Heights as percentages
  days: string[]; // e.g., ['M', 'T', ...]
}

const StreakChart: React.FC<StreakChartProps> = ({ streaks, days }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
    {streaks.map((height, index) => (
      <View
        key={index}
        style={{
          height: `${height}%`,
          width: 20,
          backgroundColor: 'blue',
          borderRadius: 10,
        }}
      >
        <Text>{days[index]}</Text>
      </View>
    ))}
  </View>
);

export default StreakChart;
