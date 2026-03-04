import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';

const MOCK_LEADERS = [
  { rank: 1, name: 'SolanaKing', xp: 2450, streak: 12, level: 8 },
  { rank: 2, name: 'CryptoNinja', xp: 2150, streak: 9, level: 7 },
  { rank: 3, name: 'PixelArt', xp: 1980, streak: 6, level: 7 },
  { rank: 4, name: 'MoonWalker', xp: 1850, streak: 12, level: 6 },
  { rank: 5, name: 'DeFi_Queen', xp: 1720, streak: 8, level: 6 },
  { rank: 6, name: 'BlockChainZ', xp: 1650, streak: 2, level: 5 },
  { rank: 7, name: 'SatoshiNaka', xp: 1580, streak: 24, level: 5 },
  { rank: 8, name: 'HODLer_01', xp: 1420, streak: 0, level: 4 },
];

const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
const RANK_LABELS = ['🥇', '🥈', '🥉'];

export default function LeaderboardScreen({ onBack }: { onBack: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Leaderboard</Text>
          <Text style={styles.headerSub}>Global Rankings</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      {/* Top 3 podium */}
      <View style={styles.podium}>
        {/* 2nd place */}
        <View style={[styles.podiumItem, styles.podiumSecond]}>
          <Text style={styles.podiumEmoji}>🥈</Text>
          <Text style={styles.podiumName}>{MOCK_LEADERS[1].name.slice(0, 8)}</Text>
          <View style={[styles.podiumBar, styles.podiumBar2]}>
            <Text style={styles.podiumXP}>{MOCK_LEADERS[1].xp} XP</Text>
          </View>
        </View>

        {/* 1st place */}
        <View style={[styles.podiumItem, styles.podiumFirst]}>
          <Text style={styles.crownEmoji}>👑</Text>
          <Text style={styles.podiumEmoji}>🥇</Text>
          <Text style={[styles.podiumName, styles.podiumNameFirst]}>{MOCK_LEADERS[0].name.slice(0, 8)}</Text>
          <View style={[styles.podiumBar, styles.podiumBar1]}>
            <Text style={styles.podiumXP}>{MOCK_LEADERS[0].xp} XP</Text>
          </View>
        </View>

        {/* 3rd place */}
        <View style={[styles.podiumItem, styles.podiumThird]}>
          <Text style={styles.podiumEmoji}>🥉</Text>
          <Text style={styles.podiumName}>{MOCK_LEADERS[2].name.slice(0, 8)}</Text>
          <View style={[styles.podiumBar, styles.podiumBar3]}>
            <Text style={styles.podiumXP}>{MOCK_LEADERS[2].xp} XP</Text>
          </View>
        </View>
      </View>

      {/* Your rank card */}
      <View style={styles.yourRank}>
        <Text style={styles.yourRankLabel}>YOUR RANK</Text>
        <View style={styles.yourRankRow}>
          <Text style={styles.yourRankNum}>#42</Text>
          <View style={styles.yourRankInfo}>
            <Text style={styles.yourRankName}>You</Text>
            <Text style={styles.yourRankSub}>🔥 5 day streak • Lvl 4</Text>
          </View>
          <Text style={styles.yourRankXP}>0 XP</Text>
        </View>
        <Text style={styles.yourRankHint}>Complete quizzes to climb the ranks! ⚡</Text>
      </View>

      {/* List */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Top Players</Text>
        {MOCK_LEADERS.map((player) => (
          <View key={player.rank} style={styles.playerRow}>
            <Text style={styles.playerRank}>
              {player.rank <= 3 ? RANK_LABELS[player.rank - 1] : `#${player.rank}`}
            </Text>
            <View style={styles.playerAvatar}>
              <Text style={styles.playerAvatarText}>
                {player.name.slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerMeta}>
                Lvl {player.level} • {player.streak > 0 ? `🔥 ${player.streak} day streak` : '💀 No streak'}
              </Text>
            </View>
            <Text style={[styles.playerXP, player.rank <= 3 && { color: RANK_COLORS[player.rank - 1] }]}>
              {player.xp.toLocaleString()} XP
            </Text>
          </View>
        ))}
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>🔗 Live onchain rankings coming soon</Text>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050A14' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(125,239,251,0.1)',
  },
  backBtn: { fontSize: 14, color: '#7DEFFB', width: 60 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#7DEFFB', textAlign: 'center' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center' },
  podium: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center',
    paddingHorizontal: 20, paddingVertical: 16, gap: 8,
  },
  podiumItem: { alignItems: 'center', flex: 1 },
  podiumFirst: { marginBottom: 0 },
  podiumSecond: { marginBottom: -16 },
  podiumThird: { marginBottom: -24 },
  crownEmoji: { fontSize: 20 },
  podiumEmoji: { fontSize: 28, marginBottom: 4 },
  podiumName: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 6, fontWeight: '600' },
  podiumNameFirst: { color: '#FFD700', fontWeight: '800' },
  podiumBar: { width: '100%', borderRadius: 8, alignItems: 'center', paddingVertical: 8 },
  podiumBar1: { backgroundColor: 'rgba(255,215,0,0.15)', borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)', height: 80 },
  podiumBar2: { backgroundColor: 'rgba(192,192,192,0.1)', borderWidth: 1, borderColor: 'rgba(192,192,192,0.2)', height: 60 },
  podiumBar3: { backgroundColor: 'rgba(205,127,50,0.1)', borderWidth: 1, borderColor: 'rgba(205,127,50,0.2)', height: 48 },
  podiumXP: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '700' },
  yourRank: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: 'rgba(125,239,251,0.06)', borderRadius: 16,
    padding: 14, borderWidth: 1, borderColor: 'rgba(125,239,251,0.2)',
  },
  yourRankLabel: { fontSize: 10, color: '#7DEFFB', fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  yourRankRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
  yourRankNum: { fontSize: 24, fontWeight: '900', color: '#7DEFFB', width: 48 },
  yourRankInfo: { flex: 1 },
  yourRankName: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  yourRankSub: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  yourRankXP: { fontSize: 16, fontWeight: '800', color: '#14F195' },
  yourRankHint: { fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center' },
  scroll: { flex: 1, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: 'rgba(255,255,255,0.5)', marginBottom: 10, letterSpacing: 0.5 },
  playerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14,
    padding: 12, marginBottom: 8, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  playerRank: { fontSize: 18, width: 32, textAlign: 'center' },
  playerAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(125,239,251,0.1)', borderWidth: 1,
    borderColor: 'rgba(125,239,251,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  playerAvatarText: { fontSize: 16, fontWeight: '800', color: '#7DEFFB' },
  playerInfo: { flex: 1 },
  playerName: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  playerMeta: { fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 },
  playerXP: { fontSize: 13, fontWeight: '800', color: 'rgba(255,255,255,0.5)' },
  comingSoon: {
    alignItems: 'center', padding: 16,
    backgroundColor: 'rgba(125,239,251,0.03)', borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(125,239,251,0.08)', marginTop: 8,
  },
  comingSoonText: { fontSize: 12, color: 'rgba(255,255,255,0.3)' },
});