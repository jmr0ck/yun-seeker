/**
 * Smart Question Generator
 * Analyzes first, asks only when uncertain
 */

import { BirthData } from './types';

// Analyze siblings from birth data
export function analyzeSiblings(data: BirthData): {
  status: 'likely_only' | 'likely_siblings' | 'unclear';
  confidence: number;
  reason: string;
  question?: string;
} {
  // Simplified analysis from birth data
  // In real app, this would use full Purple Star + Eight Characters
  
  const month = data.month;
  
  // Rule: if born after 1995 in HK, higher chance of being only child (one-child policy)
  if (data.year >= 1980 && data.year <= 2015) {
    if (month >= 1 && month <= 12) {
      // This is a rough heuristic - in real app, use full chart analysis
      return {
        status: 'unclear',
        confidence: 50,
        reason: '需要更多資料確認',
        question: '你有兄弟姐妹嗎？'
      };
    }
  }
  
  return {
    status: 'unclear',
    confidence: 40,
    reason: '無法確定',
    question: '請問你有兄弟姐妹嗎？'
  };
}

// Analyze if parent analysis is possible
export function canAnalyzeParents(data: BirthData): {
  status: 'full' | 'partial' | 'needs_more';
  confidence: number;
  reason: string;
  question?: string;
} {
  // From year pillar, we can get parent info
  // This is always "partial" without parent birth data
  
  return {
    status: 'partial',
    confidence: 70,
    reason: '可從你既八字推斷父母特質，但如果要精確分析父母運勢，需要佢哋既出生日期',
    question: '如果你想睇父母既詳細運勢，可以提供父母既出生日期（年份+月份就得）'
  };
}

// Generate smart questionnaire
export function generateSmartQuestions(data: BirthData): string[] {
  const questions: string[] = [];
  
  const siblings = analyzeSiblings(data);
  if (siblings.question && siblings.confidence < 60) {
    questions.push(siblings.question);
  }
  
  const parents = canAnalyzeParents(data);
  if (parents.question) {
    questions.push(parents.question);
  }
  
  return questions;
}

// Pre-analysis report
export interface PreAnalysis {
  certain: {
    zodiac: string;
    dayMaster: string;
    elements: string;
    structure: string;
  };
  uncertain: {
    siblings: string;
    parents: string;
  };
  questions: string[];
}

export function generatePreAnalysis(data: BirthData): PreAnalysis {
  // This would use the full calculation system
  return {
    certain: {
      zodiac: '分析緊...',
      dayMaster: '分析緊...',
      elements: '分析緊...',
      structure: '分析緊...'
    },
    uncertain: {
      siblings: '需要確認',
      parents: '可以進一步分析'
    },
    questions: generateSmartQuestions(data)
  };
}

export default {
  analyzeSiblings,
  canAnalyzeParents,
  generateSmartQuestions,
  generatePreAnalysis
};
