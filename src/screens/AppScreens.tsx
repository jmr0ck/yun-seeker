/**
 * Yun-seeker App Screens
 * 16-bit JRPG Style (Chrono Trigger vibe)
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ImageBackground } from 'react-native';
import { COLORS, DEFAULT_QUESTIONS } from '../app/constants';
import type { Profile, ReadingResult } from '../app/types';
import type { AppLanguage } from '../app/i18n';
import { PIXEL_COLORS, PIXEL_FONTS } from '../lib/pixelUI';

// Import pixel art assets
const PIXEL_ASSETS = {
  sageNPC: require('../../assets/pixel_art/sage_npc.png'),
  dragonSpirit: require('../../assets/pixel_art/dragon_spirit.png'),
  turtleCompanion: require('../../assets/pixel_art/turtle_companion.png'),
  dialogueBox: require('../../assets/pixel_art/dialogue_box.png'),
  mainMenuBg: require('../../assets/pixel_art/main_menu_bg.png'),
};

type TDict = { [k: string]: string };

function toLocaleTag(lang: AppLanguage): string {
  const map: Record<AppLanguage, string> = {
    en: 'en-US', 'zh-HK': 'zh-HK', 'zh-CN': 'zh-CN', ja: 'ja-JP', ko: 'ko-KR', es: 'es-ES',
  };
  return map[lang] || 'en-US';
}

function formatLocalDate(iso: string, lang: AppLanguage): string {
  try {
    return new Date(iso).toLocaleDateString(toLocaleTag(lang), { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return new Date(iso).toLocaleDateString(); }
}

function localizeQuestionLabel(label: string, lang: AppLanguage): string {
  const map: Record<string, Record<AppLanguage, string>> = {
    'Love outlook': { en: 'Love outlook', 'zh-HK': '感情走勢', 'zh-CN': '感情走势', ja: '恋愛運', ko: '연애 운세', es: 'Panorama amoroso' },
    'Career momentum': { en: 'Career momentum', 'zh-HK': '事業動能', 'zh-CN': '事业动能', ja: 'キャリア運', ko: '커리어 흐름', es: 'Impulso profesional' },
    'Money/finance timing': { en: 'Money/finance timing', 'zh-HK': '財運時機', 'zh-CN': '财运时机', ja: '金運タイミング', ko: '재정 타이밍', es: 'Momento financiero' },
    'Lucky numbers': { en: 'Lucky numbers', 'zh-HK': '幸運數字', 'zh-CN': '幸运数字', ja: 'ラッキーナンバー', ko: '행운의 숫자', es: 'Números de la suerte' },
    'General decision': { en: 'General decision', 'zh-HK': '綜合決策', 'zh-CN': '综合决策', ja: '意思決定', ko: '종합 의사결정', es: 'Decisión general' },
  };
  return map[label]?.[lang] || label;
}

// Reusable Pixel Button
function PixelBtn({ text, onPress, variant = 'gold', disabled = false }: { text: string; onPress: () => void; variant?: 'gold' | 'blue' | 'green' | 'red'; disabled?: boolean }) {
  const colors = {
    gold: { bg: PIXEL_COLORS.gold, text: PIXEL_COLORS.darkBlack, border: PIXEL_COLORS.darkGold },
    blue: { bg: PIXEL_COLORS.blue, text: PIXEL_COLORS.white, border: PIXEL_COLORS.darkBlue },
    green: { bg: PIXEL_COLORS.green, text: PIXEL_COLORS.white, border: PIXEL_COLORS.darkGreen },
    red: { bg: PIXEL_COLORS.red, text: PIXEL_COLORS.white, border: PIXEL_COLORS.darkRed },
  }[variant];
  return (
    <TouchableOpacity style={[styles.pixelBtn, { backgroundColor: colors.bg, borderColor: colors.border }, disabled && styles.pixelBtnDisabled]} onPress={onPress} disabled={disabled}>
      <Text style={[styles.pixelBtnText, { color: colors.text }]}>{text}</Text>
    </TouchableOpacity>
  );
}

// Reusable Pixel Card
function PixelCard({ title, children, onPress }: { title: string; children: React.ReactNode; onPress?: () => void }) {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container style={styles.pixelCard} onPress={onPress}>
      <View style={styles.pixelCardHeader}><Text style={styles.pixelCardTitle}>{title}</Text></View>
      <View style={styles.pixelCardContent}>{children}</View>
    </Container>
  );
}

// Input field with pixel styling
function PixelInput({ value, onChangeText, placeholder, multiline = false }: { value: string; onChangeText: (v: string) => void; placeholder?: string; multiline?: boolean }) {
  return (
    <TextInput
      style={[styles.pixelInput, multiline && styles.pixelInputMultiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={PIXEL_COLORS.muted}
      multiline={multiline}
    />
  );
}

// ===== SCREENS =====

export function WelcomeScreen({ onStart, t }: { onStart: () => void; t: TDict }) {
  return (
    <View style={styles.welcomeContainer}>
      <Image source={PIXEL_ASSETS.sageNPC} style={styles.welcomeAvatar} />
      <Text style={styles.welcomeTitle}>運</Text>
      <Text style={styles.welcomeSubtitle}>{t.welcomeSubtitle}</Text>
      <View style={styles.dialogueBox}>
        <Text style={styles.dialogueText}>"Your destiny awaits. Shall we begin?"</Text>
      </View>
      <PixelBtn text={t.getStarted} onPress={onStart} variant="gold" />
    </View>
  );
}

export function AuthScreen({ email, setEmail, onContinue, t }: { email: string; setEmail: (v: string) => void; onContinue: () => void; t: TDict }) {
  return (
    <ScrollView contentContainerStyle={styles.screenContainer}>
      <Image source={PIXEL_ASSETS.dragonSpirit} style={styles.screenAvatar} />
      <Text style={styles.screenTitle}>{t.authTitle}</Text>
      <Text style={styles.screenSubtitle}>{t.authSubtitle}</Text>
      <PixelInput value={email} onChangeText={setEmail} placeholder="your@email.com" />
      <PixelBtn text={t.continue} onPress={onContinue} variant="blue" />
    </ScrollView>
  );
}

export function WalletScreen({ onConnect, onFallback, t }: { onConnect: () => void; onFallback: () => void; t: TDict }) {
  return (
    <View style={styles.welcomeContainer}>
      <Image source={PIXEL_ASSETS.turtleCompanion} style={styles.welcomeAvatar} />
      <Text style={styles.screenTitle}>{t.walletTitle}</Text>
      <Text style={styles.screenSubtitle}>{t.walletSubtitle}</Text>
      <View style={styles.dialogueBox}>
        <Text style={styles.dialogueText}>"Connect your Seeker wallet to unlock ancient wisdom."</Text>
      </View>
      <PixelBtn text={t.connectSeeker} onPress={onConnect} variant="gold" />
      <PixelBtn text={t.walletFallback} onPress={onFallback} variant="blue" />
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
    <ScrollView contentContainerStyle={styles.screenContainer}>
      <Text style={styles.screenTitle}>{t.profileSetup}</Text>
      <Image source={PIXEL_ASSETS.sageNPC} style={styles.screenAvatar} />
      
      <Text style={styles.fieldLabel}>{t.birthDateLabel}</Text>
      <PixelInput value={birthDate} onChangeText={setBirthDate} placeholder="1993/06/07" />
      
      <Text style={styles.fieldLabel}>{t.birthTimeLabel}</Text>
      <PixelInput value={birthTime} onChangeText={setBirthTime} placeholder="08:30 AM" />
      
      <Text style={styles.fieldLabel}>{t.birthPlaceLabel}</Text>
      <PixelInput value={birthPlace} onChangeText={setBirthPlace} placeholder="Hong Kong, China" />
      
      <Text style={styles.fieldLabel}>{t.currentLocationLabel}</Text>
      <PixelInput value={currentLocation} onChangeText={setCurrentLocation} placeholder="New York, USA" />
      
      <PixelBtn text={t.reviewProfile} onPress={onReview} variant="gold" />
    </ScrollView>
  );
}

export function ProfileConfirmScreen({ profile, onConfirm, onEdit, t }: { profile: Profile; onConfirm: () => void; onEdit: () => void; t: TDict }) {
  return (
    <ScrollView contentContainerStyle={styles.screenContainer}>
      <Text style={styles.screenTitle}>{t.confirmProfile}</Text>
      <View style={styles.dialogueBox}>
        <Text style={styles.dialogueText}>"Is this the correct alignment of your stars?"</Text>
      </View>
      
      <PixelCard title={t.parsedProfile}>
        <Text style={styles.cardText}>{t.date}: {profile.birthDate}</Text>
        <Text style={styles.cardText}>{t.time}: {profile.birthTime.toUpperCase()}</Text>
        <Text style={styles.cardText}>{t.birthPlace}: {profile.birthPlace}</Text>
        <Text style={styles.cardText}>{t.currentLocation}: {profile.currentLocation || '-'}</Text>
        <Text style={styles.cardText}>{t.timezone}: {profile.timezone}</Text>
      </PixelCard>
      
      <PixelBtn text={t.confirmSave} onPress={onConfirm} variant="gold" />
      <PixelBtn text={t.edit} onPress={onEdit} variant="blue" />
    </ScrollView>
  );
}

export function DashboardScreen({ profile, history, onAsk, onEdit, onOpenHistory, t, language }: { profile: Profile; history: ReadingResult[]; onAsk: () => void; onEdit: () => void; onOpenHistory: (r: ReadingResult) => void; t: TDict; language: AppLanguage }) {
  return (
    <ScrollView contentContainerStyle={styles.screenContainer}>
      <Text style={styles.screenTitle}>{t.dashboardTitle}</Text>
      
      <PixelCard title={t.storedProfile}>
        <Text style={styles.cardText}>{t.date}: {profile.birthDate || '-'}</Text>
        <Text style={styles.cardText}>{t.time}: {profile.birthTime || '-'}</Text>
        <Text style={styles.cardText}>{t.birthPlace}: {profile.birthPlace || '-'}</Text>
        <Text style={styles.cardText}>{t.currentLocation}: {profile.currentLocation || '-'}</Text>
        <Text style={styles.cardText}>{t.timezone}: {profile.timezone || '-'}</Text>
      </PixelCard>
      
      <PixelBtn text={t.askQuestion} onPress={onAsk} variant="gold" />
      <PixelBtn text={t.editProfile} onPress={onEdit} variant="blue" />
      
      <PixelCard title={t.recentReports}>
        {history.length === 0 ? (
          <Text style={styles.mutedText}>{t.noReports}</Text>
        ) : (
          history.slice(0, 8).map((r, i) => (
            <TouchableOpacity key={`${r.askedAt}-${i}`} style={styles.historyItem} onPress={() => onOpenHistory(r)}>
              <Text style={styles.cardText}>★ {r.title}</Text>
              <Text style={styles.mutedText}>{formatLocalDate(r.askedAt, language)}</Text>
            </TouchableOpacity>
          ))
        )}
      </PixelCard>
    </ScrollView>
  );
}

export function QuestionsScreen({ selectedQuestion, setSelectedQuestion, customQuestion, setCustomQuestion, onGenerate, t, language }: { selectedQuestion: string; setSelectedQuestion: (v: string) => void; customQuestion: string; setCustomQuestion: (v: string) => void; onGenerate: () => void; t: TDict; language: AppLanguage }) {
  return (
    <ScrollView contentContainerStyle={styles.screenContainer}>
      <Text style={styles.screenTitle}>{t.questionsTitle}</Text>
      <Image source={PIXEL_ASSETS.dragonSpirit} style={styles.screenAvatar} />
      
      {DEFAULT_QUESTIONS.map((q) => (
        <TouchableOpacity
          key={q.label}
          style={[styles.optionItem, selectedQuestion === q.value && styles.optionActive]}
          onPress={() => { setSelectedQuestion(q.value); setCustomQuestion(''); }}
        >
          <Text style={[styles.optionText, selectedQuestion === q.value && styles.optionTextActive]}>
            ♦ {localizeQuestionLabel(q.label, language)}
          </Text>
        </TouchableOpacity>
      ))}
      
      <Text style={styles.fieldLabel}>{t.customQuestion}</Text>
      <PixelInput value={customQuestion} onChangeText={(v) => { setCustomQuestion(v); if (v.trim()) setSelectedQuestion(''); }} placeholder={t.customQuestionPlaceholder} multiline />
      
      <PixelBtn text={t.generateReport} onPress={onGenerate} variant="gold" />
    </ScrollView>
  );
}

export function ReadingScreen({ reading, onShare, onAskAgain, onBack, t, language }: { reading: ReadingResult | null; onShare: () => void; onAskAgain: () => void; onBack: () => void; t: TDict; language: AppLanguage }) {
  const confidenceLabel = reading?.confidence === 'High' ? t.confidenceHigh : reading?.confidence === 'Low' ? t.confidenceLow : t.confidenceMedium;
  const confidenceColor = reading?.confidence === 'High' ? PIXEL_COLORS.green : reading?.confidence === 'Low' ? PIXEL_COLORS.red : PIXEL_COLORS.gold;
  
  return (
    <ScrollView contentContainerStyle={styles.screenContainer}>
      <Text style={styles.screenTitle}>{t.yourReport}</Text>
      
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>{reading?.title}</Text>
        <Text style={styles.mutedText}>{t.qPrefix}: {reading?.question}</Text>
        <Text style={styles.mutedText}>{t.date}: {reading?.askedAt ? formatLocalDate(reading.askedAt, language) : '-'}</Text>
        <Text style={styles.summaryText}>{reading?.summary || t.noSummary}</Text>
        
        <View style={styles.chipRow}>
          <View style={styles.chip}><Text style={styles.chipText}>{t.focus}: {reading?.focus}</Text></View>
          <View style={[styles.chip, { borderColor: confidenceColor }]}><Text style={[styles.chipText, { color: confidenceColor }]}>{t.confidence}: {confidenceLabel}</Text></View>
        </View>
      </View>
      
      <PixelCard title={t.keyHighlights}>
        {(reading?.highlights || []).map((h, idx) => <Text key={idx} style={styles.cardText}>◆ {h}</Text>)}
      </PixelCard>
      
      <PixelCard title={t.actionPlan}>
        {((reading?.data?.actionPlan as string[]) || []).map((a, i) => <Text key={`a-${i}`} style={styles.cardText}>➤ {a}</Text>)}
      </PixelCard>
      
      <PixelCard title={t.riskWatch}>
        {((reading?.data?.risks as string[]) || []).map((r, i) => <Text key={`r-${i}`} style={styles.cardText}>⚠ {r}</Text>)}
      </PixelCard>
      
      <PixelCard title={t.timingWindows}>
        {((reading?.data?.timing as string[]) || []).map((w, i) => <Text key={`w-${i}`} style={styles.cardText}>⏰ {w}</Text>)}
      </PixelCard>
      
      <PixelBtn text={t.shareExport} onPress={onShare} variant="gold" />
      <PixelBtn text={t.askAnother} onPress={onAskAgain} variant="blue" />
      <PixelBtn text={t.backDashboard} onPress={onBack} variant="green" />
    </ScrollView>
  );
}

// ===== STYLES (16-bit JRPG) =====

const styles = StyleSheet.create({
  // Containers
  welcomeContainer: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: PIXEL_COLORS.darkBlack },
  screenContainer: { padding: 18, backgroundColor: PIXEL_COLORS.darkBlack },
  
  // Titles
  welcomeTitle: { fontSize: 56, color: PIXEL_COLORS.gold, fontWeight: 'bold', textShadowColor: PIXEL_COLORS.darkGold, textShadowOffset: { width: 3, height: 3 }, marginBottom: 8 },
  welcomeSubtitle: { fontSize: 16, color: PIXEL_COLORS.cream, marginBottom: 20, textAlign: 'center' },
  screenTitle: { fontSize: 28, color: PIXEL_COLORS.gold, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, textShadowColor: PIXEL_COLORS.darkGold, textShadowOffset: { width: 2, height: 2 } },
  screenSubtitle: { fontSize: 14, color: PIXEL_COLORS.cream, marginBottom: 20, textAlign: 'center' },
  
  // Avatars
  welcomeAvatar: { width: 120, height: 120, resizeMode: 'contain', marginBottom: 16 },
  screenAvatar: { width: 80, height: 80, resizeMode: 'contain', alignSelf: 'center', marginBottom: 16 },
  
  // Dialogue Box
  dialogueBox: { backgroundColor: PIXEL_COLORS.black, borderWidth: 3, borderColor: PIXEL_COLORS.gold, borderRadius: 8, padding: 12, marginBottom: 20, width: '100%' },
  dialogueText: { color: PIXEL_COLORS.cream, fontSize: 14, fontStyle: 'italic', textAlign: 'center', lineHeight: 22 },
  
  // Buttons
  pixelBtn: { paddingVertical: 14, paddingHorizontal: 24, borderWidth: 3, borderColor: PIXEL_COLORS.darkBlack, borderRadius: 4, marginVertical: 6, alignItems: 'center', width: '100%' },
  pixelBtnDisabled: { opacity: 0.5 },
  pixelBtnText: { fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  
  // Inputs
  fieldLabel: { color: PIXEL_COLORS.gold, fontSize: 12, fontWeight: 'bold', marginBottom: 4, marginTop: 12, textTransform: 'uppercase' },
  pixelInput: { backgroundColor: PIXEL_COLORS.black, borderWidth: 2, borderColor: PIXEL_COLORS.gold, borderRadius: 4, color: PIXEL_COLORS.cream, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, marginBottom: 8 },
  pixelInputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  
  // Cards
  pixelCard: { backgroundColor: PIXEL_COLORS.black, borderWidth: 2, borderColor: PIXEL_COLORS.gold, borderRadius: 8, marginVertical: 10, overflow: 'hidden' },
  pixelCardHeader: { backgroundColor: PIXEL_COLORS.darkGold, paddingVertical: 8, paddingHorizontal: 12 },
  pixelCardTitle: { color: PIXEL_COLORS.darkBlack, fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
  pixelCardContent: { padding: 12 },
  cardText: { color: PIXEL_COLORS.cream, fontSize: 13, lineHeight: 20, marginBottom: 4 },
  mutedText: { color: PIXEL_COLORS.muted, fontSize: 12 },
  
  // Hero Card
  heroCard: { backgroundColor: PIXEL_COLORS.darkBlue, borderWidth: 3, borderColor: PIXEL_COLORS.gold, borderRadius: 8, padding: 16, marginVertical: 10 },
  heroTitle: { color: PIXEL_COLORS.gold, fontWeight: 'bold', fontSize: 20, marginBottom: 8, textShadowColor: PIXEL_COLORS.darkGold, textShadowOffset: { width: 1, height: 1 } },
  summaryText: { color: PIXEL_COLORS.cream, fontSize: 14, lineHeight: 22, marginTop: 12 },
  
  // Chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  chip: { backgroundColor: PIXEL_COLORS.darkBlack, borderWidth: 1, borderColor: PIXEL_COLORS.gold, borderRadius: 4, paddingVertical: 4, paddingHorizontal: 10, marginRight: 8, marginBottom: 4 },
  chipText: { color: PIXEL_COLORS.gold, fontSize: 11, fontWeight: 'bold' },
  
  // Options
  optionItem: { backgroundColor: PIXEL_COLORS.black, borderWidth: 2, borderColor: PIXEL_COLORS.darkGold, borderRadius: 4, padding: 12, marginBottom: 8 },
  optionActive: { borderColor: PIXEL_COLORS.gold, backgroundColor: PIXEL_COLORS.darkGold },
  optionText: { color: PIXEL_COLORS.cream, fontSize: 14 },
  optionTextActive: { color: PIXEL_COLORS.darkBlack, fontWeight: 'bold' },
  
  // History
  historyItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: PIXEL_COLORS.darkGold },
});
