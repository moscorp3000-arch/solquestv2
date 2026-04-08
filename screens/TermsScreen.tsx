import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function TermsScreen({ onBack }: { onBack: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last updated: April 2, 2026</Text>

          <View style={styles.highlight}>
            <Text style={styles.highlightText}>
              <Text style={styles.bold}>By using SeekerLabs apps you agree to these terms. </Text>
              Our apps interact with the Solana blockchain. Blockchain transactions are irreversible. Use responsibly.
            </Text>
          </View>

          {[
            { title: '1. Acceptance', text: 'By installing or using SeekerQuest or SolQuest, you agree to these Terms. If you do not agree, do not use our apps.' },
            { title: '2. What Our Apps Do', text: '• Teach Solana through quizzes and guided modules\n• Execute real transactions on Solana mainnet\n• Mint compressed NFT badges as proof of learning\n• Interact with Jupiter swap aggregator' },
            { title: '3. Blockchain & Financial Risk', text: 'All transactions are real and irreversible. You accept that:\n\n• Transactions cannot be reversed once confirmed\n• Gas fees apply and are paid in SOL from your wallet\n• Swap prices are subject to market fluctuation and slippage\n• Small verification transactions (~0.000001 SOL) confirm module completion\n• We are not responsible for financial loss from transactions\n\nOur apps are educational tools — not financial advisors.' },
            { title: '4. Your Wallet', text: 'You are solely responsible for your wallet security. SeekerLabs:\n\n• Never has access to your private keys or seed phrase\n• Cannot recover lost wallets or funds\n• Cannot reverse transactions made through our apps' },
            { title: '5. NFT Badges', text: 'Badges are compressed NFTs minted on Solana mainnet. They have no guaranteed monetary value. Availability may change if the service is discontinued.' },
            { title: '6. Acceptable Use', text: 'Do not attempt to manipulate module verification, use bots, reverse engineer the apps, or use them for illegal purposes.' },
            { title: '7. Disclaimer', text: 'Apps are provided "as is" without warranty. Use at your own risk.' },
            { title: '8. Liability', text: 'SeekerLabs is not liable for indirect, incidental, or consequential damages including loss of funds or digital assets.' },
            { title: '9. Governing Law', text: 'These terms are governed by Dutch law. Disputes resolved in Rotterdam, Netherlands.' },
            { title: '10. Contact', text: 'Questions? Email: eds3000@proton.me' },
          ].map((s, i) => (
            <View key={i} style={styles.section}>
              <Text style={styles.sectionTitle}>{s.title}</Text>
              <Text style={styles.sectionText}>{s.text}</Text>
            </View>
          ))}
          <View style={styles.footer}>
            <Text style={styles.footerText}>SeekerLabs · eds3000@proton.me</Text>
          </View>
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
  highlight: { backgroundColor: 'rgba(255,120,0,0.07)', borderLeftWidth: 3, borderLeftColor: '#FF7800', padding: 14, borderRadius: 8, marginBottom: 20 },
  highlightText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 22 },
  bold: { fontWeight: '700', color: '#FFFFFF' },
  section: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(125,239,251,0.1)', borderRadius: 16, padding: 18, marginBottom: 12 },
  sectionTitle: { color: '#FF7800', fontSize: 15, fontWeight: '800', marginBottom: 10 },
  sectionText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 22 },
  footer: { alignItems: 'center', paddingVertical: 32 },
  footerText: { color: 'rgba(255,255,255,0.2)', fontSize: 12 },
});
