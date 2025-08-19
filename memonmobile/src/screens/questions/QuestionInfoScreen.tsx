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
  TextInput,
  Avatar,
  Snackbar,
  FAB,
} from 'react-native-paper';
import { difficulty, ResponseQuestion } from '@/src/constants/types';
import { useDeleteQuestionMutation } from '@/src/features/questions/api/questionApi';

interface QuestionInfoScreenProps {
  question: ResponseQuestion;
  onClose?: () => void;
}

const compactDifficulties: difficulty[] = ['easy', 'medium', 'hard'];

const QuestionInfoScreen: React.FC<QuestionInfoScreenProps> = ({
  question,
  onClose,
}) => {
  const { colors } = useTheme();

  const [isFavorite, setIsFavorite] = useState(false);
  const [doubtText, setDoubtText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
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
    question.difficulty || 'medium',
  );
  const [newTag, setNewTag] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const [deleteQuestion] = useDeleteQuestionMutation();

  const getDifficultyColor = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return '#2DBF73';
      case 'medium':
        return '#F6A623';
      case 'hard':
        return '#E64A19';
      default:
        return colors.primary;
    }
  };

  const difficultyColor = getDifficultyColor(editableDifficulty);

  const hasReferenceLink = !!(
    question?.formData?.link && question.formData.link.trim()
  );

  const openReferenceLink = async () => {
    if (!hasReferenceLink) return;
    try {
      const url = question.formData.link;
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch (err) {
      console.error('open link error', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQuestion(id).unwrap();
      onClose?.();
    } catch (err) {
      console.log(err);
      setSnackbarMsg('Failed to delete');
      setShowSnackbar(true);
    }
  };

  const handleSaveEdit = () => {
    const updated = {
      ...question,
      questionName: editableQuestionName.trim() || question.questionName,
      difficulty: editableDifficulty,
      tags: editableTags,
      formData: { ...question.formData, description: editableDescription },
    };
    console.log('save', updated);
    setEditMode(false);
    setSnackbarMsg('Saved');
    setShowSnackbar(true);
  };

  const handleAddTag = () => {
    const t = newTag.trim();
    if (!t || editableTags.includes(t)) return;
    setEditableTags((p) => [...p, t]);
    setNewTag('');
  };

  const handleRemoveTag = (t: string) =>
    setEditableTags((p) => p.filter((x) => x !== t));

  const handleCancelEdit = () => {
    setEditableQuestionName(question.questionName || '');
    setEditableDescription(question.formData?.description || '');
    setEditableTags(question.tags || []);
    setEditableDifficulty(question.difficulty || 'medium');
    setNewTag('');
    setEditMode(false);
  };

  const faqs = [
    {
      question: 'What is the time complexity of this algorithm?',
      answer:
        'Generally O(log n) in binary search because the search space halves each step.',
    },
    {
      question: 'When should I use this approach?',
      answer:
        'Use it when the data is sorted and lookups need to be fast with minimal memory.',
    },
    {
      question: 'Common pitfalls?',
      answer:
        'Off-by-one errors and incorrect mid computation are frequent bugs.',
    },
  ];

  const relatedQuestions = [
    'Linear Search vs Binary Search',
    'Implement Binary Search Tree',
    'Search Algorithms Comparison',
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Surface style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerLeft}>
          <Avatar.Text size={36} label={(question.questionName || 'Q')[0]} />
          <View style={styles.headerTitleWrap}>
            {editMode ? (
              <TextInput
                value={editableQuestionName}
                onChangeText={setEditableQuestionName}
                mode="flat"
                placeholder="Question title"
                style={styles.titleInput}
              />
            ) : (
              <Text
                numberOfLines={1}
                style={[styles.title, { color: colors.onSurface }]}
              >
                {editableQuestionName}
              </Text>
            )}
            <Text
              style={[styles.subtitle, { color: colors.onSurfaceVariant }]}
              numberOfLines={1}
            >
              {question.formData?.source ||
                'Self practice • ' +
                  (question.tags || []).slice(0, 3).join(', ')}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <IconButton
            icon={isFavorite ? 'star' : 'star-outline'}
            size={20}
            onPress={() => setIsFavorite((s) => !s)}
          />
          {hasReferenceLink && (
            <IconButton
              icon="link-variant"
              size={20}
              onPress={openReferenceLink}
            />
          )}
          {editMode ? (
            <>
              <IconButton icon="close" size={20} onPress={handleCancelEdit} />
              <IconButton icon="check" size={20} onPress={handleSaveEdit} />
            </>
          ) : (
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => setEditMode(true)}
            />
          )}
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleDelete(question._id)}
          />
          <IconButton icon="close" size={20} onPress={onClose} />
        </View>
      </Surface>

      <ScrollView contentContainerStyle={styles.content}>
        <Surface style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Question
          </Text>
          {editMode ? (
            <TextInput
              value={editableDescription}
              onChangeText={setEditableDescription}
              multiline
              mode="outlined"
              numberOfLines={4}
              placeholder="Describe the question"
              style={styles.multilineInput}
            />
          ) : (
            <Text style={[styles.body, { color: colors.onSurfaceVariant }]}>
              {editableDescription || 'No description provided.'}
            </Text>
          )}

          {hasReferenceLink && (
            <View style={styles.referenceRow}>
              <PaperButton
                mode="text"
                onPress={openReferenceLink}
                uppercase={false}
                icon="open-in-new"
              >
                View reference
              </PaperButton>
            </View>
          )}
        </Surface>

        <View style={styles.compactRow}>
          <Surface
            style={[styles.smallCard, { backgroundColor: colors.surface }]}
          >
            <Text
              style={[styles.smallLabel, { color: colors.onSurfaceVariant }]}
            >
              Difficulty
            </Text>
            <Chip
              style={[styles.smallChip, { borderColor: difficultyColor }]}
              textStyle={{ color: difficultyColor }}
              onPress={() => setEditMode(true)}
            >
              {editableDifficulty}
            </Chip>
          </Surface>

          <Surface
            style={[styles.smallCard, { backgroundColor: colors.surface }]}
          >
            <Text
              style={[styles.smallLabel, { color: colors.onSurfaceVariant }]}
            >
              Quick Stats
            </Text>
            <View style={styles.statsRow}>
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
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.onSurface }]}>
                  12
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.onSurfaceVariant }]}
                >
                  Reviews
                </Text>
              </View>
            </View>
          </Surface>
        </View>

        <Surface style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Tags
          </Text>
          <View style={styles.tagsWrap}>
            {editableTags.map((t) => (
              <Chip
                key={t}
                compact
                onClose={editMode ? () => handleRemoveTag(t) : undefined}
                style={styles.tag}
              >
                {t}
              </Chip>
            ))}

            {editMode && (
              <View style={styles.addTag}>
                <TextInput
                  value={newTag}
                  onChangeText={setNewTag}
                  placeholder="Add tag"
                  mode="outlined"
                  style={styles.tagInput}
                  onSubmitEditing={handleAddTag}
                />
                <PaperButton
                  onPress={handleAddTag}
                  mode="contained"
                  style={styles.addTagBtn}
                >
                  Add
                </PaperButton>
              </View>
            )}
          </View>
        </Surface>

        <List.Section style={styles.card}>
          <List.Accordion
            title="FAQs"
            left={(props) => (
              <List.Icon {...props} icon="help-circle-outline" />
            )}
          >
            {faqs.map((f, i) => (
              <List.Item key={i} title={f.question} description={f.answer} />
            ))}
          </List.Accordion>

          <List.Accordion
            title="Related Questions"
            left={(props) => (
              <List.Icon {...props} icon="lightbulb-on-outline" />
            )}
          >
            {relatedQuestions.map((r, i) => (
              <List.Item
                key={i}
                title={r}
                onPress={() => console.log('navigate', r)}
              />
            ))}
          </List.Accordion>
        </List.Section>

        <Surface style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Ask a Doubt
          </Text>
          <TextInput
            value={doubtText}
            onChangeText={setDoubtText}
            placeholder="Type your question"
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.multilineInput}
          />
          <View style={styles.rowActions}>
            <PaperButton
              mode="outlined"
              onPress={() => {
                console.log('ask ai');
                setSnackbarMsg('Asked AI');
                setShowSnackbar(true);
              }}
              disabled={!doubtText.trim()}
            >
              Ask AI
            </PaperButton>

            <PaperButton
              mode="text"
              onPress={() => {
                console.log('ask community');
                setSnackbarMsg('Asked Community');
                setShowSnackbar(true);
              }}
              disabled={!doubtText.trim()}
            >
              Ask community
            </PaperButton>
          </View>
        </Surface>

        <Surface style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Personal Notes
          </Text>
          <TextInput
            value={notesText}
            onChangeText={setNotesText}
            placeholder="Your notes"
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.multilineInput}
          />
          <View style={styles.rowActions}>
            <PaperButton
              mode="contained"
              onPress={() => {
                console.log('save notes');
                setSnackbarMsg('Notes saved');
                setShowSnackbar(true);
              }}
              disabled={!notesText.trim()}
            >
              Save
            </PaperButton>
          </View>
        </Surface>

        <View style={{ height: 80 }} />
      </ScrollView>

      <FAB
        style={[styles.fab, { backgroundColor: colors.primary }]}
        icon="lightbulb-on-outline"
        label="Generate"
        onPress={() => {
          console.log('generate related');
          setSnackbarMsg('Generating...');
          setShowSnackbar(true);
        }}
      />

      <Snackbar visible={showSnackbar} onDismiss={() => setShowSnackbar(false)}>
        {snackbarMsg}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  headerTitleWrap: { marginLeft: 12, flex: 1 },
  title: { fontSize: 16, fontWeight: '700' },
  subtitle: { fontSize: 12, marginTop: 2 },
  titleInput: { backgroundColor: 'transparent' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  content: { padding: 12, paddingBottom: 24 },
  card: { borderRadius: 12, padding: 12, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  body: { fontSize: 14, lineHeight: 20 },
  referenceRow: { marginTop: 10 },
  compactRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  smallCard: { flex: 1, borderRadius: 12, padding: 10, marginRight: 8 },
  smallLabel: { fontSize: 12, marginBottom: 6 },
  smallChip: { borderWidth: 1, height: 28 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 16, fontWeight: '800' },
  statLabel: { fontSize: 12 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { marginRight: 8, marginBottom: 8 },
  addTag: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  tagInput: { minWidth: 120, flex: 1 },
  addTagBtn: { marginLeft: 8 },
  multilineInput: { backgroundColor: 'transparent' },
  rowActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  fab: { position: 'absolute', right: 16, bottom: 20 },
});

export default QuestionInfoScreen;
