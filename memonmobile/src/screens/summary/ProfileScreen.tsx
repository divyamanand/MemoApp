import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text, useTheme, Surface } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ErrorResponse, RootStackParamList } from '@/src/constants/types';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { logoutUser } from '@/src/features/auth/authActions';
import { handleError } from '@/src/service/errorService';

const ProfileScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { userInfo } = useAppSelector((state) => state.app);
  const userData = {
    name: userInfo?.name || 'User',
    email: userInfo?.email || null,
    avatar:
      userInfo?.avatar ?? 'https://randomuser.me/api/portraits/men/32.jpg',
  };
  const dispatch = useAppDispatch()
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigation.navigate('Login');
    } catch (error) {
      const formattedError: ErrorResponse = handleError(error);
      if (formattedError.statusCode === 403) navigation.navigate('Login');
      //else error logout.
    }
  };

  // Achievement badges
  const achievements = [
    { id: 1, color: '#FFF3CD', icon: 'emoji-events' },
    { id: 2, color: '#E3F2FD', icon: 'school' },
    { id: 3, color: '#FFE0E0', icon: 'workspace-premium' },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

        {/* Achievement badges section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Achievements
          </Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((a) => (
              <Surface
                key={a.id}
                style={[styles.achievementBadge, { backgroundColor: a.color }]}
                elevation={2}
              >
                <MaterialIcons name={a.icon} size={36} color={colors.primary} />
              </Surface>
            ))}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('Settings')}
          >
            <MaterialIcons
              name="settings"
              size={20}
              color={colors.onSurfaceVariant}
            />
            <Text
              style={[styles.actionButtonText, { color: colors.onSurface }]}
            >
              Settings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface }]}
            onPress={handleLogout}
          >
            <MaterialIcons
              name="logout"
              size={20}
              color={colors.onSurfaceVariant}
            />
            <Text
              style={[styles.actionButtonText, { color: colors.onSurface }]}
            >
              Logout
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
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
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
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});

export default ProfileScreen;
