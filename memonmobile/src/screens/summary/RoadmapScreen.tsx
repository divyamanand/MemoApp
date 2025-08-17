import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Surface,
  IconButton,
  ProgressBar,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface RoadmapItem {
  id: string;
  title: string;
  questions: number;
  status: 'completed' | 'in-progress' | 'locked';
  progress?: number;
}

const RoadmapScreen = () => {
  const { colors } = useTheme();

  // Sample roadmap data
  const roadmapData: RoadmapItem[] = [
    {
      id: '1',
      title: 'Algebra',
      questions: 100,
      status: 'completed',
      progress: 100,
    },
    {
      id: '2',
      title: 'Geometry',
      questions: 50,
      status: 'in-progress',
      progress: 50,
    },
    {
      id: '3',
      title: 'Calculus',
      questions: 25,
      status: 'locked',
    },
    {
      id: '4',
      title: 'Statistics',
      questions: 0,
      status: 'locked',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'check';
      case 'in-progress':
        return 'play-arrow';
      case 'locked':
        return 'lock';
      default:
        return 'lock';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.primary;
      case 'in-progress':
        return colors.primary;
      case 'locked':
        return colors.outline;
      default:
        return colors.outline;
    }
  };

  const getStatusText = (status: string, progress?: number) => {
    switch (status) {
      case 'completed':
        return '100% COMPLETED';
      case 'in-progress':
        return `${progress}% IN PROGRESS`;
      case 'locked':
        return 'LOCKED';
      default:
        return 'LOCKED';
    }
  };

  const handleBack = () => {
    // TODO: Navigate back
    console.log('Navigate back');
  };

  const handleItemPress = (item: RoadmapItem) => {
    if (item.status !== 'locked') {
      // TODO: Navigate to topic questions
      console.log('Navigate to:', item.title);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <Surface
        style={[styles.header, { backgroundColor: colors.surface }]}
        elevation={0}
      >
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={colors.onSurface}
          onPress={handleBack}
        />
        <Text style={[styles.headerTitle, { color: colors.onSurface }]}>
          Roadmap
        </Text>
        <View style={{ width: 40 }} />
      </Surface>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Subject Title */}
        <Text style={[styles.subjectTitle, { color: colors.onSurface }]}>
          Math
        </Text>

        {/* Roadmap Items */}
        <View style={styles.roadmapContainer}>
          {roadmapData.map((item, index) => (
            <View key={item.id} style={styles.roadmapItem}>
              {/* Connecting Line */}
              {index < roadmapData.length - 1 && (
                <View
                  style={[
                    styles.connectingLine,
                    { backgroundColor: colors.outline },
                  ]}
                />
              )}

              {/* Icon Circle */}
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: getStatusColor(item.status),
                    opacity: item.status === 'locked' ? 0.5 : 1,
                  },
                ]}
              >
                <MaterialIcons
                  name={getStatusIcon(item.status) as any}
                  size={24}
                  color={
                    item.status === 'locked'
                      ? colors.onSurfaceVariant
                      : '#FFFFFF'
                  }
                />
              </View>

              {/* Content Card */}
              <Surface
                style={[
                  styles.contentCard,
                  {
                    backgroundColor: colors.surface,
                    opacity: item.status === 'locked' ? 0.6 : 1,
                  },
                ]}
                elevation={item.status === 'locked' ? 0 : 1}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardLeft}>
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            item.status === 'completed'
                              ? colors.primary
                              : item.status === 'in-progress'
                                ? colors.primary
                                : colors.onSurfaceVariant,
                        },
                      ]}
                    >
                      {getStatusText(item.status, item.progress)}
                    </Text>
                    <Text
                      style={[
                        styles.itemTitle,
                        {
                          color:
                            item.status === 'locked'
                              ? colors.onSurfaceVariant
                              : colors.onSurface,
                        },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.questionCount,
                        { color: colors.onSurfaceVariant },
                      ]}
                    >
                      {item.questions} questions
                    </Text>

                    {/* Progress Bar for In-Progress Items */}
                    {item.status === 'in-progress' && (
                      <ProgressBar
                        progress={(item.progress || 0) / 100}
                        color={colors.primary}
                        style={styles.progressBar}
                      />
                    )}
                  </View>

                  {/* Decorative Icon/Illustration */}
                  <View style={styles.cardRight}>
                    <View
                      style={[
                        styles.decorativeIcon,
                        {
                          backgroundColor:
                            item.status === 'completed'
                              ? '#F0F4FF'
                              : item.status === 'in-progress'
                                ? '#F0F8FF'
                                : colors.surfaceVariant,
                        },
                      ]}
                    >
                      <MaterialIcons
                        name={
                          item.title === 'Algebra'
                            ? 'calculate'
                            : item.title === 'Geometry'
                              ? 'polyline'
                              : item.title === 'Calculus'
                                ? 'functions'
                                : 'bar-chart'
                        }
                        size={32}
                        color={
                          item.status === 'locked'
                            ? colors.onSurfaceVariant
                            : colors.primary
                        }
                      />
                    </View>
                  </View>
                </View>
              </Surface>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  subjectTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 32,
  },
  roadmapContainer: {
    paddingLeft: 8,
  },
  roadmapItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    position: 'relative',
  },
  connectingLine: {
    position: 'absolute',
    left: 31, // Center of icon circle
    top: 64,
    width: 2,
    height: 80,
    opacity: 0.3,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contentCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardLeft: {
    flex: 1,
  },
  cardRight: {
    marginLeft: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  questionCount: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  decorativeIcon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RoadmapScreen;
