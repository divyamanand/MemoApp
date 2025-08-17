import React from 'react'
import {
  StyleSheet,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native'
import { ContributionGraph } from 'react-native-chart-kit'
import { StudyLightTheme } from '../App' 

const hexToRgb = (hex: string) => {
  const h = hex.replace('#', '')
  const bigint = parseInt(h, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  }
}

type Props = {
  numDays?: number
  values?: { date: string; count: number }[]
  cardHorizontalPadding?: number 
}

const HeatMap: React.FC<Props> = ({
  numDays = 365,
  values,
  cardHorizontalPadding = 20,
}) => {
  const { width: screenWidth } = useWindowDimensions()

  const DEFAULT_CELL = 14
  const GAP = 4
  const MIN_CELL = 6
  const SIDE_PADDING = 8

  const columns = Math.ceil(numDays / 5.8)
  const maxChartWidth = Math.max(0, screenWidth - cardHorizontalPadding)
  const fitCell = Math.floor((maxChartWidth - SIDE_PADDING - columns * GAP) / columns)

  let cellSizeUsed: number
  let graphWidth: number

  if (fitCell >= MIN_CELL) {
    cellSizeUsed = Math.min(DEFAULT_CELL, fitCell)
    graphWidth = columns * (cellSizeUsed + GAP) + SIDE_PADDING
    graphWidth = Math.max(graphWidth, Math.min(maxChartWidth, screenWidth))
  } else {
    cellSizeUsed = DEFAULT_CELL
    graphWidth = columns * (cellSizeUsed + GAP) + SIDE_PADDING
  }

  const primaryRgb = hexToRgb(StudyLightTheme.colors.primary)
  const surfaceVariant = StudyLightTheme.colors.surfaceVariant

  const  chartConfig={
          backgroundColor: StudyLightTheme.colors.background,
          backgroundGradientFrom: StudyLightTheme.colors.background,
          backgroundGradientTo: StudyLightTheme.colors.background,
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(79, 134, 247, ${opacity})`,
          style: { borderRadius: 12 },
  }

  const sampleValues =
    values ??
    [
      { date: '2019-01-02', count: 1 },
      { date: '2019-01-03', count: 2 },
      { date: '2019-01-04', count: 3 },
      { date: '2019-01-05', count: 4 },
      { date: '2019-01-06', count: 5 },
      { date: '2019-01-30', count: 2 },
      { date: '2019-01-31', count: 3 },
      { date: '2019-03-01', count: 2 },
      { date: '2019-04-02', count: 4 },
      { date: '2019-03-05', count: 2 },
      { date: '2019-12-31', count: 4 },
    ]

 return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 0 }}
    >
      <View style={[styles.wrapper, { width: graphWidth }]}>
        <ContributionGraph
          values={sampleValues}
          endDate={new Date('2019-12-31')}
          numDays={numDays}
          width={graphWidth}
          height={220}
          chartConfig={chartConfig}
          showMonthLabels={true}
        />
      </View>
    </ScrollView>
  )
}

export default HeatMap

const styles = StyleSheet.create({
  wrapper: {
    margin: 0,
    padding: 0,
  },
})