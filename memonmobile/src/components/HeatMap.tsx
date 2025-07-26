import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');

interface HeatmapProps {
  month: string; // e.g., 'October 2024'
  data: (number | null)[]; // Opacity levels (0-1) or null for empty
}

const Heatmap: React.FC<HeatmapProps> = ({ month, data }) => {
  const { colors } = useTheme();
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity Heatmap</Text>
        <Text style={styles.subtitle}>{month}</Text>
      </View>
      <View style={styles.grid}>
        {days.map((day) => (
          <Text key={day} style={styles.dayLabel}>
            {day}
          </Text>
        ))}
        {data.map((level, index) => (
          <View
            key={index}
            style={[
              styles.cell,
              {
                backgroundColor: level
                  ? `${colors.primary}${Math.round(level * 255).toString(16)}`
                  : 'transparent',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, borderRadius: 12, backgroundColor: '#f0f2f4' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  subtitle: { fontSize: 14 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    width: width / 8,
    textAlign: 'center',
    marginBottom: 8,
  },
  cell: {
    width: width / 8 - 8,
    height: width / 8 - 8,
    borderRadius: 4,
    margin: 2,
  },
});

export default Heatmap;
