import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Surface,
  IconButton,
  Button as PaperButton,
  ActivityIndicator,
} from 'react-native-paper';
import Slider from '@react-native-community/slider';
import TextInputField from '../../components/TextInputField';
import { MaterialIcons } from '@expo/vector-icons';

interface GeneratedQuestion {
  id: number;
  text: string;
}

const GenerateQuestionScreen = () => {
  const { colors } = useTheme();

  // Form state
  const [topic, setTopic] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [generatedQuestions, setGeneratedQuestions] = useState<
    GeneratedQuestion[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sample generated questions (in real app, these would come from AI)
  const sampleQuestions: GeneratedQuestion[] = [
    {
      id: 1,
      text: 'What is the capital of France, and why is it significant?',
    },
    {
      id: 2,
      text: "Explain the core principles of Einstein's theory of general...",
    },
    {
      id: 3,
      text: 'List three major human activities contributing to climate change...',
    },
  ];

  const handleBack = () => {
    // TODO: Navigate back
    console.log('Navigate back');
  };

  const handleGenerateQuestions = async () => {
    if (!topic.trim()) {
      // TODO: Show error message
      return;
    }

    setIsGenerating(true);
    try {
      // TODO: Call AI API to generate questions
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setGeneratedQuestions(sampleQuestions);
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      // TODO: Regenerate questions with same parameters
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setGeneratedQuestions([...sampleQuestions].reverse()); // Just reverse for demo
    } catch (error) {
      console.error('Error regenerating questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQuestions = async () => {
    if (generatedQuestions.length === 0) return;

    setIsSaving(true);
    try {
      // TODO: Save questions to backend
      console.log('Saving questions:', generatedQuestions);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: Navigate back or show success message
    } catch (error) {
      console.error('Error saving questions:', error);
    } finally {
      setIsSaving(false);
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
          AI Question Generator
        </Text>
        <View style={{ width: 40 }} />
      </Surface>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Topic Input */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}
          >
            TOPIC
          </Text>
          <TextInputField
            label=""
            placeholder="e.g., 'The Renaissance period in Europe, focusing on art and architecture'"
            value={topic}
            onChangeText={setTopic}
            multiline
            numberOfLines={3}
            style={[
              styles.topicInput,
              { backgroundColor: colors.surfaceVariant },
            ]}
          />
        </View>

        {/* Number of Questions */}
        <View style={styles.section}>
          <View style={styles.questionCountHeader}>
            <Text
              style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}
            >
              NUMBER OF QUESTIONS
            </Text>
            <Text style={[styles.questionCount, { color: colors.onSurface }]}>
              {numberOfQuestions}
            </Text>
          </View>

          <View style={styles.sliderContainer}>
            import Slider from '@react-native-community/slider';
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={1}
              maximumValue={10}
              value={numberOfQuestions}
              onValueChange={setNumberOfQuestions}
              step={1}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.surfaceVariant}
              thumbTintColor={colors.primary}
            />
          </View>
        </View>

        {/* Generate Button */}
        <PaperButton
          mode="contained"
          onPress={handleGenerateQuestions}
          disabled={isGenerating || !topic.trim()}
          loading={isGenerating}
          style={[styles.generateButton, { backgroundColor: colors.primary }]}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          {isGenerating ? 'Generating Questions...' : 'Generate Questions'}
        </PaperButton>

        {/* Generated Questions Section */}
        {generatedQuestions.length > 0 && (
          <View style={styles.generatedSection}>
            <Text style={[styles.generatedTitle, { color: colors.onSurface }]}>
              Generated Questions
            </Text>

            {generatedQuestions.map((question, index) => (
              <View key={question.id} style={styles.questionItem}>
                <View
                  style={[
                    styles.questionIcon,
                    { backgroundColor: colors.primaryContainer },
                  ]}
                >
                  <MaterialIcons
                    name="help-outline"
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.questionContent}>
                  <Text
                    style={[styles.questionText, { color: colors.onSurface }]}
                  >
                    {question.text}
                  </Text>
                  <Text
                    style={[
                      styles.questionLabel,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    Question {index + 1}
                  </Text>
                </View>
              </View>
            ))}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <PaperButton
                mode="outlined"
                onPress={handleRegenerate}
                disabled={isGenerating}
                style={[styles.actionButton, { borderColor: colors.outline }]}
                labelStyle={{
                  color: colors.onSurfaceVariant,
                  fontWeight: '600',
                }}
              >
                Regenerate
              </PaperButton>
              <PaperButton
                mode="contained"
                onPress={handleSaveQuestions}
                disabled={isSaving}
                loading={isSaving}
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.primary },
                ]}
                labelStyle={{ fontWeight: '700' }}
              >
                Save Questions
              </PaperButton>
            </View>
          </View>
        )}

        {/* Loading Overlay */}
        {isGenerating && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text
              style={[styles.loadingText, { color: colors.onSurfaceVariant }]}
            >
              AI is generating your questions...
            </Text>
          </View>
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
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  topicInput: {
    borderRadius: 12,
    minHeight: 100,
  },
  questionCountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionCount: {
    fontSize: 20,
    fontWeight: '700',
  },
  sliderContainer: {
    paddingHorizontal: 8,
    marginTop: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  generateButton: {
    borderRadius: 24,
    marginBottom: 32,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  generatedSection: {
    marginTop: 16,
  },
  generatedTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
  },
  questionItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  questionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  questionContent: {
    flex: 1,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 4,
  },
  questionLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 200,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default GenerateQuestionScreen;
