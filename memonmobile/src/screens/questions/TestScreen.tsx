import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import {
  Text,
  useTheme,
  Surface,
  IconButton,
  Chip,
  Button as PaperButton,
} from 'react-native-paper';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

const TestScreen = () => {
  const { colors } = useTheme();
  
  // Test state
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions] = useState(10);
  const [totalScore, setTotalScore] = useState(7);
  const [confidenceValue, setConfidenceValue] = useState(7);
  
  // Sample question data
  const questionData = {
    title: "Derivative of a function",
    difficulty: "Medium",
    subject: "Calculus",
  };

  const progressPercentage = (totalScore / totalQuestions) * 100;
  const questionProgressPercentage = (currentQuestion / totalQuestions) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return '#7BCEDB';
      case 'medium': return '#FFC15A';
      case 'hard': return '#FF6B6B';
      default: return colors.primary;
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      // Reset confidence for next question
      setConfidenceValue(5);
      // TODO: Load next question data
    }
  };

  const handleCloseTest = () => {
    // TODO: Navigate back or show test completion
    console.log('Closing test...');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Surface style={[styles.header, { backgroundColor: colors.surface }]} elevation={0}>
        <IconButton
          icon="close"
          size={24}
          iconColor={colors.onSurface}
          onPress={handleCloseTest}
        />
        <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Test Mode</Text>
        <View style={{ width: 40 }} />
      </Surface>

      {/* Score and Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.scoreRow}>
          <Text style={[styles.scoreText, { color: colors.onSurface }]}>
            Total Score: <Text style={styles.scoreValue}>{totalScore}/{totalQuestions}</Text>
          </Text>
          <Text style={[styles.questionProgress, { color: colors.onSurfaceVariant }]}>
            {currentQuestion}/{totalQuestions} questions
          </Text>
        </View>
        
        {/* Progress Bar */}
        <View style={[styles.progressBarContainer, { backgroundColor: colors.surfaceVariant }]}>
          <View 
            style={[
              styles.progressBar, 
              { 
                width: `${progressPercentage}%`, 
                backgroundColor: colors.primary 
              }
            ]} 
          />
        </View>
      </View>

      {/* Question Card */}
      <Surface style={[styles.questionCard, { backgroundColor: colors.surface }]} elevation={2}>
        <Text style={[styles.questionTitle, { color: colors.onSurface }]}>
          Question {currentQuestion}: {questionData.title}
        </Text>
        
        {/* Tags */}
        <View style={styles.tagsContainer}>
          <Chip
            compact
            style={[
              styles.difficultyChip,
              { backgroundColor: getDifficultyColor(questionData.difficulty) + '20' }
            ]}
            textStyle={{ 
              color: getDifficultyColor(questionData.difficulty), 
              fontSize: 12, 
              fontWeight: '700' 
            }}
          >
            {questionData.difficulty}
          </Chip>
          <Chip
            compact
            style={[styles.subjectChip, { backgroundColor: colors.surfaceVariant }]}
            textStyle={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: '600' }}
          >
            {questionData.subject}
          </Chip>
        </View>

        {/* Confidence Question */}
        <Text style={[styles.confidenceQuestion, { color: colors.onSurfaceVariant }]}>
          How well do you remember this?
        </Text>

        {/* Confidence Slider */}
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            value={confidenceValue}
            onValueChange={setConfidenceValue}
            step={1}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.surfaceVariant}
            thumbStyle={{ backgroundColor: colors.primary }}
          />
          
          {/* Slider Labels */}
          <View style={styles.sliderLabels}>
            <View style={styles.sliderLabelContainer}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <Text 
                  key={num} 
                  style={[
                    styles.sliderNumber, 
                    { color: colors.onSurfaceVariant }
                  ]}
                >
                  {num}
                </Text>
              ))}
            </View>
            <View style={styles.sliderTextLabels}>
              <Text style={[styles.sliderLabel, { color: colors.onSurfaceVariant }]}>
                Forget
              </Text>
              <Text style={[styles.sliderLabel, { color: colors.onSurfaceVariant }]}>
                Remember
              </Text>
            </View>
          </View>
        </View>
      </Surface>

      {/* Question Progress Dots */}
      <View style={styles.dotsContainer}>
        {Array.from({ length: totalQuestions }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index < currentQuestion 
                  ? colors.primary 
                  : colors.surfaceVariant
              }
            ]}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <PaperButton
          mode="outlined"
          onPress={() => {
            if (currentQuestion > 1) {
              setCurrentQuestion(currentQuestion - 1);
            }
          }}
          disabled={currentQuestion === 1}
          style={[styles.navButton, { borderColor: colors.outline }]}
          labelStyle={{ color: colors.onSurfaceVariant }}
        >
          Previous
        </PaperButton>
        
        <PaperButton
          mode="contained"
          onPress={handleNextQuestion}
          disabled={currentQuestion >= totalQuestions}
          style={[styles.navButton, { backgroundColor: colors.primary }]}
          labelStyle={{ fontWeight: '700' }}
        >
          {currentQuestion >= totalQuestions ? 'Finish Test' : 'Next Question'}
        </PaperButton>
      </View>
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
  progressSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
  },
  scoreValue: {
    fontWeight: '800',
  },
  questionProgress: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  questionCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
    lineHeight: 28,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  difficultyChip: {
    height: 32,
  },
  subjectChip: {
    height: 32,
  },
  confidenceQuestion: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  sliderContainer: {
    paddingHorizontal: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    marginTop: 8,
  },
  sliderLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  sliderNumber: {
    fontSize: 12,
    fontWeight: '600',
  },
  sliderTextLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  navButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 4,
  },
});

export default TestScreen;
