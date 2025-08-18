import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Chip, ProgressBar, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppDispatch } from '@/src/store/hooks';
import {
  getRecommendedTags,
  getGeneratedQuestions,
} from '@/src/service/api/llmapi';
import { addTags, finishOnboarding } from '@/src/features/app/appSlice';
import { useUpdateUserDetailsMutation } from '@/src/features/auth/api/authService';

/* -----------------------
   Step components (presentational)
   ----------------------- */

type RevisionStepProps = {
  revisionHours: string;
  setRevisionHours: (s: string) => void;
  targetDate: Date | null;
  setTargetDate: (d: Date | null) => void;
  showDatePicker: boolean;
  setShowDatePicker: (b: boolean) => void;
  onContinue: () => Promise<void>;
  disabled: boolean;
  loading: boolean;
};

const RevisionStep: React.FC<RevisionStepProps> = ({
  revisionHours,
  setRevisionHours,
  targetDate,
  setTargetDate,
  showDatePicker,
  setShowDatePicker,
  onContinue,
  disabled,
  loading,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.content}>
      <Text style={[styles.tagsTitle, { color: colors.onSurface }]}>
        Revision Plan
      </Text>

      <Text style={[styles.subText, { color: colors.onSurfaceVariant }]}>
        How many hours per day do you want to spend on revision?
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            borderColor: colors.outline,
            color: colors.onSurface,
            backgroundColor: colors.surfaceVariant,
          },
        ]}
        placeholder="Hours (e.g., 2)"
        placeholderTextColor={colors.onSurfaceDisabled}
        keyboardType="numeric"
        value={revisionHours}
        onChangeText={setRevisionHours}
      />

      <Text
        style={[
          styles.subText,
          { color: colors.onSurfaceVariant, marginTop: 20 },
        ]}
      >
        Select a target completion date
      </Text>

      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: colors.primary, fontWeight: '600' }}>
          {targetDate ? targetDate.toDateString() : 'Pick a date'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={targetDate || new Date()}
          mode="date"
          display="default"
          onChange={(_event: any, date?: Date) => {
            setShowDatePicker(false);
            if (date) setTargetDate(date);
          }}
        />
      )}

      <TouchableOpacity
        style={[
          styles.proceedButton,
          { backgroundColor: colors.primary, marginTop: 40 },
        ]}
        onPress={onContinue}
        disabled={disabled || loading}
      >
        <Text style={[styles.proceedText, { color: colors.onPrimary }]}>
          {loading ? 'Saving...' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

type TopicStepProps = {
  topic: string;
  setTopic: (s: string) => void;
  onGetTags: () => Promise<void>;
  onBack: () => void;
};

const TopicStep: React.FC<TopicStepProps> = ({
  topic,
  setTopic,
  onGetTags,
  onBack,
}) => {
  const { colors } = useTheme();
  return (
    <View style={styles.content}>
      <Text style={[styles.questionText, { color: colors.onSurface }]}>
        What would you like to learn?
      </Text>
      <Text style={[styles.subText, { color: colors.onSurfaceVariant }]}>
        (Write a topic, exam, or subject. The more details you give, the better
        suggestions you’ll get.)
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            borderColor: colors.outline,
            color: colors.onSurface,
            backgroundColor: colors.surfaceVariant,
            height: 100,
          },
        ]}
        placeholder="Enter your topic..."
        placeholderTextColor={colors.onSurfaceDisabled}
        value={topic}
        onChangeText={setTopic}
        multiline
      />

      <View style={{ height: 16 }} />

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: colors.outline }]}
          onPress={onBack}
        >
          <Text style={{ color: colors.onSurface }}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryWide, { backgroundColor: colors.primary }]}
          onPress={onGetTags}
          disabled={!topic.trim()}
        >
          <MaterialIcons
            name="arrow-forward"
            size={22}
            color={colors.onPrimary}
          />
          <Text style={[styles.primaryWideText, { color: colors.onPrimary }]}>
            Get tags
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

type TagsStepProps = {
  tags: string[];
  selectedTags: string[];
  toggleTag: (t: string) => void;
  onProceed: () => Promise<void>;
  onBack: () => void;
  onReset: () => void;
  loading?: boolean;
};

const TagsStep: React.FC<TagsStepProps> = ({
  tags,
  selectedTags,
  toggleTag,
  onProceed,
  onBack,
  onReset,
  loading,
}) => {
  const { colors } = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.tagsContainer}>
      <Text style={[styles.tagsTitle, { color: colors.onSurface }]}>
        Recommended Tags
      </Text>
      <Text style={[styles.tagsSubtitle, { color: colors.onSurfaceVariant }]}>
        Select tags to customize your learning
      </Text>

      <View style={styles.tagsWrap}>
        {tags.map((tag, index) => {
          const active = selectedTags.includes(tag);
          return (
            <Chip
              key={index}
              mode={active ? 'flat' : 'outlined'}
              selected={active}
              onPress={() => toggleTag(tag)}
              style={[
                styles.tagChip,
                active && { backgroundColor: colors.primaryContainer },
              ]}
              textStyle={{
                color: active
                  ? colors.onPrimaryContainer
                  : colors.onSurfaceVariant,
                fontSize: 14,
                fontWeight: '600',
              }}
            >
              {tag}
            </Chip>
          );
        })}
      </View>

      <View style={{ height: 16 }} />

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity
          style={[
            styles.secondaryButton,
            { borderColor: colors.outline, flex: 1 },
          ]}
          onPress={onBack}
        >
          <Text style={{ color: colors.onSurface }}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.primaryWide,
            { backgroundColor: colors.primary, flex: 1 },
          ]}
          onPress={onProceed}
          disabled={selectedTags.length === 0 || Boolean(loading)}
        >
          <MaterialIcons
            name="arrow-forward"
            size={22}
            color={colors.onPrimary}
          />
          <Text style={[styles.primaryWideText, { color: colors.onPrimary }]}>
            {loading ? 'Loading...' : `Proceed (${selectedTags.length})`}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onReset} style={{ marginTop: 16 }}>
        <Text style={[styles.resetText, { color: colors.error }]}>
          Reset & start over
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

type QuestionsStepProps = {
  questions: any[];
  onBack: () => void;
  onFinish: () => void;
};

const QuestionsStep: React.FC<QuestionsStepProps> = ({
  questions,
  onBack,
  onFinish,
}) => {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.questionsContainer}>
        <Text style={[styles.tagsTitle, { color: colors.onSurface }]}>
          AI Generated Questions
        </Text>
        {questions.map((q, i) => (
          <View
            key={i}
            style={[
              styles.questionCard,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.outline,
              },
            ]}
          >
            <Text style={[styles.question, { color: colors.onSurface }]}>
              {q.title || q}
            </Text>
            <Text
              style={[styles.questionDesc, { color: colors.onSurfaceVariant }]}
            >
              {q.description || ''}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 16,
        }}
      >
        <TouchableOpacity
          style={[
            styles.secondaryButton,
            { borderColor: colors.outline, flex: 1, marginRight: 8 },
          ]}
          onPress={onBack}
        >
          <Text style={{ color: colors.onSurface }}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.primaryWide,
            { backgroundColor: colors.primary, flex: 1, marginLeft: 8 },
          ]}
          onPress={onFinish}
        >
          <MaterialIcons name="check" size={22} color={colors.onPrimary} />
          <Text style={[styles.primaryWideText, { color: colors.onPrimary }]}>
            Finish
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* -----------------------
   Parent: TopicScreen
   ----------------------- */

const TopicScreen: React.FC = () => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  // steps: 1 = Revision, 2 = Topic, 3 = Tags, 4 = Questions
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 4;

  // data states
  const [revisionHours, setRevisionHours] = useState<string>('');
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [topic, setTopic] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);

  // loading states
  const [loadingUpdateUser, setLoadingUpdateUser] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // RTK mutation hook
  const [updateUser] = useUpdateUserDetailsMutation();

  // helper toggles
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const resetAllToStep1 = () => {
    setTopic('');
    setTags([]);
    setSelectedTags([]);
    setQuestions([]);
    setRevisionHours('');
    setTargetDate(null);
    setCurrentStep(1);
  };

  /* -----------------------
     Step handlers
     ----------------------- */

  // Step 1 -> validate and persist targetDate & maximumHours to backend (UTC)
  const handleStep1Continue = async () => {
    if (!revisionHours || !targetDate) {
      Alert.alert('Missing data', 'Please enter hours and pick a target date.');
      return;
    }

    const hoursNum = Number(revisionHours);
    if (Number.isNaN(hoursNum) || hoursNum <= 0) {
      Alert.alert(
        'Invalid hours',
        'Please enter a valid positive number for hours.',
      );
      return;
    }

    // convert targetDate to UTC midnight ISO string
    const utcMidnightIso = new Date(
      Date.UTC(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
      ),
    ).toISOString();

    try {
      setLoadingUpdateUser(true);
      // backend expects: { targetDate, maximumHours }
      await updateUser({
        targetDate: utcMidnightIso,
        maximumHours: hoursNum,
      }).unwrap();
      setCurrentStep(2);
    } catch (err) {
      console.log('updateUser failed', err);
      Alert.alert('Error', 'Failed to save revision plan. Try again.');
    } finally {
      setLoadingUpdateUser(false);
    }
  };

  // Step 2 -> fetch recommended tags and go to Step 3
  const handleGetRecommendedTags = async () => {
    if (!topic.trim()) {
      Alert.alert(
        'Empty topic',
        'Please enter something to get recommendations.',
      );
      return;
    }

    try {
      setLoadingTags(true);
      const data = await getRecommendedTags(topic);
      setTags(data?.tags || []);
      setSelectedTags([]); // reset any previous selection
      setCurrentStep(3);
    } catch (err) {
      console.log('getRecommendedTags error', err);
      Alert.alert('Error', 'Failed to fetch tags. Try again.');
    } finally {
      setLoadingTags(false);
    }
  };

  // Step 3 -> generate questions and go to Step 4
  const handleProceedToQuestions = async () => {
    if (selectedTags.length === 0) {
      Alert.alert('No tags', 'Please select at least one tag.');
      return;
    }

    try {
      setLoadingQuestions(true);
      dispatch(addTags(selectedTags));
      const data = await getGeneratedQuestions(selectedTags);
      setQuestions(data?.questions || data || []); // backend might return different shapes
      setCurrentStep(4);
    } catch (err) {
      console.log('getGeneratedQuestions error', err);
      Alert.alert('Error', 'Failed to generate questions. Try again.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Step 4 finish
  const handleFinish = () => {
    dispatch(finishOnboarding());
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Progress */}
      <View style={styles.progressWrapper}>
        <ProgressBar
          progress={currentStep / totalSteps}
          color={colors.primary}
          style={styles.progress}
        />
        <Text style={[styles.stepText, { color: colors.onSurfaceVariant }]}>
          Step {currentStep} of {totalSteps}
        </Text>
      </View>

      {/* Steps */}
      {currentStep === 1 && (
        <RevisionStep
          revisionHours={revisionHours}
          setRevisionHours={setRevisionHours}
          targetDate={targetDate}
          setTargetDate={setTargetDate}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          onContinue={handleStep1Continue}
          disabled={!revisionHours || !targetDate}
          loading={loadingUpdateUser}
        />
      )}

      {currentStep === 2 && (
        <TopicStep
          topic={topic}
          setTopic={setTopic}
          onGetTags={handleGetRecommendedTags}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <TagsStep
          tags={tags}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          onProceed={handleProceedToQuestions}
          onBack={() => setCurrentStep(2)}
          onReset={resetAllToStep1}
          loading={loadingQuestions || loadingTags}
        />
      )}

      {currentStep === 4 && (
        <QuestionsStep
          questions={questions}
          onBack={() => setCurrentStep(3)}
          onFinish={handleFinish}
        />
      )}
    </SafeAreaView>
  );
};

/* -----------------------
   Styles
   ----------------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressWrapper: { padding: 16 },
  progress: { height: 8, borderRadius: 4 },
  stepText: { textAlign: 'center', marginTop: 8, fontWeight: '600' },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  questionText: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 16,
  },

  input: {
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },

  // Buttons
  proceedButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  proceedText: { fontSize: 16, fontWeight: '600' },

  primaryWide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  primaryWideText: { fontSize: 16, fontWeight: '700' },

  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tags
  tagsContainer: { padding: 24 },
  tagsTitle: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  tagsSubtitle: { fontSize: 16, marginBottom: 24 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: { borderRadius: 16, margin: 4 },
  resetText: { marginTop: 16, textAlign: 'center', fontWeight: '600' },

  // Questions
  questionsContainer: { padding: 24 },
  questionCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  question: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  questionDesc: { fontSize: 14 },
});

export default TopicScreen;
