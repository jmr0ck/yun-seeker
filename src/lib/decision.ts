/**
 * 决策指导 - Decision Guidance
 * 
 * Based on 八字 and Five Elements to provide decision support
 */

import { BirthData, Element, BirthChart } from './types';
import { FourPillars } from './fourPillars';
import { FiveElements } from './fiveElements';

export interface DecisionQuestion {
  type: 'career' | 'relationship' | 'finance' | 'education' | 'travel' | 'health';
  specificity: 'major' | 'minor';
}

export interface DecisionGuidance {
  question: string;
  answer: string;
  reasoning: string[];
  recommendation: string;
  timing?: {
    best: string;
    avoid: string;
  };
  elements: {
    favorable: Element[];
    unfavorable: Element[];
  };
}

export class DecisionGuidance {
  private fourPillars: FourPillars;
  private fiveElements: FiveElements;

  constructor() {
    this.fourPillars = new FourPillars();
    this.fiveElements = new FiveElements();
  }

  /**
   * Ask a decision question
   */
  ask(data: BirthData, question: string): DecisionGuidance {
    const chart = this.fourPillars.analyze(data);
    const elements = this.fiveElements.calculateBalance(chart);
    
    // Determine question type from keywords
    const type = this.detectQuestionType(question);
    
    let answer = '';
    let reasoning: string[] = [];
    let recommendation = '';
    let timing = undefined;
    
    switch (type) {
      case 'career':
        ({ answer, reasoning, recommendation, timing } = this.careerGuidance(chart, elements));
        break;
      case 'finance':
        ({ answer, reasoning, recommendation, timing } = this.financeGuidance(chart, elements));
        break;
      case 'relationship':
        ({ answer, reasoning, recommendation, timing } = this.relationshipGuidance(chart, elements));
        break;
      case 'education':
        ({ answer, reasoning, recommendation } = this.educationGuidance(chart, elements));
        break;
      case 'travel':
        ({ answer, reasoning, recommendation, timing } = this.travelGuidance(chart, elements));
        break;
      case 'health':
        ({ answer, reasoning, recommendation } = this.healthGuidance(chart, elements));
        break;
      default:
        answer = 'General guidance based on your chart';
        reasoning = [`Day Master: ${chart.dayMaster}`, `Element balance: ${elements.find(e => e.strength === 'strong')?.element}`];
        recommendation = 'Follow your strengths and mitigate your weaknesses';
    }

    const favorable = this.getFavorableElements(elements);
    const unfavorable = this.getUnfavorableElements(elements);

    return {
      question,
      answer,
      reasoning,
      recommendation,
      timing,
      elements: { favorable, unfavorable },
    };
  }

  private detectQuestionType(question: string): 'career' | 'relationship' | 'finance' | 'education' | 'travel' | 'health' {
    const q = question.toLowerCase();
    
    if (q.includes('career') || q.includes('job') || q.includes('work') || q.includes('promotion') || q.includes('boss')) {
      return 'career';
    }
    if (q.includes('money') || q.includes('finance') || q.includes('invest') || q.includes('rich') || q.includes('wealth')) {
      return 'finance';
    }
    if (q.includes('love') || q.includes('marriage') || q.includes('relationship') || q.includes('partner') || q.includes('date')) {
      return 'relationship';
    }
    if (q.includes('study') || q.includes('school') || q.includes('education') || q.includes('exam')) {
      return 'education';
    }
    if (q.includes('travel') || q.includes('move') || q.includes('relocate') || q.includes('trip')) {
      return 'travel';
    }
    if (q.includes('health') || q.includes('sick') || q.includes('doctor') || q.includes('ill')) {
      return 'health';
    }
    
    return 'career'; // default
  }

  private careerGuidance(chart: BirthChart, elements: any[]): { answer: string; reasoning: string[]; recommendation: string; timing?: { best: string; avoid: string } } {
    const dm = chart.dayMaster;
    const strong = elements.find(e => e.strength === 'strong')?.element;
    const weak = elements.find(e => e.strength === 'weak')?.element;
    
    const reasoning = [
      `Day Master (${dm}) is your core energy`,
      `Strong element: ${strong}`,
      `Weak element: ${weak}`,
    ];
    
    let answer = '';
    let recommendation = '';
    
    // Career recommendations based on Day Master
    const careerMap: Record<string, { role: string; industries: string[] }> = {
      wood: { role: 'Leadership & Growth', industries: ['Tech', 'Entrepreneurship', 'Marketing'] },
      fire: { role: 'Performance & Visibility', industries: ['Entertainment', 'Sports', 'Sales'] },
      earth: { role: 'Stability & Structure', industries: ['Finance', 'Real Estate', 'Government'] },
      metal: { role: 'Authority & Precision', industries: ['Law', 'Engineering', 'Military'] },
      water: { role: 'Communication & Flow', industries: ['Media', 'Trade', 'Services'] },
    };
    
    const career = careerMap[dm] || { role: 'General', industries: [] };
    answer = `Your ${dm} Day Master suggests a career in ${career.role}. Best industries: ${career.industries.join(', ')}.`;
    recommendation = `Leverage your ${strong} element. Avoid over-reliance on ${weak}.`;
    
    return { answer, reasoning, recommendation, timing: { best: 'Morning (9AM-11AM)', avoid: 'Late night' } };
  }

  private financeGuidance(chart: BirthChart, elements: any[]): { answer: string; reasoning: string[]; recommendation: string; timing?: { best: string; avoid: string } } {
    const dm = chart.dayMaster;
    const strong = elements.find(e => e.strength === 'strong')?.element;
    const weak = elements.find(e => e.strength === 'weak')?.element;
    
    const reasoning = [
      `Day Master: ${dm}`,
      `Financial strength comes from ${strong} element`,
      `${weak} element may cause financial leaks`,
    ];
    
    let answer = '';
    let recommendation = '';
    
    // Finance recommendations
    const financeMap: Record<string, string> = {
      wood: 'Invest in growth stocks, tech, emerging markets',
      fire: 'Short-term trades, entertainment sector, branding',
      earth: 'Real estate, stable bonds, long-term holdings',
      metal: 'Precious metals, engineering, precise investments',
      water: 'Trade, e-commerce, liquid assets',
    };
    
    answer = financeMap[dm] || 'Diversified portfolio recommended';
    recommendation = `Strengthen ${strong}-related investments. Be cautious with ${weak}-related finances.`;
    
    return { 
      answer, 
      reasoning, 
      recommendation, 
      timing: { best: '7AM-9AM, 1PM-3PM', avoid: '11PM-1AM' } 
    };
  }

  private relationshipGuidance(chart: BirthChart, elements: any[]): { answer: string; reasoning: string[]; recommendation: string; timing?: { best: string; avoid: string } } {
    const dm = chart.dayMaster;
    const dmYinYang = chart.dayStem?.yinYang || 'yang';
    
    const reasoning = [
      `Day Master: ${dm} (${dmYinYang})`,
      `Your relationship style is influenced by ${dm} element`,
    ];
    
    let answer = '';
    let recommendation = '';
    
    const relationMap: Record<string, { style: string; partner: string }> = {
      wood: { style: 'Active, growth-oriented', partner: 'Fire element partner balances well' },
      fire: { style: 'Passionate, intense', partner: 'Earth element provides stability' },
      earth: { style: 'Stable, committed', partner: 'Metal element brings structure' },
      metal: { style: 'Direct, loyal', partner: 'Water element adds flexibility' },
      water: { style: 'Adaptive, flowing', partner: 'Wood element brings growth' },
    };
    
    const rel = relationMap[dm] || { style: 'Balanced', partner: 'Complementary element partner' };
    answer = `Your relationship style: ${rel.style}. ${rel.partner}.`;
    recommendation = 'Focus on compatibility of elements, not just personality.';
    
    return { 
      answer, 
      reasoning, 
      recommendation, 
      timing: { best: 'Evening 5PM-7PM', avoid: 'Early morning before 6AM' } 
    };
  }

  private educationGuidance(chart: BirthChart, elements: any[]): { answer: string; reasoning: string[]; recommendation: string } {
    const dm = chart.dayMaster;
    const strong = elements.find(e => e.strength === 'strong')?.element;
    
    const reasoning = [
      `Day Master: ${dm}`,
      `Strongest element: ${strong}`,
    ];
    
    const eduMap: Record<string, string> = {
      wood: 'Business, Marketing, Technology - fields of growth',
      fire: 'Arts, Performance, Sports - fields of passion',
      earth: 'Finance, Law, Management - fields of stability',
      metal: 'Engineering, Medicine, Law - fields of precision',
      water: 'Communication, Trade, Psychology - fields of flow',
    };
    
    const answer = eduMap[dm] || 'Follow your passion while considering practical outcomes';
    const recommendation = `Your ${strong} element supports learning in related fields.`;
    
    return { answer, reasoning, recommendation };
  }

  private travelGuidance(chart: BirthChart, elements: any[]): { answer: string; reasoning: string[]; recommendation: string; timing?: { best: string; avoid: string } } {
    const dm = chart.dayMaster;
    
    const directionMap: Record<string, string> = {
      wood: 'East, Southeast - growth directions',
      fire: 'South - passion and visibility',
      earth: 'Northeast, Southwest - stability',
      metal: 'West, Northwest - precision',
      water: 'North - flow and adaptability',
    };
    
    const answer = directionMap[dm] || 'All directions can work with proper timing';
    const recommendation = 'Travel during your favorable elements\' time for best experience.';
    
    return { 
      answer, 
      reasoning: [`Day Master: ${dm}`], 
      recommendation, 
      timing: { best: 'Morning', avoid: 'During your weak element hours' } 
    };
  }

  private healthGuidance(chart: BirthChart, elements: any[]): { answer: string; reasoning: string[]; recommendation: string } {
    const dm = chart.dayMaster;
    const weak = elements.find(e => e.strength === 'weak')?.element;
    
    const reasoning = [
      `Day Master: ${dm}`,
      `Weak element: ${weak} - pay attention to related organs`,
    ];
    
    const healthMap: Record<string, { organs: string; caution: string }> = {
      wood: { organs: 'Liver, Gallbladder', caution: 'Avoid excess anger/frustration' },
      fire: { organs: 'Heart, Small Intestine', caution: 'Manage stress and sleep' },
      earth: { organs: 'Spleen, Stomach', caution: 'Watch diet and digestion' },
      metal: { organs: 'Lungs, Large Intestine', caution: 'Respiratory health' },
      water: { organs: 'Kidneys, Bladder', caution: 'Hydration and rest' },
    };
    
    const health = healthMap[dm] || { organs: 'General', caution: 'Balance' };
    const answer = `Focus on ${health.organs}. ${health.caution}.`;
    const recommendation = `Strengthen your ${weak || dm} element through diet and lifestyle.`;
    
    return { answer, reasoning, recommendation };
  }

  private getFavorableElements(elements: any[]): Element[] {
    return elements
      .filter(e => e.strength === 'strong' || e.strength === 'balanced')
      .map(e => e.element);
  }

  private getUnfavorableElements(elements: any[]): Element[] {
    return elements
      .filter(e => e.strength === 'weak')
      .map(e => e.element);
  }
}

export default DecisionGuidance;
