/**
 * yun - 運 Astrology App
 * Main App Entry Point - Pixel Art Edition
 * 
 * Built for Solana Mobile Hackathon
 */

import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Image,
  Linking
} from 'react-native';
import { Buffer } from 'buffer';

// Polyfill buffer for React Native
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

// Import yun astrology engine
import { Luck } from './src/lib/luck';
import { solanaPayment, PRICES } from './src/lib/solanaPayment';

// Donation (SOL) — creator tip jar
const DONATION_WALLET = '8HCddiWRKs8EnYL5UbpRjKJwNdpVPoaWrWKcX683V7qQ';

// Pixel art color palette
const COLORS = {
  darkBg: '#1a1a2e',
  cardBg: '#16213e',
  gold: '#FFD700',
  darkGold: '#B8860B',
  cream: '#FFFDD0',
  red: '#E94560',
  blue: '#0f3460',
  green: '#228B22',
};

export default function App() {
  // User state
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [points, setPoints] = useState(0);
  const [lastFreeRequest, setLastFreeRequest] = useState<Date | null>(null);
  
  // Form state
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  
  // Reading state
  const [currentScreen, setCurrentScreen] = useState<'home' | 'profile' | 'reading' | 'wallet'>('home');
  const [reading, setReading] = useState<any>(null);
  const [question, setQuestion] = useState('');
  const [dialogueStep, setDialogueStep] = useState(0);

  // Donation UI
  const [showDonate, setShowDonate] = useState(false);
  const [donateAmount, setDonateAmount] = useState<string>('0.005');

  // Check if free daily request is available
  const canUseFreeRequest = () => {
    const now = new Date();
    if (!lastFreeRequest) return true;
    const lastDate = new Date(lastFreeRequest);
    return now.toDateString() !== lastDate.toDateString();
  };

  // Connect wallet (simulated for demo - in production use Solana Mobile SDK)
  const connectWallet = async () => {
    try {
      // Simulate wallet connection
      setWalletConnected(true);
      setWalletAddress('7xKXtg2CW87d97TXJSDpbD5iBk8RV1fYSErQQN7G4BQ');
      setPoints(10); // Welcome bonus
      
      // Get balance
      const balance = await solanaPayment.getBalance(walletAddress);
      setWalletBalance(balance);
      
      Alert.alert(
        'Wallet Connected! 🐉', 
        'Welcome to 運 yun!\n\n🎁 10 FREE points\n🎯 1 FREE reading daily\n\nSolana balance: ' + balance.toFixed(4) + ' SOL'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
    setWalletBalance(0);
  };

  // Donation via Solana Pay URI (opens wallet)
  const donateSol = async (amountSol: number) => {
    try {
      if (!solanaPayment.isValidAddress(DONATION_WALLET)) {
        Alert.alert('Donation Disabled', 'Invalid donation wallet address configured.');
        return;
      }

      // Solana Pay transfer request URI
      const params = new URLSearchParams({
        amount: String(amountSol),
        label: 'yun (運)',
        message: 'Donation / Tip jar',
      });
      const uri = `solana:${DONATION_WALLET}?${params.toString()}`;

      const supported = await Linking.canOpenURL(uri);
      if (!supported) {
        // Fallback: copy address
        Alert.alert(
          'Open Wallet',
          `Couldn’t open a Solana wallet automatically.\n\nDonation address:\n${DONATION_WALLET}`,
        );
        return;
      }

      await Linking.openURL(uri);
    } catch (e) {
      Alert.alert('Error', 'Could not start donation flow.');
    }
  };

  // Process payment for premium feature (Solana Pay URI; opens wallet)
  const processPayment = async (priceSOL: number, feature: string): Promise<boolean> => {
    if (!walletConnected) {
      Alert.alert('Wallet Required', 'Please connect your wallet first!');
      return false;
    }

    if (walletBalance < priceSOL) {
      Alert.alert(
        'Insufficient Balance',
        `Need ${priceSOL} SOL for ${feature}.\n\nYour balance: ${walletBalance.toFixed(4)} SOL`,
      );
      return false;
    }

    try {
      const params = new URLSearchParams({
        amount: String(priceSOL),
        label: 'yun (運)',
        message: `Payment — ${feature}`,
      });
      const uri = `solana:${DONATION_WALLET}?${params.toString()}`;

      const supported = await Linking.canOpenURL(uri);
      if (!supported) {
        Alert.alert('Open Wallet', `Couldn’t open a wallet automatically.\n\nPay to:\n${DONATION_WALLET}`);
        return false;
      }

      await Linking.openURL(uri);
      // MVP: assume user completes payment in wallet.
      return true;
    } catch {
      Alert.alert('Error', 'Could not start payment flow.');
      return false;
    }
  };

  // Generate reading based on birth data
  const generateReading = async (type: 'chart' | 'question' | 'love' | 'finance' | 'lottery' | 'career' | 'decision') => {
    if (!birthDate) {
      Alert.alert('Setup Required', 'Please enter your birth details first!');
      setCurrentScreen('profile');
      return;
    }

    const freeAvailable = canUseFreeRequest();

    // Pricing: 1 free request/day; after that, charge.
    // Premium readings can cost more than the base extra reading.
    const premiumPrices: Record<string, number> = {
      chart: 0,
      question: 0,
      lottery: 0,
      love: PRICES.LOVE_COMPATIBILITY,
      finance: PRICES.FINANCE_FORECAST,
      career: PRICES.CAREER_GUIDANCE,
      decision: PRICES.DECISION_READING,
    };

    const premium = premiumPrices[type] || 0;

    if (!freeAvailable) {
      const priceToCharge = premium > 0 ? premium : PRICES.EXTRA_READING;
      const paid = await processPayment(priceToCharge, `${type.toUpperCase()} reading`);
      if (!paid) return;
    }

    // Parse birth data
    const [year, month, day] = birthDate.split('-').map(Number);
    const hour = birthTime ? parseInt(birthTime.split(':')[0]) : 12;

    try {
      const birthData = { year, month, day, hour, timezone: 'Asia/Hong_Kong' };
      
      let result;
      switch (type) {
        case 'chart':
          result = Luck.generateFourPillars(birthData);
          break;
        case 'question':
          result = Luck.generateDecision(question, birthData);
          break;
        case 'love':
          result = Luck.generateCompatibility(birthData, birthData);
          break;
        case 'finance':
          result = Luck.generateFinance(birthData);
          break;
        case 'career':
          result = Luck.generateCareer(birthData);
          break;
        case 'lottery':
          result = Luck.generateLuckyNumbers(birthData);
          break;
        case 'decision':
          result = Luck.generateDecision(question || 'General decision', birthData);
          break;
        default:
          result = Luck.generateFourPillars(birthData);
      }

      setReading({ type, data: result });
      setDialogueStep(0);
      setCurrentScreen('reading');
      
      // Mark free request used (1 free request/day)
      if (freeAvailable) {
        setLastFreeRequest(new Date());
      }
    } catch (error) {
      Alert.alert('Error', 'Could not generate reading. Please check your birth data.');
    }
  };

  // Render dialogue for reading
  const renderReadingDialogue = () => {
    if (!reading) return null;
    
    const npcMessages = [
      "Ah, seeker of wisdom... The stars align in your favor today.",
      "Let me consult the ancient texts...",
      "The spirits reveal much to those who ask...",
      "Your destiny unfolds before us...",
    ];
    
    return (
      <View style={styles.dialogueContainer}>
        <View style={styles.npcAvatar}>
          <Text style={styles.npcEmoji}>🧙</Text>
        </View>
        <View style={styles.dialogueBox}>
          <Text style={styles.npcName}>Sage Elder</Text>
          <Text style={styles.dialogueText}>
            {dialogueStep < npcMessages.length 
              ? npcMessages[dialogueStep] 
              : reading.data?.summary || "The reading reveals your path..."}
          </Text>
          {dialogueStep < npcMessages.length ? (
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => setDialogueStep(prev => prev + 1)}
            >
              <Text style={styles.continueText}>▼ Continue</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ gap: 10, alignItems: 'flex-end' }}>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => setShowDonate(true)}
              >
                <Text style={styles.continueText}>🙏 Tip the Sage</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => setCurrentScreen('home')}
              >
                <Text style={styles.continueText}>🏠 Return Home</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Render home screen
  const renderHome = () => (
    <ScrollView style={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>運</Text>
        <Text style={styles.heroSubtitle}>yun</Text>
        <Text style={styles.heroTagline}>Chinese Astrology on Solana</Text>
        <Text style={styles.freeTag}>🎁 1 FREE reading every day!</Text>
      </View>

      {!walletConnected ? (
        <TouchableOpacity style={styles.connectButton} onPress={connectWallet}>
          <Text style={styles.connectButtonText}>🔗 Connect Wallet</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.walletInfo}>
          <Text style={styles.walletText}>
            {solanaPayment.formatAddress(walletAddress)}
          </Text>
          <Text style={styles.balanceText}>💰 {walletBalance.toFixed(4)} SOL</Text>
          <Text style={styles.pointsText}>⭐ {points} points</Text>
        </View>
      )}

      <View style={styles.menuGrid}>
        <TouchableOpacity style={styles.menuItem} onPress={() => generateReading('chart')}>
          <Text style={styles.menuIcon}>🎂</Text>
          <Text style={styles.menuText}>Birth Chart</Text>
          <Text style={styles.menuPrice}>🎁 FREE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => generateReading('lottery')}>
          <Text style={styles.menuIcon}>🎰</Text>
          <Text style={styles.menuText}>Lucky Numbers</Text>
          <Text style={styles.menuPrice}>🎁 FREE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => generateReading('love')}>
          <Text style={styles.menuIcon}>💕</Text>
          <Text style={styles.menuText}>Love</Text>
          <Text style={styles.menuPrice}>{PRICES.LOVE_COMPATIBILITY} SOL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => generateReading('finance')}>
          <Text style={styles.menuIcon}>💰</Text>
          <Text style={styles.menuText}>Finance</Text>
          <Text style={styles.menuPrice}>{PRICES.FINANCE_FORECAST} SOL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => generateReading('career')}>
          <Text style={styles.menuIcon}>💼</Text>
          <Text style={styles.menuText}>Career</Text>
          <Text style={styles.menuPrice}>{PRICES.CAREER_GUIDANCE} SOL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => generateReading('decision')}>
          <Text style={styles.menuIcon}>🎯</Text>
          <Text style={styles.menuText}>Decision</Text>
          <Text style={styles.menuPrice}>{PRICES.DECISION_READING} SOL</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.navButton} onPress={() => setCurrentScreen('profile')}>
        <Text style={styles.navButtonText}>⚙️ Profile Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, { borderColor: 'rgba(255, 215, 0, 0.35)' }]}
        onPress={() => setShowDonate((v) => !v)}
      >
        <Text style={styles.navButtonText}>🙏 Donate / Tip the Sage</Text>
      </TouchableOpacity>

      {showDonate ? (
        <View style={styles.donatePanel}>
          <Text style={styles.donateTitle}>Support yun (運)</Text>
          <Text style={styles.donateSubtitle}>
            If you like the reading, you can send a small SOL tip to keep the project alive.
          </Text>

          <Text style={styles.label}>Amount (SOL)</Text>
          <TextInput
            style={styles.input}
            value={donateAmount}
            onChangeText={setDonateAmount}
            placeholder="0.005"
            placeholderTextColor={COLORS.cream}
            keyboardType="decimal-pad"
          />

          <TouchableOpacity
            style={styles.donateButton}
            onPress={() => {
              const amt = Number(donateAmount);
              if (!Number.isFinite(amt) || amt <= 0) {
                Alert.alert('Invalid Amount', 'Enter a valid SOL amount (e.g. 0.01)');
                return;
              }
              donateSol(amt);
            }}
          >
            <Text style={styles.donateButtonText}>💛 Open Wallet to Donate</Text>
          </TouchableOpacity>

          <Text style={styles.donateAddrLabel}>Donation wallet:</Text>
          <Text style={styles.donateAddr}>{DONATION_WALLET}</Text>
        </View>
      ) : null}
    </ScrollView>
  );

  // Render profile screen
  const renderProfile = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.screenTitle}>Profile Settings</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Birth Date (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="1990-01-15"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Birth Time (HH:MM)</Text>
        <TextInput
          style={styles.input}
          value={birthTime}
          onChangeText={setBirthTime}
          placeholder="12:00"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Birth Place</Text>
        <TextInput
          style={styles.input}
          value={birthPlace}
          onChangeText={setBirthPlace}
          placeholder="Hong Kong"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Current Location</Text>
        <TextInput
          style={styles.input}
          value={currentLocation}
          onChangeText={setCurrentLocation}
          placeholder="Hong Kong"
          placeholderTextColor="#666"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={() => setCurrentScreen('home')}>
        <Text style={styles.saveButtonText}>Save & Return</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // Render reading screen
  const renderReading = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.screenTitle}>
        {reading?.type?.toUpperCase()} Reading
      </Text>
      
      {renderReadingDialogue()}
      
      {reading?.data && (
        <View style={styles.resultCard}>
          <Text style={styles.resultText}>
            {JSON.stringify(reading.data, null, 2)}
          </Text>
        </View>
      )}
    </ScrollView>
  );

  // Main render
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBg} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')}>
          <Text style={styles.logo}>運</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          {walletConnected && (
            <Text style={styles.headerPoints}>⭐ {points}</Text>
          )}
        </View>
      </View>

      {/* Screen Content */}
      {currentScreen === 'home' && renderHome()}
      {currentScreen === 'profile' && renderProfile()}
      {currentScreen === 'reading' && renderReading()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.cardBg,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gold,
  },
  logo: {
    fontSize: 32,
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerPoints: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  heroTitle: {
    fontSize: 72,
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  heroSubtitle: {
    fontSize: 24,
    color: COLORS.cream,
    marginTop: -10,
  },
  heroTagline: {
    fontSize: 14,
    color: COLORS.cream,
    marginTop: 8,
  },
  freeTag: {
    fontSize: 16,
    color: COLORS.green,
    marginTop: 12,
    fontWeight: 'bold',
  },
  connectButton: {
    backgroundColor: COLORS.gold,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  connectButtonText: {
    color: COLORS.darkBg,
    fontSize: 18,
    fontWeight: 'bold',
  },
  walletInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.cardBg,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  walletText: {
    color: COLORS.cream,
    fontSize: 14,
  },
  balanceText: {
    color: COLORS.green,
    fontSize: 14,
    fontWeight: 'bold',
  },
  pointsText: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  menuText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuPrice: {
    color: COLORS.gold,
    fontSize: 12,
    marginTop: 4,
  },
  navButton: {
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.cream,
  },
  navButtonText: {
    color: COLORS.cream,
    fontSize: 16,
  },
  screenTitle: {
    fontSize: 24,
    color: COLORS.gold,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.cream,
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.cardBg,
    color: COLORS.cream,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  saveButton: {
    backgroundColor: COLORS.gold,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: COLORS.darkBg,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dialogueContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  npcAvatar: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.cardBg,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  npcEmoji: {
    fontSize: 32,
  },
  dialogueBox: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  npcName: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  dialogueText: {
    color: COLORS.cream,
    fontSize: 14,
    lineHeight: 22,
  },
  continueButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  continueText: {
    color: COLORS.gold,
    fontSize: 14,
  },
  resultCard: {
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  resultText: {
    color: COLORS.cream,
    fontSize: 12,
  },

  donatePanel: {
    marginTop: 12,
    backgroundColor: COLORS.cardBg,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  donateTitle: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  donateSubtitle: {
    color: COLORS.cream,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 10,
    opacity: 0.9,
  },
  donateButton: {
    backgroundColor: COLORS.gold,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  donateButtonText: {
    color: COLORS.darkBg,
    fontSize: 14,
    fontWeight: 'bold',
  },
  donateAddrLabel: {
    marginTop: 10,
    color: COLORS.cream,
    fontSize: 12,
    opacity: 0.8,
  },
  donateAddr: {
    color: COLORS.cream,
    fontSize: 12,
    marginTop: 4,
  },
});
