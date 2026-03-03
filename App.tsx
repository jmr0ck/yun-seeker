import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Modal, SafeAreaView, Share, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FinalBossEngine } from './src/lib/finalBossEngine';
import { COLORS } from './src/app/constants';
import type { Profile, ReadingResult, Screen } from './src/app/types';
import { inferTimezone, mapQuestionType, parseHour24, validateDate, validatePlace, validateTime12h } from './src/app/utils';
import { loadBootstrap, saveEmail as persistEmail, saveProfile as persistProfile, saveReports as persistReports } from './src/app/storage';
import { AppLanguage, I18N, LANGUAGE_STORAGE_KEY, RTL_LANGUAGES, SUPPORTED_LANGUAGES } from './src/app/i18n';
import {
  AuthScreen,
  DashboardScreen,
  ProfileConfirmScreen,
  ProfileScreen,
  QuestionsScreen,
  ReadingScreen,
  WalletScreen,
  WelcomeScreen,
} from './src/screens/AppScreens';

// Wallet connection via Mobile Wallet Adapter (MWA) protocol
import { transact, AuthorizationResult } from '@solana-mobile/mobile-wallet-adapter-protocol';

// Wallet connection via deep links (no heavy libraries)


export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [langModalVisible, setLangModalVisible] = useState(false);

  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [timezone, setTimezone] = useState('Asia/Hong_Kong');
  const [profileSaved, setProfileSaved] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [depthMode, setDepthMode] = useState<'quick' | 'master'>('master');
  const [reading, setReading] = useState<ReadingResult | null>(null);
  const [history, setHistory] = useState<ReadingResult[]>([]);

  const activeProfile: Profile = useMemo(
    () => ({ birthDate, birthTime, birthPlace, currentLocation, timezone }),
    [birthDate, birthTime, birthPlace, currentLocation, timezone],
  );
  const isRTL = RTL_LANGUAGES.includes(language);

  useEffect(() => {
    (async () => {
      try {
        const boot = await loadBootstrap();
        const savedLang = (await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)) as AppLanguage | null;
        if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
          setLanguage(savedLang);
        } else {
          const localeRaw = Intl.DateTimeFormat().resolvedOptions().locale || 'en';
          const locale = localeRaw.toLowerCase();
          let detected: AppLanguage = 'en';
          if (locale.startsWith('zh-hk') || locale.startsWith('zh-tw') || locale.startsWith('zh-mo')) detected = 'zh-HK';
          else if (locale.startsWith('zh')) detected = 'zh-CN';
          else if (locale.startsWith('ja')) detected = 'ja';
          else if (locale.startsWith('ko')) detected = 'ko';
          else if (locale.startsWith('es')) detected = 'es';
          setLanguage(detected);
          await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, detected);
        }
        if (boot.email) {
          setEmail(boot.email);
          setIsSignedIn(true);
        }
        if (boot.profile) {
          setBirthDate(boot.profile.birthDate || '');
          setBirthTime(boot.profile.birthTime || '');
          setBirthPlace(boot.profile.birthPlace || '');
          setCurrentLocation(boot.profile.currentLocation || '');
          setTimezone(boot.profile.timezone || 'Asia/Hong_Kong');
          setProfileSaved(Boolean(boot.profile.birthDate && boot.profile.birthTime && boot.profile.birthPlace));
        }
        setHistory(boot.reports || []);
      } catch {}
    })();
  }, []);

  const handleAuth = async () => {
    const e = email.trim().toLowerCase();
    if (!e.includes('@') || !e.includes('.')) {
      Alert.alert('Invalid Email', I18N[language].invalidEmail);
      return;
    }
    await persistEmail(e);
    setIsSignedIn(true);
    setScreen('wallet');
  };

  const setAppLanguage = async (next: AppLanguage) => {
    setLanguage(next);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    setLangModalVisible(false);
  };

  const languageNames: Record<AppLanguage, string> = {
    en: 'English',
    'zh-HK': '繁體中文（香港）',
    'zh-CN': '简体中文',
    ja: '日本語',
    ko: '한국어',
    es: 'Español',
  };

const connectWallet = async () => {
  try {
    // Use MWA protocol to connect to wallet
    const auth: AuthorizationResult = await transact(async (wallet) => {
      return await wallet.authorize({
        cluster: 'mainnet-beta',
        identity: { 
          name: 'yun-seeker', 
          uri: 'https://github.com/jmr0ck/yun-seeker' 
        },
      });
    });
    
    if (auth?.accounts?.[0]?.address) {
      // Convert base64 address to base58
      const addressBytes = new Uint8Array(atob(auth.accounts[0].address).split('').map(c => c.charCodeAt(0)));
      const { PublicKey } = await import('@solana/web3.js');
      const pubkey = new PublicKey(addressBytes).toBase58();
      
      setWalletAddress(pubkey);
      setWalletConnected(true);
      Alert.alert('Wallet Connected', `Seeker Wallet connected:\n${pubkey.slice(0, 8)}...`);
      setScreen('profile');
    } else {
      throw new Error('No account returned');
    }
  } catch (e: any) {
    console.warn('Wallet connection error:', e);
    
    // Try fallback - deep link
    try {
      const canOpen = await Linking.canOpenURL('solana://');
      if (canOpen) {
        await Linking.openURL('solana://');
        // Assume connected after opening
        setWalletConnected(true);
        Alert.alert('Wallet', 'Please authorize in wallet app');
        setScreen('profile');
        return;
      }
    } catch {}
    
    // Final fallback - demo mode
    Alert.alert(
      'Demo Mode', 
      'Could not connect to wallet. Using demo mode.',
      [{ text: 'Continue', onPress: () => {
        setWalletConnected(true);
        setScreen('profile');
      }}]
    );
  }
};

  const openWalletFallback = async () => {
    try {
      const uri = 'solana:';
      const can = await Linking.canOpenURL(uri);
      if (can) await Linking.openURL(uri);
      else Alert.alert('Wallet Fallback', 'No Solana wallet URI handler found. Install/open a compatible wallet.');
    } catch {
      Alert.alert('Wallet Fallback', 'Could not open fallback wallet link.');
    }
  };

  const goProfileConfirm = () => {
    if (!validateDate(birthDate)) return Alert.alert('Invalid Birth Date', I18N[language].invalidDate);
    if (!validateTime12h(birthTime)) return Alert.alert('Invalid Birth Time', I18N[language].invalidTime);
    if (!validatePlace(birthPlace)) return Alert.alert('Invalid Birth Place', I18N[language].invalidPlace);
    setTimezone(inferTimezone(birthPlace));
    setScreen('profileConfirm');
  };

  const saveProfileNow = async () => {
    const payload: Profile = {
      birthDate: birthDate.trim(),
      birthTime: birthTime.trim().toUpperCase(),
      birthPlace: birthPlace.trim(),
      currentLocation: currentLocation.trim() || undefined,
      timezone,
    };
    await persistProfile(email, payload);
    setProfileSaved(true);
    setScreen('dashboard');
  };

  const runCalculation = async () => {
    if (!profileSaved) {
      Alert.alert('Profile Required', 'Please complete your profile first.');
      setScreen('profile');
      return;
    }
    const q = (customQuestion.trim() || selectedQuestion.trim()).trim();
    if (!q) return Alert.alert('Question Required', 'Pick a default question or type a custom question.');

    // Check daily limit (3 questions per day)
    const today = new Date().toISOString().slice(0, 10);
    const lastReadDate = await AsyncStorage.getItem('yun:lastReadDate');
    const readCountToday = parseInt(await AsyncStorage.getItem('yun:readCountToday') || '0', 10);
    if (lastReadDate === today && readCountToday >= 3) {
      return Alert.alert('Daily Limit Reached', 'You can ask 3 questions per day. Come back tomorrow!');
    }

    try {
      const [y, m, d] = birthDate.split('/').map(Number);
      const hour = parseHour24(birthTime);
      const birthData = { year: y, month: m, day: d, hour, timezone: 'Asia/Hong_Kong' as const };
      const type = mapQuestionType(q);
      const deep = FinalBossEngine.generate(q, birthData, language, depthMode);

      const report: ReadingResult = {
        title: deep.title,
        summary: deep.summary,
        data: {
          ...deep.payload,
          actionPlan: deep.actionPlan,
          risks: deep.risks,
          timing: deep.timing,
          citations: deep.citations,
          reasoning: deep.reasoning,
        },
        askedAt: new Date().toISOString(),
        question: q,
        highlights: deep.highlights,
        confidence: deep.confidence,
        focus: type,
      };

      const nextHistory = [report, ...history].slice(0, 30);
      setReading(report);
      setHistory(nextHistory);
      await persistReports(email, nextHistory);
      
      // Update daily read count
      await AsyncStorage.setItem('yun:lastReadDate', today);
      await AsyncStorage.setItem('yun:readCountToday', String(readCountToday + 1));
      
      setScreen('reading');
    } catch {
      Alert.alert('Calculation Error', 'Could not generate report. Please verify your profile fields.');
    }
  };

  const shareReading = async () => {
    if (!reading) return;
    try {
      const text = [
        `${reading.title}`,
        `Question: ${reading.question}`,
        `Summary: ${reading.summary}`,
        `Confidence: ${reading.confidence}`,
        '',
        'Highlights:',
        ...(reading.highlights || []).map((h) => `- ${h}`),
      ].join('\n');
      await Share.share({ message: text, title: reading.title });
    } catch {
      Alert.alert('Share Failed', 'Could not share report right now.');
    }
  };

  // Donate via Solana wallet
  const donate = async () => {
    try {
      const donationAddress = 'yunseeker.sol'; // Placeholder
      const solanaUri = `solana:${donationAddress}?amount=0.1&label=yun-seeker+donation`;
      const canOpen = await Linking.canOpenURL(solanaUri);
      if (canOpen) {
        await Linking.openURL(solanaUri);
        Alert.alert('Thank You!', 'Your donation helps keep yun-seeker running! 🧡');
      } else {
        Alert.alert('Donation', `Support us by sending SOL to: ${donationAddress}`);
      }
    } catch {
      Alert.alert('Donation', 'Thank you for your support!');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { direction: isRTL ? 'rtl' : 'ltr' }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={styles.header}>
        <Text style={styles.logo}>運 yun-seeker</Text>
        <View style={{ alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={() => setLangModalVisible(true)}>
            <Text style={styles.langSwitch}>{I18N[language].language}: {languageNames[language]}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setDepthMode(depthMode === 'master' ? 'quick' : 'master')}>
            <Text style={styles.depthSwitch}>Depth: {depthMode.toUpperCase()}</Text>
          </TouchableOpacity>
          {isSignedIn ? <Text style={styles.pill}>{email}</Text> : <Text style={styles.pillMuted}>Not signed in</Text>}
          {walletConnected ? <Text style={styles.pill}>Wallet: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</Text> : <Text style={styles.pillMuted}>Wallet not connected</Text>}
        </View>
      </View>

      <Modal visible={langModalVisible} transparent animationType="fade" onRequestClose={() => setLangModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{I18N[language].language}</Text>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <TouchableOpacity key={lang} style={[styles.modalOption, language === lang && styles.modalOptionActive]} onPress={() => setAppLanguage(lang)}>
                <Text style={styles.modalOptionText}>{languageNames[lang]}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.btnGhost} onPress={() => setLangModalVisible(false)}>
              <Text style={styles.btnGhostText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {screen === 'welcome' && <WelcomeScreen onStart={() => setScreen('auth')} t={I18N[language]} />}
      {screen === 'auth' && <AuthScreen email={email} setEmail={setEmail} onContinue={handleAuth} t={I18N[language]} />}
      {screen === 'wallet' && <WalletScreen onConnect={connectWallet} onFallback={openWalletFallback} t={I18N[language]} />}
      {screen === 'profile' && (
        <ProfileScreen
          birthDate={birthDate} setBirthDate={setBirthDate}
          birthTime={birthTime} setBirthTime={setBirthTime}
          birthPlace={birthPlace} setBirthPlace={setBirthPlace}
          currentLocation={currentLocation} setCurrentLocation={setCurrentLocation}
          onReview={goProfileConfirm}
          t={I18N[language]}
        />
      )}
      {screen === 'profileConfirm' && <ProfileConfirmScreen profile={activeProfile} onConfirm={saveProfileNow} onEdit={() => setScreen('profile')} t={I18N[language]} />}
      {screen === 'dashboard' && <DashboardScreen profile={activeProfile} history={history} onAsk={() => setScreen('questions')} onEdit={() => setScreen('profile')} onOpenHistory={(r) => { setReading(r); setScreen('reading'); }} t={I18N[language]} language={language} />}
      {screen === 'questions' && <QuestionsScreen selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} customQuestion={customQuestion} setCustomQuestion={setCustomQuestion} onGenerate={runCalculation} t={I18N[language]} language={language} />}
      {screen === 'reading' && <ReadingScreen reading={reading} onShare={shareReading} onDonate={donate} onAskAgain={() => setScreen('questions')} onBack={() => setScreen('dashboard')} t={I18N[language]} language={language} />}

      <View style={styles.footerNav}>
        {isSignedIn && (
          <>
            <TouchableOpacity onPress={() => setScreen('dashboard')}><Text style={styles.footerLink}>{I18N[language].dashboard}</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen('questions')}><Text style={styles.footerLink}>{I18N[language].questions}</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen('profile')}><Text style={styles.footerLink}>{I18N[language].profile}</Text></TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2b2f4a', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { color: COLORS.accent, fontWeight: '800', fontSize: 18 },
  langSwitch: { color: COLORS.accent, fontSize: 11, marginBottom: 4 },
  depthSwitch: { color: '#8ec5ff', fontSize: 11, marginBottom: 4 },
  pill: { color: COLORS.ok, fontSize: 11 },
  pillMuted: { color: COLORS.muted, fontSize: 11 },
  footerNav: { paddingVertical: 10, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: '#2b2f4a', flexDirection: 'row', justifyContent: 'space-around' },
  footerLink: { color: COLORS.muted, fontSize: 12 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: COLORS.card, borderRadius: 14, padding: 16, borderColor: '#3a4066', borderWidth: 1 },
  modalTitle: { color: COLORS.text, fontSize: 18, fontWeight: '800', marginBottom: 12 },
  modalOption: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, marginBottom: 8, backgroundColor: '#252a49' },
  modalOptionActive: { borderWidth: 1, borderColor: COLORS.accent },
  modalOptionText: { color: COLORS.text, fontSize: 14 },
});
