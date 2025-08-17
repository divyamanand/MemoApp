import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  useTheme,
  IconButton,
  Card,
  ActivityIndicator,
  Surface,
  Chip,
  Button as PaperButton,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  useGetCountTillDateQuery,
  useGetHeatMapQuery,
  useGetRevisionsInfiniteQuery,
} from '@/src/features/questions/api/questionApi';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/src/constants/types';
import HeatMap from '@/src/components/HeatMap';

const DashboardScreen = () => {
  const theme = useTheme();
  const { colors } = theme;
  const { userInfo } = useAppSelector((s) => s.app);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const {data: heatmap} = useGetHeatMapQuery({from: "2025-01-01", to: "2025-12-31"})

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

  console.log(heatmap)

  // Sample data for new features
  const aiSuggestions = [
    { id: 1, title: 'Algebra Practice', subject: 'Math', difficulty: 'Medium' },
    {
      id: 2,
      title: 'World History Quiz',
      subject: 'History',
      difficulty: 'Easy',
    },
  ];

  const recentTimeline = [
    {
      id: 1,
      type: 'achievement',
      title: 'Streak Reward',
      time: '2 hours ago',
      icon: 'local-fire-department',
    },
    {
      id: 2,
      type: 'practice',
      title: 'Completed Physics Quiz',
      time: '1 day ago',
      icon: 'quiz',
    },
  ];

  const roadmapData = {
    currentTopic: 'Geometry',
    progress: 65,
    nextTopic: 'Calculus',
    completedTopics: 3,
    totalTopics: 8,
  };

  const recentTests = [
    {
      id: 1,
      name: 'Math Assessment',
      score: 85,
      total: 100,
      date: 'Yesterday',
    },
    { id: 2, name: 'Science Quiz', score: 92, total: 100, date: '3 days ago' },
  ];

  const navigateToAISuggestions = () => navigation.navigate('Suggestions');

  const navigateToTimeline = () => navigation.navigate('Timeline');

  const navigateToRoadmap = () => navigation.navigate('Roadmap');

  const navigateToTestScreen = () => navigation.navigate('Test');

  const startPracticeTest = () => navigation.navigate('Practice');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
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
              Let's get learning.
            </Text>
          </View>

          <IconButton
            icon={'wifi-off'}
            iconColor={'red'}
            size={24}
            onPress={() => {
              // TODO: Navigate to profile
            }}
          />
        </View>

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

        <StreakStrip
          days={userInfo?.streakCount ?? 0}
          message="Keep the fire burning!"
          colors={colors}
        />

        {/* AI Suggestions Section */}
        <Surface
          style={[styles.card, { backgroundColor: colors.surface }]}
          elevation={1}
        >
          <View style={styles.rowBetween}>
            <Text style={[styles.cardTitle, { color: colors.onSurface }]}>
              AI Suggestions
            </Text>
            <TouchableOpacity onPress={navigateToAISuggestions}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.suggestionsList}>
            {aiSuggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion.id}
                style={styles.suggestionItem}
                onPress={navigateToAISuggestions}
              >
                <View
                  style={[
                    styles.suggestionIcon,
                    { backgroundColor: colors.primaryContainer },
                  ]}
                >
                  <MaterialIcons
                    name="lightbulb"
                    size={16}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.suggestionContent}>
                  <Text
                    style={[
                      styles.suggestionTitle,
                      { color: colors.onSurface },
                    ]}
                  >
                    {suggestion.title}
                  </Text>
                  <View style={styles.suggestionTags}>
                    <Text
                      style={[
                        styles.suggestionSubject,
                        { color: colors.onSurfaceVariant },
                      ]}
                    >
                      {suggestion.subject}
                    </Text>
                    <Chip
                      compact
                      style={[
                        styles.difficultyChip,
                        { backgroundColor: colors.surfaceVariant },
                      ]}
                      textStyle={{
                        color: colors.onSurfaceVariant,
                        fontSize: 10,
                      }}
                    >
                      {suggestion.difficulty}
                    </Chip>
                  </View>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={colors.onSurfaceVariant}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Surface>

        {/* Learning Roadmap Section */}
        <Surface
          style={[styles.card, { backgroundColor: colors.surface }]}
          elevation={1}
        >
          <View style={styles.rowBetween}>
            <Text style={[styles.cardTitle, { color: colors.onSurface }]}>
              Learning Roadmap
            </Text>
            <TouchableOpacity onPress={navigateToRoadmap}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.roadmapContent}
            onPress={navigateToRoadmap}
          >
            <View style={styles.roadmapHeader}>
              <Text style={[styles.currentTopic, { color: colors.onSurface }]}>
                Current: {roadmapData.currentTopic}
              </Text>
              <Text
                style={[
                  styles.roadmapStats,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                {roadmapData.completedTopics}/{roadmapData.totalTopics} topics
              </Text>
            </View>
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { backgroundColor: colors.surfaceVariant },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: colors.primary,
                      width: `${roadmapData.progress}%`,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.progressText,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                {roadmapData.progress}%
              </Text>
            </View>
            <Text
              style={[styles.nextTopic, { color: colors.onSurfaceVariant }]}
            >
              Next: {roadmapData.nextTopic}
            </Text>
          </TouchableOpacity>
        </Surface>

        {/* Recent Timeline Section */}
        <Surface
          style={[styles.card, { backgroundColor: colors.surface }]}
          elevation={1}
        >
          <View style={styles.rowBetween}>
            <Text style={[styles.cardTitle, { color: colors.onSurface }]}>
              Recent Activity
            </Text>
            <TouchableOpacity onPress={navigateToTimeline}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                View Timeline
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.timelineList}>
            {recentTimeline.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.timelineItem}
                onPress={navigateToTimeline}
              >
                <View
                  style={[
                    styles.timelineIcon,
                    { backgroundColor: colors.primaryContainer },
                  ]}
                >
                  <MaterialIcons
                    name={item.icon as any}
                    size={16}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.timelineContent}>
                  <Text
                    style={[styles.timelineTitle, { color: colors.onSurface }]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.timelineTime,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    {item.time}
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={colors.onSurfaceVariant}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Surface>

        {/* Test Center Section */}
        <Surface
          style={[styles.card, { backgroundColor: colors.surface }]}
          elevation={1}
        >
          <View style={styles.rowBetween}>
            <Text style={[styles.cardTitle, { color: colors.onSurface }]}>
              Test Center
            </Text>
            <TouchableOpacity onPress={navigateToTestScreen}>
              <MaterialIcons
                name="play-circle-fill"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <PaperButton
            mode="contained"
            onPress={startPracticeTest}
            style={[
              styles.startTestButton,
              { backgroundColor: colors.primary },
            ]}
            contentStyle={styles.testButtonContent}
            labelStyle={styles.testButtonLabel}
            icon="play-arrow"
          >
            Start Practice Test
          </PaperButton>

          <Text
            style={[
              styles.recentTestsTitle,
              { color: colors.onSurfaceVariant },
            ]}
          >
            Recent Tests
          </Text>
          <View style={styles.testsList}>
            {recentTests.map((test) => (
              <TouchableOpacity
                key={test.id}
                style={styles.testItem}
                onPress={navigateToTestScreen}
              >
                <View style={styles.testInfo}>
                  <Text style={[styles.testName, { color: colors.onSurface }]}>
                    {test.name}
                  </Text>
                  <Text
                    style={[
                      styles.testDate,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    {test.date}
                  </Text>
                </View>
                <View style={styles.testScore}>
                  <Text style={[styles.scoreValue, { color: colors.primary }]}>
                    {test.score}/{test.total}
                  </Text>
                  <Text
                    style={[
                      styles.scorePercent,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    {Math.round((test.score / test.total) * 100)}%
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={16}
                  color={colors.onSurfaceVariant}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Surface>

            <Surface
      style={[styles.card, { backgroundColor: colors.surface }]}
      elevation={1}
    >
      <View style={styles.rowBetween}>
        <Text style={[styles.cardTitle, { color: colors.onSurface }]}>
          Activity Heatmap
        </Text>
      </View>
      
      {heatmap && heatmap.length > 0 ? (
        <View style={styles.heatmapContainer}>
          <HeatMap 
            commitsData={heatmap} 
            colors={colors}
          />
        </View>
      ) : (
        <View style={[styles.heatmapPlaceholder, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[styles.placeholderText, { color: colors.onSurfaceVariant }]}>
            No activity data available
          </Text>
        </View>
      )}
    </Surface>


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

        <Surface
          style={[
            styles.quoteCard,
            { backgroundColor: '#EAF8F0', borderColor: '#CDECDC' },
          ]}
          elevation={0}
        >
          <Text style={[styles.quoteText, { color: colors.onSurface }]}>
            "The beautiful thing about learning is that no one can take it away
            from you."
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
  seeAllText: { fontSize: 12, fontWeight: '600' },

  // AI Suggestions
  suggestionsList: {
    gap: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  suggestionTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  suggestionSubject: {
    fontSize: 12,
  },
  difficultyChip: {
    height: 20,
  },

  // Roadmap
  roadmapContent: {
    gap: 8,
  },
  roadmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentTopic: {
    fontSize: 14,
    fontWeight: '600',
  },
  roadmapStats: {
    fontSize: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  nextTopic: {
    fontSize: 12,
  },

  // Timeline
  timelineList: {
    gap: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  timelineTime: {
    fontSize: 12,
  },

  // Test Center
  startTestButton: {
    borderRadius: 12,
    marginBottom: 16,
  },
  testButtonContent: {
    height: 48,
  },
  testButtonLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  recentTestsTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  testsList: {
    gap: 8,
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  testInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 14,
    fontWeight: '600',
  },
  testDate: {
    fontSize: 12,
  },
  testScore: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  scorePercent: {
    fontSize: 12,
  },

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
  // Add these to your existing styles object
  heatmapContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  heatmapPlaceholder: {
    height: 180,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  placeholderText: {
    fontSize: 14,
    fontStyle: 'italic',
  },

});

export default DashboardScreen;
