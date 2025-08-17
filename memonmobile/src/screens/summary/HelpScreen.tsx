import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text, useTheme, Surface, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const HelpScreen = () => {
  const { colors } = useTheme();

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      subtitle: 'Introductory guides',
      icon: 'home',
      onPress: () => {
        // TODO: Navigate to Getting Started guides
        console.log('Getting Started pressed');
      },
    },
    {
      id: 'faqs',
      title: 'FAQs',
      subtitle: 'Common questions with concise answers',
      icon: 'help-outline',
      onPress: () => {
        // TODO: Navigate to FAQs
        console.log('FAQs pressed');
      },
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      subtitle: 'Solutions for typical issues',
      icon: 'security',
      onPress: () => {
        // TODO: Navigate to Troubleshooting
        console.log('Troubleshooting pressed');
      },
    },
    {
      id: 'contact-support',
      title: 'Contact Support',
      subtitle: 'Form or direct link',
      icon: 'email',
      onPress: () => {
        // TODO: Navigate to Contact Support
        console.log('Contact Support pressed');
      },
    },
    {
      id: 'tutorials',
      title: 'Tutorials',
      subtitle: 'Step-by-step visual or text guides',
      icon: 'article',
      onPress: () => {
        // TODO: Navigate to Tutorials
        console.log('Tutorials pressed');
      },
    },
  ];

  const handleBack = () => {
    // TODO: Navigate back
    console.log('Navigate back');
  };

  const renderHelpCategory = (category: any, isFullWidth = false) => {
    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryCard,
          isFullWidth && styles.categoryCardFullWidth,
          { backgroundColor: colors.surface },
        ]}
        onPress={category.onPress}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.primaryContainer },
          ]}
        >
          <MaterialIcons
            name={category.icon as any}
            size={32}
            color={colors.primary}
          />
        </View>
        <Text style={[styles.categoryTitle, { color: colors.onSurface }]}>
          {category.title}
        </Text>
        <Text
          style={[styles.categorySubtitle, { color: colors.onSurfaceVariant }]}
        >
          {category.subtitle}
        </Text>
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
          Help Center
        </Text>
        <View style={{ width: 40 }} />
      </Surface>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Title */}
        <Text style={[styles.mainTitle, { color: colors.onSurface }]}>
          How can we help?
        </Text>

        {/* Help Categories Grid */}
        <View style={styles.categoriesContainer}>
          {/* First Row */}
          <View style={styles.categoryRow}>
            {renderHelpCategory(helpCategories[0])}
            {renderHelpCategory(helpCategories[1])}
          </View>

          {/* Second Row */}
          <View style={styles.categoryRow}>
            {renderHelpCategory(helpCategories[2])}
            {renderHelpCategory(helpCategories[2])}
          </View>

          {/* Third Row - Full Width */}
          <View style={styles.categoryRowFull}>
            {renderHelpCategory(helpCategories[4], true)}
          </View>
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
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 40,
    textAlign: 'left',
  },
  categoriesContainer: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 16,
  },
  categoryRowFull: {
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryCardFullWidth: {
    flex: 0,
    minWidth: 160,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  categorySubtitle: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default HelpScreen;
