import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  useTheme,
  Surface,
  Switch,
  IconButton,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const { colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const sections = [
    {
      title: 'ACCOUNT MANAGEMENT',
      items: [
        {
          id: 'editProfile',
          title: 'Edit Profile',
          subtitle: 'Update your profile information',
          icon: 'person',
          iconBg: colors.primary,
          onPress: () => {
            // TODO: Navigate to Edit Profile
          },
        },
        {
          id: 'changePassword',
          title: 'Change Password',
          subtitle: 'Change your password for security',
          icon: 'lock',
          iconBg: colors.primary,
          onPress: () => {
            // TODO: Navigate to Change Password
          },
        },
      ],
    },
    {
      title: 'NOTIFICATIONS',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'Enable or disable notifications',
          icon: 'notifications',
          iconBg: colors.primary,
          hasSwitch: true,
          switchValue: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          id: 'customizeNotifications',
          title: 'Customize Notifications',
          subtitle: 'Customize notification types',
          icon: 'tune',
          iconBg: colors.primary,
          onPress: () => {
            // TODO: Navigate to Customize Notifications
          },
        },
      ],
    },
    {
      title: 'PREFERENCES',
      items: [
        {
          id: 'themeSelection',
          title: 'Theme Selection',
          subtitle: 'Choose your preferred theme',
          icon: 'wb-sunny',
          iconBg: colors.primary,
          onPress: () => {
            // TODO: Navigate to Theme Selection
          },
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: 'Select your preferred language',
          icon: 'language',
          iconBg: colors.primary,
          onPress: () => {
            // TODO: Navigate to Language Selection
          },
        },
      ],
    },
    {
      title: 'DATA MANAGEMENT',
      items: [
        {
          id: 'exportData',
          title: 'Export Data',
          subtitle: 'Export your data for backup',
          icon: 'file-download',
          iconBg: colors.primary,
          onPress: () => {
            // TODO: Handle Export Data
          },
        },
        {
          id: 'deleteAccount',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account',
          icon: 'delete',
          iconBg: colors.error,
          textColor: colors.error,
          onPress: () => {
            // TODO: Handle Delete Account
          },
        },
      ],
    },
    {
      title: 'SUPPORT & ABOUT',
      items: [
        {
          id: 'faq',
          title: 'FAQ',
          subtitle: 'Frequently asked questions',
          icon: 'help-outline',
          iconBg: colors.primary,
          onPress: () => {
            // TODO: Navigate to FAQ
          },
        },
        {
          id: 'contactSupport',
          title: 'Contact Support',
          subtitle: 'Contact our support team',
          icon: 'headset-mic',
          iconBg: colors.primary,
          onPress: () => {
            // TODO: Navigate to Contact Support
          },
        },
        {
          id: 'appVersion',
          title: 'App Version',
          subtitle: 'v1.2.3',
          icon: 'info',
          iconBg: colors.primary,
          hideChevron: true,
        },
      ],
    },
  ];

  const handleBack = () => {
    // TODO: Navigate back
    console.log('Navigate back');
  };

  const renderSettingItem = (item: any) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.settingItem, { backgroundColor: colors.surface }]}
        onPress={item.onPress}
        disabled={item.hideChevron}
      >
        <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
          <MaterialIcons name={item.icon} size={20} color="#FFFFFF" />
        </View>

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.itemTitle,
              { color: item.textColor || colors.onSurface },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.itemSubtitle,
              { color: item.textColor || colors.onSurfaceVariant },
            ]}
          >
            {item.subtitle}
          </Text>
        </View>

        {item.hasSwitch ? (
          <Switch
            value={item.switchValue}
            onValueChange={item.onToggle}
            color={colors.primary}
          />
        ) : !item.hideChevron ? (
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={colors.onSurfaceVariant}
          />
        ) : null}
      </TouchableOpacity>
    );
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
          Settings
        </Text>
        <View style={{ width: 40 }} />
      </Surface>

      {/* Settings Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: colors.onSurfaceVariant }]}
            >
              {section.title}
            </Text>
            <View style={styles.sectionItems}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}
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
    paddingVertical: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  sectionItems: {
    gap: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.8,
  },
});

export default SettingsScreen;
