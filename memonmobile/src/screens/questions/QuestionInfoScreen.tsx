import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Linking,
} from 'react-native';
import {
  Text,
  useTheme,
  Surface,
  IconButton,
  Chip,
  Button as PaperButton,
  Divider,
  List,
  Menu,
  TouchableRipple,
} from 'react-native-paper';
import TextInputField from '../../components/TextInputField';
import { difficulty, ResponseQuestion } from '@/src/constants/types';

interface QuestionInfoScreenProps {
  question: ResponseQuestion;
  onClose?: () => void;
}

const QuestionInfoScreen: React.FC<QuestionInfoScreenProps> = ({
  question,
  onClose,
}) => {
  const { colors } = useTheme();

  // State management
  const [isFavorite, setIsFavorite] = useState(false);
  const [doubtText, setDoubtText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Editable fields state
  const [editableQuestionName, setEditableQuestionName] = useState(
    question.questionName || '',
  );
  const [editableDescription, setEditableDescription] = useState(
    question.formData?.description || '',
  );
  const [editableTags, setEditableTags] = useState<string[]>(
    question.tags || [],
  );
  const [editableDifficulty, setEditableDifficulty] = useState(
    question.difficulty || 'Medium',
  );
  const [newTag, setNewTag] = useState('');
  const [showDifficultyMenu, setShowDifficultyMenu] = useState(false);

  const difficulties: difficulty[] = ['easy', 'medium', 'hard'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return '#7BCEDB';
      case 'medium':
        return '#FFC15A';
      case 'hard':
        return '#FF6B6B';
      default:
        return colors.primary;
    }
  };

  const difficultyColor = getDifficultyColor(editableDifficulty);

  // Check if question has a reference link
  const hasReferenceLink =
    question?.formData?.link && question.formData.link.trim() !== '';

  // Handle opening the reference link
  const openReferenceLink = async () => {
    if (hasReferenceLink) {
      try {
        const url = question.formData.link;
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          console.log("Don't know how to open URI: " + url);
        }
      } catch (error) {
        console.error('Error opening link:', error);
      }
    }
  };

  // Handle saving edits
  const handleSaveEdit = async () => {
    try {
      // TODO: Save edited data to backend
      const updatedQuestion = {
        ...question,
        questionName: editableQuestionName,
        difficulty: editableDifficulty,
        tags: editableTags,
        formData: {
          ...question.formData,
          description: editableDescription,
        },
      };

      console.log('Saving updated question:', updatedQuestion);

      // Exit edit mode
      setEditMode(false);
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  // Handle adding new tag
  const handleAddTag = () => {
    if (newTag.trim() && !editableTags.includes(newTag.trim())) {
      setEditableTags([...editableTags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Handle removing tag
  const handleRemoveTag = (tagToRemove: string) => {
    setEditableTags(editableTags.filter((tag) => tag !== tagToRemove));
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    // Reset to original values
    setEditableQuestionName(question.questionName || '');
    setEditableDescription(question.formData?.description || '');
    setEditableTags(question.tags || []);
    setEditableDifficulty(question.difficulty || 'Medium');
    setNewTag('');
    setEditMode(false);
  };

  // Sample data for FAQs and Related Questions
  const faqs = [
    {
      question: 'What is the time complexity of this algorithm?',
      answer:
        'The time complexity is O(log n) for binary search as we eliminate half of the elements in each iteration.',
    },
    {
      question: 'When should I use this approach?',
      answer:
        'This approach is best used when you have a sorted array and need to find a specific element efficiently.',
    },
    {
      question: 'What are common pitfalls?',
      answer:
        'Common mistakes include not handling edge cases properly and incorrect boundary calculations.',
    },
  ];

  const relatedQuestions = [
    'Linear Search vs Binary Search',
    'Implementing Binary Search Tree',
    'Search Algorithms Comparison',
    'Time Complexity Analysis',
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleSubmitDoubt = () => {
    if (doubtText.trim()) {
      // TODO: Submit doubt to backend
      console.log('Submitting doubt:', doubtText);
      setDoubtText('');
    }
  };

  const handleSaveNotes = () => {
    if (notesText.trim()) {
      // TODO: Save notes to backend
      console.log('Saving notes:', notesText);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header with Favorite and Link Icons */}
      <Surface
        style={[styles.header, { backgroundColor: colors.surface }]}
        elevation={0}
      >
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={colors.onSurface}
          onPress={onClose}
        />

        {editMode ? (
          <TextInputField
            value={editableQuestionName}
            onChangeText={setEditableQuestionName}
            style={[
              styles.headerTitleInput,
              { backgroundColor: colors.surface },
            ]}
            contentStyle={{ fontSize: 16, fontWeight: '700' }}
          />
        ) : (
          <Text
            style={[styles.headerTitle, { color: colors.onSurface }]}
            numberOfLines={1}
          >
            {editableQuestionName}
          </Text>
        )}

        <View style={styles.headerActions}>
          <IconButton
            icon={isFavorite ? 'star' : 'star-outline'}
            size={24}
            iconColor={isFavorite ? '#FFD700' : colors.onSurfaceVariant}
            onPress={() => setIsFavorite(!isFavorite)}
          />
          {hasReferenceLink && (
            <IconButton
              icon="link"
              size={24}
              iconColor={colors.primary}
              onPress={openReferenceLink}
              style={styles.linkIcon}
            />
          )}

          {editMode ? (
            <>
              <IconButton
                icon="close"
                size={20}
                iconColor={colors.error}
                onPress={handleCancelEdit}
              />
              <IconButton
                icon="check"
                size={20}
                iconColor={colors.primary}
                onPress={handleSaveEdit}
              />
            </>
          ) : (
            <IconButton
              icon="pencil"
              size={20}
              iconColor={colors.onSurfaceVariant}
              onPress={() => setEditMode(true)}
            />
          )}

          <IconButton
            icon="delete-outline"
            size={20}
            iconColor={colors.onSurfaceVariant}
            onPress={() => {}}
          />
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
            {editableTags.map((tag) => (
              <Chip
                key={tag}
                compact
                style={[
                  styles.tagChip,
                  { backgroundColor: colors.primaryContainer },
                ]}
                textStyle={{
                  color: colors.primary,
                  fontSize: 12,
                  fontWeight: '600',
                }}
                onClose={editMode ? () => handleRemoveTag(tag) : undefined}
              >
                {tag}
              </Chip>
            ))}

            {editMode && (
              <View style={styles.addTagContainer}>
                <TextInputField
                  value={newTag}
                  onChangeText={setNewTag}
                  placeholder="Add tag..."
                  style={styles.tagInput}
                  onSubmitEditing={handleAddTag}
                  rightIcon="plus"
                  onRightIconPress={handleAddTag}
                />
              </View>
            )}

            {/* Difficulty Chip */}
            {editMode ? (
              <Menu
                visible={showDifficultyMenu}
                onDismiss={() => setShowDifficultyMenu(false)}
                anchor={
                  <TouchableRipple onPress={() => setShowDifficultyMenu(true)}>
                    <Chip
                      compact
                      style={[
                        styles.difficultyChip,
                        { backgroundColor: difficultyColor + '20' },
                      ]}
                      textStyle={{
                        color: difficultyColor,
                        fontSize: 12,
                        fontWeight: '700',
                      }}
                    >
                      {editableDifficulty} ▼
                    </Chip>
                  </TouchableRipple>
                }
              >
                {difficulties.map((diff) => (
                  <Menu.Item
                    key={diff}
                    onPress={() => {
                      setEditableDifficulty(diff);
                      setShowDifficultyMenu(false);
                    }}
                    title={diff}
                  />
                ))}
              </Menu>
            ) : (
              <Chip
                compact
                style={[
                  styles.difficultyChip,
                  { backgroundColor: difficultyColor + '20' },
                ]}
                textStyle={{
                  color: difficultyColor,
                  fontSize: 12,
                  fontWeight: '700',
                }}
              >
                {editableDifficulty}
              </Chip>
            )}
          </View>
        </View>

        {/* Question Description */}
        <Surface
          style={[styles.card, { backgroundColor: colors.surface }]}
          elevation={1}
        >
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Question
          </Text>

          {editMode ? (
            <TextInputField
              value={editableDescription}
              onChangeText={setEditableDescription}
              multiline
              numberOfLines={4}
              placeholder="Enter question description..."
              style={{ backgroundColor: colors.surface }}
            />
          ) : (
            <Text
              style={[styles.description, { color: colors.onSurfaceVariant }]}
            >
              {editableDescription ||
                'Explain the process of photosynthesis, detailing the roles of chloroplasts, sunlight, water, and carbon dioxide. What are the primary products of this essential biological process?'}
            </Text>
          )}

          {hasReferenceLink && (
            <View style={styles.referenceSection}>
              <Text
                style={[
                  styles.referenceLabel,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                Reference:
              </Text>
              <PaperButton
                mode="text"
                onPress={openReferenceLink}
                icon="open-in-new"
                labelStyle={{ color: colors.primary, fontSize: 12 }}
                style={styles.referenceButton}
              >
                View Reference Link
              </PaperButton>
            </View>
          )}
        </Surface>

        {/* Rest of the sections remain the same */}
        {/* Insights */}
        <Surface
          style={[styles.card, { backgroundColor: colors.surface }]}
          elevation={1}
        >
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Insights
          </Text>
          <View style={styles.insightsGrid}>
            <View style={styles.insightItem}>
              <Text
                style={[
                  styles.insightLabel,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                Practiced
              </Text>
              <Text style={[styles.insightValue, { color: colors.onSurface }]}>
                5 times
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text
                style={[
                  styles.insightLabel,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                Last Practiced
              </Text>
              <Text style={[styles.insightValue, { color: colors.onSurface }]}>
                3 minutes
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text
                style={[
                  styles.insightLabel,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                AI Estimated Time
              </Text>
              <Text style={[styles.insightValue, { color: colors.onSurface }]}>
                5-7 minutes
              </Text>
            </View>
          </View>
        </Surface>

        {/* Revision History */}
        <Surface
          style={[styles.card, { backgroundColor: colors.surface }]}
          elevation={1}
        >
          <View style={styles.revisionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
              Revision History
            </Text>
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
              <Text style={[styles.statValue, { color: colors.onSurface }]}>
                88%
              </Text>
              <Text
                style={[styles.statLabel, { color: colors.onSurfaceVariant }]}
              >
                Accuracy
              </Text>
            </View>
            <Divider style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.onSurface }]}>
                12
              </Text>
              <Text
                style={[styles.statLabel, { color: colors.onSurfaceVariant }]}
              >
                Total Reviews
              </Text>
            </View>
            <Divider style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.onSurface }]}>
                4.2m
              </Text>
              <Text
                style={[styles.statLabel, { color: colors.onSurfaceVariant }]}
              >
                Avg Time
              </Text>
            </View>
          </View>
        </Surface>

        {/* FAQs Section */}
        <Surface
          style={[styles.card, { backgroundColor: colors.surface }]}
          elevation={1}
        >
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            FAQs
          </Text>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <List.Accordion
                title={faq.question}
                expanded={expandedFAQ === index}
                onPress={() => toggleFAQ(index)}
                titleStyle={{
                  color: colors.onSurface,
                  fontSize: 14,
                  fontWeight: '600',
                }}
                style={{ backgroundColor: 'transparent', paddingHorizontal: 0 }}
              >
                <Text
                  style={[styles.faqAnswer, { color: colors.onSurfaceVariant }]}
                >
                  {faq.answer}
                </Text>
              </List.Accordion>
              {index < faqs.length - 1 && <Divider style={styles.faqDivider} />}
            </View>
          ))}
        </Surface>

        {/* Related Questions */}
        <Surface
          style={[styles.card, { backgroundColor: colors.surface }]}
          elevation={1}
        >
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Related Questions
          </Text>
          <View style={styles.relatedQuestionsContainer}>
            {relatedQuestions.map((relatedQuestion, index) => (
              <Chip
                key={index}
                mode="outlined"
                onPress={() => {
                  // TODO: Navigate to related question
                  console.log('Navigate to:', relatedQuestion);
                }}
                style={[
                  styles.relatedQuestionChip,
                  { borderColor: colors.outline },
                ]}
                textStyle={{ color: colors.onSurfaceVariant, fontSize: 12 }}
              >
                {relatedQuestion}
              </Chip>
            ))}
          </View>
          <PaperButton
            mode="text"
            onPress={() => {}}
            icon="lightbulb-outline"
            labelStyle={{ color: colors.primary, fontSize: 12 }}
            style={styles.generateMoreButton}
          >
            Generate More Related Questions
          </PaperButton>
        </Surface>

        {/* Ask Doubt Section */}
        <Surface
          style={[styles.card, { backgroundColor: colors.surface }]}
          elevation={1}
        >
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Ask a Doubt
          </Text>
          <Text
            style={[styles.sectionSubtitle, { color: colors.onSurfaceVariant }]}
          >
            Have questions? Ask our AI assistant or community
          </Text>
          <View style={styles.doubtInputContainer}>
            <TextInputField
              label="Type your question..."
              value={doubtText}
              onChangeText={setDoubtText}
              multiline
              numberOfLines={3}
              leftIcon="help-circle"
            />
            <View style={styles.doubtActions}>
              <PaperButton
                mode="outlined"
                onPress={handleSubmitDoubt}
                disabled={!doubtText.trim()}
                style={[styles.doubtButton, { borderColor: colors.primary }]}
                labelStyle={{ color: colors.primary, fontWeight: '600' }}
                icon="send"
              >
                Ask AI
              </PaperButton>
              <PaperButton
                mode="text"
                onPress={handleSubmitDoubt}
                disabled={!doubtText.trim()}
                labelStyle={{ color: colors.secondary, fontWeight: '600' }}
                icon="account-group"
              >
                Ask Community
              </PaperButton>
            </View>
          </View>
        </Surface>

        {/* Notes Section */}
        <Surface
          style={[styles.card, { backgroundColor: colors.surface }]}
          elevation={1}
        >
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Personal Notes
          </Text>
          <Text
            style={[styles.sectionSubtitle, { color: colors.onSurfaceVariant }]}
          >
            Add your own notes and thoughts about this question
          </Text>
          <View style={styles.notesContainer}>
            <TextInputField
              label="Write your notes here..."
              value={notesText}
              onChangeText={setNotesText}
              multiline
              numberOfLines={4}
              leftIcon="note-text"
            />
            <PaperButton
              mode="contained"
              onPress={handleSaveNotes}
              disabled={!notesText.trim()}
              style={[
                styles.saveNotesButton,
                { backgroundColor: colors.primary },
              ]}
              labelStyle={{ fontWeight: '700' }}
              icon="content-save"
            >
              Save Notes
            </PaperButton>
          </View>
        </Surface>

        {/* Action Buttons */}
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
  headerTitleInput: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  headerActions: {
    flexDirection: 'row',
  },
  linkIcon: {
    margin: 0,
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
  addTagContainer: {
    minWidth: 120,
  },
  tagInput: {
    height: 28,
    backgroundColor: 'transparent',
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
  sectionSubtitle: {
    fontSize: 12,
    marginBottom: 12,
    opacity: 0.8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  referenceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  referenceLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  referenceButton: {
    margin: 0,
    paddingHorizontal: 0,
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
  faqItem: {
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  faqDivider: {
    marginTop: 8,
    opacity: 0.3,
  },
  relatedQuestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  relatedQuestionChip: {
    marginBottom: 4,
  },
  generateMoreButton: {
    alignSelf: 'flex-start',
  },
  doubtInputContainer: {
    gap: 12,
  },
  doubtActions: {
    flexDirection: 'row',
    gap: 12,
  },
  doubtButton: {
    flex: 1,
    borderRadius: 12,
  },
  notesContainer: {
    gap: 12,
  },
  saveNotesButton: {
    alignSelf: 'flex-start',
    borderRadius: 12,
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
});

export default QuestionInfoScreen;
