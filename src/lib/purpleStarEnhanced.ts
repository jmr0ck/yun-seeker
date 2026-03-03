/**
 * 紫微斗數 Enhanced - Purple Star Astrology
 * 
 * 12 Palaces, 14 Major Stars + Secondary Stars
 * Complete palace calculation based on birth data
 */

import { Star, Palace, PalaceName, Element, BirthData, BirthChart } from './types';

// 14 Major Stars (十四主星)
const MAJOR_STARS: Star[] = [
  { name: '紫微星', chinese: 'Zi Wei', element: 'earth', nature: 'primary', keywords: ['emperor', 'authority', 'wisdom', 'leadership', 'nobility'] },
  { name: '天機星', chinese: 'Tian Ji', element: 'wood', nature: 'primary', keywords: ['intelligence', 'strategy', 'wisdom', 'cleverness', 'mutation'] },
  { name: '太陽星', chinese: 'Tai Yang', element: 'fire', nature: 'primary', keywords: ['sun', 'masculine', 'fame', 'paternal', 'official'] },
  { name: '武曲星', chinese: 'Wu Qu', element: 'metal', nature: 'primary', keywords: ['finance', 'determination', 'military', 'wealth', 'willpower'] },
  { name: '天府星', chinese: 'Tian Fu', element: 'earth', nature: 'primary', keywords: ['treasury', 'stability', 'conservation', 'prosperity', 'governance'] },
  { name: '天同星', chinese: 'Tian Tong', element: 'water', nature: 'primary', keywords: ['kindness', 'pleasure', 'easy-going', 'fortunate', 'youth'] },
  { name: '廉貞星', chinese: 'Lian Zhen', element: 'fire', nature: 'primary', keywords: ['integrity', 'justice', 'strictness', 'romance', 'cleanness'] },
  { name: '太陰星', chinese: 'Tai Yin', element: 'water', nature: 'primary', keywords: ['moon', 'feminine', 'arts', 'maternal', 'quiet'] },
  { name: '貪狼星', chinese: 'Tan Lang', element: 'wood', nature: 'primary', keywords: ['desire', 'ambition', 'talent', 'material', 'greed'] },
  { name: '巨門星', chinese: 'Ju Men', element: 'water', nature: 'primary', keywords: ['gate', 'hidden', 'secret', 'controversy', 'eloquence'] },
  { name: '天相星', chinese: 'Tian Xiang', element: 'water', nature: 'primary', keywords: ['minister', 'diplomat', 'loyalty', 'support', 'appearance'] },
  { name: '天梁星', chinese: 'Tian Liang', element: 'earth', nature: 'primary', keywords: ['pillar', 'protection', 'wisdom', 'nurturing', 'medicine'] },
  { name: '七殺星', chinese: 'Qi Sha', element: 'metal', nature: 'primary', keywords: ['military', 'power', 'danger', 'heroism', 'sudden'] },
  { name: '破軍星', chinese: 'Po Jun', element: 'water', nature: 'primary', keywords: ['destruction', 'rebellion', 'change', 'transformation', 'innovation'] },
];

// Secondary Stars (輔星)
const SECONDARY_STARS: Star[] = [
  { name: '左輔星', chinese: 'Zuo Fu', element: 'water', nature: 'secondary', keywords: ['assistant', 'support', 'helpful'] },
  { name: '右弼星', chinese: 'You Bi', element: 'water', nature: 'secondary', keywords: ['helper', 'guidance', 'literary'] },
  { name: '文昌星', chinese: 'Wen Chang', element: 'metal', nature: 'secondary', keywords: ['scholarship', 'exam', 'education'] },
  { name: '文曲星', chinese: 'Wen Qu', element: 'water', nature: 'secondary', keywords: ['arts', 'talent', 'creativity'] },
  { name: '天魁星', chinese: 'Tian Kui', element: 'metal', nature: 'secondary', keywords: ['noble', 'help', 'opportunity'] },
  { name: '天鉞星', chinese: 'Tian Yue', element: 'metal', nature: 'secondary', keywords: ['honor', 'recognition', 'government'] },
  { name: '火星', chinese: 'Huo Xing', element: 'fire', nature: 'secondary', keywords: ['fire', 'energy', 'passion'] },
  { name: '鈴星', chinese: 'Ling Xing', element: 'fire', nature: 'secondary', keywords: ['bell', 'sound', 'alert'] },
  { name: '擎羊星', chinese: 'Qian Yang', element: 'metal', nature: 'secondary', keywords: ['hurt', 'obstacle', 'conflict'] },
  { name: '陀羅星', chinese: 'Tuo Luo', element: 'metal', nature: 'secondary', keywords: ['delay', 'obstruction', '沉溺'] },
  { name: '天馬星', chinese: 'Tian Ma', element: 'fire', nature: 'secondary', keywords: ['horse', 'travel', 'movement'] },
  { name: '空亡星', chinese: 'Kong Wang', element: 'void', nature: 'secondary', keywords: ['empty', 'loss', 'uncertainty'] },
];

// 12 Palaces (十二宮)
const PALACES: Record<PalaceName, { 
  description: string; 
  areas: string[];
  body: string;
  meaning: string;
}> = {
  '命宮': {
    description: 'Self Palace - Life, personality, physical body',
    areas: ['self', 'personality', 'health', 'early life'],
    body: 'Head, face',
    meaning: 'Your core self, personality, and life path',
  },
  '兄弟宮': {
    description: 'Siblings Palace - Brothers, sisters, colleagues',
    areas: ['siblings', 'colleagues', 'support network'],
    body: 'Shoulders, arms',
    meaning: 'Your support system and relationships with peers',
  },
  '夫妻宮': {
    description: 'Spouse Palace - Marriage, romantic relationships',
    areas: ['marriage', 'partnership', 'romance'],
    body: 'Eyes',
    meaning: 'Your romantic relationships and marriage luck',
  },
  '子女宮': {
    description: 'Children Palace - Children, progeny, creativity',
    areas: ['children', 'creativity', 'talents'],
    body: 'Genitals, knees',
    meaning: 'Your creative output and relationship with children',
  },
  '財帛宮': {
    description: 'Wealth Palace - Money, finances, possessions',
    areas: ['wealth', 'finances', 'income'],
    body: 'Feet, toes',
    meaning: 'Your financial luck and wealth accumulation',
  },
  '疾厄宮': {
    description: 'Health Palace - Health, illnesses, accidents',
    areas: ['health', 'illness', 'well-being'],
    body: 'Stomach, intestines',
    meaning: 'Your health vulnerabilities and recovery ability',
  },
  '遷移宮': {
    description: 'Travel Palace - Travel, external affairs, reputation',
    areas: ['travel', 'external affairs', 'reputation'],
    body: 'Thighs',
    meaning: 'Your external interactions and travel luck',
  },
  '交友宮': {
    description: 'Friends Palace - Friends, subordinates, social circle',
    areas: ['friends', 'subordinates', 'social network'],
    body: 'Calves',
    meaning: 'Your social connections and helper relationships',
  },
  '官祿宮': {
    description: 'Career Palace - Career, job, education',
    areas: ['career', 'job', 'education', 'achievements'],
    body: 'Buttocks',
    meaning: 'Your career prospects and work achievements',
  },
  '田宅宮': {
    description: 'Property Palace - Home, property, ancestors',
    areas: ['home', 'property', 'ancestral blessings'],
    body: 'Urogenital',
    meaning: 'Your property luck and family assets',
  },
  '福德宮': {
    description: 'Fortune Palace - Fortune, happiness, spiritual',
    areas: ['fortune', 'happiness', 'spiritual life'],
    body: 'Mind, spirit',
    meaning: 'Your spiritual luck and享用福气的能力',
  },
  '父母宮': {
    description: 'Parents Palace - Parents, lineage, boss',
    areas: ['parents', 'boss', 'authority figures'],
    body: 'Head, hair',
    meaning: 'Your relationship with parents and authority',
  },
};

export class PurpleStarEnhanced {
  private majorStars: Star[] = MAJOR_STARS;
  private secondaryStars: Star[] = SECONDARY_STARS;

  /**
   * Calculate palace distribution from birth data
   * Uses a more sophisticated algorithm based on Stem-Branch combinations
   */
  calculatePalaces(data: BirthData): Map<PalaceName, Star[]> {
    const palaces = new Map<PalaceName, Star[]>();
    const palaceNames: PalaceName[] = [
      '命宮', '兄弟宮', '夫妻宮', '子女宮',
      '財帛宮', '疾厄宮', '遷移宮', '交友宮',
      '官祿宮', '田宅宮', '福德宮', '父母宮',
    ];

    // Calculate starting position based on year stem
    // Different stems have different "leap" patterns
    const yearStem = data.year % 10;
    const monthBranch = (data.month % 12);
    const dayBranch = (data.day % 12);
    
    // Base position calculation (simplified)
    let basePosition = (yearStem + monthBranch + dayBranch) % 12;
    
    // Day stem influences the "ruling star" position
    const dayStem = (data.year + data.month + data.day) % 10;
    const rulingStarIndex = dayStem % 14;

    palaceNames.forEach((palace, i) => {
      const mainStarIndex = (basePosition + i) % 14;
      const secondaryStarIndex = (basePosition + i * 2) % 12;
      const tertiaryStarIndex = (basePosition + i * 3) % 14;
      
      const mainStar = this.majorStars[mainStarIndex];
      const secondaryStar = this.secondaryStars[secondaryStarIndex] || this.majorStars[tertiaryStarIndex];
      
      // Add ruling star to specific palaces
      const rulingStar = this.majorStars[rulingStarIndex];
      
      // Life Palace (命宮) gets the ruling star
      if (i === 0) {
        palaces.set(palace, [rulingStar, mainStar, secondaryStar].filter(Boolean));
      } else {
        palaces.set(palace, [mainStar, secondaryStar].filter(Boolean));
      }
    });

    return palaces;
  }

  /**
   * Get detailed palace reading
   */
  readPalace(palace: PalaceName, stars: Star[]): {
    name: string;
    meaning: string;
    body: string;
    mainStar: Star | null;
    influences: Star[];
    interpretation: string;
    advice: string[];
  } {
    const info = PALACES[palace];
    const mainStar = stars[0] || null;
    const influences = stars.slice(1);

    let interpretation = '';
    const advice: string[] = [];

    if (mainStar) {
      // Generate interpretation based on main star
      const keywords = mainStar.keywords.join(', ');
      interpretation = `${info.meaning}. Main influence: ${mainStar.name} (${mainStar.chinese}) - ${keywords}.`;
      
      // Generate advice based on star nature
      if (mainStar.keywords.includes('emperor') || mainStar.keywords.includes('authority')) {
        advice.push('You have natural leadership abilities');
        advice.push('Focus on positions of authority');
      }
      if (mainStar.keywords.includes('finance') || mainStar.keywords.includes('wealth')) {
        advice.push('Financial matters are favorable');
        advice.push('Consider wealth management roles');
      }
      if (mainStar.keywords.includes('wisdom') || mainStar.keywords.includes('intelligence')) {
        advice.push('Use your intelligence to advance');
        advice.push('Consultative or strategic roles suit you');
      }
      if (mainStar.keywords.includes('military') || mainStar.keywords.includes('power')) {
        advice.push('You have decisive power - use it wisely');
        advice.push('Structured environments benefit you');
      }
      if (mainStar.keywords.includes('arts') || mainStar.keywords.includes('talent')) {
        advice.push('Creative pursuits will bring fulfillment');
        advice.push('Balance art with practical considerations');
      }
    }

    // Add influence advice
    if (influences.length > 0) {
      advice.push(`Secondary influences: ${influences.map(s => s.name).join(', ')}`);
    }

    return {
      name: palace,
      meaning: info.meaning,
      body: info.body,
      mainStar,
      influences,
      interpretation,
      advice,
    };
  }

  /**
   * Get full destiny reading
   */
  fullReading(data: BirthData): {
    palaces: Map<PalaceName, Star[]>;
    readings: Record<PalaceName, any>;
    summary: string;
  } {
    const palaces = this.calculatePalaces(data);
    const readings: Record<PalaceName, any> = {};
    const palaceNames: PalaceName[] = [
      '命宮', '兄弟宮', '夫妻宮', '子女宮',
      '財帛宮', '疾厄宮', '遷移宮', '交友宮',
      '官祿宮', '田宅宮', '福德宮', '父母宮',
    ];

    palaceNames.forEach(palace => {
      const stars = palaces.get(palace) || [];
      readings[palace] = this.readPalace(palace, stars);
    });

    // Generate overall summary
    const lifePalace = readings['命宮'];
    const careerPalace = readings['官祿宮'];
    const wealthPalace = readings['財帛宮'];
    
    const summary = `Your destiny centers on ${lifePalace?.mainStar?.name || 'a balanced chart'}. 
Career shows ${careerPalace?.mainStar?.name || 'neutral'} influence. 
Financial luck indicates ${wealthPalace?.mainStar?.name || 'stability'}.`;

    return { palaces, readings, summary };
  }

  /**
   * Get palace information
   */
  getPalaceInfo(): Record<PalaceName, { description: string; areas: string[]; body: string; meaning: string }> {
    return PALACES;
  }

  /**
   * Get all major stars
   */
  getStars(): Star[] {
    return [...this.majorStars, ...this.secondaryStars];
  }
}

export default PurpleStarEnhanced;
