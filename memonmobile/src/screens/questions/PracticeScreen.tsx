import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Modal,
} from 'react-native';
import {
  useTheme,
  Text,
  Surface,
  IconButton,
  ActivityIndicator,
  Chip,
  Divider,
} from 'react-native-paper';
import CircularProgress from '../../components/CircularProgress';
import PracticeCard from '../../components/PracticeCard';
import QuestionInfoScreen from './QuestionInfoScreen';
import {
  useGetRevisionsInfiniteQuery,
  useUpdateRevisionMutation,
} from '@/src/features/questions/api/questionApi';
import { ResponseQuestion } from '@/src/constants/types';

const PracticeScreen = () => {
  const { colors } = useTheme();

  const [selectedQuestion, setSelectedQuestion] =
    useState<ResponseQuestion | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const { data, isLoading, isFetching, refetch } =
    useGetRevisionsInfiniteQuery(undefined);

  const [updateRevision] = useUpdateRevisionMutation();

  const allQuestions = useMemo(
    () => data?.pages.flatMap((p) => p.data?.questions ?? []) ?? [],
    [data],
  );

  const completedCount = useMemo(
    () =>
      allQuestions.filter(
        (q: any) => q?.upcomingRevisions?.[0]?.completed === true,
      ).length,
    [allQuestions],
  );

  const handleMarkDone = async (questionId: string, revisionId: string) => {
    try {
      await updateRevision({ questionId, revisionId }).unwrap();
    } catch (error) {
      console.log('failed to update revision', error);
    }
  };

  const totalTarget = allQuestions.length;
  const progress = completedCount / totalTarget;
  const displayLabel =
    totalTarget > 0 ? `${completedCount}/${totalTarget}` : '0/0';

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
        style={[styles.topBar, { backgroundColor: colors.surface }]}
        elevation={0}
      >
        <Text style={[styles.title, { color: colors.onSurface }]}>
          Practice
        </Text>
        <View style={styles.actions}>
          <IconButton
            icon="filter-variant"
            size={22}
            iconColor={colors.onSurfaceVariant}
            onPress={() => {}}
          />
          <IconButton
            icon="magnify"
            size={22}
            iconColor={colors.onSurfaceVariant}
            onPress={() => {}}
          />
        </View>
      </Surface>

      {/* <Surface
        style={[styles.progressWrap, { backgroundColor: colors.surface }]}
        elevation={1}
      >
        <CircularProgress
          progress={totalTarget > 0 ? progress : 0}
          label={`${displayLabel}`}
        />
        <View style={styles.progressMeta}>
          <Text style={[styles.progressTitle, { color: colors.onSurface }]}>
            {`Today's Goal`}
          </Text>
          <Text
            style={[styles.progressSub, { color: colors.onSurfaceVariant }]}
          >
            Complete {totalTarget} revisions
          </Text>
          <View style={styles.progressChips}>
            <Chip
              compact
              mode="flat"
              style={styles.chip}
              textStyle={{ fontSize: 12 }}
            >
              {completedCount} done
            </Chip>
            <Chip
              compact
              mode="outlined"
              style={[styles.chip, { borderColor: colors.outline }]}
              textStyle={{ fontSize: 12 }}
            >
              {Math.max(totalTarget - completedCount, 0)} left
            </Chip>
          </View>
        </View>
      </Surface>

      <Divider style={{ opacity: 0.4 }} /> */}

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8, color: colors.onSurfaceVariant }}>
            Loading practice…
          </Text>
        </View>
      ) : allQuestions.length === 0 ? (
        <View style={styles.empty}>
          <IconButton
            icon="inbox"
            size={28}
            iconColor={colors.onSurfaceVariant}
          />
          <Text style={{ color: colors.onSurface, fontWeight: '600' }}>
            No items
          </Text>
          <Text style={{ color: colors.onSurfaceVariant, marginTop: 4 }}>
            New recommendations will appear here.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
        >
          {allQuestions.map((q: ResponseQuestion) => (
            <PracticeCard
              key={q._id}
              title={q.questionName}
              tags={q.tags}
              difficulty={q.difficulty}
              description={q.formData?.description}
              estimateTime="5-7 minutes"
              completed={q.upcomingRevisions[0].completed}
              onMarkDone={() =>
                handleMarkDone(q._id, q.upcomingRevisions[0]._id)
              }
              onStartTimer={() => {
                // TODO: Implement start timer
              }}
              onInfoPress={() => openQuestionModal(q)}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 14,
                marginBottom: 12,
              }}
              titleColor={colors.onSurface}
              subtitleColor={colors.onSurfaceVariant}
              accentColor={colors.primary}
              chipColor={colors.primaryContainer}
            />
          ))}
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: { flex: 1, fontSize: 22, fontWeight: '800' },
  actions: { flexDirection: 'row', alignItems: 'center' },

  progressWrap: {
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 4,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressMeta: { flex: 1 },
  progressTitle: { fontSize: 14, fontWeight: '700' },
  progressSub: { fontSize: 12, marginTop: 2 },
  progressChips: { flexDirection: 'row', gap: 8, marginTop: 10 },
  chip: { height: 28, borderRadius: 16 },

  listContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },

  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    gap: 2,
  },
});

export default PracticeScreen;
