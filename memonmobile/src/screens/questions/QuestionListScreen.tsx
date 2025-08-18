import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  ScrollView,
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
import { useGetQuestionsInfiniteQuery, useGetTagsQuery } from '@/src/features/questions/api/questionApi';
import QuestionInfoScreen from './QuestionInfoScreen';
import { ResponseQuestion, RootStackParamList } from '@/src/constants/types';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '@/src/store/hooks';
import { addTags } from '@/src/features/app/appSlice';

type SortOption = 'difficulty' | 'topic' | 'recency' | 'priority';
type SortDirection = 'asc' | 'desc';

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
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

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

  const {data: tagsCount} = useGetTagsQuery(undefined)

  const allTags = useMemo(() => {
    return [...new Set(tagsCount?.map(t => t.tag))];
  }, [tagsCount]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(addTags(allTags));
  }, [dispatch, allTags]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...allQuestions];

    if (selectedTags.length > 0) {
      filtered = filtered.filter(q =>
        q.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    const difficultyMap: { [key: string]: number } = {
      easy: 1,
      medium: 2,
      hard: 3,
    };

    switch (sortBy) {
      case 'difficulty':
        filtered.sort((a, b) => {
          const valA = difficultyMap[a.difficulty?.toLowerCase() ?? 'medium'] ?? 2;
          const valB = difficultyMap[b.difficulty?.toLowerCase() ?? 'medium'] ?? 2;
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        });
        break;

      case 'topic':
        filtered.sort((a, b) => {
          const tagA = (a.tags?.[0] ?? '').toLowerCase();
          const tagB = (b.tags?.[0] ?? '').toLowerCase();
          return sortDirection === 'asc'
            ? tagA.localeCompare(tagB)
            : tagB.localeCompare(tagA);
        });
        break;

      case 'recency':
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt ?? 0).getTime();
          const dateB = new Date(b.createdAt ?? 0).getTime();
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });
        break;

      default:
        break;
    }

    return filtered;
  }, [allQuestions, sortBy, sortDirection, selectedTags]);

  const filteredQuestions = useMemo(() => {
    if (!searchQuery) return [];
    return allQuestions.filter(q =>
      q.questionName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allQuestions]);

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

  const openSearch = () => {
    setSearchQuery('');
    setIsSearchVisible(true);
  };

  const closeSearch = () => {
    setIsSearchVisible(false);
  };

  const openFilter = () => {
    setIsFilterVisible(true);
  };

  const closeFilter = () => {
    setIsFilterVisible(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  console.log(tagsCount)

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
            icon="filter-variant"
            size={24}
            iconColor={colors.onSurface}
            onPress={openFilter}
          />
          <IconButton
            icon="magnify"
            size={24}
            iconColor={colors.onSurface}
            onPress={openSearch}
          />
          <IconButton
            icon="plus"
            size={24}
            iconColor={colors.onSurface}
            onPress={() => navigation.navigate('AddQuestion')}
          />
        </View>
      </Surface>

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
          data={filteredAndSortedData}
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

      <Modal
        visible={isSearchVisible}
        transparent
        animationType="fade"
        onRequestClose={closeSearch}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.searchDialog, { backgroundColor: colors.surface }]}>
            <TextInput
              style={[styles.searchInput, { borderColor: colors.outline, color: colors.onSurface }]}
              placeholder="Search questions..."
              placeholderTextColor={colors.onSurfaceVariant}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery && filteredQuestions.length === 0 ? (
              <Text style={[styles.notFound, { color: colors.error }]}>
                No questions found
              </Text>
            ) : (
              <FlatList
                data={filteredQuestions}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.searchItem}
                    onPress={() => {
                      closeSearch();
                      openQuestionModal(item);
                    }}
                  >
                    <Text style={[styles.searchItemText, { color: colors.onSurface }]}>
                      {item.questionName}
                    </Text>
                  </TouchableOpacity>
                )}
                style={styles.searchList}
              />
            )}
            <TouchableOpacity onPress={closeSearch} style={styles.closeBtn}>
              <Text style={[styles.closeBtnText, { color: colors.primary }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isFilterVisible}
        transparent
        animationType="fade"
        onRequestClose={closeFilter}
      >
        <TouchableOpacity
          style={styles.filterOverlay}
          activeOpacity={1}
          onPress={closeFilter}
        >
          <ScrollView style={[styles.filterDialog, { backgroundColor: colors.surface }]}>
            <View style={styles.sortContainer}>
              <Text style={[styles.sortLabel, { color: colors.onSurfaceVariant }]}>
                SORT BY
              </Text>
              <View style={styles.wrapContainer}>
                {['Difficulty', 'Topic', 'Recency', 'Priority'].map((item) => {
                  const option = item.toLowerCase() as SortOption;
                  const active = sortBy === option;
                  return (
                    <Chip
                      key={item}
                      mode={active ? 'flat' : 'outlined'}
                      selected={active}
                      onPress={() => {
                        if (active) {
                          setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
                        } else {
                          setSortBy(option);
                          setSortDirection('asc');
                        }
                      }}
                      style={[
                        styles.sortChip,
                        active && { backgroundColor: colors.primaryContainer },
                      ]}
                      textStyle={{
                        color: active ? colors.primary : colors.onSurfaceVariant,
                        fontSize: 12,
                        fontWeight: '600',
                      }}
                      icon={active ? (sortDirection === 'asc' ? 'arrow-up' : 'arrow-down') : undefined}
                    >
                      {item}
                    </Chip>
                  );
                })}
              </View>
            </View>

            <View style={styles.filterContainer}>
              <Text style={[styles.filterLabel, { color: colors.onSurfaceVariant }]}>
                FILTER BY TAG
              </Text>
              <View style={styles.wrapContainer}>
                {tagsCount?.map((t) => {
                  const active = selectedTags.includes(t.tag);
                  const label = `${t.tag} (${t.count})`;
                  return (
                    <Chip
                      key={t.tag}
                      mode={active ? 'flat' : 'outlined'}
                      selected={active}
                      onPress={() => toggleTag(t.tag)}
                      style={[
                        styles.filterChip,
                        active && { backgroundColor: colors.secondaryContainer },
                      ]}
                      textStyle={{
                        color: active ? colors.onSecondary : colors.onSurfaceVariant,
                        fontSize: 12,
                        fontWeight: '600',
                      }}
                    >
                      {label}
                    </Chip>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </TouchableOpacity>
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
  filterContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  wrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 8,
  },
  sortChip: {
    borderRadius: 16,
  },
  filterChip: {
    borderRadius: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    paddingTop: 80, // Adjust to position below header
  },
  filterDialog: {
    width: '100%',
    maxHeight: '80%',
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
  },
  searchDialog: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 16,
    elevation: 4,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  searchList: {
    maxHeight: 300,
  },
  searchItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchItemText: {
    fontSize: 16,
  },
  notFound: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 16,
  },
  closeBtn: {
    alignSelf: 'center',
    padding: 12,
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuestionsListScreen;
