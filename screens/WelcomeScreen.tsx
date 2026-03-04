import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, SafeAreaView,
} from 'react-native';
import { useAuthorization } from '../components/providers/AuthorizationProvider';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';

export default function WelcomeScreen() {
  const { authorizeSession } = useAuthorization();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = useCallback(async () => {
    setConnecting(true);
    try {
      await transact(async wallet => {
        await authorizeSession(wallet);
      });
    } catch (e) {
      console.log('Connect error:', e);
    } finally {
      setConnecting(false);
    }
  }, [authorizeSession]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.orb1} />
      <View style={styles.orb2} />

      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoEmoji}>⚡</Text>
        </View>
        <Text style={styles.appName}>SolQuest</Text>
        <Text style={styles.tagline}>Learn Solana. Earn Onchain.</Text>
      </View>

      <View style={styles.features}>
        {[
          { icon: '🧠', text: '10 learning modules on Solana' },
          { icon: '🏆', text: 'Earn NFT achievement badges' },
          { icon: '🔥', text: 'Daily streak & XP system' },
          { icon: '🛡️', text: 'Seed Vault secured' },
        ].map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.btn, connecting && styles.btnDisabled]}
          onPress={handleConnect}
          disabled={connecting}>
          {connecting ? (
            <ActivityIndicator color="#050A14" />
          ) : (
            <Text style={styles.btnText}>Connect Seed Vault →</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.disclaimer}>Your private key never leaves your Seeker</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050A14', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 40 },
  orb1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(125,239,251,0.07)', top: -80, right: -80 },
  orb2: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(125,239,251,0.04)', bottom: 100, left: -60 },
  logoContainer: { alignItems: 'center', marginTop: 40 },
  logoIcon: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: 'rgba(125,239,251,0.1)', borderWidth: 1.5,
    borderColor: '#7DEFFB', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  logoEmoji: { fontSize: 40 },
  appName: { fontSize: 38, fontWeight: '900', color: '#FFFFFF', letterSpacing: -1 },
  tagline: { fontSize: 16, color: 'rgba(255,255,255,0.45)', marginTop: 8 },
  features: { width: '85%', gap: 12 },
  featureRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: 'rgba(125,239,251,0.1)',
  },
  featureIcon: { fontSize: 22 },
  featureText: { fontSize: 15, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
  bottom: { width: '85%', alignItems: 'center', gap: 12 },
  btn: {
    width: '100%', backgroundColor: '#7DEFFB', borderRadius: 16,
    paddingVertical: 18, alignItems: 'center',
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontSize: 17, fontWeight: '800', color: '#050A14' },
  disclaimer: { fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center' },
});