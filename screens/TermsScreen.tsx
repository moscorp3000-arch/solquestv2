import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function TermsScreen({ onBack }: { onBack: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Use</Text>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last updated: March 2026</Text>
          <Text style={styles.intro}>By using SolQuest, you agree to these Terms of Use. Please read them carefully.</Text>
          {[
            { title: '1. Acceptance of Terms', text: 'By downloading or using SolQuest, you agree to be bound by these Terms. If you do not agree, please do not use the app.' },
            { title: '2. Description of Service', text: 'SolQuest is an educational app for learning about Solana, DeFi, and blockchain technology through interactive modules and gamification.\n\nThe app is free. Upon completing all modules, a small wallet verification transaction (≈ 0.000001 SOL) is requested.' },
            { title: '3. Wallet Verification & Airdrop Eligibility', text: 'Upon completing all 10 modules, you are invited to submit a small verification transaction.\n\nPurpose:\n• Prove ownership of an active Solana wallet\n• Qualify for Seeker Mobile Season 2 airdrop\n• Your wallet address is stored as a qualified participant\n\nThis is voluntary but required for airdrop eligibility. Your wallet address is publicly visible on-chain.' },
            { title: '4. Educational Content Only', text: 'All content is for educational purposes only.\n\nNothing in this app constitutes:\n• Financial advice\n• Investment advice\n• Trading recommendations\n• Legal advice\n\nCryptocurrency investments carry significant risk. Always do your own research.' },
            { title: '5. Blockchain Transactions', text: 'All transactions require your explicit confirmation.\n\n• Blockchain transactions are irreversible\n• You are solely responsible for transactions you authorize\n• Transaction fees are non-refundable\n• We are not responsible for loss of funds due to user error' },
            { title: '6. Wallet Security', text: '• Never share your seed phrase with anyone\n• We will never ask for your seed phrase or private keys\n• We cannot recover lost wallets or funds\n• Always verify transaction details before confirming' },
            { title: '7. Limitation of Liability', text: 'To the fullest extent permitted by law, we shall not be liable for any indirect or consequential damages arising from your use of the app, including loss of funds or data.' },
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