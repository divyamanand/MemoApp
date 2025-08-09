import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
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
import QuestionInfoScreen from './QuestionInfoScreen';
import { ResponseQuestion } from '@/src/constants/types';

type SortOption = 'difficulty' | 'topic' | 'recency' | 'priority';
type TabOption = 'questions' | 'revisions';

interface EnhancedQuestionItemProps {
  question: ResponseQuestion;
  isCompleted: boolean;
  onInfoPress: (question: ResponseQuestion) => void;
  showStatusIcon: boolean;
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const QuestionsListScreen = () => {
  const { colors } = useTheme();
  
  const [selectedQuestion, setSelectedQuestion] = useState<ResponseQuestion | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const {
    data: questions,
    isLoading: loadingQuestions,
    isFetching: fetchingQuestions,
    // refetch: refetchQuestions,
  } = useGetQuestionsInfiniteQuery(undefined);

  const {
    data: revisions,
    isLoading: loadingRevisions,
    isFetching: fetchingRevisions,
    // refetch: refetchRevisions,
  } = useGetRevisionsInfiniteQuery(undefined);

  const allQuestions = useMemo<ResponseQuestion[]>(
    () => questions?.pages.flatMap((p) => p.data?.questions ?? []) ?? [],
    [questions],
  );

  const allRevisions = useMemo<ResponseQuestion[]>(
    () => revisions?.pages.flatMap((p) => p.data?.questions ?? []) ?? [],
    [revisions],
  );


  const [activeTab, setActiveTab] = useState<TabOption>('questions'); // Default to questions
  const [sortBy, setSortBy] = useState<SortOption>('difficulty');

  const isLoading: boolean = loadingQuestions || loadingRevisions;
  const isFetching: boolean =
    activeTab === 'questions' ? fetchingQuestions : fetchingRevisions;

  const currentData: ResponseQuestion[] =
    activeTab === 'questions' ? allQuestions : allRevisions;

  const openQuestionModal = (question: ResponseQuestion): void => {
    setSelectedQuestion(question);
    setIsModalVisible(true);
  };

  const closeQuestionModal = (): void => {
    setIsModalVisible(false);
    setSelectedQuestion(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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

      <Surface
        elevation={1}
        style={[styles.tabRow, { backgroundColor: colors.surface }]}
      >
        <TabButton
          label="Today's Revisions"
          isActive={activeTab === 'revisions'}
          onPress={() => setActiveTab('revisions')}
        />
        <TabButton
          label="All Questions"
          isActive={activeTab === 'questions'}
          onPress={() => setActiveTab('questions')}
        />
      </Surface>

      <View style={styles.searchContainer}>
        <TextInputField
          label="Search questions"
          value=""
          onChangeText={() => {}}
          leftIcon="magnify"
        />
      </View>

      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, { color: colors.onSurfaceVariant }]}>
          SORT BY
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.sortChips}>
            {(['Difficulty', 'Topic', 'Recency', 'Priority'] as const).map((option) => (
              <Chip
                key={option}
                mode={sortBy === option.toLowerCase() ? 'flat' : 'outlined'}
                selected={sortBy === option.toLowerCase()}
                onPress={() => setSortBy(option.toLowerCase() as SortOption)}
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

      <View style={styles.questionsHeader}>
        <Text
          style={[styles.questionsLabel, { color: colors.onSurfaceVariant }]}
        >
          QUESTIONS
        </Text>
      </View>

      {isLoading && (
        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {!isLoading && (
        <ScrollView
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              // onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {currentData.length === 0 ? (
            <EmptyState />
          ) : (
            currentData.map((q: ResponseQuestion) => (
              <EnhancedQuestionItem
                key={q._id}
                question={q}
                isCompleted={q.upcomingRevisions?.[0]?.completed === true}
                onInfoPress={openQuestionModal}
                showStatusIcon={activeTab === 'revisions'} 
              />
            ))
          )}
        </ScrollView>
      )}

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeQuestionModal}
      >
        {selectedQuestion && (
          <QuestionInfoScreen 
            question={selectedQuestion} 
            onClose={closeQuestionModal}
          />
        )}
      </Modal>
    </View>
  );
};

const EnhancedQuestionItem: React.FC<EnhancedQuestionItemProps> = ({ 
  question, 
  isCompleted, 
  onInfoPress,
  showStatusIcon
}) => {
  const { colors } = useTheme();

  const getSubjectColor = (difficulty: ResponseQuestion['difficulty'] | undefined): string => {
    if (!difficulty) return colors.outline;
    const level = difficulty.toLowerCase();
    switch (level) {
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

  const subjectColor: string = getSubjectColor(question.difficulty);

  return (
    <TouchableOpacity style={styles.questionItem}>
      <View
        style={[styles.subjectIndicator, { backgroundColor: subjectColor }]}
      />

      <View style={styles.questionContent}>
        <View style={styles.questionHeader}>
          <Text
            style={[styles.subjectText, { color: colors.onSurfaceVariant }]}
          >
            {question.tags?.[0] || 'General'}
          </Text>
        </View>

        <Text
          style={[styles.questionTitle, { color: colors.onSurface }]}
          numberOfLines={2}
        >
          {question.questionName}
        </Text>
      </View>

      {showStatusIcon && (
        <IconButton
          icon={isCompleted ? 'check-circle' : 'check-circle-outline'}
          size={20}
          iconColor={isCompleted ? colors.primary : colors.onSurfaceVariant}
          style={styles.statusIcon}
        />
      )}
      
      <IconButton
        icon="information-outline"
        size={20}
        iconColor={colors.onSurfaceVariant}
        style={styles.statusIcon}
        onPress={() => onInfoPress(question)}
      />
    </TouchableOpacity>
  );
};

const TabButton: React.FC<TabButtonProps> = ({
  label,
  isActive,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
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
};

const EmptyState = () => {
  const { colors } = useTheme();

  return (
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
};


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
