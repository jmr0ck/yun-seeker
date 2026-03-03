/**
 * 八字 - Four Pillars Advanced Analysis
 * With Ten Gods, Palace Analysis, and Detailed Interpretations
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
  { name: '子', element: 'water', animal: 'Rat', hidden: [{ stem: '癸', element: 'water' }] },
  { name: '丑', element: 'earth', animal: 'Ox', hidden: [{ stem: '己', element: 'earth' }, { stem: '癸', element: 'water' }, { stem: '辛', element: 'metal' }] },
  { name: '寅', element: 'wood', animal: 'Tiger', hidden: [{ stem: '甲', element: 'wood' }, { stem: '丙', element: 'fire' }, { stem: '戊', element: 'earth' }] },
  { name: '卯', element: 'wood', animal: 'Rabbit', hidden: [{ stem: '乙', element: 'wood' }] },
  { name: '辰', element: 'earth', animal: 'Dragon', hidden: [{ stem: '戊', element: 'earth' }, { stem: '乙', element: 'wood' }, { stem: '癸', element: 'water' }] },
  { name: '巳', element: 'fire', animal: 'Snake', hidden: [{ stem: '丙', element: 'fire' }, { stem: '庚', element: 'metal' }, { stem: '戊', element: 'earth' }] },
  { name: '午', element: 'fire', animal: 'Horse', hidden: [{ stem: '丁', element: 'fire' }, { stem: '己', element: 'earth' }] },
  { name: '未', element: 'earth', animal: 'Goat', hidden: [{ stem: '己', element: 'earth' }, { stem: '丁', element: 'fire' }, { stem: '乙', element: 'wood' }] },
  { name: '申', element: 'metal', animal: 'Monkey', hidden: [{ stem: '庚', element: 'metal' }, { stem: '壬', element: 'water' }, { stem: '戊', element: 'earth' }] },
  { name: '酉', element: 'metal', animal: 'Rooster', hidden: [{ stem: '辛', element: 'metal' }] },
  { name: '戌', element: 'earth', animal: 'Dog', hidden: [{ stem: '戊', element: 'earth' }, { stem: '辛', element: 'metal' }, { stem: '丁', element: 'fire' }] },
  { name: '亥', element: 'water', animal: 'Pig', hidden: [{ stem: '壬', element: 'water' }, { stem: '甲', element: 'wood' }] },
];

// Ten Gods (十神) mapping - depends on Day Master (日主)
export type TenGod = '偏印' | '正印' | '比肩' | '劫財' | '食神' | '傷官' | '偏財' | '正財' | '七殺' | '正官';

// Element to Ten God mapping based on Day Master
const TEN_GODS: Record<string, Record<string, TenGod>> = {
  // Day Master = 甲 (Wood)
  '甲': { '甲': '比肩', '乙': '劫財', '丙': '食神', '丁': '傷官', '戊': '偏財', '己': '正財', '庚': '七殺', '辛': '正官', '壬': '偏印', '癸': '正印' },
  // Day Master = 乙 (Wood)
  '乙': { '甲': '劫財', '乙': '比肩', '丙': '傷官', '丁': '食神', '戊': '正財', '己': '偏財', '庚': '正官', '辛': '七殺', '壬': '正印', '癸': '偏印' },
  // Day Master = 丙 (Fire)
  '丙': { '甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫財', '戊': '食神', '己': '傷官', '庚': '偏財', '辛': '正財', '壬': '七殺', '癸': '正官' },
  // Day Master = 丁 (Fire)
  '丁': { '甲': '正印', '乙': '偏印', '丙': '劫財', '丁': '比肩', '戊': '傷官', '己': '食神', '庚': '正財', '辛': '偏財', '壬': '正官', '癸': '七殺' },
  // Day Master = 戊 (Earth)
  '戊': { '甲': '七殺', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩', '己': '劫財', '庚': '食神', '辛': '傷官', '壬': '偏財', '癸': '正財' },
  // Day Master = 己 (Earth)
  '己': { '甲': '正官', '乙': '七殺', '丙': '正印', '丁': '偏印', '戊': '劫財', '己': '比肩', '庚': '傷官', '辛': '食神', '壬': '正財', '癸': '偏財' },
  // Day Master = 庚 (Metal)
  '庚': { '甲': '偏財', '乙': '正財', '丙': '七殺', '丁': '正官', '戊': '偏印', '己': '正印', '庚': '比肩', '辛': '劫財', '壬': '食神', '癸': '傷官' },
  // Day Master = 辛 (Metal)
  '辛': { '甲': '正財', '乙': '偏財', '丙': '正官', '丁': '七殺', '戊': '正印', '己': '偏印', '庚': '劫財', '辛': '比肩', '壬': '傷官', '癸': '食神' },
  // Day Master = 壬 (Water)
  '壬': { '甲': '食神', '乙': '傷官', '丙': '偏財', '丁': '正財', '戊': '七殺', '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫財' },
  // Day Master = 癸 (Water)
  '癸': { '甲': '傷官', '乙': '食神', '丙': '正財', '丁': '偏財', '戊': '正官', '己': '七殺', '庚': '正印', '辛': '偏印', '壬': '劫財', '癸': '比肩' },
};

// Ten God meanings (十神解釋)
export const TEN_GOD_MEANINGS: Record<TenGod, { career: string; love: string; personality: string; health: string }> = {
  '偏印': {
    career: '學習、貴人、證照、靈感、偏門知識',
    love: '獨立、暗戀、神秘感',
    personality: '聰明、領悟力強、獨立思考',
    health: '思慮過度、神經衰弱'
  },
  '正印': {
    career: '穩定工作、學習、機構、證照',
    love: '穩定關係、長輩介紹',
    personality: '溫和、善良、正統',
    health: '穩定但需注意休息'
  },
  '比肩': {
    career: '自我主導、競爭、合伙、創業',
    love: '競争型戀愛、旗鼓相當',
    personality: '自我意識強、有主見、競爭心',
    health: '骨骼、肌肉問題'
  },
  '劫財': {
    career: '破財、竞争、合伙纠纷',
    love: '竞争者、争夺型关系',
    personality: '冲动、投机、冒险',
    health: '意外、刀傷、血光'
  },
  '食神': {
    career: '創作、表達、技術、服務、演藝',
    love: '浪漫、表達愛意、藝術吸引',
    personality: '感性、創造力、享受生活',
    health: '飲食、腸胃問題'
  },
  '傷官': {
    career: '創作、批判、表演、顛覆',
    love: '激烈愛恨、反叛型戀愛',
    personality: '聰明、批判、叛逆、出口成章',
    health: '腎臟、泌尿系統'
  },
  '偏財': {
    career: '投資、機會、客戶、項目制收入',
    love: '快速戀愛、機會型相遇',
    personality: '靈活、機會主義、善變現',
    health: '酒色過度、肝臟'
  },
  '正財': {
    career: '穩定收入、工資、儲蓄、理財',
    love: '穩定戀愛、正經結婚對象',
    personality: '務實、穩定、儲蓄意識',
    health: '腎臟、財務壓力'
  },
  '七殺': {
    career: '權力、壓力、競爭、領導、果斷',
    love: '強勢對象、壓力型戀愛',
    personality: '果斷、狠辣、有執行力',
    health: '壓力大、失眠、肝火旺'
  },
  '正官': {
    career: '穩定工作、管理、規矩、丈夫',
    love: '穩定婚姻、傳統關係',
    personality: '正派、規矩、責任心',
    health: '慢性壓力、婦科'
  }
};

// Pillar meanings (四柱含義)
export const PILLAR_MEANINGS = {
  '年柱': {
    title: '外界給你的氣質 + 早年環境',
    description: '代表1-15歲時期，家庭背景、外界對你的印象、早年運勢'
  },
  '月柱': {
    title: '核心性格 + 人生主題 (最重要)',
    description: '代表16-35歲時期，事業、財富、人生方向的核心驅動力'
  },
  '日柱': {
    title: '自己 + 婚姻宮',
    description: '代表你自己及配偶/伴侶的宮位，是感情生活的核心'
  },
  '時柱': {
    title: '後半生 + 事業路線 + 子女',
    description: '代表36歲後的運勢、事業最終走向、子女運'
  }
};

// Detailed Ten God interpretations
export function getTenGod(dayMaster: string, stem: string): TenGod {
  return TEN_GODS[dayMaster]?.[stem] || '偏印';
}

// Analyze Four Pillars with Ten Gods
export function analyzeWithTenGods(data: BirthData): {
  year: { stem: Stem; branch: Branch; tenGod: TenGod };
  month: { stem: Stem; branch: Branch; tenGod: TenGod };
  day: { stem: Stem; branch: Branch; tenGod: TenGod; dayMaster: Element };
  hour: { stem: Stem; branch: Branch; tenGod: TenGod };
  zodiac: string;
  elements: { element: string; count: number; strength: string }[];
  structures: string[];
  clashes: string[];
  combinations: string[];
} {
  // Calculate year pillar
  const yearOffset = (data.year - 1984) % 60;
  const yearStem = STEMS[yearOffset % 10];
  const yearBranch = BRANCHES[yearOffset % 12];
  
  // Calculate month pillar
  const monthOffset = ((data.year - 1900) * 12 + data.month + 2) % 60;
  const monthStem = STEMS[monthOffset % 10];
  const monthBranch = BRANCHES[monthOffset % 12];
  
  // Calculate day pillar
  const baseDate = new Date(1984, 0, 1);
  const birthDate = new Date(data.year, data.month - 1, data.day);
  const daysDiff = Math.floor((birthDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const dayOffset = (daysDiff + 40) % 60;
  const dayStem = STEMS[dayOffset % 10];
  const dayBranch = BRANCHES[dayOffset % 12];
  
  // Calculate hour pillar
  const hourOffset = Math.floor((data.hour + 1) / 2) % 12;
  const hourBranch = BRANCHES[hourOffset];
  const hourStemIndex = (dayOffset * 2 + hourOffset) % 10;
  const hourStem = STEMS[hourStemIndex];
  
  // Get zodiac
  const zodiac = BRANCHES[(data.year - 1900) % 12].animal;
  
  // Calculate elements
  const elements = ['wood', 'fire', 'earth', 'metal', 'water'];
  const counts: Record<string, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  
  [yearStem, monthStem, dayStem, hourStem].forEach(s => {
    counts[s.element]++;
  });
  [yearBranch, monthBranch, dayBranch, hourBranch].forEach(b => {
    counts[b.element]++;
    b.hidden?.forEach(h => counts[h.element]++);
  });
  
  const elementAnalysis = elements.map(el => ({
    element: el,
    count: counts[el],
    strength: counts[el] >= 4 ? '過旺' : counts[el] >= 3 ? '旺' : counts[el] >= 2 ? '平衡' : counts[el] >= 1 ? '弱' : '無'
  }));
  
  // Check for 三合火局 (寅午戌)
  const branches = [yearBranch.name, monthBranch.name, dayBranch.name, hourBranch.name];
  const hasFireGroup = branches.includes('寅') && branches.includes('午') && branches.includes('戌');
  
  // Check for 三合水局 (申子辰)
  const hasWaterGroup = branches.includes('申') && branches.includes('子') && branches.includes('辰');
  
  // Check for 三合金局 (巳酉丑)
  const hasMetalGroup = branches.includes('巳') && branches.includes('酉') && branches.includes('丑');
  
  // Check for 三合木局 (亥卯未)
  const hasWoodGroup = branches.includes('亥') && branches.includes('卯') && branches.includes('未');
  
  const structures: string[] = [];
  if (hasFireGroup) structures.push('寅午戌三合火局 - 行動力強、主導力強');
  if (hasWaterGroup) structures.push('申子辰三合水局 - 智慧、靈活性');
  if (hasMetalGroup) structures.push('巳酉丑三合金局 - 財富、資源');
  if (hasWoodGroup) structures.push('亥卯未三合木局 - 學習、貴人');
  
  // Check clashes (沖)
  const clashes: string[] = [];
  const branchNames = [yearBranch.name, monthBranch.name, dayBranch.name, hourBranch.name];
  const clashesPairs: [string, string][] = [
    ['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥']
  ];
  
  clashesPairs.forEach(([a, b]) => {
    if (branchNames.includes(a) && branchNames.includes(b)) {
      clashes.push(`${a}${b}沖 - 動盪、轉變、分離`);
    }
  });
  
  // Check combinations (合)
  const combinations: string[] = [];
  const pairs: [string, string][] = [
    ['子', '丑'], ['寅', '亥'], ['卯', '戌'], ['辰', '酉'], ['巳', '申'], ['午', '未'],
    ['寅', '午'], ['申', '子'], ['酉', '辰'], ['戌', '卯'], ['亥', '巳'], ['午', '戌']
  ];
  
  pairs.forEach(([a, b]) => {
    if (branchNames.includes(a) && branchNames.includes(b)) {
      if (a === '午' && b === '戌' || a === '戌' && b === '午') {
        combinations.push('午戌半合火 - 合作、聚力');
      } else if (a === '寅' && b === '午' || a === '午' && b === '寅') {
        combinations.push('寅午半合火 - 協力、旺相');
      } else {
        combinations.push(`${a}${b}合`);
      }
    }
  });
  
  return {
    year: { stem: yearStem, branch: yearBranch, tenGod: getTenGod(dayStem.name, yearStem.name) },
    month: { stem: monthStem, branch: monthBranch, tenGod: getTenGod(dayStem.name, monthStem.name) },
    day: { stem: dayStem, branch: dayBranch, tenGod: getTenGod(dayStem.name, dayStem.name), dayMaster: dayStem.element },
    hour: { stem: hourStem, branch: hourBranch, tenGod: getTenGod(dayStem.name, hourStem.name) },
    zodiac,
    elements: elementAnalysis,
    structures,
    clashes,
    combinations
  };
}

// Generate detailed reading report
export function generateDetailedReading(data: BirthData): string {
  const analysis = analyzeWithTenGods(data);
  
  let report = '';
  report += '================================================================\n';
  report += '   🔮 八字命理完整分析報告 (進階版)\n';
  report += '================================================================\n\n';
  
  // Basic info
  report += `出生: ${data.year}年${data.month}月${data.day}日 ${data.hour}:00\n`;
  report += `時區: ${data.timezone}\n`;
  report += `生肖: ${analysis.zodiac}\n\n`;
  
  // Four Pillars with Ten Gods
  report += '================================================================\n';
  report += '   🐀 四柱十神 (Four Pillars + Ten Gods)\n';
  report += '================================================================\n\n';
  
  report += `【年柱】${analysis.year.stem.name}${analysis.year.branch.name} = ${analysis.year.tenGod}\n`;
  report += `  → ${PILLAR_MEANINGS['年柱'].title}\n`;
  report += `  → ${TEN_GOD_MEANINGS[analysis.year.tenGod].personality}\n\n`;
  
  report += `【月柱】${analysis.month.stem.name}${analysis.month.branch.name} = ${analysis.month.tenGod} ⭐最重要\n`;
  report += `  → ${PILLAR_MEANINGS['月柱'].title}\n`;
  report += `  → ${TEN_GOD_MEANINGS[analysis.month.tenGod].career}\n\n`;
  
  report += `【日柱】${analysis.day.stem.name}${analysis.day.branch.name} = ${analysis.day.tenGod} (日主=${analysis.day.stem.name}${analysis.day.dayMaster})\n`;
  report += `  → ${PILLAR_MEANINGS['日柱'].title}\n`;
  report += `  → ${TEN_GOD_MEANINGS[analysis.day.tenGod].love}\n\n`;
  
  report += `【時柱】${analysis.hour.stem.name}${analysis.hour.branch.name} = ${analysis.hour.tenGod}\n`;
  report += `  → ${PILLAR_MEANINGS['時柱'].title}\n`;
  report += `  → ${TEN_GOD_MEANINGS[analysis.hour.tenGod].career}\n\n`;
  
  // Five Elements
  report += '================================================================\n';
  report += '   ⚖️ 五行強弱\n';
  report += '================================================================\n\n';
  
  analysis.elements.forEach(e => {
    report += `  ${e.element}: ${e.count}個 (${e.strength})\n`;
  });
  report += '\n';
  
  // Structures
  if (analysis.structures.length > 0) {
    report += '================================================================\n';
    report += '   🔥 格局結構 (Structures)\n';
    report += '================================================================\n\n';
    analysis.structures.forEach(s => {
      report += `  ✅ ${s}\n`;
    });
    report += '\n';
  }
  
  // Clashes
  if (analysis.clashes.length > 0) {
    report += '================================================================\n';
    report += '   ⚠️ 刑沖 (Clashes - 動盪點)\n';
    report += '================================================================\n\n';
    analysis.clashes.forEach(c => {
      report += `  ⚠️ ${c}\n`;
    });
    report += '\n';
  }
  
  // Combinations
  if (analysis.combinations.length > 0) {
    report += '================================================================\n';
    report += '   🔗 合會 (Combinations)\n';
    report += '================================================================\n\n';
    analysis.combinations.forEach(c => {
      report += `  🔗 ${c}\n`;
    });
    report += '\n';
  }
  
  return report;
}

export class FourPillarsAdvanced {
  static analyze(data: BirthData) {
    return analyzeWithTenGods(data);
  }
  
  static generateDetailedReading(data: BirthData) {
    return generateDetailedReading(data);
  }
}

export default FourPillarsAdvanced;
