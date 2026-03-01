import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS, DEFAULT_QUESTIONS } from '../app/constants';
import type { Profile, ReadingResult } from '../app/types';

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <View style={styles.centerCard}>
      <Text style={styles.h1}>Welcome to yun-seeker</Text>
      <Text style={styles.sub}>Your destiny dashboard, powered by profile + Solana identity.</Text>
      <TouchableOpacity style={styles.btn} onPress={onStart}><Text style={styles.btnText}>Get Started</Text></TouchableOpacity>
    </View>
  );
}

export function AuthScreen({ email, setEmail, onContinue }: { email: string; setEmail: (v: string) => void; onContinue: () => void }) {
  return (
    <View style={styles.centerCard}>
      <Text style={styles.h1}>Sign In / Sign Up</Text>
      <Text style={styles.sub}>MVP auth gate (email) before wallet and profile setup.</Text>
      <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor={COLORS.muted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TouchableOpacity style={styles.btn} onPress={onContinue}><Text style={styles.btnText}>Continue</Text></TouchableOpacity>
    </View>
  );
}

export function WalletScreen({ onConnect, onFallback }: { onConnect: () => void; onFallback: () => void }) {
  return (
    <View style={styles.centerCard}>
      <Text style={styles.h1}>Connect SOL Wallet</Text>
      <Text style={styles.sub}>Primary path: Seeker built-in wallet.</Text>
      <TouchableOpacity style={styles.btn} onPress={onConnect}><Text style={styles.btnText}>Connect Seeker Wallet</Text></TouchableOpacity>
      <TouchableOpacity style={styles.btnGhost} onPress={onFallback}><Text style={styles.btnGhostText}>Other Wallets (Fallback)</Text></TouchableOpacity>
    </View>
  );
}

export function ProfileScreen(props: {
  birthDate: string; setBirthDate: (v: string) => void;
  birthTime: string; setBirthTime: (v: string) => void;
  birthPlace: string; setBirthPlace: (v: string) => void;
  currentLocation: string; setCurrentLocation: (v: string) => void;
  onReview: () => void;
}) {
  const { birthDate, setBirthDate, birthTime, setBirthTime, birthPlace, setBirthPlace, currentLocation, setCurrentLocation, onReview } = props;
  return (
    <ScrollView contentContainerStyle={styles.scrollCard}>
      <Text style={styles.h1}>Profile Setup</Text>
      <Text style={styles.label}>Birth Date (yyyy/mm/dd)</Text>
      <TextInput style={styles.input} value={birthDate} onChangeText={setBirthDate} placeholder="1993/06/07" placeholderTextColor={COLORS.muted} />
      <Text style={styles.label}>Birth Time (hh:mm AM/PM)</Text>
      <TextInput style={styles.input} value={birthTime} onChangeText={setBirthTime} placeholder="08:30 AM" placeholderTextColor={COLORS.muted} autoCapitalize="characters" />
      <Text style={styles.label}>Birth Place (City, Country)</Text>
      <TextInput style={styles.input} value={birthPlace} onChangeText={setBirthPlace} placeholder="Hong Kong, China" placeholderTextColor={COLORS.muted} />
      <Text style={styles.label}>Current Living Location (optional)</Text>
      <TextInput style={styles.input} value={currentLocation} onChangeText={setCurrentLocation} placeholder="New York, USA" placeholderTextColor={COLORS.muted} />
      <TouchableOpacity style={styles.btn} onPress={onReview}><Text style={styles.btnText}>Review Profile</Text></TouchableOpacity>
    </ScrollView>
  );
}

export function ProfileConfirmScreen({ profile, onConfirm, onEdit }: { profile: Profile; onConfirm: () => void; onEdit: () => void }) {
  return (
    <View style={styles.centerCard}>
      <Text style={styles.h1}>Confirm Profile</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Parsed Profile</Text>
        <Text style={styles.text}>Date: {profile.birthDate}</Text>
        <Text style={styles.text}>Time: {profile.birthTime.toUpperCase()}</Text>
        <Text style={styles.text}>Birth place: {profile.birthPlace}</Text>
        <Text style={styles.text}>Current location: {profile.currentLocation || '-'}</Text>
        <Text style={styles.text}>Timezone: {profile.timezone}</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={onConfirm}><Text style={styles.btnText}>Confirm & Save</Text></TouchableOpacity>
      <TouchableOpacity style={styles.btnGhost} onPress={onEdit}><Text style={styles.btnGhostText}>Edit</Text></TouchableOpacity>
    </View>
  );
}

export function DashboardScreen({ profile, history, onAsk, onEdit, onOpenHistory }: { profile: Profile; history: ReadingResult[]; onAsk: () => void; onEdit: () => void; onOpenHistory: (r: ReadingResult) => void }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollCard}>
      <Text style={styles.h1}>User Dashboard</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Stored Profile</Text>
        <Text style={styles.text}>Date: {profile.birthDate || '-'}</Text>
        <Text style={styles.text}>Time: {profile.birthTime || '-'}</Text>
        <Text style={styles.text}>Birth place: {profile.birthPlace || '-'}</Text>
        <Text style={styles.text}>Current location: {profile.currentLocation || '-'}</Text>
        <Text style={styles.text}>Timezone: {profile.timezone || '-'}</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={onAsk}><Text style={styles.btnText}>Ask a Question</Text></TouchableOpacity>
      <TouchableOpacity style={styles.btnGhost} onPress={onEdit}><Text style={styles.btnGhostText}>Edit Profile</Text></TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Reports</Text>
        {history.length === 0 ? <Text style={styles.muted}>No reports yet.</Text> : history.slice(0, 8).map((r, i) => (
          <TouchableOpacity key={`${r.askedAt}-${i}`} style={styles.historyItem} onPress={() => onOpenHistory(r)}>
            <View style={styles.rowBetween}>
              <Text style={styles.text}>• {r.title}</Text>
              <Text style={styles.muted}>{new Date(r.askedAt).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.muted} numberOfLines={1}>Q: {r.question}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

export function QuestionsScreen({ selectedQuestion, setSelectedQuestion, customQuestion, setCustomQuestion, onGenerate }: { selectedQuestion: string; setSelectedQuestion: (v: string) => void; customQuestion: string; setCustomQuestion: (v: string) => void; onGenerate: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollCard}>
      <Text style={styles.h1}>Ask a Question</Text>
      {DEFAULT_QUESTIONS.map((q) => (
        <TouchableOpacity key={q.label} style={[styles.option, selectedQuestion === q.value && styles.optionActive]} onPress={() => { setSelectedQuestion(q.value); setCustomQuestion(''); }}>
          <Text style={styles.text}>{q.label}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.label}>Custom question</Text>
      <TextInput style={[styles.input, { minHeight: 84, textAlignVertical: 'top' }]} multiline value={customQuestion} onChangeText={(t) => { setCustomQuestion(t); if (t.trim()) setSelectedQuestion(''); }} placeholder="e.g. Where will I meet my true love in March?" placeholderTextColor={COLORS.muted} />
      <TouchableOpacity style={styles.btn} onPress={onGenerate}><Text style={styles.btnText}>Generate Report</Text></TouchableOpacity>
    </ScrollView>
  );
}

export function ReadingScreen({ reading, onShare, onAskAgain, onBack }: { reading: ReadingResult | null; onShare: () => void; onAskAgain: () => void; onBack: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollCard}>
      <Text style={styles.h1}>Your Report</Text>
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>{reading?.title}</Text>
        <Text style={styles.muted}>Q: {reading?.question}</Text>
        <Text style={styles.summary}>{reading?.summary || 'No summary.'}</Text>
        <View style={styles.rowWrap}>
          <Text style={styles.chip}>Focus: {reading?.focus}</Text>
          <Text style={[styles.chip, reading?.confidence === 'High' ? styles.chipOk : reading?.confidence === 'Low' ? styles.chipWarn : null]}>Confidence: {reading?.confidence}</Text>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Key Highlights</Text>
        {(reading?.highlights || []).map((h, idx) => <Text key={idx} style={styles.text}>• {h}</Text>)}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Detailed Output</Text>
        <Text style={styles.code}>{JSON.stringify(reading?.data ?? {}, null, 2)}</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={onShare}><Text style={styles.btnText}>Share / Export Report</Text></TouchableOpacity>
      <TouchableOpacity style={styles.btnGhost} onPress={onAskAgain}><Text style={styles.btnGhostText}>Ask Another Question</Text></TouchableOpacity>
      <TouchableOpacity style={styles.btnGhost} onPress={onBack}><Text style={styles.btnGhostText}>Back to Dashboard</Text></TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerCard: { flex: 1, padding: 20, justifyContent: 'center' },
  scrollCard: { padding: 18, gap: 10 },
  h1: { color: COLORS.text, fontSize: 24, fontWeight: '800', marginBottom: 8 },
  sub: { color: COLORS.muted, fontSize: 14, marginBottom: 16 },
  btn: { backgroundColor: COLORS.accent, paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  btnText: { color: '#1a1d33', fontWeight: '800', fontSize: 15 },
  btnGhost: { borderColor: '#3a4066', borderWidth: 1, paddingVertical: 13, borderRadius: 10, alignItems: 'center', marginBottom: 8 },
  btnGhostText: { color: COLORS.text, fontWeight: '700' },
  label: { color: COLORS.text, marginBottom: 6, marginTop: 10, fontSize: 13, fontWeight: '700' },
  input: { backgroundColor: COLORS.card, borderColor: '#3a4066', borderWidth: 1, borderRadius: 10, color: COLORS.text, paddingHorizontal: 12, paddingVertical: 12 },
  card: { backgroundColor: COLORS.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#2e3458', marginBottom: 10 },
  heroCard: { backgroundColor: '#202644', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#3a4066', marginBottom: 10 },
  heroTitle: { color: COLORS.accent, fontWeight: '900', fontSize: 18, marginBottom: 6 },
  summary: { color: COLORS.text, fontSize: 14, lineHeight: 22, marginTop: 8 },
  cardTitle: { color: COLORS.accent, fontWeight: '800', marginBottom: 8 },
  text: { color: COLORS.text, fontSize: 13, lineHeight: 20 },
  muted: { color: COLORS.muted, fontSize: 12 },
  code: { color: '#ced2f8', fontSize: 11, lineHeight: 16, fontFamily: 'monospace' },
  option: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: '#2e3458', borderRadius: 10, padding: 12, marginBottom: 8 },
  optionActive: { borderColor: COLORS.accent },
  chip: { color: COLORS.text, backgroundColor: COLORS.chip, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10, fontSize: 11, marginRight: 8, marginTop: 8 },
  chipOk: { backgroundColor: '#1f4a33' },
  chipWarn: { backgroundColor: '#5a2f27' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  historyItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2e3458' },
});
