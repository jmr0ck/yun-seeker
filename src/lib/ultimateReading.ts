/**
 * 完整命理分析系統 - Ultimate Reading Generator
 * 結合八字 + 紫微斗數 + 詳細解讀
 */

import { BirthData } from './types';
import { analyzeWithTenGods, TEN_GOD_MEANINGS } from './fourPillarsAdvanced';
import { generateCompleteReading } from './completeReading';
import { 
  calculatePurpleStar, 
  analyzeLove, 
  analyzeCareer, 
  analyzeRelationships,
  getLuckyElements,
  PALACE_MEANINGS 
} from './purpleStarAdvanced';

// 完整命盤分析
export interface UltimateReading {
  // 基本資料
  basic: {
    birthDate: string;
    zodiac: string;
    dayMaster: string;
    yearPillar: string;
    monthPillar: string;
    dayPillar: string;
    hourPillar: string;
  };
  
  // 十神
  tenGods: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  
  // 五行
  elements: { element: string; count: number; strength: string }[];
  
  // 格局結構
  structures: string[];
  
  // 刑沖合害
  clashes: string[];
  combinations: string[];
  
  // 紫微斗數
  purpleStar: {
    mainStar: string;
    palace: string;
    palaces: Record<string, string>;
    fourHua: { star: string; type: string };
  };
  
  // 事業分析
  career: {
    palace: string;
    traits: string[];
    industries: string[];
    stages: { age: string; focus: string }[];
    entrepreneurial: boolean;
    advice: string;
  };
  
  // 財運分析
  finance: {
    traits: string[];
    risks: string[];
    strategy: string;
    yearly: { year: string; outlook: string }[];
  };
  
  // 桃花/感情
  love: {
    palace: string;
    marriageAge: { min: number; max: number };
    idealType: string[];
    challenges: string[];
    advice: string;
    yearly: { year: string; status: string }[];
  };
  
  // 健康
  health: {
    weakPoints: string[];
    bodyParts: string[];
    advice: string;
  };
  
  // 幸運元素
  lucky: {
    colors: string[];
    directions: string[];
    numbers: number[];
    days: string[];
    months: number[];
  };
  
  // 大運
  daYun: {
    current: { age: string; years: string; theme: string };
    next: { age: string; years: string; theme: string };
    next2: { age: string; years: string; theme: string };
  };
  
  // 流年
  liuNian: {
    2025: { stem: string; branch: string; luck: string; career: string; love: string; finance: string };
    2026: { stem: string; branch: string; luck: string; career: string; love: string; finance: string };
    2027: { stem: string; branch: string; luck: string; career: string; love: string; finance: string };
    2028: { stem: string; branch: string; luck: string; career: string; love: string; finance: string };
  };
  
  // 貴人小人
  relationships: {
   贵人类: string[];
    小人特征: string[];
    advice: string;
  };
  
  // 總結建議
  summary: string;
}

// 生成完整命盤
export function generateUltimateReading(data: BirthData): UltimateReading {
  // 八字分析
  const bazi = analyzeWithTenGods(data);
  const baziReading = generateCompleteReading(data);
  
  // 紫微斗數
  const purple = calculatePurpleStar(data);
  const love = analyzeLove(data);
  const career = analyzeCareer(data);
  const relationships = analyzeRelationships(data);
  const lucky = getLuckyElements(data);
  
  // 流年計算
  const yearNum = (data.year - 2000) % 60;
  const stem2025 = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][(yearNum + 5) % 10];
  const branch2025 = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][(0 + 5) % 12];
  
  const stem2026 = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][(yearNum + 6) % 10];
  const branch2026 = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][(0 + 6) % 12];
  
  const stem2027 = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][(yearNum + 7) % 10];
  const branch2027 = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][(0 + 7) % 12];
  
  const stem2028 = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][(yearNum + 8) % 10];
  const branch2028 = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][(0 + 8) % 12];
  
  // 流年解讀
  const getYearOutlook = (stem: string, branch: string): string => {
    if (['甲', '乙'].includes(stem)) return '⭐⭐⭐⭐ - 學習成長年';
    if (['丙', '丁'].includes(stem)) return '⭐⭐⭐⭐⭐ - 事業高峰年';
    if (['戊', '己'].includes(stem)) return '⭐⭐⭐ - 穩定收獲年';
    if (['庚', '辛'].includes(stem)) return '⭐⭐⭐⭐ - 挑戰突破年';
    return '⭐⭐⭐ - 轉變年';
  };
  
  return {
    basic: {
      birthDate: `${data.year}年${data.month}月${data.day}日 ${data.hour}:00`,
      zodiac: bazi.zodiac,
      dayMaster: `${bazi.day.stem.name}${bazi.day.dayMaster}`,
      yearPillar: `${bazi.year.stem.name}${bazi.year.branch.name}`,
      monthPillar: `${bazi.month.stem.name}${bazi.month.branch.name}`,
      dayPillar: `${bazi.day.stem.name}${bazi.day.branch.name}`,
      hourPillar: `${bazi.hour.stem.name}${bazi.hour.branch.name}`
    },
    tenGods: {
      year: bazi.year.tenGod,
      month: bazi.month.tenGod,
      day: bazi.day.tenGod,
      hour: bazi.hour.tenGod
    },
    elements: bazi.elements,
    structures: bazi.structures,
    clashes: bazi.clashes,
    combinations: bazi.combinations,
    purpleStar: {
      mainStar: purple.dayStar,
      palace: purple.palace,
      palaces: purple.palaces,
      fourHua: purple.fourHua
    },
    career: {
      palace: career.careerPalace,
      traits: career.careerStages.map(s => s.focus),
      industries: career.suitableIndustries,
      stages: career.careerStages,
      entrepreneurial: career.entrepreneurial,
      advice: career.advice
    },
    finance: {
      traits: baziReading.finance.traits,
      risks: baziReading.finance.risks,
      strategy: baziReading.finance.advice,
      yearly: [
        { year: '2025', outlook: '穩中有升' },
        { year: '2026', outlook: '挑戰與機會' },
        { year: '2027', outlook: '收獲季節' },
        { year: '2028', outlook: '新開始' }
      ]
    },
    love: {
      palace: love.marriagePalace,
      marriageAge: love.marriageAge,
      idealType: love.idealMatch,
      challenges: love.redFlag,
      advice: love.advice,
      yearly: [
        { year: '2025', status: '專注事業' },
        { year: '2026', status: '桃花上升' },
        { year: '2027', status: '穩定發展' },
        { year: '2028', status: '可能結婚' }
      ]
    },
    health: {
      weakPoints: baziReading.health.weakPoints,
      bodyParts: ['心臟', '肝臟', '睡眠'],
      advice: baziReading.health.careAdvice
    },
    lucky: {
      colors: lucky.luckyColors,
      directions: lucky.luckyDirections,
      numbers: lucky.luckyNumbers,
      days: lucky.luckyDays,
      months: lucky.luckyMonths
    },
    daYun: {
      current: {
        age: '20-29',
        years: '2021-2031',
        theme: '戊申大運 - 食神生財，靠技能變現'
      },
      next: {
        age: '30-39',
        years: '2031-2041',
        theme: '丁未大運 - 注意人際，穩健發展'
      },
      next2: {
        age: '40-49',
        years: '2041-2051',
        theme: '丙午大運 - 事業高峰期'
      }
    },
    liuNian: {
      2025: {
        stem: stem2025,
        branch: branch2025,
        luck: getYearOutlook(stem2025, branch2025),
        career: '穩定發展',
        love: '專注事業',
        finance: '正財收入'
      },
      2026: {
        stem: stem2026,
        branch: branch2026,
        luck: getYearOutlook(stem2026, branch2026),
        career: '挑戰上升',
        love: '桃花出現',
        finance: '波動但有機會'
      },
      2027: {
        stem: stem2027,
        branch: branch2027,
        luck: getYearOutlook(stem2027, branch2027),
        career: '收獲滿滿',
        love: '穩定戀愛',
        finance: '投資收益'
      },
      2028: {
        stem: stem2028,
        branch: branch2028,
        luck: getYearOutlook(stem2028, branch2028),
        career: '新開始',
        love: '考慮結婚',
        finance: '新規劃'
      }
    },
    relationships: {
      贵人类: ['長輩', '老師', '合作伙伴'],
      小人特征: relationships.小人类征,
      advice: relationships.社交建議
    },
    summary: `你是${bazi.day.stem.name}${bazi.day.dayMaster}日主，${bazi.month.tenGod}在月柱，代表${baziReading.career.traits.join('、')}。${bazi.structures.length > 0 ? '有' + bazi.structures.join('、') + '格局。' : ''}${bazi.clashes.length > 0 ? '注意' + bazi.clashes.join('、') + '帶來的影響。' : ''}建議${career.advice}，${lucky.luckyColors[0]}色是你的幸運色，${lucky.luckyDirections[0]}是你的幸運方向。`
  };
}

export default { generateUltimateReading };
