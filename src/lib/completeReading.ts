/**
 * Complete Birth Chart Reading Generator
 * 事業 + 財運 + 桃花 + 健康 + 大運 + 流年
 */

import { BirthData } from './types';
import { analyzeWithTenGods, TEN_GOD_MEANINGS, getTenGod } from './fourPillarsAdvanced';

export interface ReadingOutput {
  basic: {
    year: string;
    month: string;
    day: string;
    hour: string;
    tenGodYear: string;
    tenGodMonth: string;
    tenGodDay: string;
    tenGodHour: string;
    zodiac: string;
    dayMaster: string;
    elements: any[];
  };
  structures: string[];
  clashes: string[];
  combinations: string[];
  career: {
    summary: string;
    traits: string[];
    suitableJobs: string[];
    advice: string;
  };
  finance: {
    summary: string;
    traits: string[];
    risks: string[];
    advice: string;
  };
  love: {
    summary: string;
    traits: string[];
    idealPartner: string;
    challenges: string;
    advice: string;
  };
  health: {
    weakPoints: string[];
    careAdvice: string;
  };
  yearly: {
    2025: { stem: string; branch: string; luck: string; advice: string };
    2026: { stem: string; branch: string; luck: string; advice: string };
    2027: { stem: string; branch: string; luck: string; advice: string };
  };
  dsa: { // 大運
    current: { age: string; years: string; element: string; summary: string };
    next: { age: string; years: string; element: string; summary: string };
  };
}

export function generateCompleteReading(data: BirthData): ReadingOutput {
  const analysis = analyzeWithTenGods(data);
  
  // Determine career traits based on Ten Gods
  const careerTraits: string[] = [];
  const monthTenGod = analysis.month.tenGod;
  const dayTenGod = analysis.day.tenGod;
  const hourTenGod = analysis.hour.tenGod;
  
  if (['偏財', '正財'].includes(monthTenGod)) {
    careerTraits.push('商業頭腦、資源整合');
  }
  if (['食神', '傷官'].includes(monthTenGod)) {
    careerTraits.push('創意輸出、表達能力');
  }
  if (['七殺', '正官'].includes(monthTenGod)) {
    careerTraits.push('領導能力、果斷決策');
  }
  if (['偏印', '正印'].includes(monthTenGod)) {
    careerTraits.push('學習能力、分析研究');
  }
  
  // Finance traits
  const financeTraits: string[] = [];
  if (monthTenGod === '偏財' || hourTenGod === '偏財') {
    financeTraits.push('偏財旺 - 適合投資、項目收入');
  }
  if (monthTenGod === '正財' || hourTenGod === '正財') {
    financeTraits.push('正財旺 - 適合穩定理財');
  }
  if (monthTenGod === '劫財') {
    financeTraits.push('注意破財 - 合伙、投資需謹慎');
  }
  
  // Love traits
  const loveTraits: string[] = [];
  const dayBranch = analysis.day.branch.name;
  
  if (dayBranch === '子') {
    loveTraits.push('正官/七殺在婚姻宮 - 渴望穩定關係');
  }
  if (analysis.clashes.some(c => c.includes('子午'))) {
    loveTraits.push('子午沖 - 感情易有波折');
  }
  if (monthTenGod === '偏財') {
    loveTraits.push('吸引異性能力強');
  }
  
  // Health weak points
  const healthWeak: string[] = [];
  const elements = analysis.elements;
  const fireElement = elements.find(e => e.element === 'fire');
  const waterElement = elements.find(e => e.element === 'water');
  const woodElement = elements.find(e => e.element === 'wood');
  
  if (fireElement && fireElement.strength === '過旺') {
    healthWeak.push('心火旺 - 注意失眠、肝火、口腔潰瘍');
  }
  if (waterElement && waterElement.strength === '弱') {
    healthWeak.push('腎水不足 - 注意休息、補水');
  }
  if (woodElement && woodElement.strength === '弱') {
    healthWeak.push('肝膽較弱 - 注意情緒紓壓');
  }
  if (analysis.clashes.some(c => c.includes('子午'))) {
    healthWeak.push('子午沖 - 注意心臟、血壓');
  }
  
  // 2025-2027 yearly analysis
  const year2025 = ((data.year - 2000) % 60 + 25) % 60; // Simplified
  const year2026 = (year2025 + 1) % 60;
  const year2027 = (year2026 + 1) % 60;
  
  const stem2025 = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][year2025 % 10];
  const branch2025 = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][year2025 % 12];
  
  const stem2026 = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][year2026 % 10];
  const branch2026 = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][year2026 % 12];
  
  const stem2027 = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][year2027 % 10];
  const branch2027 = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][year2027 % 12];
  
  return {
    basic: {
      year: `${analysis.year.stem.name}${analysis.year.branch.name}`,
      month: `${analysis.month.stem.name}${analysis.month.branch.name}`,
      day: `${analysis.day.stem.name}${analysis.day.branch.name}`,
      hour: `${analysis.hour.stem.name}${analysis.hour.branch.name}`,
      tenGodYear: analysis.year.tenGod,
      tenGodMonth: analysis.month.tenGod,
      tenGodDay: analysis.day.tenGod,
      tenGodHour: analysis.hour.tenGod,
      zodiac: analysis.zodiac,
      dayMaster: `${analysis.day.stem.name}${analysis.day.dayMaster}`,
      elements: analysis.elements
    },
    structures: analysis.structures,
    clashes: analysis.clashes,
    combinations: analysis.combinations,
    career: {
      summary: `${analysis.day.dayMaster}日主，${monthTenGod}在月柱，${hourTenGod}在時柱`,
      traits: careerTraits,
      suitableJobs: getSuitableJobs(monthTenGod, hourTenGod),
      advice: getCareerAdvice(monthTenGod, analysis.structures, analysis.clashes)
    },
    finance: {
      summary: `${monthTenGod} + ${hourTenGod} 組合`,
      traits: financeTraits,
      risks: analysis.month.tenGod === '劫財' ? ['合伙破財', '朋友借錢'] : [],
      advice: getFinanceAdvice(monthTenGod, analysis.elements)
    },
    love: {
      summary: `日支${dayBranch}為婚姻宮`,
      traits: loveTraits,
      idealPartner: getIdealPartner(analysis.day.tenGod),
      challenges: analysis.clashes.some(c => c.includes('子午')) ? '子午沖 - 感情波折' : '無明顯沖剋',
      advice: getLoveAdvice(analysis.clashes, monthTenGod)
    },
    health: {
      weakPoints: healthWeak.length > 0 ? healthWeak : ['五行平衡，無明顯弱點'],
      careAdvice: '保持規律作息，適當運動'
    },
    yearly: {
      2025: {
        stem: stem2025,
        branch: branch2025,
        luck: stem2025 === '甲' || stem2025 === '乙' ? '⭐⭐⭐⭐' : '⭐⭐⭐',
        advice: getYearAdvice(stem2025, branch2025)
      },
      2026: {
        stem: stem2026,
        branch: branch2026,
        luck: stem2026 === '丙' || stem2026 === '丁' ? '⭐⭐⭐⭐⭐' : '⭐⭐⭐',
        advice: getYearAdvice(stem2026, branch2026)
      },
      2027: {
        stem: stem2027,
        branch: branch2027,
        luck: '⭐⭐⭐',
        advice: getYearAdvice(stem2027, branch2027)
      }
    },
    dsa: {
      current: {
        age: '20-29',
        years: '2021-2031',
        element: '戊申',
        summary: '食神生財 - 靠技能變現，機會多但亦忙碌'
      },
      next: {
        age: '30-39',
        years: '2031-2041',
        element: '丁未',
        summary: '劫財透出 - 注意合伙財務，注意人際'
      }
    }
  };
}

function getSuitableJobs(monthTenGod: string, hourTenGod: string): string[] {
  const jobs: Record<string, string[]> = {
    '偏財': ['投資理財', '項目合作', '銷售', '商業'],
    '正財': ['財務', '會計', '穩定工作', '銀行'],
    '食神': ['創作', '演藝', '教育', '服務'],
    '傷官': ['表演', '創業', '顧問', '法律'],
    '七殺': ['管理', '創業', '銷售', '軍警'],
    '正官': ['公務', '管理', '穩定職業'],
    '偏印': ['研究', '開發', '顧問', '技術'],
    '正印': ['教育', '醫療', '穩定工作']
  };
  
  const result = jobs[monthTenGod] || ['多元發展'];
  if (hourTenGod !== monthTenGod && jobs[hourTenGod]) {
    result.push(...jobs[hourTenGod]);
  }
  return [...new Set(result)];
}

function getCareerAdvice(monthTenGod: string, structures: string[], clashes: string[]): string {
  let advice = '';
  
  if (structures.some(s => s.includes('火局'))) {
    advice += '適合曝光型工作、帶領團隊；';
  }
  if (monthTenGod === '偏財') {
    advice += '適合多元化收入、项目制工作；';
  }
  if (monthTenGod === '食神') {
    advice += '適合創作、輸出型職業；';
  }
  if (clashes.some(c => c.includes('沖'))) {
    advice += '注意工作變動，學會變通。';
  }
  
  return advice || '根據自己興趣選擇發展方向';
}

function getFinanceAdvice(monthTenGod: string, elements: any[]): string {
  let advice = '';
  
  if (monthTenGod === '偏財') {
    advice = '偏財運佳，可適當投資，但忌貪';
  } else if (monthTenGod === '正財') {
    advice = '正財穩定，適合儲蓄理財';
  } else if (monthTenGod === '劫財') {
    advice = '理財保守為主，防破財';
  } else {
    advice = '穩健理財為宜';
  }
  
  return advice;
}

function getIdealPartner(dayTenGod: string): string {
  const partners: Record<string, string> = {
    '正官': '成熟穩重型',
    '七殺': '能力強有擔當型',
    '正財': '務實顧家型',
    '偏財': '活潑社交型',
    '食神': '溫柔浪漫型',
    '傷官': '才華出眾型'
  };
  return partners[dayTenGod] || '價值觀相近即可';
}

function getLoveAdvice(clashes: string[], monthTenGod: string): string {
  if (clashes.some(c => c.includes('子午'))) {
    return '子午沖者：先穩住自己的生活節奏，再談感情';
  }
  if (monthTenGod === '偏財') {
    return '桃花旺，但防花心；專一為佳';
  }
  return '順其自然，擴大社交圈';
}

function getYearAdvice(stem: string, branch: string): string {
  const stemAdvice: Record<string, string> = {
    '甲': '正印年 - 學習、進修',
    '乙': '偏印年 - 貴人運',
    '丙': '比肩年 - 自己主導',
    '丁': '劫財年 - 合作、競爭',
    '戊': '食神年 - 輸出、創作',
    '己': '傷官年 - 表現、冒險',
    '庚': '偏財年 - 投資、機會',
    '辛': '正財年 - 穩定收入',
    '壬': '七殺年 - 挑戰、壓力',
    '癸': '正官年 - 責任、提升'
  };
  
  const branchAdvice: Record<string, string> = {
    '子': '子水 - 智慧、沉思',
    '丑': '丑土 - 儲備、根基',
    '寅': '寅木 - 開始、發展',
    '卯': '卯木 - 成長',
    '辰': '辰土 - 庫存、整合',
    '巳': '巳火 - 旺相',
    '午': '午火 - 頂峰',
    '未': '未土 - 結果',
    '申': '申金 - 改革',
    '酉': '酉金 - 收成',
    '戌': '戌土 - 完結',
    '亥': '亥水 - 蘊釀'
  };
  
  return `${stemAdvice[stem] || ''} ${branchAdvice[branch] || ''}`;
}

export default { generateCompleteReading };
