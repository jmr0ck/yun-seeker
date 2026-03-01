/**
 * Simple Four Pillars Calculator
 * For testing without complex imports
 */

// Heavenly Stems (天干)
const STEMS = [
  { name: '甲', element: 'wood', yinYang: 'yang' },
  { name: '乙', element: 'wood', yinYang: 'yin' },
  { name: '丙', element: 'fire', yinYang: 'yang' },
  { name: '丁', element: 'fire', yinYang: 'yin' },
  { name: '戊', element: 'earth', yinYang: 'yang' },
  { name: '己', element: 'earth', yinYang: 'yin' },
  { name: '庚', element: 'metal', yinYang: 'yang' },
  { name: '辛', element: 'metal', yinYang: 'yin' },
  { name: '壬', element: 'water', yinYang: 'yang' },
  { name: '癸', element: 'water', yinYang: 'yin' },
];

// Earthly Branches (地支)
const BRANCHES = [
  { name: '子', element: 'water', animal: 'Rat' },
  { name: '丑', element: 'earth', animal: 'Ox' },
  { name: '寅', element: 'wood', animal: 'Tiger' },
  { name: '卯', element: 'wood', animal: 'Rabbit' },
  { name: '辰', element: 'earth', animal: 'Dragon' },
  { name: '巳', element: 'fire', animal: 'Snake' },
  { name: '午', element: 'fire', animal: 'Horse' },
  { name: '未', element: 'earth', animal: 'Goat' },
  { name: '申', element: 'metal', animal: 'Monkey' },
  { name: '酉', element: 'metal', animal: 'Rooster' },
  { name: '戌', element: 'earth', animal: 'Dog' },
  { name: '亥', element: 'water', animal: 'Pig' },
];

// Calculate Four Pillars
function calculateFourPillars(year: number, month: number, day: number, hour: number) {
  // Year pillar (starting from 1984 =甲子)
  const yearOffset = (year - 1984) % 60;
  const yearStem = STEMS[yearOffset % 10];
  const yearBranch = BRANCHES[yearOffset % 12];
  
  // Simplified month pillar (approximation)
  const monthOffset = ((year - 1900) * 12 + month + 2) % 60;
  const monthStem = STEMS[monthOffset % 10];
  const monthBranch = BRANCHES[monthOffset % 12];
  
  // Day pillar (starting from 1984-01-01 = 甲子)
  const baseDate = new Date(1984, 0, 1);
  const birthDate = new Date(year, month - 1, day);
  const daysDiff = Math.floor((birthDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const dayOffset = (daysDiff + 40) % 60;
  const dayStem = STEMS[dayOffset % 10];
  const dayBranch = BRANCHES[dayOffset % 12];
  
  // Hour pillar
  const hourOffset = Math.floor((hour + 1) / 2) % 12;
  const hourBranch = BRANCHES[hourOffset];
  const hourStemIndex = (dayOffset * 2 + hourOffset) % 10;
  const hourStem = STEMS[hourStemIndex];
  
  return {
    year: { stem: yearStem, branch: yearBranch },
    month: { stem: monthStem, branch: monthBranch },
    day: { stem: dayStem, branch: dayBranch },
    hour: { stem: hourStem, branch: hourBranch },
  };
}

// Calculate Five Elements
function calculateElements(chart: any) {
  const elements = ['wood', 'fire', 'earth', 'metal', 'water'];
  const counts: Record<string, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  
  [chart.year, chart.month, chart.day, chart.hour].forEach((pillar: any) => {
    counts[pillar.stem.element]++;
    counts[pillar.branch.element]++;
  });
  
  return elements.map(el => ({
    element: el,
    count: counts[el],
    strength: counts[el] >= 3 ? 'strong' : counts[el] >= 2 ? 'balanced' : 'weak'
  }));
}

// Get Zodiac
function getZodiac(year: number) {
  const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  return animals[(year - 1900) % 12];
}

// Lucky numbers based on birth chart
function getLuckyNumbers(chart: any) {
  // Use day stem and branch to generate "lucky" numbers
  const dayNum = chart.day.stem.name.charCodeAt(0) % 10 + 1;
  const hourNum = chart.hour.branch.name.charCodeAt(0) % 10 + 1;
  const yearNum = chart.year.branch.name.charCodeAt(0) % 10 + 1;
  
  const numbers = new Set([dayNum, hourNum, yearNum, 8, 9, 3, 7]);
  return Array.from(numbers).slice(0, 6);
}

// Test
const birthData = { year: 2002, month: 11, day: 4, hour: 4 };
const chart = calculateFourPillars(birthData.year, birthData.month, birthData.day, birthData.hour);
const elements = calculateElements(chart);
const zodiac = getZodiac(birthData.year);
const luckyNumbers = getLuckyNumbers(chart);

console.log('========================================');
console.log('   八字 - 八字命理分析');
console.log('   Birth: 2002-11-04 4:00 AM');
console.log('   Timezone: Asia/Hong_Kong');
console.log('========================================');
console.log('');
console.log('🐀 八字 (Four Pillars):');
console.log('------------------------');
console.log('年柱 Year:     ', chart.year.stem.name, chart.year.branch.name, '-', chart.year.stem.element, chart.year.branch.animal);
console.log('月柱 Month:    ', chart.month.stem.name, chart.month.branch.name, '-', chart.month.stem.element);
console.log('日柱 Day:      ', chart.day.stem.name, chart.day.branch.name, '-', chart.day.stem.element);
console.log('時柱 Hour:     ', chart.hour.stem.name, chart.hour.branch.name, '-', chart.hour.stem.element);
console.log('');
console.log('🐉 生肖 (Zodiac):', zodiac, '🐷');
console.log('');
console.log('⚖️ 五行 (Five Elements):');
console.log('------------------------');
elements.forEach(e => console.log('  ', e.element, ':', e.count, '-', e.strength));
console.log('');
console.log('🎰 幸運數字 (Lucky Numbers):', luckyNumbers.join(', '));
console.log('');
console.log('========================================');
console.log('   2026 事業預測 (Career 2026)');
console.log('========================================');
console.log('');
console.log('Day Master (日主):', chart.day.stem.name, '-', chart.day.stem.element, chart.day.stem.yinYang);
console.log('');
console.log('2026預測:');
console.log('- 2026是丙辰年 (Fire Dragon)');
console.log('- 你的日主是', chart.day.stem.name, '（', chart.day.stem.element, '）');
console.log('- 丙火生辰土，事業上有貴人幫助');
console.log('- 適合: 穩定發展、團隊合作、房地產/建築相關');
console.log('- 注意: 防止過度投資，保持低調');
console.log('- 幸運色: 紅、橙、金');
console.log('- 幸運方向: 東北、東南');
