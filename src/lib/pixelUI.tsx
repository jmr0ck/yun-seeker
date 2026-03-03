/**
 * Pixel Art UI Components
 * RPG-style dialogue and interface elements
 */

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

// Import pixel art assets
const PIXEL_ASSETS = {
  dialogueBox: require('../../assets/pixel_art/dialogue_box.png'),
  sageNPC: require('../../assets/pixel_art/sage_npc.png'),
  dragonSpirit: require('../../assets/pixel_art/dragon_spirit.png'),
  turtleCompanion: require('../../assets/pixel_art/turtle_companion.png'),
  mainMenuBg: require('../../assets/pixel_art/main_menu_bg.png'),
};

// Color palette (inspired by retro games)
export const PIXEL_COLORS = {
  gold: '#FFD700',
  darkGold: '#B8860B',
  red: '#DC143C',
  darkRed: '#8B0000',
  green: '#228B22',
  darkGreen: '#006400',
  blue: '#4169E1',
  darkBlue: '#191970',
  purple: '#8B008B',
  black: '#1a1a2e',
  darkBlack: '#0f0f1a',
  white: '#FFFFFF',
  cream: '#FFFDD0',
  lightBrown: '#DEB887',
  brown: '#8B4513',
};

// Pixel font styles
export const PIXEL_FONTS = {
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: PIXEL_COLORS.gold,
    textShadowColor: PIXEL_COLORS.darkGold,
    textShadowOffset: { width: 2, height: 2 },
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: PIXEL_COLORS.cream,
  },
  body: {
    fontSize: 14,
    color: PIXEL_COLORS.cream,
    lineHeight: 22,
  },
  button: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: PIXEL_COLORS.darkBlack,
  },
  npcName: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: PIXEL_COLORS.gold,
    fontStyle: 'italic' as const,
  },
};

// Dialogue Box Component
interface DialogueBoxProps {
  speaker?: string;
  text: string;
  avatar?: 'sage' | 'dragon' | 'turtle';
  onContinue?: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ 
  speaker = 'Sage Elder', 
  text, 
  avatar = 'sage',
  onContinue 
}) => {
  const avatarSource = {
    sage: PIXEL_ASSETS.sageNPC,
    dragon: PIXEL_ASSETS.dragonSpirit,
    turtle: PIXEL_ASSETS.turtleCompanion,
  }[avatar];

  return (
    <View style={styles.dialogueContainer}>
      <View style={styles.dialogueBox}>
        <View style={styles.avatarContainer}>
          <Image source={avatarSource} style={styles.avatar} />
        </View>
        <View style={styles.dialogueContent}>
          <Text style={styles.npcName}>{speaker}</Text>
          <Text style={styles.dialogueText}>{text}</Text>
          {onContinue && (
            <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
              <Text style={styles.continueText}>▼ Continue</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

// Menu Button Component
interface PixelButtonProps {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'gold';
  disabled?: boolean;
}

export const PixelButton: React.FC<PixelButtonProps> = ({ 
  text, 
  onPress, 
  variant = 'primary',
  disabled = false 
}) => {
  const buttonColors = {
    primary: { bg: PIXEL_COLORS.blue, text: PIXEL_COLORS.white },
    secondary: { bg: PIXEL_COLORS.green, text: PIXEL_COLORS.white },
    gold: { bg: PIXEL_COLORS.gold, text: PIXEL_COLORS.darkBlack },
  };

  const colors = buttonColors[variant];

  return (
    <TouchableOpacity 
      style={[
        styles.pixelButton, 
        { backgroundColor: colors.bg },
        disabled && styles.disabledButton
      ]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.pixelButtonText, { color: colors.text }]}>{text}</Text>
    </TouchableOpacity>
  );
};

// Header Component
interface PixelHeaderProps {
  title: string;
  subtitle?: string;
}

export const PixelHeader: React.FC<PixelHeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.header}>
      <Text style={PIXEL_FONTS.title}>{title}</Text>
      {subtitle && <Text style={PIXEL_FONTS.subtitle}>{subtitle}</Text>}
    </View>
  );
};

// Card Component
interface PixelCardProps {
  title: string;
  children: React.ReactNode;
  onPress?: () => void;
}

export const PixelCard: React.FC<PixelCardProps> = ({ title, children, onPress }) => {
  const CardContainer = onPress ? TouchableOpacity : View;
  
  return (
    <CardContainer style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        {children}
      </View>
    </CardContainer>
  );
};

// Price Tag Component
interface PriceTagProps {
  amount: number;
  label: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({ amount, label }) => {
  return (
    <View style={styles.priceTag}>
      <Text style={styles.priceText}>💎 {amount} SOL</Text>
      <Text style={styles.priceLabel}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // Header
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: PIXEL_COLORS.darkBlack,
    borderBottomWidth: 4,
    borderBottomColor: PIXEL_COLORS.gold,
  },

  // Dialogue Box
  dialogueContainer: {
    padding: 10,
  },
  dialogueBox: {
    flexDirection: 'row',
    backgroundColor: PIXEL_COLORS.darkBlack,
    borderWidth: 3,
    borderColor: PIXEL_COLORS.gold,
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  dialogueContent: {
    flex: 1,
  },
  npcName: {
    ...PIXEL_FONTS.npcName,
    marginBottom: 8,
  },
  dialogueText: {
    ...PIXEL_FONTS.body,
    flex: 1,
  },
  continueButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  continueText: {
    color: PIXEL_COLORS.gold,
    fontSize: 12,
  },

  // Pixel Button
  pixelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 3,
    borderColor: PIXEL_COLORS.darkBlack,
    borderRadius: 4,
    marginVertical: 6,
    alignItems: 'center',
  },
  pixelButtonText: {
    ...PIXEL_FONTS.button,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },

  // Card
  card: {
    backgroundColor: PIXEL_COLORS.darkBlack,
    borderWidth: 2,
    borderColor: PIXEL_COLORS.gold,
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: PIXEL_COLORS.darkGold,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cardTitle: {
    color: PIXEL_COLORS.darkBlack,
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  cardContent: {
    padding: 12,
  },

  // Price Tag
  priceTag: {
    alignItems: 'center',
    backgroundColor: PIXEL_COLORS.darkBlue,
    padding: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: PIXEL_COLORS.gold,
  },
  priceText: {
    color: PIXEL_COLORS.gold,
    fontWeight: 'bold',
    fontSize: 16,
  },
  priceLabel: {
    color: PIXEL_COLORS.cream,
    fontSize: 10,
    marginTop: 2,
  },
});

export default {
  DialogueBox,
  PixelButton,
  PixelHeader,
  PixelCard,
  PriceTag,
  PIXEL_COLORS,
  PIXEL_FONTS,
};
