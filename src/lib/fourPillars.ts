/**
 * 八字 - Four Pillars of Destiny
 * 
 * Year, Month, Day, Hour stems & branches
 */

import { BirthData, Pillar, Stem, Branch, Element, YinYang } from './types';

// Heavenly Stems (天干) - 10
const STEMS: Stem[] = [
  { name: '甲', pinyin: 'jia', element: 'wood', yinYang: 'yang' },
  { name: '乙', pinyin: 'yi', element: 'wood', yinYang: 'yin' },
  { name: '丙', pinyin: 'bing', element: 'fire', yinYang: 'yang' },
  { name: '丁', pinyin: 'ding', element: 'fire', yinYang: 'yin' },
  { name: '戊', pinyin: 'wu', element: 'earth', yinYang: 'yang' },
  { name: '己', pinyin: 'ji', element: 'earth', yinYang: 'yin' },
  { name: '庚', pinyin: 'geng', element: 'metal', yinYang: 'yang' },
  { name: '辛', pinyin: 'xin', element: 'metal', yinYang: 'yin' },
  { name: '壬', pinyin: 'ren', element: 'water', yinYang: 'yang' },
  { name: '癸', pinyin: 'gui', element: 'water', yinYang: 'yin' },
];

// Earthly Branches (地支) - 12
const BRANCHES: Branch[] = [
  { name: '子', pinyin: 'zi', animal: 'Rat', element: 'water', yinYang: 'yang' },
  { name: '丑', pinyin: 'chou', animal: 'Ox', element: 'earth', yinYang: 'yin' },
  { name: '寅', pinyin: 'yin', animal: 'Tiger', element: 'wood', yinYang: 'yang' },
  { name: '卯', pinyin: 'mao', animal: 'Rabbit', element: 'wood', yinYang: 'yin' },
  { name: '辰', pinyin: 'chen', animal: 'Dragon', element: 'earth', yinYang: 'yang' },
  { name: '巳', pinyin: 'si', animal: 'Snake', element: 'fire', yinYang: 'yin' },
  { name: '午', pinyin: 'wu', animal: 'Horse', element: 'fire', yinYang: 'yang' },
  { name: '未', pinyin: 'wei', animal: 'Goat', element: 'earth', yinYang: 'yin' },
  { name: '申', pinyin: 'shen', animal: 'Monkey', element: 'metal', yinYang: 'yang' },
  { name: '酉', pinyin: 'you', animal: 'Rooster', element: 'metal', yinYang: 'yin' },
  { name: '戌', pinyin: 'xu', animal: 'Dog', element: 'earth', yinYang: 'yang' },
  { name: '亥', pinyin: 'hai', animal: 'Pig', element: 'water', yinYang: 'yin' },
];

// Stem-Branch combinations (60 cycle)
const SEXAGENARY_CYCLE: { stem: number; branch: number }[] = [];
for (let i = 0; i < 60; i++) {
  SEXAGENARY_CYCLE.push({
    stem: i % 10,
    branch: i % 12,
  });
}

export class FourPillars {
  /**
   * Calculate Four Pillars from birth data
   */
  analyze(data: BirthData): {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
    dayMaster: Element;
  } {
    const yearPillar = this.getYearPillar(data.year);
    const monthPillar = this.getMonthPillar(data.year, data.month);
    const dayPillar = this.getDayPillar(data.year, data.month, data.day);
    const hourPillar = this.getHourPillar(data.hour);

    return {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
      dayMaster: dayPillar.stem.element,
    };
  }

  /**
   * Get year pillar
   */
  private getYearPillar(year: number): Pillar {
    const cycleYear = year - 4; // Cycle starts at 甲子 in 4 BC
    const index = ((cycleYear % 60) + 60) % 60;
    const { stem, branch } = SEXAGENARY_CYCLE[index];
    
    return {
      stem: STEMS[stem],
      branch: BRANCHES[branch],
    };
  }

  /**
   * Get month pillar (depends on year stem)
   * Formula: Month stem = (Year stem × 2 + Month) mod 10
   */
  private getMonthPillar(year: number, month: number): Pillar {
    const cycleYear = year - 4;
    const yearIndex = ((cycleYear % 60) + 60) % 60;
    const yearStem = SEXAGENARY_CYCLE[yearIndex].stem;

    // Month stem formula: (yearStem * 2 + month) % 10
    const monthStem = (yearStem * 2 + month) % 10;

    // Month branches: 子 for Nov, 丑 for Dec, etc.
    // Branch index = (month + 1) % 12
    const monthBranch = (month + 1) % 12;

    return {
      stem: STEMS[monthStem],
      branch: BRANCHES[monthBranch],
    };
  }

  /**
   * Get day pillar (Julian day calculation)
   */
  private getDayPillar(year: number, month: number, day: number): Pillar {
    // Calculate Julian Day Number
    const jd = this.getJulianDayNumber(year, month, day);
    const index = ((jd - 1) % 60 + 60) % 60;
    const { stem, branch } = SEXAGENARY_CYCLE[index];

    return {
      stem: STEMS[stem],
      branch: BRANCHES[branch],
    };
  }

  /**
   * Get hour pillar
   */
  private getHourPillar(hour: number): Pillar {
    // Earthly branch based on hour (2-hour periods)
    const branchIndex = Math.floor((hour + 1) / 2) % 12;
    
    // Stem based on day stem (would need day stem calculation)
    // Simplified: using branch index for now
    const stemIndex = branchIndex;

    return {
      stem: STEMS[stemIndex],
      branch: BRANCHES[branchIndex],
    };
  }

  /**
   * Calculate Julian Day Number
   */
  private getJulianDayNumber(year: number, month: number, day: number): number {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    
    return day + Math.floor((153 * m + 2) / 5) + 
           365 * y + Math.floor(y / 4) - 
           Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  }

  /**
   * Get element balance analysis
   */
  getElementBalance(pillars: { year: Pillar; month: Pillar; day: Pillar; hour: Pillar }): 
    Record<Element, number> {
    const elements: Record<Element, number> = {
      wood: 0, fire: 0, earth: 0, metal: 0, water: 0,
    };

    const countPillar = (pillar: Pillar) => {
      elements[pillar.stem.element]++;
      elements[pillar.branch.element]++;
    };

    countPillar(pillars.year);
    countPillar(pillars.month);
    countPillar(pillars.day);
    countPillar(pillars.hour);

    return elements;
  }
}

export default FourPillars;
