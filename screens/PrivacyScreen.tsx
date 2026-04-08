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
          <Text style={styles.lastUpdated}>Last updated: April 2, 2026</Text>

          <View style={styles.highlight}>
            <Text style={styles.highlightText}>
              <Text style={styles.bold}>Short version: </Text>
              SeekerLabs collects zero personal data. We do not track you, store your information, or sell anything. Your wallet stays yours.
            </Text>
          </View>

          {[
            { title: '1. Who We Are', text: 'SeekerLabs builds mobile apps for the Solana Mobile ecosystem. Our apps — SeekerQuest and SolQuest — run on Solana Mobile Seeker devices.\n\nContact: eds3000@proton.me' },
            { title: '2. Data We Do NOT Collect', text: 'We do not collect, store, or process:\n\n• Personal information (name, email, phone)\n• Location data\n• Device identifiers or advertising IDs\n• Usage analytics or behavioral tracking\n• Private keys or seed phrases — ever' },
            { title: '3. Blockchain Interactions', text: 'Our apps interact with Solana mainnet. Transactions are public by nature. When you complete a module or earn a badge, a transaction is recorded on-chain. This is how the Solana network works.\n\nAll signing happens through Seed Vault — Solana Mobile\'s secure hardware enclave. We never see your private keys.' },
            { title: '4. Wallet Permissions', text: 'We only request:\n\n• Sign transactions — to verify module completion on-chain\n• Public wallet address — to associate badges with your wallet' },
            { title: '5. Third-Party Services', text: '• Helius RPC — Solana node provider\n• Jupiter Aggregator — token swap routing\n• Metaplex — compressed NFT badge minting\n\nThese services only receive your public wallet address.' },
            { title: '6. Children\'s Privacy', text: 'Our apps are not directed at children under 13. We do not knowingly collect information from children.' },
            { title: '7. Contact', text: 'Questions? Email: eds3000@proton.me' },
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
  highlight: { backgroundColor: 'rgba(153,69,255,0.08)', borderLeftWidth: 3, borderLeftColor: '#9945FF', padding: 14, borderRadius: 8, marginBottom: 20 },
  highlightText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 22 },
  bold: { fontWeight: '700', color: '#FFFFFF' },
  section: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(125,239,251,0.1)', borderRadius: 16, padding: 18, marginBottom: 12 },
  sectionTitle: { color: '#9945FF', fontSize: 15, fontWeight: '800', marginBottom: 10 },
  sectionText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 22 },
  footer: { alignItems: 'center', paddingVertical: 32 },
  footerText: { color: 'rgba(255,255,255,0.2)', fontSize: 12 },
});
