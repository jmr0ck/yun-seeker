/**
 * yun - 運 Astrology App
 * Main App Entry Point
 * 
 * Built for Solana Mobile Hackathon
 */

import React, { useState, useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Buffer } from 'buffer';

// Polyfill buffer for React Native
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

// Import yun astrology engine
import { Luck } from './src/lib/yun';

export default function App() {
  // User state
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [points, setPoints] = useState(0);
  
  // Form state
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  
  // Reading state
  const [currentScreen, setCurrentScreen] = useState<'home' | 'profile' | 'reading' | 'wallet'>('home');
  const [reading, setReading] = useState<any>(null);
  const [question, setQuestion] = useState('');

  // Mock wallet connection (replace with real Solana Mobile SDK)
  const connectWallet = async () => {
    // In production: use @solana/mobile-wallet-adapter
    // For demo: simulate wallet connection
    setWalletConnected(true);
    setWalletAddress('7xKXtg2CW87d97TXJSDpbD5iBk8RV1fYSErQQN7G4BQ'); // Demo address
    setPoints(10); // Welcome bonus
    Alert.alert('Wallet Connected!', 'Welcome to 運 yun! 🎉');
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
  };

  // Generate reading based on birth data
  const generateReading = (type: 'chart' | 'question' | 'love' | 'finance' | 'lottery') => {
    if (!birthDate) {
      Alert.alert('Setup Required', 'Please enter your birth details first!');
      setCurrentScreen('profile');
      return;
    }

    // Parse birth data
    const [year, month, day] = birthDate.split('-').map(Number);
    const hour = birthTime ? parseInt(birthTime.split(':')[0]) : 12;

    try {
      const birthData = { year, month, day, hour, timezone: 'Asia/Hong_Kong' };
      
      let result;
      switch (type) {
        case 'chart':
          result = Luck.read(birthData);
          break;
        case 'lottery':
          // Import lottery would go here
          result = { 
            summary: 'Your lucky numbers today',
            numbers: { main: [3, 5, 16, 21, 34, 41] }
          };
          break;
        case 'love':
          const cz = require('./src/lib/chineseZodiac');
          result = { compatibility: '85%', match: 'Rabbit, Tiger, Goat' };
          break;
        case 'finance':
          result = { forecast: 'Your 2026 finance is looking UP! September is your peak month.' };
          break;
        default:
          result = { answer: 'The stars align in your favor.' };
      }
      
      setReading({ type, data: result });
      setCurrentScreen('reading');
    } catch (e) {
      Alert.alert('Error', 'Could not generate reading. Please check your birth data.');
    }
  };

  // Render home screen
  const renderHome = () => (
    <ScrollView style={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>運</Text>
        <Text style={styles.heroSubtitle}>Chinese Astrology on Solana</Text>
        <Text style={styles.heroTagline}>3,000 years of wisdom</Text>
      </View>

      {!walletConnected ? (
        <TouchableOpacity style={styles.connectButton} onPress={connectWallet}>
          <Text style={styles.connectButtonText}>🔗 Connect Wallet</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.walletInfo}>
          <Text style={styles.walletText}>Connected: {walletAddress.slice(0,8)}...{walletAddress.slice(-4)}</Text>
          <Text style={styles.pointsText}>⭐ {points} points</Text>
        </View>
      )}

      <View style={styles.menuGrid}>
        <TouchableOpacity style={styles.menuItem} onPress={() => generateReading('chart')}>
          <Text style={styles.menuIcon}>🎂</Text>
          <Text style={styles.menuText}>Birth Chart</Text>
          <Text style={styles.menuPrice}>0.05 SOL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => generateReading('question')}>
          <Text style={styles.menuIcon}>🔮</Text>
          <Text style={styles.menuText}>Ask Question</Text>
          <Text style={styles.menuPrice}>0.005 SOL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => generateReading('love')}>
          <Text style={styles.menuIcon}>💕</Text>
          <Text style={styles.menuText}>Love</Text>
          <Text style={styles.menuPrice}>0.01 SOL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => generateReading('finance')}>
          <Text style={styles.menuIcon}>💰</Text>
          <Text style={styles.menuText}>Finance</Text>
          <Text style={styles.menuPrice}>0.01 SOL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => generateReading('lottery')}>
          <Text style={styles.menuIcon}>🎱</Text>
          <Text style={styles.menuText}>Lucky Numbers</Text>
          <Text style={styles.menuPrice}>Free</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setCurrentScreen('profile')}>
          <Text style={styles.menuIcon}>👤</Text>
          <Text style={styles.menuText}>My Profile</Text>
          <Text style={styles.menuPrice}>Setup</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Render profile screen
  const renderProfile = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.screenTitle}>Your Profile</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Birth Date</Text>
        <TextInput 
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={birthDate}
          onChangeText={setBirthDate}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Birth Time (hour)</Text>
        <TextInput 
          style={styles.input}
          placeholder="0-23"
          value={birthTime}
          onChangeText={setBirthTime}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Birth Place</Text>
        <TextInput 
          style={styles.input}
          placeholder="City, Country"
          value={birthPlace}
          onChangeText={setBirthPlace}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Current Location</Text>
        <TextInput 
          style={styles.input}
          placeholder="City, Country"
          value={currentLocation}
          onChangeText={setCurrentLocation}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={() => setCurrentScreen('home')}>
        <Text style={styles.saveButtonText}>Save & Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // Render reading screen
  const renderReading = () => (
    <ScrollView style={styles.content}>
      <TouchableOpacity onPress={() => setCurrentScreen('home')}>
        <Text style={styles.backLink}>← Back to Home</Text>
      </TouchableOpacity>

      <Text style={styles.screenTitle}>
        {reading?.type === 'chart' && '🎂 Your Birth Chart'}
        {reading?.type === 'question' && '🔮 Your Answer'}
        {reading?.type === 'love' && '💕 Love Reading'}
        {reading?.type === 'finance' && '💰 Finance Forecast'}
        {reading?.type === 'lottery' && '🎱 Lucky Numbers'}
      </Text>

      <View style={styles.readingCard}>
        {reading?.type === 'chart' && (
          <>
            <Text style={styles.readingText}>{reading.data.summary}</Text>
            <Text style={styles.readingDetail}>Strengths: {reading.data.details.strengths?.join(', ')}</Text>
            <Text style={styles.readingDetail}>Weaknesses: {reading.data.details.weaknesses?.join(', ')}</Text>
            {reading.data.details.luckyElements && (
              <>
                <Text style={styles.readingLabel}>🍀 Lucky Elements:</Text>
                <Text style={styles.readingDetail}>Colors: {reading.data.details.luckyElements.colors?.join(', ')}</Text>
                <Text style={styles.readingDetail}>Numbers: {reading.data.details.luckyElements.numbers?.join(', ')}</Text>
                <Text style={styles.readingDetail}>Directions: {reading.data.details.luckyElements.directions?.join(', ')}</Text>
              </>
            )}
          </>
        )}

        {reading?.type === 'lottery' && (
          <>
            <Text style={styles.readingText}>Your lucky numbers today:</Text>
            <Text style={styles.lotteryNumbers}>{reading.data.numbers.main.join('  ')}</Text>
            <Text style={styles.readingNote}>Good luck! 🍀</Text>
          </>
        )}

        {reading?.type === 'love' && (
          <>
            <Text style={styles.readingText}>Compatibility Score: {reading.data.compatibility}</Text>
            <Text style={styles.readingDetail}>Best matches: {reading.data.match}</Text>
          </>
        )}

        {reading?.type === 'finance' && (
          <>
            <Text style={styles.readingText}>{reading.data.forecast}</Text>
          </>
        )}
      </View>

      <View style={styles.earnPoints}>
        <Text style={styles.pointsEarned}>+5 points earned!</Text>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>運</Text>
        <Text style={styles.headerTitle}>yun</Text>
      </View>

      {/* Main Content */}
      {currentScreen === 'home' && renderHome()}
      {currentScreen === 'profile' && renderProfile()}
      {currentScreen === 'reading' && renderReading()}

      {/* Bottom Nav */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')}>
          <Text style={[styles.navItem, currentScreen === 'home' && styles.navActive]}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentScreen('profile')}>
          <Text style={[styles.navItem, currentScreen === 'profile' && styles.navActive]}>👤</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={walletConnected ? disconnectWallet : connectWallet}>
          <Text style={styles.navItem}>{walletConnected ? '🔓' : '🔗'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  logo: {
    fontSize: 32,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 64,
    color: '#FFD700',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroTagline: {
    fontSize: 14,
    color: '#888888',
  },
  connectButton: {
    backgroundColor: '#9945FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  walletInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  walletText: {
    color: '#888888',
    fontSize: 12,
  },
  pointsText: {
    color: '#FFD700',
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
    backgroundColor: '#1F1F1F',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuPrice: {
    color: '#9945FF',
    fontSize: 12,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1F1F1F',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#9945FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backLink: {
    color: '#9945FF',
    fontSize: 14,
    marginBottom: 16,
  },
  readingCard: {
    backgroundColor: '#1F1F1F',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  readingText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 12,
  },
  readingLabel: {
    color: '#FFD700',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  readingDetail: {
    color: '#AAAAAA',
    fontSize: 14,
    marginBottom: 4,
  },
  lotteryNumbers: {
    color: '#FFD700',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  readingNote: {
    color: '#888888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  earnPoints: {
    backgroundColor: '#1F1F1F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pointsEarned: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1F1F1F',
  },
  navItem: {
    fontSize: 24,
    padding: 8,
  },
  navActive: {
    opacity: 1,
  },
});
