import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Text,
  useTheme,
  Surface,
  IconButton,
  Button as PaperButton,
  Chip,
  HelperText,
  ActivityIndicator,
} from 'react-native-paper';
import TextInputField from '../../components/TextInputField';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { difficulty, PostQuestion, ResponseQuestion, RootStackParamList } from '@/src/constants/types';
import { useAddQuestionMutation } from '@/src/features/questions/api/questionApi';
import { nanoid } from '@reduxjs/toolkit';

// AI Suggestion Data
const DIFFICULTY_SUGGESTIONS: difficulty[] = ['easy', 'medium', 'hard'];
const TAG_SUGGESTIONS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 
  'Computer Science', 'Algorithms', 'Data Structures', 
  'Programming', 'General Knowledge', 'History'
];


const AddQuestionScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  // Form state
  const [questionName, setQuestionName] = useState('');
  const [difficulty, setDifficulty] = useState<difficulty>("medium");
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>(['']);
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // AI Suggestion states
  const [showDifficultySuggestions, setShowDifficultySuggestions] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  const [addQuestion, {isError}] = useAddQuestionMutation()

  // Difficulty handling
  const selectDifficulty = (selectedDifficulty: difficulty) => {
    setDifficulty(selectedDifficulty);
    setShowDifficultySuggestions(false);
    setErrors(prev => ({ ...prev, difficulty: '' }));
  };

  // Tag handling
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag.length > 0 && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setErrors(prev => ({ ...prev, tags: '' }));
    }
    setTagInput('');
    setShowTagSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputSubmit = () => {
    if (tagInput.trim().length > 0) {
      addTag(tagInput);
    }
  };

  // Options handling
  const updateOption = (text: string, index: number) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!questionName.trim()) {
      newErrors.questionName = 'Question name is required';
    }
    if (!difficulty) {
      newErrors.difficulty = 'Please select a difficulty level';
    }
    if (tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
  setQuestionName('');
  setDifficulty("medium");
  setDescription('');
  setTags([]);
  setOptions(['']);
  setLink('');
  setErrors({});
  setTagInput('');
  setShowDifficultySuggestions(false);
  setShowTagSuggestions(false);
};


  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const tempId = nanoid()
      const formData : PostQuestion = {
        questionName: questionName.trim(),
        difficulty,
        description: description.trim(),
        tags,
        // options: options.filter(option => option.trim().length > 0),
        link: link.trim(),
        _id: tempId,
        upcomingRevisions: [],
        formData: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await addQuestion(formData).unwrap()

      resetForm()

      
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  const filteredTagSuggestions = TAG_SUGGESTIONS.filter(
    tag => tag.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(tag)
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Surface style={[styles.header, { backgroundColor: colors.surface }]} elevation={0}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={colors.onSurface}
          onPress={() => {
            // TODO: Navigate back
          }}
        />
        <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Add Question</Text>
        <View style={{ width: 40 }} />
      </Surface>

      <PaperButton
              mode="contained"
              onPress={() => navigation.navigate("GenerateQuestion")}
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              contentStyle={styles.submitButtonContent}
            >
              Generate With AI
      </PaperButton>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Surface style={[styles.formCard, { backgroundColor: colors.surface }]} elevation={1}>
            
            {/* Question Name */}
            <View style={styles.fieldContainer}>
              <TextInputField
                label="Question Name *"
                value={questionName}
                onChangeText={(text) => {
                  setQuestionName(text);
                  setErrors(prev => ({ ...prev, questionName: '' }));
                }}
                leftIcon="help-circle"
              />
              <HelperText type="error" visible={!!errors.questionName}>
                {errors.questionName}
              </HelperText>
            </View>

            {/* Difficulty with AI Suggestions */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: colors.onSurface }]}>
                Difficulty Level *
              </Text>
              <View style={styles.suggestionContainer}>
                <PaperButton
                  mode="outlined"
                  onPress={() => setShowDifficultySuggestions(!showDifficultySuggestions)}
                  style={[styles.suggestionButton, { borderColor: colors.primary }]}
                  icon="lightbulb"
                  labelStyle={{ color: colors.primary, fontWeight: '600' }}
                >
                  AI Suggestions
                </PaperButton>
                {difficulty && (
                  <Chip
                    style={[styles.selectedChip, { backgroundColor: colors.primaryContainer }]}
                    textStyle={{ color: colors.primary, fontWeight: '700' }}
                    onClose={() => setDifficulty("medium")}
                  >
                    {difficulty}
                  </Chip>
                )}
              </View>
              
              {showDifficultySuggestions && (
                <View style={[styles.suggestionsGrid, { backgroundColor: colors.surfaceVariant }]}>
                  {DIFFICULTY_SUGGESTIONS.map((suggestion : difficulty) => (
                    <Chip
                      key={suggestion}
                      onPress={() => selectDifficulty(suggestion)}
                      style={styles.suggestionChip}
                      mode="outlined"
                    >
                      {suggestion}
                    </Chip>
                  ))}
                </View>
              )}
              <HelperText type="error" visible={!!errors.difficulty}>
                {errors.difficulty}
              </HelperText>
            </View>

            {/* Description */}
            <View style={styles.fieldContainer}>
              <TextInputField
                label="Description (Optional)"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                leftIcon="text"
              />
              <HelperText type="info" visible={true}>
                Provide additional context or details about the question
              </HelperText>
            </View>

            {/* Tags with AI Suggestions */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: colors.onSurface }]}>
                Tags * (At least one required)
              </Text>
              
              {/* Selected Tags */}
              <View style={styles.tagsContainer}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    onClose={() => removeTag(tag)}
                    style={[styles.selectedTagChip, { backgroundColor: colors.primaryContainer }]}
                    textStyle={{ color: colors.primary }}
                  >
                    {tag}
                  </Chip>
                ))}
              </View>

              {/* Tag Input with AI Suggestions */}
              <View style={styles.tagInputContainer}>
                <TextInputField
                  label="Add Tag"
                  value={tagInput}
                  onChangeText={(text) => {
                    setTagInput(text);
                    setShowTagSuggestions(text.length > 0);
                  }}
                  onSubmitEditing={handleTagInputSubmit}
                  leftIcon="tag"
                  rightIcon="plus"
                  onRightIconPress={handleTagInputSubmit}
                />
                
                <PaperButton
                  mode="text"
                  onPress={() => setShowTagSuggestions(!showTagSuggestions)}
                  icon="lightbulb"
                  labelStyle={{ color: colors.primary, fontSize: 12 }}
                >
                  AI Suggestions
                </PaperButton>
              </View>

              {showTagSuggestions && filteredTagSuggestions.length > 0 && (
                <View style={[styles.suggestionsGrid, { backgroundColor: colors.surfaceVariant }]}>
                  {filteredTagSuggestions.slice(0, 6).map((suggestion) => (
                    <Chip
                      key={suggestion}
                      onPress={() => addTag(suggestion)}
                      style={styles.suggestionChip}
                      mode="outlined"
                    >
                      {suggestion}
                    </Chip>
                  ))}
                </View>
              )}
              <HelperText type="error" visible={!!errors.tags}>
                {errors.tags}
              </HelperText>
            </View>

            {/* Options */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: colors.onSurface }]}>
                Options (Optional)
              </Text>
              {options.map((option, index) => (
                <View key={index} style={styles.optionRow}>
                  <View style={styles.optionInput}>
                    <TextInputField
                      label={`Option ${index + 1}`}
                      value={option}
                      onChangeText={(text) => updateOption(text, index)}
                      leftIcon="format-list-bulleted"
                    />
                  </View>
                  {options.length > 1 && (
                    <IconButton
                      icon="close"
                      size={20}
                      iconColor={colors.error}
                      onPress={() => removeOption(index)}
                    />
                  )}
                </View>
              ))}
              <PaperButton
                mode="outlined"
                onPress={addOption}
                icon="plus"
                style={[styles.addButton, { borderColor: colors.outline }]}
                labelStyle={{ color: colors.onSurfaceVariant }}
              >
                Add Option
              </PaperButton>
            </View>

            {/* Reference Link */}
            <View style={styles.fieldContainer}>
              <TextInputField
                label="Reference Link (Optional)"
                value={link}
                onChangeText={setLink}
                leftIcon="link"
                keyboardType="url"
                autoCapitalize="none"
              />
              <HelperText type="info" visible={true}>
                Add a reference URL for additional reading
              </HelperText>
            </View>

            {/* Submit Button */}
            <PaperButton
              mode="contained"
              onPress={handleSubmit}
              disabled={loading}
              loading={loading}
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              contentStyle={styles.submitButtonContent}
              labelStyle={styles.submitButtonLabel}
            >
              {loading ? 'Creating Question...' : 'Create Question'}
            </PaperButton>

          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loading Overlay */}
      {/* {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )} */}
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  formCard: {
    borderRadius: 16,
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  suggestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  suggestionButton: {
    borderRadius: 12,
  },
  selectedChip: {
    height: 32,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  suggestionChip: {
    height: 32,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  selectedTagChip: {
    height: 32,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionInput: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    alignSelf: 'flex-start',
    borderRadius: 12,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 12,
  },
  submitButtonContent: {
    height: 48,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default AddQuestionScreen;
