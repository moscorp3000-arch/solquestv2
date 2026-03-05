import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function PrivacyScreen({ onBack }: { onBack: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last updated: March 2026</Text>
          <Text style={styles.intro}>SolQuest is committed to protecting your privacy. This policy explains how we handle information when you use our app.</Text>
          {[
            { title: '1. Information We Collect', text: 'We do not collect personal data.\n\nSolQuest is a fully local application. All progress data is stored exclusively on your device using AsyncStorage and is never transmitted to any server.\n\nWe do not collect:\n• Your name, email address, or contact information\n• Location data\n• Device identifiers or advertising IDs\n• Usage analytics or behavioral data' },
            { title: '2. Blockchain & Wallet Data', text: 'When you connect your Solana wallet via the Mobile Wallet Adapter, we only read your public wallet address. We never have access to your private keys or seed phrase.\n\nAll blockchain transactions are initiated by you and signed exclusively within your wallet.' },
            { title: '3. Wallet Verification & Airdrop', text: 'Upon completing all modules, you may optionally submit a small verification transaction (≈ 0.000001 SOL).\n\nThis transaction:\n• Proves you have an active Solana wallet\n• Qualifies your wallet for Seeker Mobile Season 2 airdrop\n• Records your public wallet address on-chain\n\nThis is voluntary. Your wallet address is publicly visible on the Solana blockchain.' },
            { title: '4. Local Storage', text: 'The following data is stored locally only:\n\n• Learning progress (completed modules, XP)\n• Streak count\n• Language preference\n\nThis data never leaves your device and can be deleted by uninstalling the app.' },
            { title: '5. Contact', text: 'Questions about this Privacy Policy? Contact us via the Solana Mobile dApp Store listing or our official channels.' },
          ].map((s, i) => (
            <View key={i} style={styles.section}>
              <Text style={styles.sectionTitle}>{s.title}</Text>
              <Text style={styles.sectionText}>{s.text}</Text>
            </View>
          ))}
          <View style={styles.footer}><Text style={styles.footerText}>⚡ SolQuest — Built for Solana Mobile</Text></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050A14' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(125,239,251,0.15)' },
  backBtn: { marginRight: 16 },
  backText: { color: '#7DEFFB', fontSize: 15, fontWeight: '600' },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  scroll: { flex: 1 },
  content: { padding: 20 },
  lastUpdated: { color: 'rgba(255,255,255,0.3)', fontSize: 12, marginBottom: 12 },
  intro: { color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 22, marginBottom: 20 },
  section: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(125,239,251,0.1)', borderRadius: 16, padding: 18, marginBottom: 12 },
  sectionTitle: { color: '#7DEFFB', fontSize: 15, fontWeight: '800', marginBottom: 10 },
  sectionText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 22 },
  footer: { alignItems: 'center', paddingVertical: 32 },
  footerText: { color: 'rgba(255,255,255,0.2)', fontSize: 12 },
});