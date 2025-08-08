import React, { useEffect } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { Provider as PaperProvider, Text, useTheme } from 'react-native-paper';
// import { Ionicons } from '@expo/vector-icons';
// import AppHeader from '../components/AppHeader';
// import ProgressCard from '../components/ProgressCard';
// import StreakBanner from '../components/StreakBanner';
// import Heatmap from '../components/HeatMap';
// import LineChart from '../components/LineChart';
// import PrimaryButton from '../components/PrimaryButton';
// import Quote from '../components/Quote';
// import BottomNav from '../components/BottomNav';
// import IconButton from '../components/IconButton';
import { useVerifyUser } from '../hooks/useVerifyUser';
import { useAppSelector } from '../store/hooks';
import { handleReset } from '../service/resetService';

const DashboardScreen = () => {
  const { colors } = useTheme();
  const { userInfo } = useAppSelector((state) => state.app);

  // const userStatus = useVerifyUser();

  // useEffect(() => {
  //   if (userStatus === 'loggedOut') {
  //     handleReset();
  //   }
  // }, [userStatus]);

  return (
    <PaperProvider>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* <AppHeader
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
        /> */}
        <View style={styles.welcome}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1C_tQb92-CJPIRc6Wk9ARF_Ifwj-SyvHGUNmxLPnDk6JrdeEVzS61_KiRO4xc57E5Aarp6Bsg-JNmaX2K8VNU5AdiYMfdMJQioLxczPjduOPfPb-1EEbI-tU7gR9YGALrY1OCRZUccCuBXdMcFr5Tt0M2ysrEuyAit3LFFKotMgticv01ePjDpEHelz7eCAlqs8bxrZeRRxM5bTHGJ-RqIMjGcfhyfrAwJrZRpx-nEaWlC9WfHRwWkGkKJLApTyVnUJ1dhHPmdFk',
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.welcomeTitle}>{userInfo.name}</Text>
            <Text style={styles.welcomeSubtitle}>{`Let's get learning.`}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.mainContent}>
          {/* <Text style={styles.sectionTitle}>Progress Overview</Text>
          <View style={styles.progressGrid}>
            <ProgressCard label="Completed Today" value={userInfo.completedToday} />
            <ProgressCard label="Total Completed" value={userInfo.totalCompleted} />
          </View>

          <StreakBanner
            days={userInfo.streak}
            message="Keep the fire burning!"
          />

          <Heatmap month="October 2024" data={userInfo.heatmapData} />

          <Text style={styles.sectionTitle}>Performance Insights</Text>
          <View style={styles.accuracyCard}>
            <Text style={styles.cardSubtitle}>Accuracy Trend</Text>
            <View style={styles.accuracyRow}>
              <Text style={styles.cardTitle}>88%</Text>
              <Text style={styles.accuracyChange}>+8% vs last week</Text>
            </View>
            <LineChart data={[42, 72, 10, 92, 150, 1, 32, 82]} />{' '}
          </View>

          <Text style={styles.sectionTitle}>Quick Access</Text>
          <PrimaryButton label="Continue Revision" onPress={() => {}} /> */}
          {/* <SecondaryButton label="Personalized Questions" onPress={() => {}} /> */}
          {/* <SecondaryButton label="Upcoming Revision" onPress={() => {}} /> */}

          {/* <Quote
            text="The beautiful thing about learning is that no one can take it away from you."
            author="B.B. King"
          /> */}
        </ScrollView>
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
