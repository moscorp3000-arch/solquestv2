import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const LICENSES = [
  { name: 'React Native', version: '0.71', license: 'MIT', author: 'Meta Platforms, Inc.', desc: 'Framework for building native apps using React.' },
  { name: '@react-native-async-storage/async-storage', version: '1.18.2', license: 'MIT', author: 'React Native Community', desc: 'Asynchronous key-value storage for React Native.' },
  { name: '@solana/web3.js', version: '1.x', license: 'MIT', author: 'Solana Labs', desc: 'Solana JavaScript API for blockchain interaction.' },
  { name: '@solana-mobile/mobile-wallet-adapter-protocol', version: 'latest', license: 'Apache 2.0', author: 'Solana Mobile', desc: 'Mobile Wallet Adapter protocol for Solana Mobile.' },
  { name: '@solana-mobile/mobile-wallet-adapter-protocol-web3js', version: 'latest', license: 'Apache 2.0', author: 'Solana Mobile', desc: 'Web3.js integration for Solana Mobile Wallet Adapter.' },
  { name: 'React', version: '18.x', license: 'MIT', author: 'Meta Platforms, Inc.', desc: 'JavaScript library for building user interfaces.' },
];

const LICENSE_COLORS: Record<string, string> = { 'MIT': '#7DEFFB', 'Apache 2.0': '#9945FF' };

export default function LicensesScreen({ onBack }: { onBack: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Open Source Licenses</Text>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.intro}>SolQuest is built with the following open source libraries. We are grateful to the communities that maintain them.</Text>
          {LICENSES.map((lib, i) => (
            <View key={i} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.libName}>{lib.name}</Text>
                <View style={[styles.badge, { borderColor: LICENSE_COLORS[lib.license] || '#666', backgroundColor: (LICENSE_COLORS[lib.license] || '#666') + '20' }]}>
                  <Text style={[styles.badgeText, { color: LICENSE_COLORS[lib.license] || '#666' }]}>{lib.license}</Text>
                </View>
              </View>
              <Text style={styles.libAuthor}>by {lib.author} · v{lib.version}</Text>
              <Text style={styles.libDesc}>{lib.desc}</Text>
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
  intro: { color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 20, marginBottom: 20 },
  card: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(125,239,251,0.1)', borderRadius: 16, padding: 16, marginBottom: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  libName: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', flex: 1, marginRight: 8 },
  badge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  libAuthor: { color: 'rgba(255,255,255,0.3)', fontSize: 11, marginBottom: 6 },
  libDesc: { color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 18 },
  footer: { alignItems: 'center', paddingVertical: 32 },
  footerText: { color: 'rgba(255,255,255,0.2)', fontSize: 12 },
});