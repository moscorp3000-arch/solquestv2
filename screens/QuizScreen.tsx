import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView,
} from 'react-native';
import { MODULES } from '../src/lessons';
import { QuizStep } from '../src/types';

export default function QuizScreen({
  moduleId,
  onComplete,
  onBack,
}: {
  moduleId: number;
  onComplete: (result: any) => void;
  onBack: () => void;
}) {
  const module = MODULES.find(m => m.id === moduleId) || MODULES[0];
  const questions = module.steps.filter(s => s.type === 'quiz') as QuizStep[];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const question = questions[current];
  const progress = (current / questions.length) * 100;
  const isCorrect = selected === question?.correct;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === question.correct) {
      setScore(s => s + 1);
    } else {
      setLives(l => l - 1);
    }
  };

  const handleNext = () => {
    const newScore = isCorrect ? score + 1 : score;
    const newLives = isCorrect ? lives : lives - 1;

    if (current + 1 >= questions.length || newLives <= 0) {
      onComplete({
        moduleId,
        moduleTitle: module.title,
        score: newScore,
        total: questions.length,
        xp: newScore * Math.floor(module.xp / questions.length),
        streak: 5,
      });
      return;
    }
    setCurrent(c => c + 1);
    setSelected(null);
    setAnswered(false);
  };

  const getOptionStyle = (idx: number) => {
    if (!answered) return styles.option;
    if (idx === question.correct) return [styles.option, styles.optionCorrect];
    if (idx === selected) return [styles.option, styles.optionWrong];
    return styles.option;
  };

  if (!question) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.livesRow}>
          {[...Array(3)].map((_, i) => (
            <Text key={i} style={{ fontSize: 16, opacity: i < lives ? 1 : 0.2 }}>❤️</Text>
          ))}
        </View>
      </View>

      <View style={styles.moduleLabel}>
        <Text style={styles.moduleLabelText}>{module.emoji} {module.title}</Text>
        <Text style={styles.questionNumText}>{current + 1}/{questions.length}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.questionCard}>
          <View style={styles.qNumBadge}>
            <Text style={styles.qNumText}>Q{current + 1}</Text>
          </View>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        <View style={styles.options}>
          {question.options.map((opt: string, idx: number) => (
            <TouchableOpacity
              key={idx}
              style={getOptionStyle(idx)}
              onPress={() => handleSelect(idx)}>
              <View style={[
                styles.optionRadio,
                answered && idx === question.correct && styles.optionRadioCorrect,
                answered && idx === selected && idx !== question.correct && styles.optionRadioWrong,
              ]}>
                {answered && idx === question.correct && <Text style={styles.optionCheck}>✓</Text>}
                {answered && idx === selected && idx !== question.correct && <Text style={styles.optionX}>✗</Text>}
              </View>
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {answered && question.explanation && (
          <View style={[styles.explanationBox, isCorrect ? styles.explanationCorrect : styles.explanationWrong]}>
            <Text style={styles.explanationIcon}>{isCorrect ? '✅' : '💡'}</Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}

        {answered && (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {current + 1 >= questions.length ? 'See Results 🎉' : 'Next →'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050A14' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 12,
  },
  closeBtn: { fontSize: 18, color: 'rgba(255,255,255,0.5)', padding: 4 },
  progressTrack: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 999 },
  progressFill: { height: '100%', backgroundColor: '#7DEFFB', borderRadius: 999 },
  livesRow: { flexDirection: 'row', gap: 2 },
  moduleLabel: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 12,
  },
  moduleLabelText: { fontSize: 12, color: '#7DEFFB', fontWeight: '700' },
  questionNumText: { fontSize: 12, color: 'rgba(255,255,255,0.3)' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  questionCard: {
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20,
    padding: 20, marginBottom: 20, borderWidth: 1,
    borderColor: 'rgba(125,239,251,0.1)',
  },
  qNumBadge: {
    backgroundColor: 'rgba(125,239,251,0.15)', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
    alignSelf: 'flex-start', marginBottom: 12,
  },
  qNumText: { fontSize: 12, color: '#7DEFFB', fontWeight: '700' },
  questionText: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', lineHeight: 28 },
  options: { gap: 10 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14,
    padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  optionCorrect: { borderColor: '#14F195', backgroundColor: 'rgba(20,241,149,0.08)' },
  optionWrong: { borderColor: '#FF4444', backgroundColor: 'rgba(255,68,68,0.08)' },
  optionRadio: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  optionRadioCorrect: { borderColor: '#14F195' },
  optionRadioWrong: { borderColor: '#FF4444' },
  optionCheck: { fontSize: 14, color: '#14F195' },
  optionX: { fontSize: 14, color: '#FF4444' },
  optionText: { fontSize: 15, color: 'rgba(255,255,255,0.85)', flex: 1 },
  explanationBox: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    marginTop: 16, borderRadius: 14, padding: 14, borderWidth: 1,
  },
  explanationCorrect: {
    backgroundColor: 'rgba(20,241,149,0.06)', borderColor: 'rgba(20,241,149,0.2)',
  },
  explanationWrong: {
    backgroundColor: 'rgba(125,239,251,0.06)', borderColor: 'rgba(125,239,251,0.2)',
  },
  explanationIcon: { fontSize: 16 },
  explanationText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', flex: 1, lineHeight: 20 },
  nextBtn: {
    marginTop: 24, backgroundColor: '#7DEFFB',
    borderRadius: 16, paddingVertical: 18, alignItems: 'center',
  },
  nextBtnText: { fontSize: 17, fontWeight: '800', color: '#050A14' },
});