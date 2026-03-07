import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { StreakState } from '../util/streak';

interface Props {
  streak: StreakState;
  accentColor?: string; // '#9945FF' for SolQuest, '#FF7800' for SeekerQuest
}

const MILESTONES = [3, 7, 14, 30, 60, 100];

function getMilestoneLabel(count: number): string | null {
  if (count === 3)   return '3 dagen 🔥';
  if (count === 7)   return '1 week! 🏆';
  if (count === 14)  return '2 weken! 💎';
  if (count === 30)  return '1 maand! 🚀';
  if (count === 60)  return '2 maanden! 🌟';
  if (count === 100) return '100 dagen! 👑';
  return null;
}

export default function StreakBanner({ streak, accentColor = '#9945FF' }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  const milestone = getMilestoneLabel(streak.count);

  useEffect(() => {
    // Slide in on mount
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0, duration: 350, useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 350, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Pulse fire emoji when streak is fresh today
    if (!streak.isAlreadyCountedToday) {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.4, duration: 200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [streak.count]);

  const isFrozen   = streak.freezeUsed;
  const fireEmoji  = isFrozen ? '🧊' : streak.count >= 30 ? '🔥🔥' : '🔥';
  const borderColor = isFrozen
    ? 'rgba(100,180,255,0.4)'
    : `${accentColor}55`;
  const bgColor = isFrozen
    ? 'rgba(100,180,255,0.07)'
    : `${accentColor}12`;

  return (
    <Animated.View style={[
      styles.container,
      { borderColor, backgroundColor: bgColor },
      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
    ]}>
      {/* Left: fire + count */}
      <View style={styles.left}>
        <Animated.Text style={[styles.fire, { transform: [{ scale: pulseAnim }] }]}>
          {fireEmoji}
        </Animated.Text>
        <View>
          <Text style={[styles.count, { color: isFrozen ? '#64B4FF' : accentColor }]}>
            {streak.count} {streak.count === 1 ? 'dag' : 'dagen'}
          </Text>
          <Text style={styles.label}>
            {isFrozen
              ? '❄️ Streak freeze gebruikt'
              : streak.isAlreadyCountedToday
                ? 'Vandaag al actief ✓'
                : 'Streak bijgewerkt!'
            }
          </Text>
        </View>
      </View>

      {/* Right: freeze indicator or milestone */}
      <View style={styles.right}>
        {milestone ? (
          <View style={[styles.milestoneBadge, { borderColor: accentColor, backgroundColor: `${accentColor}20` }]}>
            <Text style={[styles.milestoneText, { color: accentColor }]}>{milestone}</Text>
          </View>
        ) : streak.freezeAvailable && !isFrozen ? (
          <View style={styles.freezeBadge}>
            <Text style={styles.freezeIcon}>🧊</Text>
            <Text style={styles.freezeLabel}>1 freeze</Text>
          </View>
        ) : isFrozen ? (
          <View style={styles.freezeBadge}>
            <Text style={styles.freezeIcon}>⚡</Text>
            <Text style={styles.freezeLabel}>+7 dagen{'\n'}= nieuwe freeze</Text>
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: 16, marginBottom: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 16, borderWidth: 1,
  },
  left: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  fire: {
    fontSize: 28,
  },
  count: {
    fontSize: 18, fontWeight: '900',
  },
  label: {
    fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1,
  },
  right: {
    alignItems: 'flex-end',
  },
  milestoneBadge: {
    borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4,
  },
  milestoneText: {
    fontSize: 11, fontWeight: '800',
  },
  freezeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(100,180,255,0.1)',
    borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(100,180,255,0.25)',
  },
  freezeIcon: { fontSize: 14 },
  freezeLabel: {
    fontSize: 10, color: '#64B4FF', fontWeight: '600',
  },
});