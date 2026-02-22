/**
 * 五行 - Five Elements
 * 
 * Wood (木), Fire (火), Earth (土), Metal (金), Water (水)
 * Generating cycle (相生) & Overcoming cycle (相剋)
 */

import { Element, ElementBalance, BirthChart } from './types';

interface ElementInfo {
  name: Element;
  generating: Element;
  overcomes: Element;
  colors: string[];
  numbers: number[];
  directions: string[];
  seasons: string[];
}

const ELEMENT_DATA: Record<Element, ElementInfo> = {
  wood: {
    name: 'wood',
    generating: 'water',
    overcomes: 'earth',
    colors: ['green', 'blue', 'turquoise'],
    numbers: [3, 4],
    directions: ['east', 'southeast'],
    seasons: ['spring'],
  },
  fire: {
    name: 'fire',
    generating: 'wood',
    overcomes: 'metal',
    colors: ['red', 'orange', 'purple', 'pink'],
    numbers: [2, 7],
    directions: ['south', 'southeast'],
    seasons: ['summer'],
  },
  earth: {
    name: 'earth',
    generating: 'fire',
    overcomes: 'water',
    colors: ['yellow', 'brown', 'beige', 'gold'],
    numbers: [5, 8],
    directions: ['northeast', 'southwest', 'center'],
    seasons: ['late summer'],
  },
  metal: {
    name: 'metal',
    generating: 'earth',
    overcomes: 'wood',
    colors: ['white', 'silver', 'gold', 'gray'],
    numbers: [6, 7],
    directions: ['west', 'northwest'],
    seasons: ['autumn'],
  },
  water: {
    name: 'water',
    generating: 'metal',
    overcomes: 'fire',
    colors: ['black', 'blue', 'dark blue'],
    numbers: [1, 6],
    directions: ['north'],
    seasons: ['winter'],
  },
};

export class FiveElements {
  /**
   * Calculate element balance from Four Pillars
   */
  calculateBalance(chart: BirthChart): ElementBalance[] {
    const counts: Record<Element, number> = {
      wood: 0, fire: 0, earth: 0, metal: 0, water: 0,
    };

    const count = (stem: { element: Element }, branch: { element: Element }) => {
      counts[stem.element]++;
      counts[branch.element]++;
    };

    count(chart.year.stem, chart.year.branch);
    count(chart.month.stem, chart.month.branch);
    count(chart.day.stem, chart.day.branch);
    count(chart.hour.stem, chart.hour.branch);

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    return (Object.keys(counts) as Element[]).map((el) => ({
      element: el,
      count: counts[el],
      percentage: (counts[el] / total) * 100,
      strength: this.getStrengthLevel(counts[el], total),
    }));
  }

  private getStrengthLevel(count: number, total: number): 'strong' | 'balanced' | 'weak' {
    const pct = (count / total) * 100;
    if (pct >= 30) return 'strong';
    if (pct >= 15) return 'balanced';
    return 'weak';
  }

  /**
   * Get strengths (elements that are strong)
   */
  getStrengths(balance: ElementBalance[]): string[] {
    return balance
      .filter((b) => b.strength === 'strong')
      .map((b) => this.getElementNameChinese(b.element));
  }

  /**
   * Get weaknesses (elements that need strengthening)
   */
  getWeaknesses(balance: ElementBalance[]): string[] {
    return balance
      .filter((b) => b.strength === 'weak')
      .map((b) => this.getElementNameChinese(b.element));
  }

  private getElementNameChinese(el: Element): string {
    const names: Record<Element, string> = {
      wood: '木',
      fire: '火',
      earth: '土',
      metal: '金',
      water: '水',
    };
    return names[el];
  }

  /**
   * Get lucky elements for a Day Master
   */
  getLuckyElements(dayMaster: Element): {
    colors: string[];
    numbers: number[];
    directions: string[];
    months: number[];
  } {
    const info = ELEMENT_DATA[dayMaster];
    
    // Lucky elements are those that the Day Master generates or that generate the Day Master
    const lucky: string[] = [];
    
    // The element that generates this one
    lucky.push(info.generating);
    // The element this one generates
    lucky.push(info.overcomes);

    const allColors = new Set<string>();
    const allNumbers = new Set<number>();
    const allDirections = new Set<string>();

    lucky.forEach((el) => {
      const elInfo = ELEMENT_DATA[el as Element];
      if (elInfo) {
        elInfo.colors.forEach((c) => allColors.add(c));
        elInfo.numbers.forEach((n) => allNumbers.add(n));
        elInfo.directions.forEach((d) => allDirections.add(d));
      }
    });

    // Lucky months based on element
    const monthMap: Record<Element, number[]> = {
      wood: [1, 2],      // Tiger, Rabbit months
      fire: [4, 5],      // Snake, Horse months
      earth: [3, 6, 9],  // Dragon, Goat, Monkey months (earth months)
      metal: [7, 8],     // Rooster, Dog months
      water: [10, 11],   // Pig, Rat months
    };

    return {
      colors: Array.from(allColors),
      numbers: Array.from(allNumbers).sort((a, b) => a - b),
      directions: Array.from(allDirections),
      months: monthMap[dayMaster],
    };
  }

  /**
   * Check compatibility between two charts
   */
  checkCompatibility(chart1: BirthChart, chart2: BirthChart): {
    score: number;
    summary: string;
    details: string[];
  } {
    const details: string[] = [];
    let score = 50;

    // Day stem relationship
    const stemInteraction = this.getStemInteraction(chart1.day.stem.element, chart2.day.stem.element);
    score += stemInteraction.score;
    details.push(stemInteraction.detail);

    // Branch (animal) compatibility
    const branchInteraction = this.getBranchInteraction(
      chart1.day.branch.animal,
      chart2.day.branch.animal
    );
    score += branchInteraction.score;
    details.push(branchInteraction.detail);

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    const summary = score >= 70 ? 'Excellent compatibility' :
                    score >= 50 ? 'Good compatibility' :
                    score >= 30 ? 'Challenging compatibility' :
                    'Difficult compatibility';

    return { score, summary, details };
  }

  private getStemInteraction(el1: Element, el2: Element): { score: number; detail: string } {
    // Same element
    if (el1 === el2) return { score: 10, detail: 'Same Day Master element - mutual understanding' };
    
    // Generating cycle
    if (ELEMENT_DATA[el1].generating === el2) return { score: 15, detail: `${el1} generates ${el2} - giving relationship` };
    if (ELEMENT_DATA[el2].generating === el1) return { score: 15, detail: `${el2} generates ${el1} - supportive relationship` };
    
    // Overcoming cycle
    if (ELEMENT_DATA[el1].overcomes === el2) return { score: -10, detail: `${el1} overcomes ${el2} - potential tension` };
    if (ELEMENT_DATA[el2].overcomes === el1) return { score: -10, detail: `${el2} overcomes ${el1} - potential tension` };

    return { score: 0, detail: 'Neutral element relationship' };
  }

  private getBranchInteraction(animal1: string, animal2: string): { score: number; detail: string } {
    // Six Harmonies (六合)
    const harmonies: [string, string][] = [
      ['Rat', 'Ox'], ['Tiger', 'Rabbit'], ['Dragon', 'Snake'],
      ['Horse', 'Goat'], ['Monkey', 'Rooster'], ['Dog', 'Pig'],
    ];
    
    for (const [a, b] of harmonies) {
      if ((animal1 === a && animal2 === b) || (animal1 === b && animal2 === a)) {
        return { score: 20, detail: `Six Harmony: ${animal1} + ${animal2}` };
      }
    }

    // Six Conflicts (六沖)
    const conflicts: [string, string][] = [
      ['Rat', 'Horse'], ['Ox', 'Goat'], ['Tiger', 'Monkey'],
      ['Rabbit', 'Rooster'], ['Dragon', 'Dog'], ['Snake', 'Pig'],
    ];

    for (const [a, b] of conflicts) {
      if ((animal1 === a && animal2 === b) || (animal1 === b && animal2 === a)) {
        return { score: -15, detail: `Six Conflict: ${animal1} + ${animal2} - challenging` };
      }
    }

    return { score: 0, detail: `Neutral: ${animal1} + ${animal2}` };
  }

  /**
   * Get best timing for an action (择日)
   */
  getBestTiming(
    targetDate: Date,
    dayMaster: Element,
    purpose: 'business' | 'marriage' | 'travel' | 'construction'
  ): {
    score: number;
    recommended: Date[];
    reason: string;
  } {
    // Simplified - just return the target with score
    const month = targetDate.getMonth() + 1;
    const day = targetDate.getDate();

    let score = 50;
    let reason = '';

    // Check element of the month
    const monthElements: Record<number, Element> = {
      1: 'water', 2: 'water',
      3: 'wood', 4: 'wood',
      5: 'fire', 6: 'fire',
      7: 'metal', 8: 'metal',
      9: 'earth', 10: 'earth',
      11: 'metal', 12: 'water',
    };

    const monthElement = monthElements[month];
    const dayMasterInfo = ELEMENT_DATA[dayMaster];

    if (monthElement === dayMaster || monthElement === dayMasterInfo.generating) {
      score += 20;
      reason = `Month element supports Day Master`;
    } else if (monthElement === dayMasterInfo.overcomes) {
      score -= 10;
      reason = `Month element overcomes Day Master`;
    }

    return {
      score,
      recommended: [targetDate],
      reason,
    };
  }

  /**
   * Get recommendations based on element balance
   */
  getRecommendations(balance: ElementBalance[]): string[] {
    const recs: string[] = [];
    
    const weak = balance.filter(b => b.strength === 'weak');
    const strong = balance.filter(b => b.strength === 'strong');

    weak.forEach(w => {
      const info = ELEMENT_DATA[w.element];
      recs.push(`Strengthen ${w.element}: Use ${info.colors.join('/')} colors, numbers ${info.numbers.join(', ')}`);
    });

    if (strong.length >= 3) {
      recs.push('Strong chart - you have good foundation, focus on timing');
    }

    return recs;
  }
}

export default FiveElements;
