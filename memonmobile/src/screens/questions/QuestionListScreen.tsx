import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  useTheme,
  ActivityIndicator,
  Surface,
  IconButton,
  Chip,
} from 'react-native-paper';

import TextInputField from '../../components/TextInputField';
import {
  useGetQuestionsInfiniteQuery,
  useGetRevisionsInfiniteQuery,
} from '@/src/features/questions/api/questionApi';

const QuestionsListScreen = () => {
  const { colors } = useTheme();
  const {
    data: questions,
    isLoading: loadingQuestions,
    isFetching: fetchingQuestions,
    refetch: refetchQuestions,
  } = useGetQuestionsInfiniteQuery(undefined);

  const {
    data: revisions,
    isLoading: loadingRevisions,
    isFetching: fetchingRevisions,
    refetch: refetchRevisions,
  } = useGetRevisionsInfiniteQuery(undefined);

  const allQuestions = useMemo(
    () => questions?.pages.flatMap((p) => p.data?.questions ?? []) ?? [],
    [questions],
  );

  const allRevisions = useMemo(
    () => revisions?.pages.flatMap((p) => p.data?.questions ?? []) ?? [],
    [revisions],
  );

  const completedQuestions = useMemo(
    () =>
      allRevisions.filter(
        (q) => q.upcomingRevisions?.[0]?.completed === true,
      ) ?? [],
    [allRevisions],
  );

  /* ── UI state ────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState<
    'questions' | 'revisions' | 'completed'
  >('questions');
  const [sortBy, setSortBy] = useState<
    'difficulty' | 'topic' | 'recency' | 'priority'
  >('difficulty');

  const isLoading = loadingQuestions || loadingRevisions;
  const isFetching =
    activeTab === 'questions' ? fetchingQuestions : fetchingRevisions;

  const currentData =
    activeTab === 'questions'
      ? allQuestions
      : activeTab === 'revisions'
        ? allRevisions
        : completedQuestions;

  const handleRefresh = () =>
    activeTab === 'questions' ? refetchQuestions() : refetchRevisions();

  const revisionsToday = completedQuestions.length;
  const totalRevisions = allRevisions.length;

  /* ── Render ──────────────────────────────────────────── */
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Surface
        style={[styles.header, { backgroundColor: colors.surface }]}
        elevation={0}
      >
        <Text style={[styles.headerTitle, { color: colors.onSurface }]}>
          Questions
        </Text>
        <IconButton
          icon="plus"
          size={24}
          iconColor={colors.onSurface}
          onPress={() => {}}
        />
      </Surface>

      {/* Tabs */}
      <Surface
        elevation={1}
        style={[styles.tabRow, { backgroundColor: colors.surface }]}
      >
        <TabButton
          label="All Questions"
          isActive={activeTab === 'questions'}
          onPress={() => setActiveTab('questions')}
          colors={colors}
        />
        <TabButton
          label="Today's Revisions"
          isActive={activeTab === 'revisions'}
          onPress={() => setActiveTab('revisions')}
          colors={colors}
        />
        <TabButton
          label="Completed"
          isActive={activeTab === 'completed'}
          onPress={() => setActiveTab('completed')}
          colors={colors}
        />
      </Surface>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInputField
          label="Search questions"
          value=""
          onChangeText={() => {}}
          leftIcon="magnify"
        />
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, { color: colors.onSurfaceVariant }]}>
          SORT BY
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.sortChips}>
            {['Difficulty', 'Topic', 'Recency', 'Priority'].map((option) => (
              <Chip
                key={option}
                mode={sortBy === option.toLowerCase() ? 'flat' : 'outlined'}
                selected={sortBy === option.toLowerCase()}
                onPress={() => setSortBy(option.toLowerCase() as any)}
                style={[
                  styles.sortChip,
                  sortBy === option.toLowerCase() && {
                    backgroundColor: colors.primaryContainer,
                  },
                ]}
                textStyle={{
                  color:
                    sortBy === option.toLowerCase()
                      ? colors.primary
                      : colors.onSurfaceVariant,
                  fontSize: 12,
                  fontWeight: '600',
                }}
              >
                {option}
              </Chip>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Questions Header with Count */}
      <View style={styles.questionsHeader}>
        <Text
          style={[styles.questionsLabel, { color: colors.onSurfaceVariant }]}
        >
          QUESTIONS
        </Text>
        <Text
          style={[styles.revisionsCount, { color: colors.onSurfaceVariant }]}
        >
          Revisions Today: {revisionsToday} / {totalRevisions}
        </Text>
      </View>

      {/* Loader overlay while first batch is loading */}
      {isLoading && (
        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {/* List / Empty / Loading-more */}
      {!isLoading && (
        <ScrollView
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {currentData.length === 0 ? (
            <EmptyState colors={colors} />
          ) : (
            currentData.map((q) => (
              <EnhancedQuestionItem
                key={q._id}
                question={q}
                colors={colors}
                isCompleted={activeTab === 'completed'}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

const EnhancedQuestionItem = ({ question, colors, isCompleted }) => {
  // Map difficulty to colors (based on the image)
  const getSubjectColor = (difficulty) => {
    if (!difficulty) return colors.outline;
    const level = difficulty.toLowerCase();
    switch (level) {
      case 'easy':
        return '#7BCEDB'; // Teal/Green for easy
      case 'medium':
        return '#FFC15A'; // Yellow for medium
      case 'hard':
        return '#FF6B6B'; // Red for hard
      default:
        return colors.primary;
    }
  };

  const subjectColor = getSubjectColor(question.difficulty);
  const timeEstimate = question.estimatedTime || '5m';

  return (
    <TouchableOpacity style={styles.questionItem}>
      {/* Difficulty Color Indicator */}
      <View
        style={[styles.subjectIndicator, { backgroundColor: subjectColor }]}
      />

      {/* Content */}
      <View style={styles.questionContent}>
        <View style={styles.questionHeader}>
          <Text
            style={[styles.subjectText, { color: colors.onSurfaceVariant }]}
          >
            {question.tags?.[0] || 'General'}
          </Text>
          <Text style={[styles.timeText, { color: colors.onSurfaceVariant }]}>
            {timeEstimate}
          </Text>
        </View>

        <Text
          style={[styles.questionTitle, { color: colors.onSurface }]}
          numberOfLines={2}
        >
          {question.questionName}
        </Text>
      </View>

      {/* Status Icon */}
      <IconButton
        icon={isCompleted ? 'check-circle' : 'check-circle-outline'}
        size={20}
        iconColor={isCompleted ? colors.primary : colors.onSurfaceVariant}
        style={styles.statusIcon}
      />
    </TouchableOpacity>
  );
};

/* ── Sub-components ───────────────────────────────────── */
const TabButton = ({
  label,
  isActive,
  onPress,
  colors,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
  colors: any;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.tabButton}>
    <View
      style={[
        styles.indicator,
        { backgroundColor: isActive ? colors.primary : 'transparent' },
      ]}
    />
    <Text
      style={[
        styles.tabText,
        { color: isActive ? colors.primary : colors.onSurfaceVariant },
        isActive && styles.tabTextActive,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const EmptyState = ({ colors }: { colors: any }) => (
  <View style={styles.emptyWrap}>
    <IconButton icon="inbox" size={30} iconColor={colors.onSurfaceVariant} />
    <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>
      Nothing here yet
    </Text>
    <Text style={[styles.emptySub, { color: colors.onSurfaceVariant }]}>
      New questions will appear once available.
    </Text>
  </View>
);

/* ── Styles ───────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  tabRow: {
    flexDirection: 'row',
    borderRadius: 0,
    paddingHorizontal: 16,
  },
  tabButton: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  indicator: { height: 3, width: '100%', borderRadius: 2, marginBottom: 4 },
  tabText: { fontSize: 14 },
  tabTextActive: { fontWeight: '700' },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sortContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  sortChips: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  sortChip: {
    height: 32,
    borderRadius: 16,
  },
  questionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  questionsLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  revisionsCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  loaderWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  listContent: { paddingBottom: 24 },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 1,
  },
  subjectIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
    minHeight: 40,
  },
  questionContent: {
    flex: 1,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  statusIcon: {
    margin: 0,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    gap: 4,
  },
  emptyTitle: { fontWeight: '700', fontSize: 15 },
  emptySub: { fontSize: 13 },
});

export default QuestionsListScreen;
