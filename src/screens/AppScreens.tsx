/**
 * Yun-seeker App Screens
 * Full JRPG Style - Chrono Trigger / FF6 Inspired
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ImageBackground, Animated } from 'react-native';
import { COLORS, DEFAULT_QUESTIONS } from '../app/constants';
import type { Profile, ReadingResult } from '../app/types';
import type { AppLanguage } from '../app/i18n';

// JRPG Color Palette (Chrono Trigger inspired)
const JRPG = {
  // Backgrounds
  darkBg: '#0a0a12',
  darkBgAlt: '#12121f',
  
  // UI Panels - warm earthy tones
  panelBg: '#1a1a2e',
  panelBorder: '#3d2b1f',
  panelBorderLight: '#6b4423',
  
  // Gold accents (classic JRPG)
  gold: '#f0c040',
  goldDark: '#a08020',
  goldLight: '#ffe080',
  
  // Character stats colors
  hp: '#40a040',
  mp: '#4060e0',
  tp: '#e04040',
  
  // Text
  textPrimary: '#f8f8e8',
  textSecondary: '#a0a0b0',
  textGold: '#ffd700',
  
  // Action colors
  confirm: '#50c878',
  cancel: '#c04040',
  highlight: '#4080ff',
};

// JRPG Button Component
function JRPGBtn({ 
  text, 
  onPress, 
  variant = 'primary',
  disabled = false,
  icon = null
}: { 
  text: string; 
  onPress: () => void; 
  variant?: 'primary' | 'secondary' | 'danger' | 'gold';
  disabled?: boolean;
  icon?: string;
}) {
  const colors = {
    primary: { bg: JRPG.panelBg, border: JRPG.goldDark, text: JRPG.textPrimary },
    secondary: { bg: JRPG.darkBgAlt, border: JRPG.panelBorderLight, text: JRPG.textSecondary },
    danger: { bg: '#3a1a1a', border: JRPG.cancel, text: '#ff8080' },
    gold: { bg: JRPG.goldDark, border: JRPG.gold, text: JRPG.darkBg },
  }[variant];
  
  return (
    <TouchableOpacity 
      style={[
        styles.jrpgBtn, 
        { backgroundColor: colors.bg, borderColor: colors.border },
        disabled && styles.jrpgBtnDisabled
      ]} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.jrpgBtnContent}>
        {icon && <Text style={styles.jrpgBtnIcon}>{icon}</Text>}
        <Text style={[styles.jrpgBtnText, { color: colors.text }]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

// JRPG Panel/Card Component
function JRPGPanel({ 
  title, 
  children, 
  variant = 'normal',
  onPress 
}: { 
  title: string; 
  children: React.ReactNode; 
  variant?: 'normal' | 'gold' | 'dark';
  onPress?: () => void;
}) {
  const borders = {
    normal: { border: JRPG.panelBorder, titleBg: '#2a2a3e' },
    gold: { border: JRPG.goldDark, titleBg: '#3a3020' },
    dark: { border: '#0a0a12', titleBg: '#0a0a12' },
  }[variant];
  
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container style={[styles.jrpgPanel, { borderColor: borders.border }]} onPress={onPress}>
      <View style={[styles.jrpgPanelHeader, { backgroundColor: borders.titleBg }]}>
        <Text style={styles.jrpgPanelTitle}>{title}</Text>
      </View>
      <View style={styles.jrpgPanelContent}>
        {children}
      </View>
    </Container>
  );
}

// JRPG Input Field
function JRPGInput({ 
  value, 
  onChangeText, 
  placeholder, 
  multiline = false,
  secure = false
}: { 
  value: string; 
  onChangeText: (v: string) => void; 
  placeholder?: string; 
  multiline?: boolean;
  secure?: boolean;
}) {
  return (
    <View style={styles.jrpgInputContainer}>
      <TextInput
        style={[styles.jrpgInput, multiline && styles.jrpgInputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={JRPG.textSecondary}
        multiline={multiline}
        secureTextEntry={secure}
      />
    </View>
  );
}

// Stat Bar (HP/MP style)
function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <View style={styles.statBarContainer}>
      <Text style={styles.statBarLabel}>{label}</Text>
      <View style={styles.statBarBg}>
        <View style={[styles.statBarFill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.statBarValue}>{value}/{max}</Text>
    </View>
  );
}

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
    'Love outlook': { en: '♥ Love', 'zh-HK': '♥ 感情', 'zh-CN': '♥ 感情', ja: '♥ 恋愛', ko: '♥ 연爱', es: '♥ Amor' },
    'Career momentum': { en: '⚔ Career', 'zh-HK': '⚔ 事業', 'zh-CN': '⚔ 事业', ja: '⚔ キャリア', ko: '⚔ 커리어', es: '⚔ Carrera' },
    'Money/finance timing': { en: '★ Finance', 'zh-HK': '★ 財運', 'zh-CN': '★ 财运', ja: '★ 金運', ko: '★ 재정', es: '★ Finanzas' },
    'Lucky numbers': { en: '✪ Lucky', 'zh-HK': '✪ 幸運', 'zh-CN': '✪ 幸运', ja: '✪ ラッキー', ko: '✪ 행운', es: '✪ Suerte' },
    'General decision': { en: '◎ Decision', 'zh-HK': '◎ 決策', 'zh-CN': '◎ 决策', ja: '◎ 意思決定', ko: '◎ 결정', es: '◎ Decisión' },
  };
  return map[label]?.[lang] || label;
}

// ===== SCREENS =====

export function WelcomeScreen({ onStart, t }: { onStart: () => void; t: TDict }) {
  return (
    <ScrollView contentContainerStyle={styles.welcomeScrollContent} showsVerticalScrollIndicator={true}>
      <View style={styles.welcomeTitleArea}>
        <Text style={styles.welcomeLogo}>運</Text>
        <Text style={styles.welcomeTitle}>YUN-SEEKER</Text>
        <Text style={styles.welcomeSubtitle}>◆ Destiny Awaits ◆</Text>
      </View>
      
      <JRPGPanel title="Sage Elder" variant="gold">
        <Text style={styles.dialogueText}>"Greetings, traveler. Your destiny awaits within the stars. Shall we begin your journey?"</Text>
      </JRPGPanel>
      
      <View style={styles.welcomeMenu}>
        <JRPGBtn text="▶ BEGIN JOURNEY" onPress={onStart} variant="gold" />
      </View>
      
      <Text style={styles.welcomeVersion}>v1.0.0 • Demo Build</Text>
    </ScrollView>
  );
}

export function AuthScreen({ email, setEmail, onContinue, t }: { email: string; setEmail: (v: string) => void; onContinue: () => void; t: TDict }) {
  return (
    <ScrollView contentContainerStyle={styles.screenContainer}>
      <View style={styles.authHeader}>
        <Text style={styles.authTitle}>IDENTIFY YOURSELF</Text>
        <Text style={styles.authSubtitle}>Enter your email to continue</Text>
      </View>
      
      <JRPGPanel title="Traveler Registration">
        <JRPGInput 
          value={email} 
          onChangeText={setEmail} 
          placeholder="your.email@example.com"
        />
        <Text style={styles.authNote}>Your data is stored locally. No account required for demo.</Text>
      </JRPGPanel>
      
      <JRPGBtn text="▶ CONTINUE" onPress={onContinue} variant="gold" />
    </ScrollView>
  );
}

export function WalletScreen({ onConnect, onFallback, t }: { onConnect: () => void; onFallback: () => void; t: TDict }) {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.authHeader}>
        <Text style={styles.authTitle}>WALLET (OPTIONAL)</Text>
        <Text style={styles.authSubtitle}>Connect Seeker wallet for full experience</Text>
      </View>
      
      <JRPGPanel title="Seeker Wallet" variant="gold">
        <Text style={styles.dialogueText}>"The ancient wisdom is available now! Connect your wallet for the full experience, or continue in demo mode."</Text>
      </JRPGPanel>
      
      <JRPGBtn text="▶ CONTINUE (DEMO MODE)" onPress={onFallback} variant="gold" />
      <JRPGBtn text="◎ CONNECT WALLET" onPress={onConnect} variant="secondary" />
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
      <View style={styles.authHeader}>
        <Text style={styles.authTitle}>CREATE YOUR PROFILE</Text>
        <Text style={styles.authSubtitle}>The stars need your birth data</Text>
      </View>
      
      <JRPGPanel title="◆ Birth Information ◆">
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>BIRTH DATE</Text>
          <JRPGInput value={birthDate} onChangeText={setBirthDate} placeholder="1993/06/07" />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>BIRTH TIME</Text>
          <JRPGInput value={birthTime} onChangeText={setBirthTime} placeholder="08:30 AM" />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>BIRTH PLACE</Text>
          <JRPGInput value={birthPlace} onChangeText={setBirthPlace} placeholder="Hong Kong, China" />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>CURRENT LOCATION</Text>
          <JRPGInput value={currentLocation} onChangeText={setCurrentLocation} placeholder="New York, USA" />
        </View>
      </JRPGPanel>
      
      <JRPGBtn text="▶ REVIEW PROFILE" onPress={onReview} variant="gold" />
    </ScrollView>
  );
}

export function ProfileConfirmScreen({ profile, onConfirm, onEdit, t }: { profile: Profile; onConfirm: () => void; onEdit: () => void; t: TDict }) {
  return (
    <ScrollView contentContainerStyle={styles.screenContainer}>
      <View style={styles.authHeader}>
        <Text style={styles.authTitle}>CONFIRM PROFILE</Text>
        <Text style={styles.authSubtitle}>Verify your stellar coordinates</Text>
      </View>
      
      <JRPGPanel title="◆ YOUR DESTINY DATA ◆" variant="gold">
        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>Date:</Text>
          <Text style={styles.profileValue}>{profile.birthDate}</Text>
        </View>
        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>Time:</Text>
          <Text style={styles.profileValue}>{profile.birthTime.toUpperCase()}</Text>
        </View>
        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>Birth:</Text>
          <Text style={styles.profileValue}>{profile.birthPlace}</Text>
        </View>
        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>Current:</Text>
          <Text style={styles.profileValue}>{profile.currentLocation || '-'}</Text>
        </View>
        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>Zone:</Text>
          <Text style={styles.profileValue}>{profile.timezone}</Text>
        </View>
      </JRPGPanel>
      
      <JRPGBtn text="✓ SAVE PROFILE" onPress={onConfirm} variant="gold" />
      <JRPGBtn text="✎ EDIT" onPress={onEdit} variant="secondary" />
    </ScrollView>
  );
}

export function DashboardScreen({ profile, history, onAsk, onEdit, onOpenHistory, t, language }: { profile: Profile; history: ReadingResult[]; onAsk: () => void; onEdit: () => void; onOpenHistory: (r: ReadingResult) => void; t: TDict; language: AppLanguage }) {
  return (
    <ScrollView contentContainerStyle={styles.screenContainer}>
      <View style={styles.authHeader}>
        <Text style={styles.authTitle}>DASHBOARD</Text>
        <Text style={styles.authSubtitle}>Your destiny command center</Text>
      </View>
      
      <JRPGPanel title="◆ YOUR PROFILE ◆" variant="gold">
        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>Date:</Text>
          <Text style={styles.profileValue}>{profile.birthDate || '---'}</Text>
        </View>
        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>Time:</Text>
          <Text style={styles.profileValue}>{profile.birthTime || '---'}</Text>
        </View>
        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>Place:</Text>
          <Text style={styles.profileValue}>{profile.birthPlace || '---'}</Text>
        </View>
        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>Zone:</Text>
          <Text style={styles.profileValue}>{profile.timezone || '---'}</Text>
        </View>
      </JRPGPanel>
      
      <JRPGBtn text="▶ ASK THE STARS" onPress={onAsk} variant="gold" />
      <JRPGBtn text="✎ EDIT PROFILE" onPress={onEdit} variant="secondary" />
      
      <JRPGPanel title="◆ READING HISTORY ◆">
        {history.length === 0 ? (
          <Text style={styles.emptyText}>No readings yet. Ask the stars!</Text>
        ) : (
          history.slice(0, 5).map((r, i) => (
            <TouchableOpacity key={`${r.askedAt}-${i}`} style={styles.historyItem} onPress={() => onOpenHistory(r)}>
              <Text style={styles.historyTitle}>★ {r.title}</Text>
              <Text style={styles.historyDate}>{formatLocalDate(r.askedAt, language)}</Text>
            </TouchableOpacity>
          ))
        )}
      </JRPGPanel>
    </ScrollView>
  );
}

export function QuestionsScreen({ selectedQuestion, setSelectedQuestion, customQuestion, setCustomQuestion, onGenerate, t, language }: { selectedQuestion: string; setSelectedQuestion: (v: string) => void; customQuestion: string; setCustomQuestion: (v: string) => void; onGenerate: () => void; t: TDict; language: AppLanguage }) {
  return (
    <ScrollView contentContainerStyle={styles.screenContainer}>
      <View style={styles.authHeader}>
        <Text style={styles.authTitle}>SELECT QUEST</Text>
        <Text style={styles.authSubtitle}>What do you seek from destiny?</Text>
      </View>
      
      {DEFAULT_QUESTIONS.map((q) => (
        <TouchableOpacity
          key={q.label}
          style={[styles.questionItem, selectedQuestion === q.value && styles.questionItemActive]}
          onPress={() => { setSelectedQuestion(q.value); setCustomQuestion(''); }}
        >
          <Text style={[styles.questionText, selectedQuestion === q.value && styles.questionTextActive]}>
            {localizeQuestionLabel(q.label, language)}
          </Text>
        </TouchableOpacity>
      ))}
      
      <JRPGPanel title="CUSTOM QUESTION">
        <JRPGInput 
          value={customQuestion} 
          onChangeText={(v) => { setCustomQuestion(v); if (v.trim()) setSelectedQuestion(''); }} 
          placeholder="Ask anything..."
          multiline
        />
      </JRPGPanel>
      
      <JRPGBtn text="★ RECEIVE DIVINATION" onPress={onGenerate} variant="gold" />
    </ScrollView>
  );
}

export function ReadingScreen({ reading, onShare, onAskAgain, onBack, t, language }: { reading: ReadingResult | null; onShare: () => void; onAskAgain: () => void; onBack: () => void; t: TDict; language: AppLanguage }) {
  const confidenceColor = reading?.confidence === 'High' ? JRPG.hp : reading?.confidence === 'Low' ? JRPG.tp : JRPG.gold;
  
  return (
    <ScrollView contentContainerStyle={styles.screenContainer}>
      <View style={styles.readingHeader}>
        <Text style={styles.readingTitle}>{reading?.title || 'DIVINATION'}</Text>
        <Text style={styles.readingQuestion}>Q: {reading?.question}</Text>
      </View>
      
      <JRPGPanel title="◆ SUMMARY ◆" variant="gold">
        <Text style={styles.summaryText}>{reading?.summary || 'No summary available.'}</Text>
        <View style={styles.readingStats}>
          <View style={styles.statChip}>
            <Text style={styles.statChipLabel}>Focus:</Text>
            <Text style={styles.statChipValue}>{reading?.focus || '---'}</Text>
          </View>
          <View style={[styles.statChip, { borderColor: confidenceColor }]}>
            <Text style={[styles.statChipLabel, { color: confidenceColor }]}>Confidence:</Text>
            <Text style={[styles.statChipValue, { color: confidenceColor }]}>
              {reading?.confidence === 'High' ? 'HIGH' : reading?.confidence === 'Low' ? 'LOW' : 'MEDIUM'}
            </Text>
          </View>
        </View>
      </JRPGPanel>
      
      <JRPGPanel title="◆ KEY INSIGHTS ◆">
        {(reading?.highlights || []).map((h, idx) => (
          <Text key={idx} style={styles.insightText}>◆ {h}</Text>
        ))}
      </JRPGPanel>
      
      <JRPGPanel title="◆ ACTION PLAN ◆">
        {((reading?.data?.actionPlan as string[]) || []).map((a, i) => (
          <Text key={`a-${i}`} style={styles.actionText}>➤ {a}</Text>
        ))}
      </JRPGPanel>
      
      <JRPGPanel title="◆ TIMING ◆">
        {((reading?.data?.timing as string[]) || []).map((w, i) => (
          <Text key={`w-${i}`} style={styles.timingText}>⏰ {w}</Text>
        ))}
      </JRPGPanel>
      
      <View style={styles.readingActions}>
        <JRPGBtn text="◈ SHARE" onPress={onShare} variant="gold" />
        <JRPGBtn text="▶ ASK AGAIN" onPress={onAskAgain} variant="secondary" />
        <JRPGBtn text="◀ BACK" onPress={onBack} variant="secondary" />
      </View>
    </ScrollView>
  );
}

// ===== STYLES =====

const styles = StyleSheet.create({
  // Containers
  welcomeContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: JRPG.darkBg,
    justifyContent: 'center',
  },
  screenContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: JRPG.darkBg,
    paddingBottom: 40,
  },
  
  // Welcome Screen
  welcomeScrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: JRPG.darkBg,
  },
  welcomeTitleArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeLogo: {
    fontSize: 72,
    color: JRPG.gold,
    textShadowColor: JRPG.goldDark,
    textShadowOffset: { width: 2, height: 2 },
  },
  welcomeTitle: {
    fontSize: 32,
    color: JRPG.gold,
    fontWeight: 'bold',
    letterSpacing: 4,
    textShadowColor: JRPG.goldDark,
    textShadowOffset: { width: 1, height: 1 },
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: JRPG.textSecondary,
    marginTop: 8,
  },
  welcomeMenu: {
    marginTop: 24,
  },
  welcomeVersion: {
    textAlign: 'center',
    color: JRPG.textSecondary,
    fontSize: 10,
    marginTop: 24,
  },
  
  // Auth/Wallet Screens
  authHeader: {
    marginBottom: 20,
  },
  authTitle: {
    fontSize: 24,
    color: JRPG.gold,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  authSubtitle: {
    fontSize: 12,
    color: JRPG.textSecondary,
    marginTop: 4,
  },
  authNote: {
    fontSize: 10,
    color: JRPG.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  
  // JRPG Button
  jrpgBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginVertical: 6,
  },
  jrpgBtnDisabled: {
    opacity: 0.5,
  },
  jrpgBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jrpgBtnIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  jrpgBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  
  // JRPG Panel
  jrpgPanel: {
    backgroundColor: JRPG.panelBg,
    borderWidth: 2,
    borderRadius: 4,
    marginVertical: 8,
    overflow: 'hidden',
  },
  jrpgPanelHeader: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: JRPG.panelBorder,
  },
  jrpgPanelTitle: {
    color: JRPG.gold,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  jrpgPanelContent: {
    padding: 12,
  },
  
  // JRPG Input
  jrpgInputContainer: {
    marginBottom: 8,
  },
  jrpgInput: {
    backgroundColor: JRPG.darkBg,
    borderWidth: 1,
    borderColor: JRPG.panelBorder,
    borderRadius: 4,
    color: JRPG.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  jrpgInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  
  // Form
  formGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: JRPG.gold,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  
  // Profile
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: JRPG.panelBorder,
  },
  profileLabel: {
    color: JRPG.textSecondary,
    fontSize: 12,
  },
  profileValue: {
    color: JRPG.textPrimary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Dialogue
  dialogueText: {
    color: JRPG.textPrimary,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 20,
    textAlign: 'center',
  },
  
  // Questions
  questionItem: {
    backgroundColor: JRPG.panelBg,
    borderWidth: 1,
    borderColor: JRPG.panelBorder,
    borderRadius: 4,
    padding: 14,
    marginVertical: 4,
  },
  questionItemActive: {
    backgroundColor: JRPG.goldDark,
    borderColor: JRPG.gold,
  },
  questionText: {
    color: JRPG.textPrimary,
    fontSize: 14,
  },
  questionTextActive: {
    color: JRPG.darkBg,
    fontWeight: 'bold',
  },
  
  // History
  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: JRPG.panelBorder,
  },
  historyTitle: {
    color: JRPG.gold,
    fontSize: 13,
  },
  historyDate: {
    color: JRPG.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  emptyText: {
    color: JRPG.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Reading
  readingHeader: {
    marginBottom: 16,
  },
  readingTitle: {
    fontSize: 28,
    color: JRPG.gold,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  readingQuestion: {
    fontSize: 12,
    color: JRPG.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  summaryText: {
    color: JRPG.textPrimary,
    fontSize: 14,
    lineHeight: 22,
  },
  readingStats: {
    flexDirection: 'row',
    marginTop: 12,
  },
  statChip: {
    backgroundColor: JRPG.darkBg,
    borderWidth: 1,
    borderColor: JRPG.panelBorder,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  statChipLabel: {
    color: JRPG.textSecondary,
    fontSize: 10,
  },
  statChipValue: {
    color: JRPG.gold,
    fontSize: 12,
    fontWeight: 'bold',
  },
  insightText: {
    color: JRPG.textPrimary,
    fontSize: 13,
    lineHeight: 20,
  },
  actionText: {
    color: JRPG.hp,
    fontSize: 13,
    lineHeight: 20,
  },
  timingText: {
    color: JRPG.mp,
    fontSize: 13,
    lineHeight: 20,
  },
  readingActions: {
    marginTop: 16,
    marginBottom: 32,
  },
  
  // Stat Bar
  statBarContainer: {
    marginBottom: 8,
  },
  statBarLabel: {
    color: JRPG.textSecondary,
    fontSize: 10,
    marginBottom: 2,
  },
  statBarBg: {
    height: 8,
    backgroundColor: JRPG.darkBg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statBarValue: {
    color: JRPG.textSecondary,
    fontSize: 10,
    marginTop: 2,
    textAlign: 'right',
  },
});
