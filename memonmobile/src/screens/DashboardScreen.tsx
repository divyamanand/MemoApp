import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import {
  Text,
  useTheme,
  IconButton,
  Card,
  ActivityIndicator,
  Badge,
  Surface,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../features/auth/authActions';
import {
  useGetCountTillDateQuery,
  useGetRevisionsInfiniteQuery,
} from '../features/questions/api/questionApi';

const DashboardScreen = () => {
  const theme = useTheme();
  const { colors } = theme;
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((s) => s.app);

  const [completedToday, setCompletedToday] = useState(0);

  const { data: revisionsData, isLoading: loadingRevisions } =
    useGetRevisionsInfiniteQuery(undefined);
  const { data: completedUptodate, isLoading: loadingCounts } =
    useGetCountTillDateQuery(undefined);

  const allRevisions = useMemo(
    () => revisionsData?.pages.flatMap((p) => p.data?.questions ?? []) ?? [],
    [revisionsData],
  );

  useEffect(() => {
    const count =
      allRevisions.filter(
        (q: any) => q?.upcomingRevisions?.[0]?.completed === true,
      ).length ?? 0;
    setCompletedToday(count);
  }, [allRevisions]);

  const totalCompleted =
    (completedUptodate?.totalCompleted ?? 0) + completedToday;
  const loading = loadingRevisions || loadingCounts;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Welcome row */}
        <View style={styles.welcomeRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.welcomeTitle, { color: colors.onSurface }]}>
              Welcome, {userInfo?.name || 'Learner'}!
            </Text>
            <Text
              style={[
                styles.welcomeSubtitle,
                { color: colors.onSurfaceVariant },
              ]}
            >
              Let’s get learning.
            </Text>
          </View>

          {/* Action icons: profile, settings, logout */}
          <IconButton
            icon="account"
            iconColor={colors.onSurfaceVariant}
            size={24}
            onPress={() => {
              // TODO: Navigate to profile
            }}
          />
          <IconButton
            icon="cog"
            iconColor={colors.onSurfaceVariant}
            size={24}
            onPress={() => {
              // TODO: Navigate to settings
            }}
          />
          <IconButton
            icon="logout"
            iconColor={colors.primary}
            size={24}
            onPress={() => dispatch(logoutUser())}
          />
        </View>

        {/* Progress Overview */}
        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
          Progress Overview
        </Text>

        <View style={styles.grid}>
          <StatCard
            title="Completed Today"
            value={completedToday}
            colors={colors}
          />
          <StatCard
            title="Total Completed"
            value={totalCompleted}
            colors={colors}
          />
        </View>

        {/* Streak banner */}
        <StreakStrip
          days={userInfo?.streakCount ?? 0}
          message="Keep the fire burning!"
          colors={colors}
        />

        {/* Activity heatmap placeholder block (to match screenshot spacing) */}
        <Surface
          style={[styles.card, { backgroundColor: colors.surface }]}
          elevation={1}
        >
          <View style={styles.rowBetween}>
            <Text style={[styles.cardTitle, { color: colors.onSurface }]}>
              Activity Heatmap
            </Text>
            <Text style={{ color: colors.onSurfaceVariant }}>October 2024</Text>
          </View>
          <View style={styles.heatmapBox}>
            <View
              style={[styles.heatDot, { backgroundColor: colors.primary }]}
            />
            <View
              style={[styles.heatDot, { backgroundColor: colors.primary }]}
            />
          </View>
        </Surface>

        {/* Performance Insights */}
        <Surface
          style={[styles.card, { backgroundColor: colors.surface }]}
          elevation={1}
        >
          <Text style={[styles.cardTitle, { color: colors.onSurface }]}>
            Performance Insights
          </Text>
          <View style={styles.accuracyHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={[styles.accuracyValue, { color: colors.onSurface }]}>
                88%
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#E7F7EE',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text
                style={{ color: '#1E7F4B', fontSize: 12, fontWeight: '600' }}
              >
                +8% vs last week
              </Text>
            </View>
          </View>
          {/* Replace this block with your actual LineChart component */}
          <View
            style={[
              styles.chartStub,
              { backgroundColor: colors.surfaceVariant },
            ]}
          />
        </Surface>

        {/* Quote */}
        <Surface
          style={[
            styles.quoteCard,
            { backgroundColor: '#EAF8F0', borderColor: '#CDECDC' },
          ]}
          elevation={0}
        >
          <Text style={[styles.quoteText, { color: colors.onSurface }]}>
            “The beautiful thing about learning is that no one can take it away
            from you.”
          </Text>
          <Text
            style={[styles.quoteAuthor, { color: colors.onSurfaceVariant }]}
          >
            – B.B. King
          </Text>
        </Surface>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator animating color={colors.primary} size="large" />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const StatCard = ({
  title,
  value,
  colors,
}: {
  title: string;
  value: number | string;
  colors: any;
}) => {
  return (
    <Card
      mode="contained"
      style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 14 }}
    >
      <Card.Content style={{ paddingVertical: 16 }}>
        <Text
          style={{
            color: colors.onSurfaceVariant,
            fontSize: 12,
            marginBottom: 6,
          }}
        >
          {title}
        </Text>
        <Text
          style={{ color: colors.onSurface, fontWeight: '700', fontSize: 24 }}
        >
          {value}
        </Text>
      </Card.Content>
    </Card>
  );
};

const StreakStrip = ({
  days,
  message,
  colors,
}: {
  days: number;
  message: string;
  colors: any;
}) => {
  return (
    <Surface style={[styles.streakWrap]} elevation={0}>
      <View
        style={[
          styles.streakInner,
          { backgroundColor: colors.tertiary, opacity: 0.95 },
        ]}
      >
        <View style={styles.streakIconCircle}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>🔥</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.streakTitle}>{days} Day Streak!</Text>
          <Text style={styles.streakSub}>{message}</Text>
        </View>
      </View>
    </Surface>
  );
};

/* ---- Styles ---- */

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // Tight spacing between icons
    marginBottom: 12,
  },
  welcomeTitle: { fontSize: 16, fontWeight: '700' },
  welcomeSubtitle: { fontSize: 12 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  streakWrap: {
    marginTop: 16,
    borderRadius: 14,
    overflow: 'hidden',
  },
  streakInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
  },
  streakIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  streakTitle: { fontSize: 14, fontWeight: '700', color: '#1B1B1F' },
  streakSub: { fontSize: 12, color: '#1B1B1F' },

  card: {
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
  },
  cardTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  heatmapBox: {
    height: 120,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    justifyContent: 'center',
    paddingLeft: 24,
    gap: 8,
  },
  heatDot: {
    width: 36,
    height: 36,
    borderRadius: 8,
    opacity: 0.95,
  },

  accuracyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accuracyValue: {
    fontSize: 32,
    fontWeight: '800',
  },
  chartStub: {
    height: 120,
    borderRadius: 12,
    marginTop: 12,
  },

  quoteCard: {
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  quoteText: { fontSize: 13, lineHeight: 18 },
  quoteAuthor: { marginTop: 4, fontSize: 12 },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 40,
    alignSelf: 'center',
  },
});

export default DashboardScreen;
