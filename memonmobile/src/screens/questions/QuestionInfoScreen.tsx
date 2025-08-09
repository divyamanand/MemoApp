import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Surface,
  IconButton,
  Chip,
  Button as PaperButton,
  Divider,
} from 'react-native-paper';
import { ResponseQuestion } from '@/src/constants/types';

interface QuestionInfoScreenProps {
  question: ResponseQuestion;
  onClose?: () => void;
}

const QuestionInfoScreen: React.FC<QuestionInfoScreenProps> = ({
  question,
  onClose,
}) => {
  const { colors } = useTheme();

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return '#7BCEDB';
      case 'medium': return '#FFC15A';
      case 'hard': return '#FF6B6B';
      default: return colors.primary;
    }
  };

  const difficultyColor = getDifficultyColor(question.difficulty);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

      <Surface style={[styles.header, { backgroundColor: colors.surface }]} elevation={0}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={colors.onSurface}
          onPress={onClose}
        />
        <Text style={[styles.headerTitle, { color: colors.onSurface }]} numberOfLines={1}>
          {question.questionName}
        </Text>
        <View style={styles.headerActions}>
          <IconButton
            icon="pencil"
            size={20}
            iconColor={colors.onSurfaceVariant}
            onPress={() => {}}
          />
          <IconButton
            icon="delete-outline"
            size={20}
            iconColor={colors.onSurfaceVariant}
            onPress={() => {}}
          />
          {/* Close button in top right */}
          <IconButton
            icon="close"
            size={24}
            iconColor={colors.onSurface}
            onPress={onClose}
          />
        </View>
      </Surface>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Tags and Difficulty */}
        <View style={styles.tagsSection}>
          <View style={styles.tagsContainer}>
            {question.tags?.map((tag) => (
              <Chip
                key={tag}
                compact
                style={[
                  styles.tagChip,
                  { backgroundColor: colors.primaryContainer },
                ]}
                textStyle={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}
              >
                {tag}
              </Chip>
            ))}
            <Chip
              compact
              style={[
                styles.difficultyChip,
                { backgroundColor: difficultyColor + '20' },
              ]}
              textStyle={{ color: difficultyColor, fontSize: 12, fontWeight: '700' }}
            >
              {question.difficulty || 'Medium'}
            </Chip>
          </View>
        </View>

        {/* Question Description */}
        <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={1}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Question</Text>
          <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>
            {question.formData?.description || 
              "Explain the process of photosynthesis, detailing the roles of chloroplasts, sunlight, water, and carbon dioxide. What are the primary products of this essential biological process?"}
          </Text>
        </Surface>

        {/* Insights Section */}
        <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={1}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Insights</Text>
          <View style={styles.insightsGrid}>
            <View style={styles.insightItem}>
              <Text style={[styles.insightLabel, { color: colors.onSurfaceVariant }]}>Practiced</Text>
              <Text style={[styles.insightValue, { color: colors.onSurface }]}>5 times</Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={[styles.insightLabel, { color: colors.onSurfaceVariant }]}>Last Practiced</Text>
              <Text style={[styles.insightValue, { color: colors.onSurface }]}>3 minutes</Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={[styles.insightLabel, { color: colors.onSurfaceVariant }]}>AI Estimated Time</Text>
              <Text style={[styles.insightValue, { color: colors.onSurface }]}>5-7 minutes</Text>
            </View>
          </View>
        </Surface>

        {/* Revision History */}
        <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={1}>
          <View style={styles.revisionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Revision History</Text>
            <Chip
              compact
              style={{ backgroundColor: '#E7F7EE' }}
              textStyle={{ color: '#1E7F4B', fontSize: 12, fontWeight: '600' }}
            >
              +10% vs Last 7 days
            </Chip>
          </View>
          
          <View style={styles.historyStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.onSurface }]}>88%</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Accuracy</Text>
            </View>
            <Divider style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.onSurface }]}>12</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Total Reviews</Text>
            </View>
            <Divider style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.onSurface }]}>4.2m</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Avg Time</Text>
            </View>
          </View>
        </Surface>


        <View style={styles.actionButtons}>
          <PaperButton
            mode="outlined"
            onPress={() => {}}
            style={[styles.actionButton, { borderColor: colors.error }]}
            labelStyle={{ color: colors.error, fontWeight: '700' }}
            icon="minus"
          >
            Decrease
          </PaperButton>
          <PaperButton
            mode="outlined"
            onPress={() => {}}
            style={[styles.actionButton, { borderColor: colors.primary }]}
            labelStyle={{ color: colors.primary, fontWeight: '700' }}
            icon="plus"
          >
            Increase
          </PaperButton>
          
        </View>

        <PaperButton
            mode="contained"
            onPress={() => {}}
            style={[styles.actionButton, { backgroundColor: colors.secondary }]}
            labelStyle={{ fontWeight: '700' }}
            icon="lightbulb-outline"
          >
            Generate Related Questions
          </PaperButton>
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
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  tagsSection: {
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    height: 28,
  },
  difficultyChip: {
    height: 28,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  insightsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insightItem: {
    flex: 1,
    alignItems: 'center',
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  revisionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  historyStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  statDivider: {
    height: 30,
    width: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
  },
  frequencyButton: {
    alignSelf: 'center',
  },
  frequencyLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default QuestionInfoScreen;
