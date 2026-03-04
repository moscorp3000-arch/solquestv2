import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Alert,
} from 'react-native';
import { useAuthorization } from '../components/providers/AuthorizationProvider';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { isModuleUnlocked } from '../src/progress';

const MODULES = [
  { id: 1, title: 'Crypto History', desc: 'The origin of blockchain and Bitcoin', icon: '₿', difficulty: 'Beginner', xp: 100, time: '5m' },
  { id: 2, title: 'What is Solana?', desc: 'Fastest blockchain in the world', icon: '⚡', difficulty: 'Beginner', xp: 100, time: '5m' },
  { id: 3, title: 'Wallet Security', desc: 'Protect your seed phrase and assets', icon: '🔐', difficulty: 'Intermediate', xp: 200, time: '15m' },
  { id: 4, title: 'Tokens: SOL, USDC, SKR', desc: 'Understanding different tokens', icon: '🪙', difficulty: 'Beginner', xp: 150, time: '8m' },
  { id: 5, title: 'How Swapping Works', desc: 'Trade tokens via Jupiter', icon: '🔄', difficulty: 'Beginner', xp: 150, time: '8m' },
  { id: 6, title: 'What is Staking?', desc: 'Earn passive rewards', icon: '💎', difficulty: 'Intermediate', xp: 200, time: '10m' },
  { id: 7, title: 'What are NFTs?', desc: 'Digital collectibles explained', icon: '🎨', difficulty: 'Intermediate', xp: 200, time: '10m' },
  { id: 8, title: 'DeFi Basics', desc: 'Lending, liquidity and more', icon: '🏦', difficulty: 'Intermediate', xp: 250, time: '15m' },
  { id: 9, title: 'Scam Recognition', desc: 'Protect yourself online', icon: '🛡️', difficulty: 'Intermediate', xp: 200, time: '10m' },
  { id: 10, title: 'Advanced DeFi', desc: 'Advanced yield strategies', icon: '🚀', difficulty: 'Advanced', xp: 500, time: '25m' },
];

const DIFF_COLORS: Record<string, string> = {
  Beginner: '#7DEFFB',
  Intermediate: '#FFFFFF',
  Advanced: '#FFB347',
};

export default function HomeScreen({
  onStartQuiz,
  onViewBadges,
  onViewLeaderboard,
  onPlayNext,
  onDevReset,
  completedModules,
  totalXP,
  streak,
}: {
  onStartQuiz: (moduleId: number) => void;
  onViewBadges: () => void;
  onViewLeaderboard: () => void;
  onPlayNext: () => void;
  onDevReset: () => void;
  completedModules: number[];
  totalXP: number;
  streak: number;
}) {
  const { selectedAccount, deauthorizeSession } = useAuthorization();

  const shortAddress = selectedAccount
    ? `${selectedAccount.publicKey.toString().slice(0, 4)}...${selectedAccount.publicKey.toString().slice(-4)}`
    : '';

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            await transact(async wallet => {
              await deauthorizeSession(wallet);
            });
          },
        },
      ]
    );
  };

  const handleModulePress = (moduleId: number) => {
    const unlocked = isModuleUnlocked(moduleId, completedModules);
    if (!unlocked) {
      Alert.alert(
        '🔒 Locked',
        `Complete Module ${moduleId - 1} first to unlock this module.`,
        [{ text: 'OK' }]
      );
      return;
    }
    onStartQuiz(moduleId);
  };

  const progressPct = (completedModules.length / MODULES.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>SolQuest ⚡</Text>
          <TouchableOpacity onLongPress={onDevReset} delayLongPress={1500}>
            <Text style={styles.headerSub}>{shortAddress}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>⚡ {totalXP} XP</Text>
          </View>
          <TouchableOpacity onPress={handleDisconnect} style={styles.disconnectBtn}>
            <Text style={styles.disconnectIcon}>🔓</Text>
            <Text style={styles.disconnectLabel}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>{completedModules.length}/{MODULES.length} modules completed</Text>
          <Text style={styles.streakText}>🔥 {streak} day streak</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>
      </View>

      {/* Bottom nav */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => handleModulePress(1)}>
          <Text style={styles.navIcon}>📚</Text>
          <Text style={styles.navLabel}>Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navPlayBtn} onPress={onPlayNext}>
          <Text style={styles.navPlayIcon}>▶</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={onViewBadges}>
          <Text style={styles.navIcon}>🏅</Text>
          <Text style={styles.navLabel}>Badges</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={onViewLeaderboard}>
          <Text style={styles.navIcon}>🏆</Text>
          <Text style={styles.navLabel}>Rank</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Recommended */}
        <TouchableOpacity style={styles.recommendedCard} onPress={onPlayNext}>
          <Text style={styles.recommendedLabel}>RECOMMENDED</Text>
          <Text style={styles.recommendedTitle}>
            {completedModules.length === 0
              ? 'Start Here: Crypto History'
              : completedModules.length >= 10
              ? '🏆 All modules complete!'
              : `Continue: Module ${completedModules.length + 1}`}
          </Text>
          <Text style={styles.recommendedDesc}>
            {completedModules.length === 0
              ? 'Begin your crypto learning journey.'
              : completedModules.length >= 10
              ? 'You have mastered all modules. Legend!'
              : `Pick up where you left off — ${MODULES.length - completedModules.length} modules remaining.`}
          </Text>
          <View style={styles.recommendedMeta}>
            <Text style={styles.metaText}>✅ {completedModules.length} done</Text>
            <Text style={styles.metaText}>🔒 {MODULES.length - completedModules.length} locked</Text>
            <Text style={styles.metaXP}>⚡ {totalXP} XP total</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>All Modules</Text>

        {MODULES.map((module) => {
          const unlocked = isModuleUnlocked(module.id, completedModules);
          const completed = completedModules.includes(module.id);

          return (
            <TouchableOpacity
              key={module.id}
              style={[
                styles.moduleCard,
                completed && styles.moduleCardCompleted,
                !unlocked && styles.moduleCardLocked,
              ]}
              onPress={() => handleModulePress(module.id)}
              activeOpacity={unlocked ? 0.7 : 1}>
              <View style={[styles.moduleIcon, !unlocked && styles.moduleIconLocked]}>
                <Text style={[styles.moduleIconText, !unlocked && { opacity: 0.3 }]}>
                  {unlocked ? module.icon : '🔒'}
                </Text>
              </View>
              <View style={styles.moduleInfo}>
                <Text style={[styles.moduleTitle, !unlocked && styles.moduleTitleLocked]}>
                  {module.title}
                </Text>
                <Text style={[styles.moduleDesc, !unlocked && { opacity: 0.3 }]}>
                  {unlocked ? module.desc : `Complete Module ${module.id - 1} to unlock`}
                </Text>
                <View style={styles.moduleMeta}>
                  {unlocked ? (
                    <>
                      <Text style={[styles.diffText, { color: DIFF_COLORS[module.difficulty] }]}>{module.difficulty}</Text>
                      <Text style={styles.timeText}>⏱ {module.time}</Text>
                      <Text style={styles.xpReward}>+{module.xp} XP</Text>
                    </>
                  ) : (
                    <Text style={styles.lockedLabel}>🔒 Locked</Text>
                  )}
                </View>
              </View>
              {completed && <Text style={styles.completedCheck}>✅</Text>}
              {unlocked && !completed && <Text style={styles.arrow}>›</Text>}
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050A14' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(125,239,251,0.1)',
  },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  headerSub: { fontSize: 12, color: '#7DEFFB', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  xpBadge: {
    backgroundColor: 'rgba(125,239,251,0.1)', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: 'rgba(125,239,251,0.25)',
  },
  xpText: { fontSize: 13, color: '#7DEFFB', fontWeight: '700' },
  disconnectBtn: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10,
    backgroundColor: 'rgba(255,68,68,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,68,68,0.2)',
    alignItems: 'center',
  },
  disconnectIcon: { fontSize: 14 },
  disconnectLabel: { fontSize: 9, color: 'rgba(255,100,100,0.8)', fontWeight: '600', marginTop: 1 },
  progressContainer: { paddingHorizontal: 20, paddingVertical: 12 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  streakText: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  progressTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 999 },
  progressFill: { height: '100%', backgroundColor: '#7DEFFB', borderRadius: 999 },
  scroll: { flex: 1, paddingHorizontal: 16 },
  recommendedCard: {
    backgroundColor: 'rgba(125,239,251,0.05)', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: 'rgba(125,239,251,0.15)', marginBottom: 20, marginTop: 8,
  },
  recommendedLabel: { fontSize: 11, color: '#7DEFFB', fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  recommendedTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  recommendedDesc: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 10 },
  recommendedMeta: { flexDirection: 'row', gap: 12 },
  metaText: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  metaXP: { fontSize: 12, color: '#7DEFFB', fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', marginBottom: 12 },
  moduleCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16,
    padding: 14, marginBottom: 10, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)', gap: 12,
  },
  moduleCardCompleted: {
    borderColor: 'rgba(20,241,149,0.3)',
    backgroundColor: 'rgba(20,241,149,0.04)',
  },
  moduleCardLocked: {
    opacity: 0.5,
  },
  moduleIcon: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  moduleIconLocked: {
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  moduleIconText: { fontSize: 24 },
  moduleInfo: { flex: 1 },
  moduleTitle: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 2 },
  moduleTitleLocked: { color: 'rgba(255,255,255,0.4)' },
  moduleDesc: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 },
  moduleMeta: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  diffText: { fontSize: 11, fontWeight: '700' },
  timeText: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },
  xpReward: { fontSize: 11, color: '#14F195', fontWeight: '700' },
  lockedLabel: { fontSize: 11, color: 'rgba(255,255,255,0.25)' },
  completedCheck: { fontSize: 20 },
  arrow: { fontSize: 22, color: 'rgba(255,255,255,0.2)' },
  navBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: '#0A1020', borderTopWidth: 1,
    borderTopColor: 'rgba(125,239,251,0.1)', paddingVertical: 10, paddingBottom: 20,
  },
  navItem: { alignItems: 'center', gap: 4 },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 10, color: 'rgba(255,255,255,0.35)' },
  navLabelActive: { color: '#7DEFFB' },
  navPlayBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#7DEFFB', alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  navPlayIcon: { fontSize: 20, color: '#050A14' },
});