import React from 'react';
import { View, Text } from 'react-native';
// Placeholder: Install react-native-chart-kit for real charts
// import { LineChart as RNLineChart } from 'react-native-chart-kit';

interface LineChartProps {
  data: number[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => (
  <View>
    {/* Replace with actual chart */}
    <Text>Line Chart Placeholder (Data: {data.join(', ')})</Text>
    {/* Example with chart-kit: <RNLineChart data={{ datasets: [{ data }] }} width={300} height={200} /> */}
  </View>
);

export default LineChart;
