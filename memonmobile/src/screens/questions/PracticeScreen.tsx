import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
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
import { useGetRevisionsInfiniteQuery } from '@/src/features/questions/api/questionApi';

const PracticeScreen = () => {
  const { colors } = useTheme();

  const { data, isLoading, isFetching, refetch } =
    useGetRevisionsInfiniteQuery(undefined);

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

  const totalTarget = allQuestions.length;
  const progress = completedCount / totalTarget;
  const displayLabel =
    totalTarget > 0 ? `${completedCount}/${totalTarget}` : '0/0';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Sticky top bar (title + actions) */}
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

      {/* Progress summary */}
      <Surface
        style={[styles.progressWrap, { backgroundColor: colors.surface }]}
        elevation={1}
      >
        <CircularProgress
          progress={totalTarget > 0 ? progress : 0}
          label={`${displayLabel}`}
        />
        <View style={styles.progressMeta}>
          <Text style={[styles.progressTitle, { color: colors.onSurface }]}>
            Today’s Goal
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

      <Divider style={{ opacity: 0.4 }} />

      {/* Content list */}
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
          {allQuestions.map((q: any) => (
            <PracticeCard
              key={q._id}
              title={q.questionName}
              tags={q.tags}
              difficulty={q.difficulty}
              description={q.formData?.description}
              estimateTime="5-7 minutes"
              onMarkDone={() => {
                // TODO: Implement mark-as-done
              }}
              onStartTimer={() => {
                // TODO: Implement start timer
              }}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 14,
                marginBottom: 12,
              }}
              // If your PracticeCard supports color props:
              titleColor={colors.onSurface}
              subtitleColor={colors.onSurfaceVariant}
              accentColor={colors.primary}
              chipColor={colors.primaryContainer}
            />
          ))}
        </ScrollView>
      )}
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
