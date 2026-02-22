/**
 * 運 [Luck] - Main Entry Point
 * 
 * Unified interface for Chinese astrology analysis.
 */

import { BirthData, LuckReading, Element } from './types';
import { FourPillars } from './fourPillars';
import { PurpleStar } from './purpleStar';
import { FiveElements } from './fiveElements';
import { ChineseZodiac } from './chineseZodiac';

export class Luck {
  private fourPillars: FourPillars;
  private purpleStar: PurpleStar;
  private fiveElements: FiveElements;
  private chineseZodiac: ChineseZodiac;

  constructor() {
    this.fourPillars = new FourPillars();
    this.purpleStar = new PurpleStar();
    this.fiveElements = new FiveElements();
    this.chineseZodiac = new ChineseZodiac();
  }

  /**
   * Analyze a birth chart using Four Pillars (八字)
   */
  static analyzeBirth(data: BirthData): ReturnType<FourPillars['analyze']> {
    const fp = new FourPillars();
    return fp.analyze(data);
  }

  /**
   * Full reading combining multiple systems
   */
  static read(data: BirthData): LuckReading {
    const fp = new FourPillars();
    const fe = new FiveElements();
    const cz = new ChineseZodiac();

    const fourPillars = fp.analyze(data);
    const elementBalance = fe.calculateBalance(fourPillars);
    const zodiac = cz.getSign(data.year);
    const strengths = fe.getStrengths(elementBalance);
    const weaknesses = fe.getWeaknesses(elementBalance);
    const luckyElements = fe.getLuckyElements(fourPillars.dayMaster);

    const summary = `${zodiac.animal}年 ${fourPillars.dayMaster}日主，${strengths.join('、')}旺，${weaknesses.join('、')}需補。`;

    return {
      type: 'four-pillars',
      summary,
      details: {
        dayMaster: fourPillars.dayMaster,
        zodiacSign: zodiac,
        elementBalance,
        strengths,
        weaknesses,
        luckyElements,
      },
      recommendations: fe.getRecommendations(elementBalance),
    };
  }

  /**
   * Check compatibility between two birth charts
   */
  static compatibility(data1: BirthData, data2: BirthData): {
    score: number;
    summary: string;
    details: string[];
  } {
    const fp1 = new FourPillars().analyze(data1);
    const fp2 = new FourPillars().analyze(data2);
    const fe = new FiveElements();

    return fe.checkCompatibility(fp1, fp2);
  }

  /**
   * Get best timing for an action (择日)
   */
  static getBestTiming(
    targetDate: Date,
    dayMaster: Element,
    purpose: 'business' | 'marriage' | 'travel' | 'construction'
  ): {
    score: number;
    recommended: Date[];
    reason: string;
  } {
    const fe = new FiveElements();
    return fe.getBestTiming(targetDate, dayMaster, purpose);
  }

  /**
   * Get lucky elements for a given Day Master
   */
  static getLuckyElements(dayMaster: Element): {
    colors: string[];
    numbers: number[];
    directions: string[];
    months: number[];
  } {
    const fe = new FiveElements();
    return fe.getLuckyElements(dayMaster);
  }
}

export default Luck;
