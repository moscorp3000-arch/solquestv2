import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ActivityIndicator,
} from 'react-native';
import { useAuthorization } from '../components/providers/AuthorizationProvider';
import { useConnection } from '../components/providers/ConnectionProvider';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

const TREASURY_WALLET = new PublicKey('8LED9AaiG92Zr7LqJDBrK4XqLCyws6AyUaWKsw4183BT');
const VERIFICATION_AMOUNT = 100;

type Status = 'idle' | 'sending' | 'success' | 'failed';

export default function CompletionScreen({ onBack, totalXP, streak }: {
  onBack: () => void;
  totalXP: number;
  streak: number;
}) {
  const { selectedAccount, authorizeSession } = useAuthorization();
  const { connection } = useConnection();
  const [status, setStatus] = useState<Status>('idle');
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const shortAddress = selectedAccount
    ? `${selectedAccount.publicKey.toString().slice(0, 6)}...${selectedAccount.publicKey.toString().slice(-6)}`
    : '';

  const handleVerify = useCallback(async () => {
    if (!selectedAccount) return;
    setStatus('sending');
    try {
      const signature = await transact(async wallet => {
        const authResult = await authorizeSession(wallet);
        const latestBlockhash = await connection.getLatestBlockhash();
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: authResult.publicKey,
            toPubkey: TREASURY_WALLET,
            lamports: VERIFICATION_AMOUNT,
          })
        );
        transaction.recentBlockhash = latestBlockhash.blockhash;
        transaction.feePayer = authResult.publicKey;
        const signedTx = await wallet.signTransactions({ transactions: [transaction] });
        return await connection.sendRawTransaction(signedTx[0].serialize());
      });
      setTxSignature(signature);
      setStatus('success');
    } catch (e) {
      console.log('Verification error:', e);
      setStatus('failed');
    }
  }, [selectedAccount, authorizeSession, connection]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.orb} />

      <View style={styles.content}>
        <View style={styles.trophyWrap}>
          <Text style={styles.trophy}>🏆</Text>
        </View>

        <Text style={styles.title}>All modules completed!</Text>
        <Text style={styles.subtitle}>
          You've completed all 10 modules of SolQuest. Verify your wallet to create an on-chain record of your completion.
        </Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>⚡ {totalXP}</Text>
            <Text style={styles.statLabel}>XP earned</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>🔥 {streak}</Text>
            <Text style={styles.statLabel}>Day streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>✅ 10</Text>
            <Text style={styles.statLabel}>Modules</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🔐</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Your wallet</Text>
              <Text style={styles.infoValue}>{shortAddress}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>💸</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Verification amount</Text>
              <Text style={styles.infoValue}>0.000001 SOL (~$0.0001)</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🎯</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Purpose</Text>
              <Text style={styles.infoValue}>On-chain proof of completion</Text>
            </View>
          </View>
        </View>

        <Text style={styles.disclaimer}>
          By verifying, you confirm that your wallet address may be stored as an on-chain record of completion.
        </Text>
      </View>

      <View style={styles.bottomBar}>
        {status === 'success' ? (
          <View style={styles.successBox}>
            <Text style={styles.successIcon}>✅</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.successTitle}>Wallet verified!</Text>
              <Text style={styles.successSub}>Your completion has been recorded on-chain.</Text>
              {txSignature && (
                <Text style={styles.txHash} numberOfLines={1}>
                  TX: {txSignature.slice(0, 20)}...
                </Text>
              )}
            </View>
          </View>
        ) : status === 'failed' ? (
          <View style={{ gap: 10 }}>
            <Text style={styles.failedText}>
              ❌ Transaction failed. Check your SOL balance and try again.
            </Text>
            <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
              <Text style={styles.verifyBtnText}>🔄 Try again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipBtn} onPress={onBack}>
              <Text style={styles.skipBtnText}>Do this later →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            <TouchableOpacity
              style={[styles.verifyBtn, status === 'sending' && styles.verifyBtnDisabled]}
              onPress={handleVerify}
              disabled={status === 'sending'}>
              {status === 'sending' ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <ActivityIndicator color="#050A14" size="small" />
                  <Text style={styles.verifyBtnText}>Sending...</Text>
                </View>
              ) : (
                <Text style={styles.verifyBtnText}>🚀 Verify on-chain</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipBtn} onPress={onBack}>
              <Text style={styles.skipBtnText}>Skip →</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050A14' },
  orb: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(125,239,251,0.08)', top: -80, right: -80 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 40, alignItems: 'center' },
  trophyWrap: {
    width: 100, height: 100, borderRadius: 30,
    backgroundColor: 'rgba(125,239,251,0.1)',
    borderWidth: 2, borderColor: 'rgba(125,239,251,0.3)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  trophy: { fontSize: 48 },
  title: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24, width: '100%' },
  statBox: {
    flex: 1, backgroundColor: 'rgba(125,239,251,0.06)', borderRadius: 14,
    padding: 12, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(125,239,251,0.15)',
  },
  statValue: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  infoCard: {
    width: '100%', backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: 'rgba(125,239,251,0.15)',
    marginBottom: 16, gap: 4,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  infoIcon: { fontSize: 22 },
  infoLabel: { fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 2 },
  infoValue: { fontSize: 14, color: '#FFFFFF', fontWeight: '700' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  disclaimer: { fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center', lineHeight: 18 },
  bottomBar: { paddingHorizontal: 24, paddingVertical: 20, borderTopWidth: 1, borderTopColor: 'rgba(125,239,251,0.08)' },
  verifyBtn: { backgroundColor: '#7DEFFB', borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  verifyBtnDisabled: { opacity: 0.5 },
  verifyBtnText: { fontSize: 17, fontWeight: '800', color: '#050A14' },
  skipBtn: { alignItems: 'center', paddingVertical: 12 },
  skipBtnText: { fontSize: 14, color: 'rgba(255,255,255,0.3)' },
  successBox: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(20,241,149,0.08)', borderRadius: 16,
    padding: 18, borderWidth: 1, borderColor: 'rgba(20,241,149,0.3)',
  },
  successIcon: { fontSize: 32 },
  successTitle: { fontSize: 16, fontWeight: '800', color: '#14F195', marginBottom: 4 },
  successSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  txHash: { fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 },
  failedText: { fontSize: 13, color: 'rgba(255,100,100,0.9)', textAlign: 'center', lineHeight: 20 },
});