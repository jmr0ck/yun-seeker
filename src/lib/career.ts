/**
 * 事業 Career Guidance
 * 
 * Career analysis based on 八字, 五行, and 紫微斗數
 */

import { BirthData, Element, BirthChart } from './types';
import { FourPillars } from './fourPillars';
import { FiveElements } from './fiveElements';

export interface CareerProfile {
  strengths: string[];
  idealRoles: string[];
  workStyle: string;
  challenges: string[];
  growthAreas: string[];
  recommendedIndustries: string[];
  favorableConditions: string[];
}

export interface CareerGuidance {
  profile: CareerProfile;
  summary: string;
  detailedAnalysis: string[];
  actionSteps: string[];
}

export class Career {
  private fourPillars: FourPillars;
  private fiveElements: FiveElements;

  constructor() {
    this.fourPillars = new FourPillars();
    this.fiveElements = new FiveElements();
  }

  /**
   * Get comprehensive career guidance
   */
  analyze(data: BirthData): CareerGuidance {
    const chart = this.fourPillars.analyze(data);
    const elements = this.fiveElements.calculateBalance(chart);
    
    const profile = this.buildProfile(chart, elements);
    const summary = this.generateSummary(profile);
    const detailedAnalysis = this.generateAnalysis(chart, elements);
    const actionSteps = this.generateActionSteps(profile);

    return { profile, summary, detailedAnalysis, actionSteps };
  }

  private buildProfile(chart: BirthChart, elements: any[]): CareerProfile {
    const dm = chart.dayMaster;
    const strong = elements.find(e => e.strength === 'strong')?.element;
    const weak = elements.find(e => e.strength === 'weak')?.element;
    const balance = elements.find(e => e.strength === 'balanced')?.element;

    // Day Master career mapping
    const dmCareerMap: Record<string, { roles: string[]; style: string; industries: string[] }> = {
      wood: {
        roles: ['Entrepreneur', 'Marketing Director', 'Tech Leader', 'Growth Hacker', 'Sales Director'],
        style: 'Growth-oriented, ambitious, competitive',
        industries: ['Technology', 'Marketing', 'E-commerce', 'Startups', 'Media'],
      },
      fire: {
        roles: ['Performer', 'Entertainer', 'Sales Executive', 'Sports Coach', 'Brand Ambassador'],
        style: 'Visible, passionate, energetic',
        industries: ['Entertainment', 'Sports', 'Fashion', 'Sales', 'Hospitality'],
      },
      earth: {
        roles: ['Manager', 'Financial Analyst', 'Accountant', 'Real Estate', 'Consultant'],
        style: 'Stable, methodical, practical',
        industries: ['Finance', 'Real Estate', 'Government', 'Legal', 'Consulting'],
      },
      metal: {
        roles: ['Engineer', 'Surgeon', 'Lawyer', 'Military Officer', 'Quality Assurance'],
        style: 'Precise, decisive, systematic',
        industries: ['Engineering', 'Medicine', 'Law', 'Manufacturing', 'Military'],
      },
      water: {
        roles: ['Trader', 'Media Professional', 'Consultant', 'Translator', 'Counselor'],
        style: 'Adaptive, communicative, flexible',
        industries: ['Media', 'Trade', 'Services', 'Education', 'Healthcare'],
      },
    };

    const career = dmCareerMap[dm] || { roles: ['General'], style: 'Balanced', industries: ['All'] };

    // Element strengths
    const elementRoles: Record<string, string[]> = {
      wood: ['Leadership', 'Innovation', 'Strategy'],
      fire: ['Communication', 'Performance', 'Motivation'],
      earth: ['Planning', 'Management', 'Analysis'],
      metal: ['Precision', 'Execution', 'Quality'],
      water: ['Adaptation', 'Mediation', 'Innovation'],
    };

    const strengths = [dm, strong, balance].filter(Boolean).map(e => `${e} energy`).concat(
      elementRoles[strong || dm] || []
    );

    const challenges = [
      `${weak} weakness can cause setbacks`,
      'Overcompensating for weaknesses',
      'Balancing ambition with stability',
    ];

    const growthAreas = [
      `Strengthen ${weak} element through experience`,
      'Develop complementary skills',
      'Seek mentors in weak areas',
    ];

    return {
      strengths,
      idealRoles: career.roles,
      workStyle: career.style,
      challenges,
      growthAreas,
      recommendedIndustries: career.industries,
      favorableConditions: this.getFavorableConditions(dm),
    };
  }

  private getFavorableConditions(dm: Element): string[] {
    const conditions: Record<string, string[]> = {
      wood: ['East Asia', 'Growth companies', 'Morning hours', 'Leadership roles'],
      fire: ['South', 'Entertainment industry', 'Public-facing roles', 'Peak hours'],
      earth: ['Northeast/Southwest', 'Stable organizations', 'Structured environment', 'Long-term projects'],
      metal: ['West/Northwest', 'Precision work', 'Large organizations', 'Deadline-driven'],
      water: ['North', 'Flexible hours', 'International', 'Trade/Diplomacy'],
    };
    return conditions[dm] || ['Various'];
  }

  private generateSummary(profile: CareerProfile): string {
    return `Your ${profile.idealRoles[0]}-type career suits your ${profile.workStyle.toLowerCase()} nature. 
You thrive in ${profile.recommendedIndustries[0]} industries where your ${profile.strengths[0]} can shine. 
Key challenges include ${profile.challenges[0]}.`;
  }

  private generateAnalysis(chart: BirthChart, elements: any[]): string[] {
    const dm = chart.dayMaster;
    const analysis = [];

    analysis.push(`Day Master ${dm} determines your core career energy`);
    
    if (chart.hour?.branch) {
      analysis.push(`Hour branch ${chart.hour.branch.name} shows your work style`);
    }
    
    if (chart.month?.branch) {
      analysis.push(`Month branch ${chart.month.branch.name} influences your career timing`);
    }

    const strong = elements.find(e => e.strength === 'strong');
    const weak = elements.find(e => e.strength === 'weak');
    
    if (strong) {
      analysis.push(`Your ${strong.element} is strong - leverage this in your career`);
    }
    if (weak) {
      analysis.push(`Your ${weak.element} is weak - protect against ${weak.element}-related career risks`);
    }

    return analysis;
  }

  private generateActionSteps(profile: CareerProfile): string[] {
    const steps = [
      `Target roles: ${profile.idealRoles.slice(0, 3).join(', ')}`,
      `Focus industries: ${profile.recommendedIndustries.slice(0, 3).join(', ')}`,
      `Work on: ${profile.growthAreas[0]}`,
      `Watch out for: ${profile.challenges[0]}`,
    ];
    return steps;
  }
}

export default Career;
