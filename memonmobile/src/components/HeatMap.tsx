import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const HeatMap = ({ commitsData, colors }) => {
  const chartConfig = {
    backgroundColor: colors?.surface || '#ffffff',
    backgroundGradientFrom: colors?.surface || '#ffffff',
    backgroundGradientTo: colors?.surface || '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => colors?.primary ? `rgba(79, 134, 247, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 12,
    },
  };

  return (
    <ContributionGraph
      values={commitsData || []}
      endDate={new Date('2025-10-30')}
      numDays={200}
      width={width-64}
      height={180}
      chartConfig={chartConfig}
      showMonthLabels={true}
      showOutOfRangeDays={true}
      squareSize={15}
      gutterSize={4}
      horizontal={true}
    />
  );
};

export default HeatMap;

const styles = StyleSheet.create({});
