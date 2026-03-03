/**
 * 紫微斗數 (Purple Star Astrology) - Advanced
 * 12宮位 + 之星 + 四化詳細分析
 */

import { BirthData } from './types';

// 紫微斗數主星 (Main Stars)
const PURPLE_STARS = [
  '紫微', '天機', '太陽', '武曲', '天同', '廉貞', 
  '天府', '太陰', '貪狼', '巨門', '天相', '天梁',
  '七殺', '破軍', '左輔', '右弼', '文昌', '文曲',
  '火星', '鈴星', '擎羊', '陀羅', '祿存', '天馬'
];

// 12宮位 (12 Palaces)
export const PALACES = [
  '命宮', '兄弟宮', '夫妻宮', '子女宮', 
  '財帛宮', '疾厄宮', '遷移宮', '奴僕宮', 
  '官祿宮', '田宅宮', '福德宮', '父母宮'
];

// 四化 (Four Transformations)
const FOUR_TRANSFORMATIONS = {
  '甲': { star: '廉貞', type: '化忌' },
  '乙': { star: '天機', type: '化忌' },
  '丙': { star: '天同', type: '化忌' },
  '丁': { star: '太陰', type: '化忌' },
  '戊': { star: '貪狼', type: '化忌' },
  '己': { star: '武曲', type: '化忌' },
  '庚': { star: '太陽', type: '化忌' },
  '辛': { star: '巨門', type: '化忌' },
  '壬': { star: '天梁', type: '化忌' },
  '癸': { star: '破軍', type: '化忌' }
};

// 宮位含義
export const PALACE_MEANINGS: Record<string, { title: string; meaning: string }> = {
  '命宮': { title: '命宮', meaning: '本性、自我、給外界的第一印象' },
  '兄弟宮': { title: '兄弟宮', meaning: '兄弟姐妹、合伙人、同事關係' },
  '夫妻宮': { title: '夫妻宮', meaning: '婚姻、伴侶、感情模式' },
  '子女宮': { title: '子女宮', meaning: '子女、創作、投標' },
  '財帛宮': { title: '財帛宮', meaning: '財富、收入、理財能力' },
  '疾厄宮': { title: '疾厄宮', meaning: '健康、疾病、體質' },
  '遷移宮': { title: '遷移宮', meaning: '外出、旅遊、發展空間' },
  '奴僕宮': { title: '奴僕宮', meaning: '下屬、朋友、社交關係' },
  '官祿宮': { title: '官祿宮', meaning: '事業、學業、官運' },
  '田宅宮': { title: '田宅宮', meaning: '房產、家庭、祖產' },
  '福德宮': { title: '福德宮', meaning: '福氣、享受、興趣愛好' },
  '父母宮': { title: '父母宮', meaning: '父母、長輩、師長' }
};

// 主星特質
export const STAR_TRAITS: Record<string, { personality: string; career: string; love: string; wealth: string }> = {
  '紫微': { personality: '領導、尊貴、追求完美', career: '管理、行政、創業', love: '專一、佔有慾強', wealth: '富貴命' },
  '天機': { personality: '聰明、機智、善變', career: '策划、顧問、創意', love: '浪漫選擇多', wealth: '智慧生財' },
  '太陽': { personality: '熱情、正義、愛表現', career: '演藝、法律、政治', love: '熱情主動', wealth: '名聲生財' },
  '武曲': { personality: '剛毅、果斷、固執', career: '金融、軍警、工程', love: '專一但不懂浪漫', wealth: '武略生財' },
  '天同': { personality: '溫和、享樂、懶散', career: '藝術、服務、休閒', love: '追求快樂', wealth: '福氣享財' },
  '廉貞': { personality: '剛柔並濟、複雜', career: '法律、行政、藝術', love: '癡情但複雜', wealth: '清白生財' },
  '天府': { title: '天府', meaning: '保守、謹慎、領導力', career: '管理、財務、穩定', love: '傳統穩定', wealth: '庫存有餘' },
  '太陰': { personality: '溫柔、感性、追求完美', career: '藝術、服務、行政', love: '浪漫溫柔', wealth: '月亮生財' },
  '貪狼': { personality: '慾望強、社交高手', career: '銷售、公關、娛樂', love: '桃花旺', wealth: '貪狼生財' },
  '巨門': { personality: '口才好、愛批評、防備心', career: '律師、銷售、教育', love: '選擇困難', wealth: '口才生財' },
  '天相': { personality: '溫和、協調能力強', career: '協調、管理、服務', love: '穩定温和', wealth: '衣食無憂' },
  '天梁': { personality: '正直、原則性強', career: '法律、醫療、教育', love: '要求高', wealth: '清貴生財' },
  '七殺': { personality: '果斷、衝動、魄力', career: '創業、軍警、果斷決策', love: '激烈浪漫', wealth: '爆發有財' },
  '破軍': { personality: '破壞與創新、冒險', career: '創新、創業、突破', love: '刻骨銘心', wealth: '破而后立' }
};

// 計算紫微斗數命盤 (簡化版)
export function calculatePurpleStar(data: BirthData): {
  yearStar: string;
  monthStar: string;
  dayStar: string;
  hourStar: string;
  palace: string;
  palaces: Record<string, string>;
  fourHua: { star: string; type: string };
} {
  // 簡化計算 - 實際需要更複雜的演算法
  const stars = ['紫微', '天機', '太陽', '武曲', '天同', '廉貞', '天府', '太陰', '貪狼', '巨門', '天相', '天梁'];
  
  // 根據出生年份月日時分配星星
  const yearIndex = (data.year - 1900) % 12;
  const monthIndex = (data.month - 1) % 12;
  const dayIndex = (data.day - 1) % 12;
  const hourIndex = Math.floor(data.hour / 2) % 12;
  
  return {
    yearStar: stars[yearIndex],
    monthStar: stars[monthIndex],
    dayStar: stars[dayIndex],
    hourStar: stars[hourIndex],
    palace: PALACES[dayIndex % 12],
    palaces: {
      '命宮': stars[(yearIndex + monthIndex) % 12],
      '兄弟宮': stars[(yearIndex + monthIndex + 1) % 12],
      '夫妻宮': stars[(yearIndex + monthIndex + 2) % 12],
      '子女宮': stars[(yearIndex + monthIndex + 3) % 12],
      '財帛宮': stars[(yearIndex + monthIndex + 4) % 12],
      '疾厄宮': stars[(yearIndex + monthIndex + 5) % 12],
      '遷移宮': stars[(yearIndex + monthIndex + 6) % 12],
      '奴僕宮': stars[(yearIndex + monthIndex + 7) % 12],
      '官祿宮': stars[(yearIndex + monthIndex + 8) % 12],
      '田宅宮': stars[(yearIndex + monthIndex + 9) % 12],
      '福德宮': stars[(yearIndex + monthIndex + 10) % 12],
      '父母宮': stars[(yearIndex + monthIndex + 11) % 12]
    },
    fourHua: FOUR_TRANSFORMATIONS[['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][(data.year - 1984) % 10]]
  };
}

// 詳細感情分析
export function analyzeLove(data: BirthData): {
  marriagePalace: string;
  spouseStar: string;
  marriageAge: { min: number; max: number };
  idealMatch: string[];
  redFlag: string[];
  advice: string;
} {
  const purple = calculatePurpleStar(data);
  
  // 婚姻宮
  const marriagePalace = purple.palaces['夫妻宮'];
  
  // 根據出生年份判斷結婚年齡範圍
  const year = data.year;
  const baseAge = year < 1995 ? 25 : year < 2000 ? 27 : year < 2005 ? 28 : 30;
  
  return {
    marriagePalace,
    spouseStar: marriagePalace,
    marriageAge: { min: baseAge, max: baseAge + 5 },
    idealMatch: ['溫柔顧家', '孝順', '價值觀相近', '有責任心'],
    redFlag: ['脾氣暴躁', '花心', '不上進', '家庭背景複雜'],
    advice: '先專注事業發展，28-32歲是理想結婚年齡'
  };
}

// 詳細事業分析
export function analyzeCareer(data: BirthData): {
  careerPalace: string;
  bossStar: string;
  suitableIndustries: string[];
  careerStages: { age: string; focus: string }[];
  entrepreneurial: boolean;
  advice: string;
} {
  const purple = calculatePurpleStar(data);
  
  const careerPalace = purple.palaces['官祿宮'];
  const stars = Object.values(purple.palaces);
  
  const hasLeadership = stars.includes('紫微') || stars.includes('天府') || stars.includes('天梁');
  const hasCreative = stars.includes('貪狼') || stars.includes('天機') || stars.includes('廉貞');
  const hasFinance = stars.includes('武曲') || stars.includes('太陰') || stars.includes('天府');
  
  const industries: string[] = [];
  if (hasLeadership) industries.push('管理', '創業', '投資');
  if (hasCreative) industries.push('創意', '設計', '媒體', '演藝');
  if (hasFinance) industries.push('金融', '財務', '會計');
  industries.push('教育', '服務');
  
  return {
    careerPalace,
    bossStar: careerPalace,
    suitableIndustries: [...new Set(industries)],
    careerStages: [
      { age: '20-25', focus: '學習、累積經驗' },
      { age: '26-30', focus: '確立方向、發展專業' },
      { age: '31-40', focus: '事業上升、晉升管理' },
      { age: '40+', focus: '穩定發展或創業' }
    ],
    entrepreneurial: hasLeadership,
    advice: hasLeadership ? '適合創業或帶團隊' : '適合專業技術路線'
  };
}

// 貴人/小人分析
export function analyzeRelationships(data: BirthData): {
 贵人大運: { age: string; source: string }[];
  小人特徵: string[];
  社交建議: string;
} {
  const purple = calculatePurpleStar(data);
  
  return {
    贵人大運: [
      { age: '20-30', source: '長輩、老師' },
      { age: '30-40', source: '同事、合作夥伴' },
      { age: '40+', source: '下屬、晚輩' }
    ],
    小人特徵: ['脾氣暴躁', '愛搬弄是非', '嫉妒心強', '說話不算話'],
    社交建議: '遠離負能量的人，多與正面積極的人來往'
  };
}

// 幸運元素建議
export function getLuckyElements(data: BirthData): {
  luckyColors: string[];
  luckyDirections: string[];
  luckyNumbers: number[];
  luckyDays: string[];
  luckyMonths: number[];
} {
  const purple = calculatePurpleStar(data);
  
  // 根據主星建議幸運元素
  const star = purple.dayStar;
  const colors: Record<string, string[]> = {
    '紫微': ['紫', '金', '黑'],
    '天機': ['綠', '藍', '青'],
    '太陽': ['紅', '橙', '金'],
    '武曲': ['白', '金', '銀'],
    '天同': ['粉', '藍', '白'],
    '廉貞': ['紅', '紫', '黑'],
    '天府': ['黃', '金', '白'],
    '太陰': ['白', '銀', '淡藍'],
    '貪狼': ['紅', '紫', '金'],
    '巨門': ['白', '金', '黑'],
    '天相': ['白', '灰', '藍'],
    '天梁': ['黃', '金', '棕']
  };
  
  const directions: Record<string, string[]> = {
    '紫微': ['東北', '中央'],
    '天機': ['東', '東南'],
    '太陽': ['東南', '南'],
    '武曲': ['西北', '西'],
    '天同': ['南', '東南'],
    '廉貞': ['南', '西南'],
    '天府': ['東北', '西南'],
    '太陰': ['北', '東北'],
    '貪狼': ['北', '西北'],
    '巨門': ['西南', '西北'],
    '天相': ['東北', '北'],
    '天梁': ['東北', '東']
  };
  
  return {
    luckyColors: colors[star] || ['紅', '金'],
    luckyDirections: directions[star] || ['東', '南'],
    luckyNumbers: [star.length * 3, data.day % 9 + 1, 8, 9, 3],
    luckyDays: ['星期二', '星期四', '星期六'],
    luckyMonths: [3, 4, 9, 10]
  };
}

export default {
  calculatePurpleStar,
  analyzeLove,
  analyzeCareer,
  analyzeRelationships,
  getLuckyElements
};
