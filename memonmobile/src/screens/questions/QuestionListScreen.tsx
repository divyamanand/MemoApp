import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Modal,
  FlatList,
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
import { useGetQuestionsInfiniteQuery } from '@/src/features/questions/api/questionApi';
import QuestionInfoScreen from './QuestionInfoScreen';
import { ResponseQuestion, RootStackParamList } from '@/src/constants/types';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '@/src/store/hooks';
import { addTags } from '@/src/features/app/appSlice';

type SortOption = 'difficulty' | 'topic' | 'recency' | 'priority';

interface EnhancedQuestionItemProps {
  question: ResponseQuestion;
  onInfoPress: (question: ResponseQuestion) => void;
}

const QuestionsListScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [selectedQuestion, setSelectedQuestion] =
    useState<ResponseQuestion | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('difficulty');

  const {
    data: questions,
    isLoading,
    isFetching,
    refetch: refetchQuestions,
    hasNextPage: hasNextQuestionPage,
    fetchNextPage: fetchNextPageQuestions,
    isFetchingNextPage: isFetchingNextPageQuestions,
  } = useGetQuestionsInfiniteQuery(undefined);

  const allQuestions = useMemo<ResponseQuestion[]>(
    () => questions?.pages.flatMap((p) => p.data?.questions ?? []) ?? [],
    [questions],
  );

  const allTags = useMemo(() => {
    return [...new Set(allQuestions.flatMap(q => q.tags))];
  }, [allQuestions]);

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(addTags(allTags))
  }, [dispatch, allTags])
  

  const currentData = allQuestions;

  const handleNextPage = async () => {
    if (hasNextQuestionPage) await fetchNextPageQuestions();
  };

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
          All Questions
        </Text>
        <View style={styles.headerIcons}>
          <IconButton
            icon="magnify"
            size={24}
            iconColor={colors.onSurface}
            onPress={() => {}}
          />
          <IconButton
            icon="plus"
            size={24}
            iconColor={colors.onSurface}
            onPress={() => navigation.navigate('AddQuestion')}
          />
        </View>
      </Surface>

      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, { color: colors.onSurfaceVariant }]}>
          SORT BY
        </Text>
        <FlatList
          horizontal
          data={['Difficulty', 'Topic', 'Recency', 'Priority'] as const}
          keyExtractor={(i) => i}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const option = item.toLowerCase() as SortOption;
            const active = sortBy === option;
            return (
              <Chip
                mode={active ? 'flat' : 'outlined'}
                selected={active}
                onPress={() => setSortBy(option)}
                style={[
                  styles.sortChip,
                  active && { backgroundColor: colors.primaryContainer },
                ]}
                textStyle={{
                  color: active ? colors.primary : colors.onSurfaceVariant,
                  fontSize: 12,
                  fontWeight: '600',
                }}
              >
                {item}
              </Chip>
            );
          }}
          contentContainerStyle={styles.sortChips}
        />
      </View>

      <View style={styles.questionsHeader}>
        <Text
          style={[styles.questionsLabel, { color: colors.onSurfaceVariant }]}
        >
          QUESTIONS
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={currentData}
          keyExtractor={(item: ResponseQuestion) => item._id}
          renderItem={({ item }) => (
            <EnhancedQuestionItem
              question={item}
              onInfoPress={openQuestionModal}
            />
          )}
          ListEmptyComponent={<EmptyState />}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetchQuestions}
              tintColor={colors.primary}
            />
          }
          onEndReached={() => {
            if (!isFetchingNextPageQuestions) handleNextPage();
          }}
          onEndReachedThreshold={0.7}
          ListFooterComponent={
            isFetchingNextPageQuestions ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : null
          }
        />
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
  onInfoPress,
}) => {
  const { colors } = useTheme();

  const getSubjectColor = (
    difficulty: ResponseQuestion['difficulty'] | undefined,
  ): string => {
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
    alignItems: 'center',
    paddingRight: 16,
  },
  sortChip: {
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
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
  loaderWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
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
