import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    tag: 'MODULES',
    title: 'Learn Crypto',
    titleAccent: 'The Smart Way',
    desc: 'SolQuest breaks down blockchain, DeFi, and NFTs into digestible modules. Learn, quiz, and level up your knowledge.',
    icon: '🧱',
    btnText: 'Next Step →',
  },
  {
    tag: 'SAFETY FIRST',
    title: 'Master Web3',
    titleAccent: 'Safety & Security',
    desc: 'Learn how to protect your assets. Understand seed phrases, avoid scams, and explore key tracks like DeFi and NFTs safely.',
    bullets: ['Secure your Seed Vault and recovery phrases', 'Identify and avoid common crypto scams'],
    icon: '🛡️',
    btnText: 'Next Step →',
  },
  {
    tag: 'EARN & COMPETE',
    title: 'Learn to Earn',
    titleAccent: 'Real Rewards',
    desc: 'Complete quests to earn XP, maintain streaks, and collect exclusive NFT badges. Climb the leaderboard to unlock special perks.',
    bullets: ['NFT Badges — Verifiable on-chain achievements', 'Daily Streaks — Build habits and multiply your XP'],
    icon: '🏆',
    btnText: 'Start Learning 🚀',
  },
];

export default function OnboardingScreen({ onFinish }: { onFinish: () => void }) {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  const handleNext = () => {
    if (index < SLIDES.length - 1) setIndex(index + 1);
    else onFinish();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.orb} />

      <TouchableOpacity style={styles.skip} onPress={onFinish}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Progress dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive, i < index && styles.dotDone]} />
        ))}
      </View>

      {/* Icon card */}
      <View style={styles.iconCard}>
        <Text style={styles.icon}>{slide.icon}</Text>
      </View>

      {/* Tag */}
      <View style={styles.tagRow}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>{slide.tag}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.titleAccent}>{slide.titleAccent}</Text>
      <Text style={styles.desc}>{slide.desc}</Text>

      {/* Bullets */}
      {slide.bullets && (
        <View style={styles.bullets}>
          {slide.bullets.map((b, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>{b}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Text style={styles.btnText}>{slide.btnText}</Text>
        </TouchableOpacity>
        {index === SLIDES.length - 1 && (
          <Text style={styles.disclaimer}>Wallet connection is optional and can be done later.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050A14', paddingHorizontal: 28, alignItems: 'center' },
  orb: {
    position: 'absolute', width: 400, height: 400, borderRadius: 200,
    backgroundColor: 'rgba(125,239,251,0.05)', top: -100, right: -150,
  },
  skip: { alignSelf: 'flex-end', marginTop: 16 },
  skipText: { color: 'rgba(255,255,255,0.4)', fontSize: 15 },
  dots: { flexDirection: 'row', gap: 8, marginTop: 20, marginBottom: 32 },
  dot: { width: 32, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)' },
  dotActive: { backgroundColor: '#7DEFFB', width: 48 },
  dotDone: { backgroundColor: 'rgba(125,239,251,0.4)' },
  iconCard: {
    width: width * 0.55, height: width * 0.55, borderRadius: 32,
    backgroundColor: 'rgba(125,239,251,0.06)', borderWidth: 1,
    borderColor: 'rgba(125,239,251,0.15)', alignItems: 'center',
    justifyContent: 'center', marginBottom: 28,
  },
  icon: { fontSize: 72 },
  tagRow: { alignItems: 'center', marginBottom: 12 },
  tagBadge: {
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4,
    backgroundColor: 'rgba(125,239,251,0.1)', borderWidth: 1,
    borderColor: 'rgba(125,239,251,0.2)',
  },
  tagText: { fontSize: 11, color: '#7DEFFB', fontWeight: '700', letterSpacing: 1 },
  title: { fontSize: 34, fontWeight: '900', color: '#FFFFFF', textAlign: 'center' },
  titleAccent: { fontSize: 34, fontWeight: '900', color: '#7DEFFB', textAlign: 'center', marginBottom: 16 },
  desc: { fontSize: 15, color: 'rgba(255,255,255,0.55)', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  bullets: { width: '100%', gap: 12, marginBottom: 16 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bulletDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#7DEFFB' },
  bulletText: { fontSize: 14, color: 'rgba(255,255,255,0.7)', flex: 1 },
  bottom: { position: 'absolute', bottom: 36, width: '100%', alignItems: 'center', gap: 12 },
  btn: {
    width: '100%', backgroundColor: '#7DEFFB', borderRadius: 16,
    paddingVertical: 18, alignItems: 'center',
  },
  btnText: { fontSize: 17, fontWeight: '800', color: '#050A14' },
  disclaimer: { fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center' },
});