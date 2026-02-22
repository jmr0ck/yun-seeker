/**
 * Core Types for 運 [Luck]
 */

// ==================== Five Elements ====================

export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type YinYang = 'yang' | 'yin';

export interface Stem {
  name: string;        // e.g., "甲" (Jia)
  pinyin: string;      // e.g., "jia"
  element: Element;
  yinYang: YinYang;
}

export interface Branch {
  name: string;        // e.g., "子" (Zi)
  pinyin: string;      // e.g., "zi"
  animal: string;      // e.g., "Rat"
  element: Element;    // derived from stem in combination
  yinYang: YinYang;
}

// ==================== Four Pillars ====================

export interface Pillar {
  stem: Stem;
  branch: Branch;
}

export interface BirthChart {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  dayMaster: Element;  // Element of the Day Stem
}

export interface BirthData {
  year: number;
  month: number;
  day: number;
  hour: number;       // 0-23
  minute?: number;
  timezone: string;
}

// ==================== Five Elements Analysis ====================

export interface ElementBalance {
  element: Element;
  count: number;
  percentage: number;
  strength: 'strong' | 'balanced' | 'weak';
}

export interface ElementCycle {
  generating: [Element, Element][];  // e.g., Wood generates Fire
  overcoming: [Element, Element][];  // e.g., Wood overcomes Earth
}

// ==================== Chinese Zodiac ====================

export interface ZodiacSign {
  animal: string;      // e.g., "Tiger"
  element: Element;
  yinYang: YinYang;
  year: number;
}

// ==================== Purple Star (紫微斗數) ====================

export type PalaceName = 
  | '命宮' | '兄弟宮' | '夫妻宮' | '子女宮' 
  | '財帛宮' | '疾厄宮' | '遷移宮' | '交友宮'
  | '官祿宮' | '田宅宮' | '福德宮' | '父母宮';

export interface Star {
  name: string;
  chinese: string;
  element: Element;
  nature: 'primary' | 'secondary' | 'auxiliary';
  keywords: string[];
}

export interface Palace {
  name: PalaceName;
  stars: Star[];
  description: string;
}

// ==================== Analysis Results ====================

export interface LuckReading {
  type: 'four-pillars' | 'purple-star' | 'compatibility' | 'timing';
  summary: string;
  details: {
    dayMaster?: Element;
    zodiacSign?: ZodiacSign;
    elementBalance?: ElementBalance[];
    strengths?: string[];
    weaknesses?: string[];
    luckyElements?: {
      colors: string[];
      numbers: number[];
      directions: string[];
      months: number[];
    };
  };
  recommendations?: string[];
}
