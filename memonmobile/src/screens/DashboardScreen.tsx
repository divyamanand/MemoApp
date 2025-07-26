import React from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { Provider as PaperProvider, Text, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader'; // From previous
import ProgressCard from '../components/ProgressCard'; // New
import StreakBanner from '../components/StreakBanner'; // New
import Heatmap from '../components/HeatMap'; // New
import LineChart from '../components/LineChart'; // From previous (placeholder)
import PrimaryButton from '../components/PrimaryButton'; // From previous
import SecondaryButton from '../components/SecondaryButton'; // From previous (adapted for tonal)
import Quote from '../components/Quote'; // New
import BottomNav from '../components/BottomNav'; // From previous
import IconButton from '../components/IconButton';

const DashboardScreen = () => {
  const { colors } = useTheme();

  // Sample data from HTML
  const heatmapData = [
    null,
    0.2,
    0.4,
    0.6,
    0.8,
    1,
    null,
    0.2,
    0.2,
    0.4,
    0.6,
    0.4,
    1,
    null,
    0.6,
    null,
    0.2,
    null,
    0.4,
    0.8,
    null,
    0.2,
    0.6,
    null,
    0.2,
    null,
    0.4,
    null,
    0.2,
  ];

  return (
    <PaperProvider>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <AppHeader
          title=""
          actions={
            <>
              <IconButton
                icon={() => (
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color="#637588"
                  />
                )}
                onPress={() => {}}
              />
              <IconButton
                icon={() => (
                  <Ionicons name="settings-outline" size={24} color="#637588" />
                )}
                onPress={() => {}}
              />
            </>
          }
        />
        <View style={styles.welcome}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1C_tQb92-CJPIRc6Wk9ARF_Ifwj-SyvHGUNmxLPnDk6JrdeEVzS61_KiRO4xc57E5Aarp6Bsg-JNmaX2K8VNU5AdiYMfdMJQioLxczPjduOPfPb-1EEbI-tU7gR9YGALrY1OCRZUccCuBXdMcFr5Tt0M2ysrEuyAit3LFFKotMgticv01ePjDpEHelz7eCAlqs8bxrZeRRxM5bTHGJ-RqIMjGcfhyfrAwJrZRpx-nEaWlC9WfHRwWkGkKJLApTyVnUJ1dhHPmdFk',
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.welcomeTitle}>Welcome, Sophia!</Text>
            <Text style={styles.welcomeSubtitle}>{`Let's get learning.`}</Text>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.mainContent}>
          <Text style={styles.sectionTitle}>Progress Overview</Text>
          <View style={styles.progressGrid}>
            <ProgressCard label="Completed Today" value="25" />
            <ProgressCard label="Total Completed" value="1500" />
          </View>

          <StreakBanner days={5} message="Keep the fire burning!" />

          <Heatmap month="October 2024" data={heatmapData} />

          <Text style={styles.sectionTitle}>Performance Insights</Text>
          <View style={styles.accuracyCard}>
            <Text style={styles.cardSubtitle}>Accuracy Trend</Text>
            <View style={styles.accuracyRow}>
              <Text style={styles.cardTitle}>88%</Text>
              <Text style={styles.accuracyChange}>+8% vs last week</Text>
            </View>
            <LineChart data={[42, 72, 10, 92, 150, 1, 32, 82]} />{' '}
            {/* Placeholder data from SVG path */}
          </View>

          <Text style={styles.sectionTitle}>Quick Access</Text>
          <PrimaryButton label="Continue Revision" onPress={() => {}} />
          <SecondaryButton label="Personalized Questions" onPress={() => {}} />
          <SecondaryButton label="Upcoming Revision" onPress={() => {}} />

          <Quote
            text="The beautiful thing about learning is that no one can take it away from you."
            author="B.B. King"
          />
        </ScrollView>

        <BottomNav activeRoute="dashboard" onNavigate={() => {}} />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  welcome: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  welcomeTitle: { fontSize: 18, fontWeight: 'bold' },
  welcomeSubtitle: { fontSize: 14 },
  mainContent: { padding: 16, gap: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  progressGrid: { flexDirection: 'row', gap: 16 },
  accuracyCard: { padding: 16, backgroundColor: '#f0f2f4', borderRadius: 12 },
  cardSubtitle: { fontSize: 14, fontWeight: '500', color: '#637588' },
  accuracyRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  cardTitle: { fontSize: 32, fontWeight: 'bold' },
  accuracyChange: { color: 'green', fontSize: 14 },
});

export default DashboardScreen;
