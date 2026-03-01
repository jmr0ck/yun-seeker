import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS, DEFAULT_QUESTIONS } from '../app/constants';
import type { Profile, ReadingResult } from '../app/types';
import type { AppLanguage } from '../app/i18n';

type TDict = {
  [k: string]: string;
};

function toLocaleTag(lang: AppLanguage) {
  const map: Record<AppLanguage, string> = {
    en: 'en-US',
    'zh-HK': 'zh-HK',
    'zh-CN': 'zh-CN',
    ja: 'ja-JP',
    ko: 'ko-KR',
    es: 'es-ES',
  };
  return map[lang] || 'en-US';
}

function formatLocalDate(iso: string, lang: AppLanguage) {
  try {
    return new Date(iso).toLocaleDateString(toLocaleTag(lang), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return new Date(iso).toLocaleDateString();
  }
}

function localizeQuestionLabel(label: string, lang: AppLanguage) {
  const map: Record<string, Record<AppLanguage, string>> = {
    'Love outlook': {
      en: 'Love outlook', 'zh-HK': '感情走勢', 'zh-CN': '感情走势', ja: '恋愛運', ko: '연애 운세', es: 'Panorama amoroso',
    },
    'Career momentum': {
      en: 'Career momentum', 'zh-HK': '事業動能', 'zh-CN': '事业动能', ja: 'キャリア運', ko: '커리어 흐름', es: 'Impulso profesional',
    },
    'Money/finance timing': {
      en: 'Money/finance timing', 'zh-HK': '財運時機', 'zh-CN': '财运时机', ja: '金運タイミング', ko: '재정 타이밍', es: 'Momento financiero',
    },
    'Lucky numbers': {
      en: 'Lucky numbers', 'zh-HK': '幸運數字', 'zh-CN': '幸运数字', ja: 'ラッキーナンバー', ko: '행운의 숫자', es: 'Números de la suerte',
    },
    'General decision': {
      en: 'General decision', 'zh-HK': '綜合決策', 'zh-CN': '综合决策', ja: '意思決定', ko: '종합 의사결정', es: 'Decisión general',
    },
  };
  return map[label]?.[lang] || label;
}

export function WelcomeScreen({ onStart, t }: { onStart: () => void; t: TDict }) {
  return (
    <View style={styles.centerCard}>
      <Text style={styles.h1}>{t.welcomeTitle}</Text>
      <Text style={styles.sub}>{t.welcomeSubtitle}</Text>
      <TouchableOpacity style={styles.btn} onPress={onStart}><Text style={styles.btnText}>{t.getStarted}</Text></TouchableOpacity>
    </View>
  );
}

export function AuthScreen({ email, setEmail, onContinue, t }: { email: string; setEmail: (v: string) => void; onContinue: () => void; t: TDict }) {
  return (
    <View style={styles.centerCard}>
      <Text style={styles.h1}>{t.authTitle}</Text>
      <Text style={styles.sub}>{t.authSubtitle}</Text>
      <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor={COLORS.muted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TouchableOpacity style={styles.btn} onPress={onContinue}><Text style={styles.btnText}>{t.continue}</Text></TouchableOpacity>
    </View>
  );
}

export function WalletScreen({ onConnect, onFallback, t }: { onConnect: () => void; onFallback: () => void; t: TDict }) {
  return (
    <View style={styles.centerCard}>
      <Text style={styles.h1}>{t.walletTitle}</Text>
      <Text style={styles.sub}>{t.walletSubtitle}</Text>
      <TouchableOpacity style={styles.btn} onPress={onConnect}><Text style={styles.btnText}>{t.connectSeeker}</Text></TouchableOpacity>
      <TouchableOpacity style={styles.btnGhost} onPress={onFallback}><Text style={styles.btnGhostText}>{t.walletFallback}</Text></TouchableOpacity>
    </View>
  );
}

export function ProfileScreen(props: {
  birthDate: string; setBirthDate: (v: string) => void;
  birthTime: string; setBirthTime: (v: string) => void;
  birthPlace: string; setBirthPlace: (v: string) => void;
  currentLocation: string; setCurrentLocation: (v: string) => void;
  onReview: () => void;
  t: TDict;
}) {
  const { birthDate, setBirthDate, birthTime, setBirthTime, birthPlace, setBirthPlace, currentLocation, setCurrentLocation, onReview, t } = props;
  return (
    <ScrollView contentContainerStyle={styles.scrollCard}>
      <Text style={styles.h1}>{t.profileSetup}</Text>
      <Text style={styles.label}>{t.birthDateLabel}</Text>
      <TextInput style={styles.input} value={birthDate} onChangeText={setBirthDate} placeholder="1993/06/07" placeholderTextColor={COLORS.muted} />
      <Text style={styles.label}>{t.birthTimeLabel}</Text>
      <TextInput style={styles.input} value={birthTime} onChangeText={setBirthTime} placeholder="08:30 AM" placeholderTextColor={COLORS.muted} autoCapitalize="characters" />
      <Text style={styles.label}>{t.birthPlaceLabel}</Text>
      <TextInput style={styles.input} value={birthPlace} onChangeText={setBirthPlace} placeholder="Hong Kong, China" placeholderTextColor={COLORS.muted} />
      <Text style={styles.label}>{t.currentLocationLabel}</Text>
      <TextInput style={styles.input} value={currentLocation} onChangeText={setCurrentLocation} placeholder="New York, USA" placeholderTextColor={COLORS.muted} />
      <TouchableOpacity style={styles.btn} onPress={onReview}><Text style={styles.btnText}>{t.reviewProfile}</Text></TouchableOpacity>
    </ScrollView>
  );
}

export function ProfileConfirmScreen({ profile, onConfirm, onEdit, t }: { profile: Profile; onConfirm: () => void; onEdit: () => void; t: TDict }) {
  return (
    <View style={styles.centerCard}>
      <Text style={styles.h1}>{t.confirmProfile}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.parsedProfile}</Text>
        <Text style={styles.text}>{t.date}: {profile.birthDate}</Text>
        <Text style={styles.text}>{t.time}: {profile.birthTime.toUpperCase()}</Text>
        <Text style={styles.text}>{t.birthPlace}: {profile.birthPlace}</Text>
        <Text style={styles.text}>{t.currentLocation}: {profile.currentLocation || '-'}</Text>
        <Text style={styles.text}>{t.timezone}: {profile.timezone}</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={onConfirm}><Text style={styles.btnText}>{t.confirmSave}</Text></TouchableOpacity>
      <TouchableOpacity style={styles.btnGhost} onPress={onEdit}><Text style={styles.btnGhostText}>{t.edit}</Text></TouchableOpacity>
    </View>
  );
}

export function DashboardScreen({ profile, history, onAsk, onEdit, onOpenHistory, t, language }: { profile: Profile; history: ReadingResult[]; onAsk: () => void; onEdit: () => void; onOpenHistory: (r: ReadingResult) => void; t: TDict; language: AppLanguage }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollCard}>
      <Text style={styles.h1}>{t.dashboardTitle}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.storedProfile}</Text>
        <Text style={styles.text}>{t.date}: {profile.birthDate || '-'}</Text>
        <Text style={styles.text}>{t.time}: {profile.birthTime || '-'}</Text>
        <Text style={styles.text}>{t.birthPlace}: {profile.birthPlace || '-'}</Text>
        <Text style={styles.text}>{t.currentLocation}: {profile.currentLocation || '-'}</Text>
        <Text style={styles.text}>{t.timezone}: {profile.timezone || '-'}</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={onAsk}><Text style={styles.btnText}>{t.askQuestion}</Text></TouchableOpacity>
      <TouchableOpacity style={styles.btnGhost} onPress={onEdit}><Text style={styles.btnGhostText}>{t.editProfile}</Text></TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.recentReports}</Text>
        {history.length === 0 ? <Text style={styles.muted}>{t.noReports}</Text> : history.slice(0, 8).map((r, i) => (
          <TouchableOpacity key={`${r.askedAt}-${i}`} style={styles.historyItem} onPress={() => onOpenHistory(r)}>
            <View style={styles.rowBetween}>
              <Text style={styles.text}>• {r.title}</Text>
              <Text style={styles.muted}>{formatLocalDate(r.askedAt, language)}</Text>
            </View>
            <Text style={styles.muted} numberOfLines={1}>{t.qPrefix}: {r.question}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

export function QuestionsScreen({ selectedQuestion, setSelectedQuestion, customQuestion, setCustomQuestion, onGenerate, t, language }: { selectedQuestion: string; setSelectedQuestion: (v: string) => void; customQuestion: string; setCustomQuestion: (v: string) => void; onGenerate: () => void; t: TDict; language: AppLanguage }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollCard}>
      <Text style={styles.h1}>{t.questionsTitle}</Text>
      {DEFAULT_QUESTIONS.map((q) => (
        <TouchableOpacity key={q.label} style={[styles.option, selectedQuestion === q.value && styles.optionActive]} onPress={() => { setSelectedQuestion(q.value); setCustomQuestion(''); }}>
          <Text style={styles.text}>{localizeQuestionLabel(q.label, language)}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.label}>{t.customQuestion}</Text>
      <TextInput style={[styles.input, { minHeight: 84, textAlignVertical: 'top' }]} multiline value={customQuestion} onChangeText={(v) => { setCustomQuestion(v); if (v.trim()) setSelectedQuestion(''); }} placeholder={t.customQuestionPlaceholder} placeholderTextColor={COLORS.muted} />
      <TouchableOpacity style={styles.btn} onPress={onGenerate}><Text style={styles.btnText}>{t.generateReport}</Text></TouchableOpacity>
    </ScrollView>
  );
}

export function ReadingScreen({ reading, onShare, onAskAgain, onBack, t, language }: { reading: ReadingResult | null; onShare: () => void; onAskAgain: () => void; onBack: () => void; t: TDict; language: AppLanguage }) {
  const confidenceLabel = reading?.confidence === 'High'
    ? t.confidenceHigh
    : reading?.confidence === 'Low'
      ? t.confidenceLow
      : t.confidenceMedium;

  return (
    <ScrollView contentContainerStyle={styles.scrollCard}>
      <Text style={styles.h1}>{t.yourReport}</Text>
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>{reading?.title}</Text>
        <Text style={styles.muted}>{t.qPrefix}: {reading?.question}</Text>
        <Text style={styles.muted}>{t.date}: {reading?.askedAt ? formatLocalDate(reading.askedAt, language) : '-'}</Text>
        <Text style={styles.summary}>{reading?.summary || t.noSummary}</Text>
        <View style={styles.rowWrap}>
          <Text style={styles.chip}>{t.focus}: {reading?.focus}</Text>
          <Text style={[styles.chip, reading?.confidence === 'High' ? styles.chipOk : reading?.confidence === 'Low' ? styles.chipWarn : null]}>{t.confidence}: {confidenceLabel}</Text>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.keyHighlights}</Text>
        {(reading?.highlights || []).map((h, idx) => <Text key={idx} style={styles.text}>• {h}</Text>)}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.actionPlan}</Text>
        {((reading?.data?.actionPlan as string[]) || []).map((a, i) => <Text key={`a-${i}`} style={styles.text}>• {a}</Text>)}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.riskWatch}</Text>
        {((reading?.data?.risks as string[]) || []).map((r, i) => <Text key={`r-${i}`} style={styles.text}>• {r}</Text>)}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.timingWindows}</Text>
        {((reading?.data?.timing as string[]) || []).map((w, i) => <Text key={`w-${i}`} style={styles.text}>• {w}</Text>)}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.evidence}</Text>
        <Text style={styles.text}>{t.howDerived}</Text>
        {((reading?.data?.reasoning as string[]) || []).map((r, i) => <Text key={`reason-${i}`} style={styles.text}>• {r}</Text>)}
        <Text style={[styles.text, { marginTop: 8 }]}>{t.citations}</Text>
        {((reading?.data?.citations as string[]) || []).map((c, i) => <Text key={`cit-${i}`} style={styles.text}>• {c}</Text>)}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.detailedOutput}</Text>
        <Text style={styles.code}>{JSON.stringify(reading?.data ?? {}, null, 2)}</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={onShare}><Text style={styles.btnText}>{t.shareExport}</Text></TouchableOpacity>
      <TouchableOpacity style={styles.btnGhost} onPress={onAskAgain}><Text style={styles.btnGhostText}>{t.askAnother}</Text></TouchableOpacity>
      <TouchableOpacity style={styles.btnGhost} onPress={onBack}><Text style={styles.btnGhostText}>{t.backDashboard}</Text></TouchableOpacity>
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
