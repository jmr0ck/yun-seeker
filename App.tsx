import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, SafeAreaView, Share, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { FinalBossEngine } from './src/lib/finalBossEngine';
import { COLORS } from './src/app/constants';
import type { Profile, ReadingResult, Screen } from './src/app/types';
import { inferTimezone, mapQuestionType, parseHour24, validateDate, validatePlace, validateTime12h } from './src/app/utils';
import { loadBootstrap, saveEmail as persistEmail, saveProfile as persistProfile, saveReports as persistReports } from './src/app/storage';
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

if (typeof global.Buffer === 'undefined') global.Buffer = Buffer;

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [timezone, setTimezone] = useState('Asia/Hong_Kong');
  const [profileSaved, setProfileSaved] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [reading, setReading] = useState<ReadingResult | null>(null);
  const [history, setHistory] = useState<ReadingResult[]>([]);

  const activeProfile: Profile = useMemo(
    () => ({ birthDate, birthTime, birthPlace, currentLocation, timezone }),
    [birthDate, birthTime, birthPlace, currentLocation, timezone],
  );

  useEffect(() => {
    (async () => {
      try {
        const boot = await loadBootstrap();
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
      Alert.alert('Invalid Email', 'Please enter a valid email for sign-in/sign-up.');
      return;
    }
    await persistEmail(e);
    setIsSignedIn(true);
    setScreen('wallet');
  };

  const connectWallet = async () => {
    try {
      const auth = await transact((wallet) =>
        wallet.authorize({
          cluster: 'mainnet-beta',
          identity: { name: 'yun-seeker', uri: 'https://github.com/jmr0ck/yun-seeker' },
        }),
      );
      const acct = auth.accounts?.[0];
      if (!acct?.address) throw new Error('No wallet account returned');
      const pubkey = new PublicKey(Buffer.from(acct.address, 'base64')).toBase58();
      setWalletAddress(pubkey);
      setWalletConnected(true);
      Alert.alert('Wallet Connected', `Seeker wallet connected:\n${pubkey.slice(0, 6)}...${pubkey.slice(-4)}`);
      setScreen('profile');
    } catch {
      Alert.alert('Wallet Connection Failed', 'Open from a Seeker wallet-enabled device and try again.');
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
    if (!validateDate(birthDate)) return Alert.alert('Invalid Birth Date', 'Use format: YYYY/MM/DD');
    if (!validateTime12h(birthTime)) return Alert.alert('Invalid Birth Time', 'Use format: hh:mm AM/PM');
    if (!validatePlace(birthPlace)) return Alert.alert('Invalid Birth Place', 'Use format: City, Country');
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

    try {
      const [y, m, d] = birthDate.split('/').map(Number);
      const hour = parseHour24(birthTime);
      const birthData = { year: y, month: m, day: d, hour, timezone: 'Asia/Hong_Kong' as const };
      const type = mapQuestionType(q);
      const deep = FinalBossEngine.generate(q, birthData);

      const report: ReadingResult = {
        title: deep.title,
        summary: deep.summary,
        data: {
          ...deep.payload,
          actionPlan: deep.actionPlan,
          risks: deep.risks,
          timing: deep.timing,
          citations: deep.citations,
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={styles.header}>
        <Text style={styles.logo}>運 yun-seeker</Text>
        <View style={{ alignItems: 'flex-end' }}>
          {isSignedIn ? <Text style={styles.pill}>{email}</Text> : <Text style={styles.pillMuted}>Not signed in</Text>}
          {walletConnected ? <Text style={styles.pill}>Wallet: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</Text> : <Text style={styles.pillMuted}>Wallet not connected</Text>}
        </View>
      </View>

      {screen === 'welcome' && <WelcomeScreen onStart={() => setScreen('auth')} />}
      {screen === 'auth' && <AuthScreen email={email} setEmail={setEmail} onContinue={handleAuth} />}
      {screen === 'wallet' && <WalletScreen onConnect={connectWallet} onFallback={openWalletFallback} />}
      {screen === 'profile' && (
        <ProfileScreen
          birthDate={birthDate} setBirthDate={setBirthDate}
          birthTime={birthTime} setBirthTime={setBirthTime}
          birthPlace={birthPlace} setBirthPlace={setBirthPlace}
          currentLocation={currentLocation} setCurrentLocation={setCurrentLocation}
          onReview={goProfileConfirm}
        />
      )}
      {screen === 'profileConfirm' && <ProfileConfirmScreen profile={activeProfile} onConfirm={saveProfileNow} onEdit={() => setScreen('profile')} />}
      {screen === 'dashboard' && <DashboardScreen profile={activeProfile} history={history} onAsk={() => setScreen('questions')} onEdit={() => setScreen('profile')} onOpenHistory={(r) => { setReading(r); setScreen('reading'); }} />}
      {screen === 'questions' && <QuestionsScreen selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} customQuestion={customQuestion} setCustomQuestion={setCustomQuestion} onGenerate={runCalculation} />}
      {screen === 'reading' && <ReadingScreen reading={reading} onShare={shareReading} onAskAgain={() => setScreen('questions')} onBack={() => setScreen('dashboard')} />}

      <View style={styles.footerNav}>
        {isSignedIn && (
          <>
            <TouchableOpacity onPress={() => setScreen('dashboard')}><Text style={styles.footerLink}>Dashboard</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen('questions')}><Text style={styles.footerLink}>Questions</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen('profile')}><Text style={styles.footerLink}>Profile</Text></TouchableOpacity>
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
  pill: { color: COLORS.ok, fontSize: 11 },
  pillMuted: { color: COLORS.muted, fontSize: 11 },
  footerNav: { paddingVertical: 10, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: '#2b2f4a', flexDirection: 'row', justifyContent: 'space-around' },
  footerLink: { color: COLORS.muted, fontSize: 12 },
});
