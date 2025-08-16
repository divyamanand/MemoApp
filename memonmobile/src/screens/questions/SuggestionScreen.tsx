import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import {
  Text,
  useTheme,
  Surface,
  IconButton,
  Chip,
  Button as PaperButton,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface Question {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
}

const SuggestionScreen = () => {
  const { colors } = useTheme();
  
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      title: 'Question 1',
      description: 'Analyze the impact of the Industrial Revolution on global trade patterns.',
      subject: 'Economics',
      difficulty: 'Medium',
    },
    {
      id: '2',
      title: 'Question 2',
      description: 'Discuss the key factors that led to the fall of the Roman Empire.',
      subject: 'History',
      difficulty: 'Hard',
    },
    {
      id: '3',
      title: 'Question 3',
      description: 'Explain the principles of quantum mechanics and their applications.',
      subject: 'Physics',
      difficulty: 'Expert',
    },
    {
      id: '4',
      title: 'Question 4',
      description: 'Describe the process of photosynthesis in plants.',
      subject: 'Biology',
      difficulty: 'Easy',
    },
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '#E8F5E8';
      case 'medium':
        return '#FFF3CD';
      case 'hard':
        return '#FFE0E0';
      case 'expert':
        return '#F3E5F5';
      default:
        return colors.surfaceVariant;
    }
  };

  const getDifficultyTextColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '#2E7D32';
      case 'medium':
        return '#F57C00';
      case 'hard':
        return '#D32F2F';
      case 'expert':
        return '#7B1FA2';
      default:
        return colors.onSurfaceVariant;
    }
  };

  const handleBack = () => {
    // TODO: Navigate back
    console.log('Navigate back');
  };

  const handleDismiss = (questionId: string) => {
    setQuestions(prevQuestions => 
      prevQuestions.filter(q => q.id !== questionId)
    );
  };

  const handleQuestionPress = (question: Question) => {
    // TODO: Navigate to question details or add to practice
    console.log('Question pressed:', question);
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
        <Text style={[styles.headerTitle, { color: colors.onSurface }]}>
          AI Recommendations
        </Text>
        <View style={{ width: 40 }} />
      </Surface>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {questions.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons
              name="lightbulb-outline"
              size={64}
              color={colors.onSurfaceVariant}
            />
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>
              No Recommendations Yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
              AI recommendations will appear here based on your learning progress
            </Text>
          </View>
        ) : (
          questions.map((question) => (
            <TouchableOpacity
              key={question.id}
              onPress={() => handleQuestionPress(question)}
              activeOpacity={0.7}
            >
              <Surface style={[styles.questionCard, { backgroundColor: colors.surface }]} elevation={1}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.questionTitle, { color: colors.onSurface }]}>
                    {question.title}
                  </Text>
                </View>
                
                <Text style={[styles.questionDescription, { color: colors.onSurfaceVariant }]}>
                  {question.description}
                </Text>
                
                <View style={styles.tagsContainer}>
                  <Chip
                    compact
                    style={[styles.subjectChip, { backgroundColor: colors.surfaceVariant }]}
                    textStyle={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: '600' }}
                  >
                    {question.subject}
                  </Chip>
                  
                  <Chip
                    compact
                    style={[
                      styles.difficultyChip,
                      { backgroundColor: getDifficultyColor(question.difficulty) }
                    ]}
                    textStyle={{
                      color: getDifficultyTextColor(question.difficulty),
                      fontSize: 12,
                      fontWeight: '700'
                    }}
                  >
                    {question.difficulty}
                  </Chip>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.spacer} />
                  <PaperButton
                    mode="text"
                    onPress={() => handleDismiss(question.id)}
                    icon="eye-off"
                    labelStyle={{ color: colors.onSurfaceVariant, fontSize: 12 }}
                    style={styles.dismissButton}
                  >
                    Dismiss
                  </PaperButton>
                </View>
              </Surface>
            </TouchableOpacity>
          ))
        )}
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
    paddingHorizontal: 16,
  },
  questionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    marginBottom: 12,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  questionDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  subjectChip: {
    height: 28,
  },
  difficultyChip: {
    height: 28,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  spacer: {
    flex: 1,
  },
  dismissButton: {
    marginRight: -8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});

export default SuggestionScreen;
