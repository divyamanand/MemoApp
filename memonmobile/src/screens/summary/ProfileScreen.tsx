import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import {
  Text,
  useTheme,
  Surface,
  IconButton,
  Button as PaperButton,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/src/constants/types';

const ProfileScreen = () => {
  const { colors } = useTheme();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  // Sample user data
  const userData = {
    name: 'Ethan Carter',
    email: 'ethan.carter@email.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  };

  // Learning progress data
  const learningProgress = {
    questionsCompleted: 234,
    streak: 5,
    accuracy: '85%',
  };

  // Recent activity data
  const recentActivity = [
    {
      id: 1,
      title: 'Algebra Practice',
      subject: 'Math',
      icon: 'tag',
    },
    {
      id: 2,
      title: 'Biology Quiz',
      subject: 'Science',
      icon: 'science',
    },
    {
      id: 3,
      title: 'World War II Review',
      subject: 'History',
      icon: 'public',
    },
  ];

  // Achievement badges (using placeholder colors)
  const achievements = [
    { id: 1, color: '#FFF3CD', icon: 'emoji-events' },
    { id: 2, color: '#E3F2FD', icon: 'school' },
    { id: 3, color: '#FFE0E0', icon: 'workspace-premium' },
    { id: 4, color: '#F0F0F0', icon: 'circle', disabled: true },
  ];

  const handleBack = () => {
    // TODO: Navigate back
    console.log('Navigate back');
  };

  const handleEditProfile = () => {
    // TODO: Navigate to Edit Profile
    console.log('Edit Profile');
  };

  const handleSettings = () => {
    // TODO: Navigate to Settings
    console.log('Settings');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={colors.onSurface}
          onPress={handleBack}
        />
        <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: userData.avatar }}
            style={styles.profileImage}
          />
          <Text style={[styles.userName, { color: colors.onSurface }]}>
            {userData.name}
          </Text>
          <Text style={[styles.userEmail, { color: colors.onSurfaceVariant }]}>
            {userData.email}
          </Text>
        </View>

        {/* Learning Progress */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Learning Progress
          </Text>
          <View style={styles.progressGrid}>
            <Surface style={[styles.progressCard, { backgroundColor: colors.surfaceVariant }]} elevation={0}>
              <Text style={[styles.progressLabel, { color: colors.onSurfaceVariant }]}>
                Questions{'\n'}Completed
              </Text>
              <Text style={[styles.progressValue, { color: colors.primary }]}>
                {learningProgress.questionsCompleted}
              </Text>
            </Surface>
            
            <Surface style={[styles.progressCard, { backgroundColor: colors.surfaceVariant }]} elevation={0}>
              <Text style={[styles.progressLabel, { color: colors.onSurfaceVariant }]}>
                Streak
              </Text>
              <Text style={[styles.progressValue, { color: colors.primary }]}>
                {learningProgress.streak} days
              </Text>
            </Surface>
          </View>
          
          <Surface style={[styles.progressCardFull, { backgroundColor: colors.surfaceVariant }]} elevation={0}>
            <Text style={[styles.progressLabel, { color: colors.onSurfaceVariant }]}>
              Accuracy
            </Text>
            <Text style={[styles.progressValue, { color: colors.primary }]}>
              {learningProgress.accuracy}
            </Text>
          </Surface>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Recent Activity
          </Text>
          <View style={styles.activityList}>
            {recentActivity.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: colors.surfaceVariant }]}>
                  <MaterialIcons
                    name={activity.icon as any}
                    size={20}
                    color={colors.onSurfaceVariant}
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTitle, { color: colors.onSurface }]}>
                    {activity.title}
                  </Text>
                  <Text style={[styles.activitySubject, { color: colors.onSurfaceVariant }]}>
                    {activity.subject}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Achievements
          </Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <Surface 
                key={achievement.id}
                style={[
                  styles.achievementBadge,
                  { backgroundColor: achievement.color },
                  achievement.disabled && { opacity: 0.3 }
                ]}
                elevation={achievement.disabled ? 0 : 2}
              >
                <MaterialIcons
                  name={achievement.icon as any}
                  size={32}
                  color={achievement.disabled ? colors.onSurfaceVariant : colors.primary}
                />
              </Surface>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <MaterialIcons name="edit" size={20} color={colors.onSurfaceVariant} />
          <Text style={[styles.actionButtonText, { color: colors.onSurface }]}>
            Edit Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <MaterialIcons name="settings" size={20} color={colors.onSurfaceVariant} />
          <Text style={[styles.actionButtonText, { color: colors.onSurface }]}>
            Settings
          </Text>
        </TouchableOpacity>
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  progressGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  progressCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  progressCardFull: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 16,
  },
  progressValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  activitySubject: {
    fontSize: 13,
    fontWeight: '500',
  },
  achievementsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  achievementBadge: {
    width: 72,
    height: 72,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    gap: 16,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});

export default ProfileScreen;
