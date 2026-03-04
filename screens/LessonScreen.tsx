import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView,
} from 'react-native';
import { MODULES } from '../src/lessons';
import { InfoStep } from '../src/types';

export default function LessonScreen({
  moduleId,
  onStartQuiz,
  onBack,
}: {
  moduleId: number;
  onStartQuiz: () => void;
  onBack: () => void;
}) {
  const module = MODULES.find(m => m.id === moduleId) || MODULES[0];
  const infoSteps = module.steps.filter(s => s.type === 'info') as InfoStep[];
  const quizCount = module.steps.filter(s => s.type === 'quiz').length;

  const [current, setCurrent] = useState(0);
  const isLast = current === infoSteps.length - 1;
  const progress = ((current + 1) / infoSteps.length) * 100;

  const handleNext = () => {
    if (isLast) {
      onStartQuiz();
    } else {
      setCurrent(c => c + 1);
    }
  };

  const handleBack = () => {
    if (current === 0) {
      onBack();
    } else {
      setCurrent(c => c - 1);
    }
  };

  const step = infoSteps[current];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: module.color }]} />
        </View>
        <Text style={styles.stepCount}>{current + 1}/{infoSteps.length}</Text>
      </View>

      {/* Module label */}
      <View style={styles.moduleLabel}>
        <Text style={[styles.moduleLabelText, { color: module.color }]}>
          {module.emoji} {module.title}
        </Text>
        <View style={styles.diffBadge}>
          <Text style={styles.diffText}>{module.difficulty}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Info card */}
        <View style={[styles.infoCard, { borderColor: `${module.color}30` }]}>
          {/* Icon */}
          <View style={[styles.iconWrap, { backgroundColor: `${module.color}15` }]}>
            <Text style={styles.icon}>{step.icon}</Text>
          </View>

          {/* Text */}
          <Text style={styles.infoText}>{step.text}</Text>
        </View>

        {/* Step dots */}
        <View style={styles.dotsRow}>
          {infoSteps.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === current && { backgroundColor: module.color, width: 20 },
                i < current && { backgroundColor: `${module.color}60` },
              ]}
            />
          ))}
        </View>

        {/* Quiz preview — only show on last step */}
        {isLast && (
          <View style={styles.quizPreview}>
            <Text style={styles.quizPreviewIcon}>🧠</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.quizPreviewTitle}>Ready for the quiz?</Text>
              <Text style={styles.quizPreviewDesc}>
                {quizCount} questions • +{module.xp} XP • {module.timeMin} min
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: isLast ? '#7DEFFB' : `${module.color}` }]}
          onPress={handleNext}>
          <Text style={[styles.nextBtnText, { color: isLast ? '#050A14' : '#050A14' }]}>
            {isLast ? '🧠 Start Quiz' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050A14' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 14,
  },
  backBtn: { padding: 4 },
  backBtnText: { fontSize: 22, color: 'rgba(255,255,255,0.5)' },
  progressTrack: {
    flex: 1, height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 999,
  },
  progressFill: { height: '100%', borderRadius: 999 },
  stepCount: { fontSize: 12, color: 'rgba(255,255,255,0.3)', minWidth: 30, textAlign: 'right' },
  moduleLabel: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, marginBottom: 20,
  },
  moduleLabelText: { fontSize: 14, fontWeight: '800' },
  diffBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  diffText: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 20, alignItems: 'center' },
  infoCard: {
    width: '100%', backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24, padding: 28,
    borderWidth: 1, alignItems: 'center', gap: 20,
    minHeight: 280, justifyContent: 'center',
  },
  iconWrap: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
  },
  icon: { fontSize: 40 },
  infoText: {
    fontSize: 18, color: '#FFFFFF', lineHeight: 30,
    textAlign: 'center', fontWeight: '500',
  },
  dotsRow: {
    flexDirection: 'row', gap: 6, marginTop: 24, marginBottom: 16,
    alignItems: 'center',
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  quizPreview: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    width: '100%', backgroundColor: 'rgba(125,239,251,0.06)',
    borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: 'rgba(125,239,251,0.15)',
    marginTop: 8,
  },
  quizPreviewIcon: { fontSize: 28 },
  quizPreviewTitle: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  quizPreviewDesc: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  bottomBar: {
    paddingHorizontal: 20, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
  },
  nextBtn: {
    borderRadius: 16, paddingVertical: 18, alignItems: 'center',
  },
  nextBtnText: { fontSize: 17, fontWeight: '800' },
});