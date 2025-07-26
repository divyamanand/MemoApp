import React from 'react';
import { View, Text } from 'react-native';
import { Surface } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';

interface StreakBannerProps {
  days: number;
  message: string;
}

const StreakBanner: React.FC<StreakBannerProps> = ({ days, message }) => (
  <Surface
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      borderRadius: 12,
      backgroundColor: 'orange',
      elevation: 2,
    }}
  >
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <FontAwesome5 name="fire" size={28} color="white" />
    </View>
    <View>
      <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
        {days} Day Streak!
      </Text>
      <Text style={{ color: 'white', fontSize: 14, opacity: 0.9 }}>
        {message}
      </Text>
    </View>
  </Surface>
);

export default StreakBanner;
