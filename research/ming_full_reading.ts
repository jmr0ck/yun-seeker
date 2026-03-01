/**
 * Ming's Complete Reading
 * Birth: 1982-12-12 4:00 AM HK
 */

// Simplified Four Pillars Calculator

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

function calculateFourPillars(year, month, day, hour) {
  const yearOffset = (year - 1984) % 60;
  const yearStem = STEMS[yearOffset % 10];
  const yearBranch = BRANCHES[yearOffset % 12];
  
  const monthOffset = ((year - 1900) * 12 + month + 2) % 60;
  const monthStem = STEMS[monthOffset % 10];
  const monthBranch = BRANCHES[monthOffset % 12];
  
  const baseDate = new Date(1984, 0, 1);
  const birthDate = new Date(year, month - 1, day);
  const daysDiff = Math.floor((birthDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const dayOffset = (daysDiff + 40) % 60;
  const dayStem = STEMS[dayOffset % 10];
  const dayBranch = BRANCHES[dayOffset % 12];
  
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

function calculateElements(chart) {
  const elements = ['wood', 'fire', 'earth', 'metal', 'water'];
  const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  
  [chart.year, chart.month, chart.day, chart.hour].forEach(pillar => {
    counts[pillar.stem.element]++;
    counts[pillar.branch.element]++;
  });
  
  return elements.map(el => ({
    element: el,
    count: counts[el],
    strength: counts[el] >= 4 ? '過旺' : counts[el] >= 3 ? '旺' : counts[el] >= 2 ? '平衡' : counts[el] >= 1 ? '弱' : '無'
  }));
}

function getZodiac(year) {
  const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  return animals[(year - 1900) % 12];
}

// Ming's birth data
const birthData = { year: 1982, month: 12, day: 12, hour: 4 };
const chart = calculateFourPillars(birthData.year, birthData.month, birthData.day, birthData.hour);
const elements = calculateElements(chart);
const zodiac = getZodiac(birthData.year);

// Calculate age in 2026
const age2026 = 2026 - 1982;

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('                    🔮 八字命理完整分析報告');
console.log('                    Ming (鄧明) - Ultimate Reading');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');
console.log('【基本資料】');
console.log('──────────────────────────────────────────────────────────────────────');
console.log(`出生日期：1982年12月12日 凌晨4:00 (寅時)`);
console.log(`出生地點：廣東開平 (Kaiping, China)`);
console.log(`時區：Asia/Hong_Kong`);
console.log(`性別：男命`);
console.log(`生肖：${zodiac} 🐎`);
console.log('');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('                    🐀 第一部分：四柱十神詳解');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');
console.log('【先講「你係咩日主」同十神對照】');
console.log('');
console.log('日主：丙火（太陽火）');
console.log('');
console.log('對丙火嚟講：');
console.log('• 木＝印星 → 學習、貴人、保護');
console.log('• 火＝比劫 → 自我、膽量、競爭');
console.log('• 土＝食傷 → 表達、創作、技術');
console.log('• 金＝財星 → 錢、資源、客戶');
console.log('• 水＝官殺 → 規矩、壓力、權力');
console.log('');

console.log('──────────────────────────────────────────────────────────────────────');
console.log('【四柱逐柱拆解】');
console.log('──────────────────────────────────────────────────────────────────────');
console.log('');

console.log(`A）年柱【${chart.year.stem.name}${chart.year.branch.name}】＝「外界給你既氣質＋早年環境」`);
console.log(`   ${chart.year.stem.name}=${chart.year.stem.element} (${chart.year.stem.yinYang}) | ${chart.year.branch.name}=${chart.year.branch.element}`);
console.log(`   → 早年有壓力但變成動力`);
console.log('');

console.log(`B）【最重要】月柱【${chart.month.stem.name}${chart.month.branch.name}】＝「核心性格＋人生主題」`);
console.log(`   ${chart.month.stem.name}=${chart.month.stem.element} | ${chart.month.branch.name}=${chart.month.branch.element}`);
console.log(`   → 呢個係你既主引擎，決定你既人生方向`);
console.log('');

console.log(`C）【日柱】${chart.day.stem.name}${chart.day.branch.name}＝「你自己＋婚姻宮」`);
console.log(`   ${chart.day.stem.name}=${chart.day.stem.element} (${chart.day.stem.yinYang}) | ${chart.day.branch.name}=${chart.day.branch.element}`);
console.log(`   → 你既日主丙火代表你係一個有活力、熱情既人`);
console.log('');

console.log(`D）【時柱】${chart.hour.stem.name}${chart.hour.branch.name}＝「後半生走勢＋事業」`);
console.log(`   ${chart.hour.stem.name}=${chart.hour.stem.element} | ${chart.hour.branch.name}=${chart.hour.branch.element}`);
console.log(`   → 事業同財運既走向`);
console.log('');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('                    ⚖️ 第二部分：五行強弱與格局');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');
console.log('【五行分佈】');
elements.forEach(e => {
  const bar = '█'.repeat(Math.min(e.count, 6));
  console.log(`  ${e.element}: ${bar} (${e.strength})`);
});
console.log('');

// Check structures
const branches = [chart.year.branch.name, chart.month.branch.name, chart.day.branch.name, chart.hour.branch.name];
const hasFireGroup = branches.includes('寅') && branches.includes('午') && branches.includes('戌');
const hasWaterGroup = branches.includes('申') && branches.includes('子') && branches.includes('辰');
const hasMetalGroup = branches.includes('巳') && branches.includes('酉') && branches.includes('丑');

console.log('【格局結構】');
if (hasFireGroup) console.log('  ✅ 寅午戌三合火局 - 行動力強、主導力強');
if (hasWaterGroup) console.log('  ✅ 申子辰三合水局 - 智慧、靈活性');
if (hasMetalGroup) console.log('  ✅ 巳酉丑三合金局 - 財富、資源');
if (!hasFireGroup && !hasWaterGroup && !hasMetalGroup) console.log('  ⚪ 無明顯三合局');
console.log('');

// Check clashes
console.log('【刑沖合害】');
const clashes = [];
if (branches.includes('子') && branches.includes('午')) clashes.push('子午沖');
if (branches.includes('寅') && branches.includes('申')) clashes.push('寅申沖');
if (branches.includes('丑') && branches.includes('未')) clashes.push('丑未沖');
if (clashes.length > 0) clashes.forEach(c => console.log(`  ⚠️ ${c}`));
else console.log('  ⚪ 無明顯沖剋');
console.log('');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('                    💼 第三部分：事業詳細分析');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');
console.log(`【日主】${chart.day.stem.name}火 - 太陽火`);
console.log('');
console.log('【事業特質】');
console.log('• 你既八字以火為主，代表你有強既行動力同執行力');
console.log('• 適合做需要帶頭、曝光既工作');
console.log('• 有領導能力，唔怕困難');
console.log('');
console.log('【適合行業】');
console.log('• 管理、創業、投資');
console.log('• 演藝、創意、媒體');
console.log('• 建築、房地產');
console.log('• 科技、創新');
console.log('');
console.log('【事業階段】');
console.log(`• ${age2026}-${age2026+10}歲 (${2026}-${2036}): 穩定發展期`);
console.log(`• ${age2026+10}-${age2026+20}歲 (${2036}-${2046}): 事業高峰期`);
console.log(`• ${age2026+20}-${age2026+30}歲 (${2046}-${2056}): 收獲期`);
console.log('');
console.log('【2026事業預測】');
console.log('• 2026係丙辰年 (Fire Dragon)');
console.log('• 你既日主丙火得辰土生旺，事業上有貴人幫助');
console.log('• 適合穩定發展、團隊合作');
console.log('• 注意：防過度投資，保持低調');
console.log('');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('                    💰 第四部分：財運詳細分析');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');
console.log('【財運特質】');
console.log('• 丙火日主需要金水來平衡');
console.log('• 你既八字金水弱，宜儲蓄不宜投機');
console.log('');
console.log('【理財建議】');
console.log('• 適合：定期存款、基金、保險');
console.log('• 不宜：股票、期貨、杠杆投資');
console.log('• 建議養成儲蓄既習慣');
console.log('');
console.log('【2026財運】');
console.log('• 收入穩定');
console.log('• 有貴人相助帶來額外收入');
console.log('• 注意：防止借錢比人');
console.log('');
console.log('【2025-2028財運】');
console.log('• 2025: 穩中有升');
console.log('• 2026: 挑戰與機會並存');
console.log('• 2027: 收獲季節');
console.log('• 2028: 新開始');
console.log('');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('                    💕 第五部分：桃花/戀愛分析');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');
console.log('【感情特質】');
console.log('• 丙火日主既人熱情、主動');
console.log('• 適合既伴侶：要溫柔、包容');
console.log('');
console.log('【理想對象】');
console.log('• 溫柔顧家');
console.log('• 價值觀相近');
console.log('• 有責任心');
console.log('');
console.log('【2026桃花運】');
console.log('• 2026年桃花運一般');
console.log('• 專注事業發展為佳');
console.log('');
console.log('【結婚建議】');
console.log('• 如果未有伴侶，2026-2027係好好既機會');
console.log('• 遇到鍾意既人可以主動啲');
console.log('');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('                    🏥 第六部分：健康建議');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');
console.log('【健康弱點】');
console.log('• 火過旺：心火旺 - 注意失眠、肝火');
console.log('• 士過旺：消化系統要注意');
console.log('• 水弱：腎水不足');
console.log('');
console.log('【養生建議】');
console.log('• 多休息、多飲水');
console.log('• 親近自然、規律運動');
console.log('• 學習/冥想可以幫你調和');
console.log('• 盡量唔好熬夜');
console.log('');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('                    🚀 第七部分：大運分析');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');
// Calculate big luck periods (10 years each)
const currentYear = 2026;
const birthYear = 1982;
const age = currentYear - birthYear;
const dsyunStart = Math.floor(age / 10) * 10;

console.log(`【現在大運】${dsyunStart}-${dsyunStart+10}年 (${currentYear}-${currentYear+10})`);
console.log(`  年齡：${dsyunStart}-${dsyunStart+10}歲`);

const dsyunElements = ['戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'];
const dsyunIdx = Math.floor((dsyunStart + 8) % 10);
console.log(`  天干：${dsyunElements[dsyunIdx]}`);
console.log('  主題：呢十年你既運程');
console.log('');

console.log(`【下一步大運】${dsyunStart+10}-${dsyunStart+20}年`);
console.log('  事業同財運既高峰期');
console.log('');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('                    📅 第八部分：流年 2025-2028');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');

const yearly = [
  { year: 2025, stem: '乙', branch: '巳', age: 43 },
  { year: 2026, stem: '丙', branch: '午', age: 44 },
  { year: 2027, stem: '丁', branch: '未', age: 45 },
  { year: 2028, stem: '戊', branch: '申', age: 46 },
];

yearly.forEach(y => {
  console.log(`【${y.year}年】${y.stem}${y.branch} (${y.age}歲)`);
  if (y.stem === '乙') console.log('  運勢：⭐⭐⭐⭐ - 學習成長年');
  if (y.stem === '丙') console.log('  運勢：⭐⭐⭐⭐⭐ - 事業高峰年');
  if (y.stem === '丁') console.log('  運勢：⭐⭐⭐ - 穩定收獲年');
  if (y.stem === '戊') console.log('  運勢：⭐⭐⭐⭐ - 新開始年');
  console.log('');
});

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('                    🍀 第九部分：幸運元素');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');
console.log('【幸運色】');
console.log('  紅、橙、金');
console.log('');
console.log('【幸運方向】');
console.log('  東北、東南');
console.log('');
console.log('【幸運數字】');
console.log('  3、7、8、9');
console.log('');
console.log('【幸運日】');
console.log('  星期二、星期四、星期日');
console.log('');
console.log('【幸運月份】');
console.log('  3月、5月、9月');
console.log('');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('                    👥 第十部分：貴人小人');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');
console.log('【貴人類】');
console.log('  • 長輩');
console.log('  • 老師');
console.log('  • 屬蛇、龍、狗既人');
console.log('');
console.log('【小人特徵】');
console.log('  • 脾氣暴躁');
console.log('  • 愛搬弄是非');
console.log('  • 嫉妒心強');
console.log('');
console.log('【社交建議】');
console.log('  • 遠離負能量既人');
console.log('  • 多與正面積極既人來往');
console.log('');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('                    📝 第十一部分：總結');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');
console.log(`你是${chart.day.stem.name}火日主，代表你係一個有活力、熱情、主動既人。`);
console.log('');
console.log('你既人生主題：');
console.log('• 靠技能同專業食飯');
console.log('• 有領導能力');
console.log('• 適合創業或者帶團隊');
console.log('');
console.log('2026年預測：');
console.log('• 事業上有貴人幫助');
console.log('• 財運穩定');
console.log('• 注意健康，多休息');
console.log('');
console.log('記住：');
console.log('• 幸運色：紅、橙、金');
console.log('• 幸運方向：東北、東南');
console.log('• 努力方向：事業發展 + 技能提升');
console.log('');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('                    報告結束');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('');
console.log('此報告由 yun-seeker (運) 應用生成');
console.log('僅供參考，祝您好運！');
console.log('');
console.log('報告生成日期：2026年2月24日');
