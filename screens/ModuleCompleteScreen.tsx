import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView,
} from 'react-native';
import { MODULES, BADGE_DATA } from '../src/lessons';

type Result = {
  moduleId: number;
  moduleTitle: string;
  score: number;
  total: number;
  xp: number;
  streak: number;
};

const getFeedback = (pct: number) => {
  if (pct === 100) return { emoji: '🏆', title: 'Perfect Score!', desc: 'Flawless. You nailed every question.' };
  if (pct >= 80) return { emoji: '🎉', title: 'Module Mastered!', desc: 'Great work — you really know this.' };
  if (pct >= 60) return { emoji: '👍', title: 'Well Done!', desc: 'Solid effort. Review the ones you missed.' };
  return { emoji: '💪', title: 'Keep Going!', desc: 'Retry to improve your score and earn more XP.' };
};

export default function ModuleCompleteScreen({
  result,
  onContinue,
  onRetry,
}: {
  result: Result;
  onContinue: () => void;
  onRetry: () => void;
}) {
  const pct = Math.round((result.score / result.total) * 100);
  const feedback = getFeedback(pct);
  const module = MODULES.find(m => m.id === result.moduleId);
  const badge = BADGE_DATA.find(b => b.moduleId === result.moduleId);

  // Ring color based on score
  const ringColor = pct === 100 ? '#FFD700' : pct >= 80 ? '#14F195' : pct >= 60 ? '#7DEFFB' : '#FF6B35';

  return (
    <SafeAreaView style={styles.container}>
      {/* Glow orb */}
      <View style={[styles.orb, { backgroundColor: `${ringColor}10` }]} />

      {/* Close */}
      <TouchableOpacity style={styles.closeBtn} onPress={onContinue}>
        <Text style={styles.closeBtnText}>✕</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Module label */}
        <Text style={styles.topLabel}>MODULE COMPLETE</Text>
        <Text style={[styles.moduleName, { color: module?.color || '#7DEFFB' }]}>
          {module?.emoji} {result.moduleTitle}
        </Text>

        {/* Score ring */}
        <View style={[styles.scoreRing, { borderColor: ringColor, shadowColor: ringColor }]}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={[styles.scoreValue, { color: ringColor }]}>{pct}%</Text>
          <View style={[styles.xpBadge, { backgroundColor: `${ringColor}20` }]}>
            <Text style={[styles.xpBadgeText, { color: ringColor }]}>⚡ +{result.xp} XP</Text>
          </View>
        </View>

        {/* Feedback */}
        <Text style={styles.feedbackEmoji}>{feedback.emoji}</Text>
        <Text style={[styles.masteredText, { color: ringColor }]}>{feedback.title}</Text>
        <Text style={styles.masteredDesc}>{feedback.desc}</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statValue}>{result.score}/{result.total}</Text>
            <Text style={styles.statLabel}>CORRECT</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{result.streak} Day</Text>
            <Text style={styles.statLabel}>STREAK</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={styles.statValue}>+{result.xp}</Text>
            <Text style={styles.statLabel}>XP EARNED</Text>
          </View>
        </View>

        {/* Badge — only show if this module has a badge */}
        {badge ? (
          <View style={styles.badgeCard}>
            <View style={styles.badgeIconWrap}>
              <Text style={{ fontSize: 28 }}>{badge.icon}</Text>
              <View style={styles.checkmark}>
                <Text style={{ fontSize: 10, color: '#050A14' }}>✓</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.badgeUnlockedLabel}>BADGE UNLOCKED</Text>
              <Text style={styles.badgeName}>{badge.name}</Text>
              <Text style={styles.badgeDesc}>{badge.desc}</Text>
            </View>
            <Text style={styles.badgeTime}>Just now</Text>
          </View>
        ) : (
          <View style={styles.noBargeCard}>
            <Text style={styles.noBadgeText}>
              🎯 Complete more modules to unlock badges
            </Text>
          </View>
        )}

        {/* Buttons */}
        <TouchableOpacity style={styles.continueBtn} onPress={onContinue}>
          <Text style={styles.continueBtnText}>Continue to Next Module →</Text>
        </TouchableOpacity>

        <View style={styles.secondaryBtns}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onRetry}>
            <Text style={styles.secondaryBtnText}>↺  Retry Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onContinue}>
            <Text style={styles.secondaryBtnText}>🏅  View Badges</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050A14' },
  orb: {
    position: 'absolute', width: 340, height: 340,
    borderRadius: 170, top: -60, alignSelf: 'center',
  },
  closeBtn: { alignSelf: 'flex-end', marginTop: 12, marginRight: 20, padding: 8 },
  closeBtnText: { fontSize: 18, color: 'rgba(255,255,255,0.4)' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, alignItems: 'center', paddingBottom: 20 },
  topLabel: {
    fontSize: 11, color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2, marginBottom: 4, marginTop: 8,
  },
  moduleName: { fontSize: 16, fontWeight: '700', marginBottom: 24 },
  scoreRing: {
    width: 160, height: 160, borderRadius: 80,
    borderWidth: 6, alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 24,
    elevation: 10,
  },
  scoreLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 },
  scoreValue: { fontSize: 44, fontWeight: '900' },
  xpBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, marginTop: 4 },
  xpBadgeText: { fontSize: 12, fontWeight: '700' },
  feedbackEmoji: { fontSize: 36, marginBottom: 8 },
  masteredText: { fontSize: 26, fontWeight: '900', marginBottom: 8 },
  masteredDesc: {
    fontSize: 14, color: 'rgba(255,255,255,0.45)',
    textAlign: 'center', marginBottom: 24, lineHeight: 20,
  },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16, width: '100%' },
  statCard: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14,
    padding: 14, alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  statIcon: { fontSize: 20 },
  statValue: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 0.5 },
  badgeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16,
    padding: 14, width: '100%', marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(125,239,251,0.2)',
  },
  badgeIconWrap: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: 'rgba(125,239,251,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  checkmark: {
    position: 'absolute', bottom: -2, right: -2,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#14F195', alignItems: 'center', justifyContent: 'center',
  },
  badgeUnlockedLabel: { fontSize: 10, color: '#7DEFFB', letterSpacing: 1, fontWeight: '700' },
  badgeName: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  badgeDesc: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  badgeTime: { fontSize: 11, color: 'rgba(255,255,255,0.3)' },
  noBargeCard: {
    width: '100%', borderRadius: 14, padding: 14, marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
  },
  noBadgeText: { fontSize: 13, color: 'rgba(255,255,255,0.35)' },
  continueBtn: {
    width: '100%', backgroundColor: '#7DEFFB',
    borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginBottom: 10,
  },
  continueBtnText: { fontSize: 16, fontWeight: '800', color: '#050A14' },
  secondaryBtns: { flexDirection: 'row', gap: 10, width: '100%' },
  secondaryBtn: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  secondaryBtnText: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
});