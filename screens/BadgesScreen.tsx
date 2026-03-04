import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { BADGE_DATA } from '../src/lessons';

// Badge unlock logic
const getBadgeStatus = (badgeId: number, completedModules: number[], streak: number, totalXP: number) => {
  switch (badgeId) {
    case 1: // Solana Pioneer — complete module 2
      return {
        earned: completedModules.includes(2),
        progress: completedModules.includes(2) ? 100 : completedModules.includes(1) ? 50 : 0,
      };
    case 2: // 7-Day Streak
      return {
        earned: streak >= 7,
        progress: Math.min(Math.round((streak / 7) * 100), 100),
      };
    case 3: // Security Guru — complete module 9
      return {
        earned: completedModules.includes(9),
        progress: completedModules.includes(9) ? 100 : Math.min(completedModules.filter(m => m <= 9).length * 11, 99),
      };
    case 4: // Quiz Master — complete 5 modules
      return {
        earned: completedModules.length >= 5,
        progress: Math.min(Math.round((completedModules.length / 5) * 100), 100),
      };
    case 5: // DeFi Explorer — complete module 8
      return {
        earned: completedModules.includes(8),
        progress: completedModules.includes(8) ? 100 : Math.min(completedModules.filter(m => m <= 8).length * 12, 99),
      };
    case 6: // Early Adopter — always earned
      return { earned: true, progress: 100 };
    default:
      return { earned: false, progress: 0 };
  }
};

const BADGE_XP: Record<number, number> = {
  1: 200, 2: 300, 3: 250, 4: 400, 5: 300, 6: 150,
};

export default function BadgesScreen({
  onBack,
  completedModules,
  streak = 0,
  totalXP = 0,
}: {
  onBack: () => void;
  completedModules: number[];
  streak?: number;
  totalXP?: number;
}) {
  const badgesWithStatus = BADGE_DATA.map(badge => ({
    ...badge,
    ...getBadgeStatus(badge.id, completedModules, streak, totalXP),
  }));

  const earnedCount = badgesWithStatus.filter(b => b.earned).length;

  // Next goal = first unearned badge
  const nextGoal = badgesWithStatus.find(b => !b.earned);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Je Badges</Text>
          <Text style={styles.headerSub}>{earnedCount}/{BADGE_DATA.length} earned</Text>
        </View>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>⚡ {totalXP} XP</Text>
        </View>
      </View>

      {/* Next goal */}
      {nextGoal ? (
        <View style={styles.nextGoal}>
          <View style={styles.nextGoalIcon}>
            <Text style={{ fontSize: 24 }}>{nextGoal.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.nextGoalRow}>
              <Text style={styles.nextGoalName}>{nextGoal.name}</Text>
              <Text style={styles.nextGoalTag}>NEXT GOAL</Text>
            </View>
            <Text style={styles.nextGoalDesc}>{nextGoal.desc}</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${nextGoal.progress}%` }]} />
            </View>
            <Text style={styles.progressPct}>{nextGoal.progress}%</Text>
          </View>
        </View>
      ) : (
        <View style={styles.allEarnedCard}>
          <Text style={styles.allEarnedText}>🏆 All badges earned! Legend!</Text>
        </View>
      )}

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {badgesWithStatus.map(badge => (
            <View key={badge.id} style={[styles.badgeCard, badge.earned && styles.badgeCardEarned]}>
              <View style={[styles.badgeIconWrap, badge.earned && styles.badgeIconEarned]}>
                <Text style={{ fontSize: 32, opacity: badge.earned ? 1 : 0.3 }}>{badge.icon}</Text>
                {badge.earned && (
                  <View style={styles.checkmark}>
                    <Text style={{ fontSize: 10, color: '#050A14' }}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.badgeName, !badge.earned && styles.badgeNameLocked]}>
                {badge.name}
              </Text>
              <Text style={[styles.badgeDesc, !badge.earned && styles.badgeDescLocked]}>
                {badge.desc}
              </Text>
              {!badge.earned && badge.progress > 0 && (
                <View style={styles.badgeProgress}>
                  <View style={[styles.badgeProgressFill, { width: `${badge.progress}%` }]} />
                </View>
              )}
              {!badge.earned && badge.progress === 0 && (
                <Text style={styles.lockedText}>Locked</Text>
              )}
              {badge.earned && (
                <Text style={styles.earnedXP}>+{BADGE_XP[badge.id]} XP</Text>
              )}
            </View>
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050A14' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(125,239,251,0.1)',
  },
  backBtn: { fontSize: 14, color: '#7DEFFB' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#7DEFFB', textAlign: 'center' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center' },
  xpBadge: {
    backgroundColor: 'rgba(125,239,251,0.1)', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: 'rgba(125,239,251,0.25)',
  },
  xpText: { fontSize: 12, color: '#7DEFFB', fontWeight: '700' },
  nextGoal: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    marginHorizontal: 16, marginVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16,
    padding: 14, borderWidth: 1, borderColor: 'rgba(125,239,251,0.12)',
  },
  nextGoalIcon: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: 'rgba(125,239,251,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  nextGoalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 4,
  },
  nextGoalName: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  nextGoalTag: { fontSize: 10, color: '#7DEFFB', fontWeight: '700', letterSpacing: 0.5 },
  nextGoalDesc: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 },
  progressTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 999 },
  progressFill: { height: '100%', backgroundColor: '#7DEFFB', borderRadius: 999 },
  progressPct: { fontSize: 11, color: '#7DEFFB', marginTop: 4, textAlign: 'right' },
  allEarnedCard: {
    marginHorizontal: 16, marginVertical: 14,
    backgroundColor: 'rgba(125,239,251,0.06)', borderRadius: 16,
    padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(125,239,251,0.2)',
  },
  allEarnedText: { fontSize: 16, fontWeight: '800', color: '#7DEFFB' },
  scroll: { flex: 1, paddingHorizontal: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingTop: 4 },
  badgeCard: {
    width: '47%', backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16, padding: 16, alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  badgeCardEarned: {
    borderColor: 'rgba(125,239,251,0.3)',
    backgroundColor: 'rgba(125,239,251,0.04)',
  },
  badgeIconWrap: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center', justifyContent: 'center',
  },
  badgeIconEarned: { backgroundColor: 'rgba(125,239,251,0.1)' },
  checkmark: {
    position: 'absolute', bottom: 0, right: 0,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#14F195', alignItems: 'center', justifyContent: 'center',
  },
  badgeName: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  badgeNameLocked: { color: 'rgba(255,255,255,0.4)' },
  badgeDesc: { fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
  badgeDescLocked: { color: 'rgba(255,255,255,0.2)' },
  badgeProgress: {
    width: '100%', height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 999,
  },
  badgeProgressFill: { height: '100%', backgroundColor: '#7DEFFB', borderRadius: 999 },
  lockedText: { fontSize: 11, color: 'rgba(255,255,255,0.2)' },
  earnedXP: { fontSize: 12, color: '#7DEFFB', fontWeight: '700' },
});