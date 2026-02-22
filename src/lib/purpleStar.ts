/**
 * 紫微斗數 - Purple Star Astrology
 * 
 * 12 Palaces, 14 Major Stars, lunar calendar based
 */

import { Star, Palace, PalaceName, Element } from './types';

// 14 Major Stars (十四主星)
const MAJOR_STARS: Star[] = [
  {
    name: '紫微星',
    chinese: 'Zi Wei',
    element: 'earth',
    nature: 'primary',
    keywords: ['emperor', 'authority', 'wisdom', 'leadership'],
  },
  {
    name: '天機星',
    chinese: 'Tian Ji',
    element: 'wood',
    nature: 'primary',
    keywords: ['intelligence', 'strategy', 'wisdom', 'cleverness'],
  },
  {
    name: '太陽星',
    chinese: 'Tai Yang',
    element: 'fire',
    nature: 'primary',
    keywords: ['sun', 'masculine', 'fame', 'paternal'],
  },
  {
    name: '武曲星',
    chinese: 'Wu Qu',
    element: 'metal',
    nature: 'primary',
    keywords: ['finance', 'determination', 'military', 'wealth'],
  },
  {
    name: '天府星',
    chinese: 'Tian Fu',
    element: 'earth',
    nature: 'primary',
    keywords: ['treasury', 'stability', 'conservation', 'prosperity'],
  },
  {
    name: '天同星',
    chinese: 'Tian Tong',
    element: 'water',
    nature: 'primary',
    keywords: ['kindness', 'pleasure', 'easy-going', 'fortunate'],
  },
  {
    name: '廉貞星',
    chinese: 'Lian Zhen',
    element: 'fire',
    nature: 'primary',
    keywords: ['integrity', 'justice', 'strictness', 'romance'],
  },
  {
    name: '太陰星',
    chinese: 'Tai Yin',
    element: 'water',
    nature: 'primary',
    keywords: ['moon', 'feminine', 'arts', 'maternal'],
  },
  {
    name: '貪狼星',
    chinese: 'Tan Lang',
    element: 'wood',
    nature: 'primary',
    keywords: ['desire', 'ambition', 'talent', 'material'],
  },
  {
    name: '巨門星',
    chinese: 'Ju Men',
    element: 'water',
    nature: 'primary',
    keywords: ['gate', 'hidden', 'secret', 'controversy'],
  },
  {
    name: '天相星',
    chinese: 'Tian Xiang',
    element: 'water',
    nature: 'primary',
    keywords: ['minister', 'diplomat', 'loyalty', 'support'],
  },
  {
    name: '天梁星',
    chinese: 'Tian Liang',
    element: 'earth',
    nature: 'primary',
    keywords: ['pillar', 'protection', 'wisdom', 'nurturing'],
  },
  {
    name: '七殺星',
    chinese: 'Qi Sha',
    element: 'metal',
    nature: 'primary',
    keywords: ['military', 'power', 'danger', 'heroism'],
  },
  {
    name: '破軍星',
    chinese: 'Po Jun',
    element: 'water',
    nature: 'primary',
    keywords: ['destruction', 'rebellion', 'change', 'transformation'],
  },
];

// 12 Palaces (十二宮)
const PALACES: Record<PalaceName, { description: string; areas: string[] }> = {
  '命宮': {
    description: 'Self Palace - Life, personality, physical body',
    areas: ['self', 'personality', 'health', 'early life'],
  },
  '兄弟宮': {
    description: 'Siblings Palace - Brothers, sisters, colleagues',
    areas: ['siblings', 'colleagues', 'support network'],
  },
  '夫妻宮': {
    description: 'Spouse Palace - Marriage, romantic relationships',
    areas: ['marriage', 'partnership', 'romance'],
  },
  '子女宮': {
    description: 'Children Palace - Children, progeny, creativity',
    areas: ['children', 'creativity', 'talents'],
  },
  '財帛宮': {
    description: 'Wealth Palace - Money, finances, possessions',
    areas: ['wealth', 'finances', 'income'],
  },
  '疾厄宮': {
    description: 'Health Palace - Health, illnesses, accidents',
    areas: ['health', 'illness', 'well-being'],
  },
  '遷移宮': {
    description: 'Travel Palace - Travel, external affairs, reputation',
    areas: ['travel', 'external affairs', 'reputation'],
  },
  '交友宮': {
    description: 'Friends Palace - Friends, subordinates, social circle',
    areas: ['friends', 'subordinates', 'social network'],
  },
  '官祿宮': {
    description: 'Career Palace - Career, job, education',
    areas: ['career', 'job', 'education', 'achievements'],
  },
  '田宅宮': {
    description: 'Property Palace - Home, property, ancestors',
    areas: ['home', 'property', 'ancestral blessings'],
  },
  '福德宮': {
    description: 'Fortune Palace - Fortune, happiness, spiritual',
    areas: ['fortune', 'happiness', 'spiritual life'],
  },
  '父母宮': {
    description: 'Parents Palace - Parents, lineage, boss',
    areas: ['parents', 'boss', 'authority figures'],
  },
};

export class PurpleStar {
  private stars: Star[] = MAJOR_STARS;

  /**
   * Get all major stars
   */
  getStars(): Star[] {
    return this.stars;
  }

  /**
   * Get star by name
   */
  getStar(name: string): Star | undefined {
    return this.stars.find(
      (s) => s.name === name || s.chinese === name || s.name.includes(name)
    );
  }

  /**
   * Get palace by name
   */
  getPalace(name: PalaceName): Palace | undefined {
    const info = PALACES[name];
    if (!info) return undefined;

    return {
      name,
      stars: [], // Would be calculated from birth data
      description: info.description,
    };
  }

  /**
   * Calculate palaces from birth data (simplified)
   * In reality, this requires complex lunar calendar calculations
   */
  calculatePalaces(
    year: number,
    month: number,
    day: number,
    hour: number
  ): Map<PalaceName, Star[]> {
    const palaces = new Map<PalaceName, Star[]>();

    // Simplified: Assign stars based on a simple rotation
    // Real calculation would require precise lunar calendar data
    const palaceNames: PalaceName[] = [
      '命宮', '兄弟宮', '夫妻宮', '子女宮',
      '財帛宮', '疾厄宮', '遷移宮', '交友宮',
      '官祿宮', '田宅宮', '福德宮', '父母宮',
    ];

    // Simple distribution based on day of month
    const startIndex = (day % 12);

    palaceNames.forEach((palace, i) => {
      const starIndex = (startIndex + i) % this.stars.length;
      const star = this.stars[starIndex];
      // Add secondary stars for more complexity
      const secondaryIndex = (startIndex + i + 5) % this.stars.length;
      const secondaryStar = this.stars[secondaryIndex];
      
      palaces.set(palace, [star, secondaryStar]);
    });

    return palaces;
  }

  /**
   * Get palace descriptions
   */
  getPalaceInfo(): Record<PalaceName, { description: string; areas: string[] }> {
    return PALACES;
  }

  /**
   * Interpret a palace reading
   */
  interpretPalace(
    palace: PalaceName,
    stars: Star[]
  ): {
    summary: string;
    analysis: string[];
    suggestions: string[];
  } {
    const palaceInfo = PALACES[palace];
    const mainStar = stars[0];
    
    const summary = `${palace}: ${mainStar?.name || 'No major star'} influences`;

    const analysis = [
      `Primary star: ${mainStar?.name || 'None'} (${mainStar?.nature})`,
      `Element: ${mainStar?.element || 'Unknown'}`,
      `Keywords: ${mainStar?.keywords.join(', ') || 'N/A'}`,
    ];

    const suggestions: string[] = [];
    
    // Add suggestions based on star nature
    if (mainStar) {
      if (mainStar.keywords.includes('wealth') || mainStar.keywords.includes('finance')) {
        suggestions.push('Focus on financial planning and asset accumulation');
      }
      if (mainStar.keywords.includes('career') || mainStar.keywords.includes('authority')) {
        suggestions.push('Career advancement through leadership and recognition');
      }
      if (mainStar.keywords.includes('relationship') || mainStar.keywords.includes('marriage')) {
        suggestions.push('Relationships require attention and nurturing');
      }
      if (mainStar.keywords.includes('health')) {
        suggestions.push('Prioritize health and preventive care');
      }
    }

    return { summary, analysis, suggestions };
  }
}

export default PurpleStar;
