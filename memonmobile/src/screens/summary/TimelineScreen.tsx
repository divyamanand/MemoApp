import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Surface,
  IconButton,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const TimelineScreen = () => {
  const { colors } = useTheme();

  // Sample timeline data
  const timelineData = [
    {
      id: 1,
      icon: 'local-fire-department',
      title: 'Streak Reward',
      subtitle: '3-day streak',
      timestamp: 'June 23, 2024 - 10:30 AM',
    },
    {
      id: 2,
      icon: 'emoji-events',
      title: 'Practice Milestone',
      subtitle: '100 questions answered',
      timestamp: 'June 22, 2024 - 3:45 PM',
    },
    {
      id: 3,
      icon: 'star',
      title: 'Challenge Victory',
      subtitle: 'Won a challenge',
      timestamp: 'June 21, 2024 - 11:00 AM',
    },
    {
      id: 4,
      icon: 'check-circle',
      title: 'Review Completion',
      subtitle: 'Completed a review session',
      timestamp: 'June 20, 2024 - 9:00 PM',
    },
    {
      id: 5,
      icon: 'quiz',
      title: 'Daily Quiz',
      subtitle: 'Finished daily quiz',
      timestamp: 'June 19, 2024 - 8:15 AM',
    },
  ];

  const handleBack = () => {
    // TODO: Navigate back
    console.log('Navigate back');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Surface style={[styles.header, { backgroundColor: colors.surface }]} elevation={0}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={colors.onSurface}
          onPress={handleBack}
        />
        <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Rewards</Text>
        <View style={{ width: 40 }} />
      </Surface>

      {/* Timeline Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timelineContainer}>
          {timelineData.map((item, index) => (
            <View key={item.id} style={styles.timelineItem}>
              {/* Timeline Line */}
              {index < timelineData.length - 1 && (
                <View 
                  style={[
                    styles.timelineLine, 
                    { backgroundColor: colors.outline }
                  ]} 
                />
              )}
              
              {/* Icon Circle */}
              <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
                <MaterialIcons
                  name={item.icon as any}
                  size={24}
                  color="#FFFFFF"
                />
              </View>
              
              {/* Content */}
              <View style={styles.contentContainer}>
                <Text style={[styles.titleText, { color: colors.onSurface }]}>
                  {item.title}
                </Text>
                <Text style={[styles.subtitleText, { color: colors.onSurfaceVariant }]}>
                  {item.subtitle}
                </Text>
                <Text style={[styles.timestampText, { color: colors.onSurfaceVariant }]}>
                  {item.timestamp}
                </Text>
              </View>
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
  },
  timelineContainer: {
    paddingHorizontal: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
    paddingBottom: 32,
  },
  timelineLine: {
    position: 'absolute',
    left: 31, // Center of icon (60/2 - 1)
    top: 60,
    width: 2,
    height: 72, // Extends to next item
    opacity: 0.3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    opacity: 0.8,
  },
  timestampText: {
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.6,
  },
});

export default TimelineScreen;
