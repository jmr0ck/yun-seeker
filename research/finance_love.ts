/**
 * Finance & Love Forecast 2026
 * Based on Four Pillars
 */

const birthChart = {
  dayStem: '丙火', // Day Master: Fire
  dayBranch: '戌', // Earth Dog
  yearStem: '壬水', // Year Stem
  monthStem: '辛金', // Month Stem
  hourStem: '庚金', // Hour Stem
  zodiac: '馬',
  elements: { wood: 1, fire: 2, earth: 2, metal: 2, water: 1 }
};

// Finance monthly analysis
function financeAnalysis(month: string, branch: string) {
  const finance: Record<string, { income: string, expense: string, overall: string, tip: string }> = {
    '丑': { income: '中', expense: '高', overall: '緊張', tip: '節制開支，避免大額投資' },
    '寅': { income: '上升', expense: '中', overall: '好轉', tip: '開始有新收入來源' },
    '卯': { income: '上升', expense: '中', overall: '好', tip: '理財收益增加' },
    '辰': { income: '穩定', expense: '低', overall: '理想', tip: '儲蓄好時機' },
    '巳': { income: '高峰', expense: '高', overall: '波動', tip: '收入大增但花費也大' },
    '午': { income: '中', expense: '高', overall: '注意', tip: '謹慎消費，防破財' },
    '未': { income: '回穩', expense: '中', overall: '平穩', tip: '收入支出平衡' },
    '申': { income: '佳', expense: '中', overall: '好', tip: '投資運不錯' },
    '酉': { income: '中', expense: '高', overall: '注意', tip: '小心破財' },
    '戌': { income: '中', expense: '高', overall: '緊張', tip: '理財謹慎' },
    '亥': { income: '回升', expense: '中', overall: '好轉', tip: '年末有新收入' },
    '子': { income: '穩', expense: '低', overall: '理想', tip: '為明年儲蓄' },
  };
  return finance[branch] || { income: '中', expense: '中', overall: '平穩', tip: '穩健理財' };
}

// Love monthly analysis  
function loveAnalysis(month: string, branch: string) {
  const love: Record<string, { relationship: string, luck: string, tip: string }> = {
    '丑': { relationship: '單身', luck: '⭐⭐⭐', tip: '相親有望，長輩介紹' },
    '寅': { relationship: '桃花', luck: '⭐⭐⭐⭐', tip: '新戀情出現' },
    '卯': { relationship: '穩定', luck: '⭐⭐⭐⭐', tip: '感情升溫' },
    '辰': { relationship: '考驗', luck: '⭐⭐⭐', tip: '磨合期，多溝通' },
    '巳': { relationship: '沖動', luck: '⭐⭐', tip: '謹慎決定，避免衝動' },
    '午': { relationship: '現有', luck: '⭐⭐⭐', tip: '珍惜身邊人' },
    '未': { relationship: '回歸', luck: '⭐⭐⭐', tip: '前任或舊相識' },
    '申': { relationship: '社交', luck: '⭐⭐⭐⭐', tip: '社交活動多' },
    '酉': { relationship: '專注', luck: '⭐⭐⭐', tip: '專注工作' },
    '戌': { relationship: '動盪', luck: '⭐⭐', tip: '防第三者' },
    '亥': { relationship: '轉機', luck: '⭐⭐⭐', tip: '年末有新發展' },
    '子': { relationship: '蘊釀', luck: '⭐⭐⭐', tip: '為明年做準備' },
  };
  return love[branch] || { relationship: '平穩', luck: '⭐⭐⭐', tip: '順其自然' };
}

const months2026 = [
  { month: '1月', branch: '丑' }, { month: '2月', branch: '寅' },
  { month: '3月', branch: '卯' }, { month: '4月', branch: '辰' },
  { month: '5月', branch: '巳' }, { month: '6月', branch: '午' },
  { month: '7月', branch: '未' }, { month: '8月', branch: '申' },
  { month: '9月', branch: '酉' }, { month: '10月', branch: '戌' },
  { month: '11月', branch: '亥' }, { month: '12月', branch: '子' },
];

console.log('================================================================');
console.log('   💰 2026 財運預測');
console.log('   出生: 2002年11月4日 4:00 AM');
console.log('   日主: 丙火');
console.log('================================================================');
console.log('');

months2026.forEach(m => {
  const f = financeAnalysis(m.month, m.branch);
  console.log(`【${m.month}】收入: ${f.income} | 支出: ${f.expense} | 整體: ${f.overall}`);
  console.log(`   💡 ${f.tip}`);
  console.log('');
});

console.log('================================================================');
console.log('   💕 2026 桃花/戀愛運預測');
console.log('================================================================');
console.log('');

months2026.forEach(m => {
  const l = loveAnalysis(m.month, m.branch);
  console.log(`【${m.month}】${l.relationship} | 運勢: ${l.luck}`);
  console.log(`   💡 ${l.tip}`);
  console.log('');
});

console.log('================================================================');
console.log('   📊 全年總結');
console.log('================================================================');
console.log('');
console.log('💰 財運總結:');
console.log('  - 最旺月份: 4月(辰)、5月(巳)、8月(申)');
console.log('  - 注意月份: 1月、6月、10月');
console.log('  - 建議: 4-5月把握機會，6、10月謹慎理財');
console.log('');
console.log('💕 桃花運總結:');
console.log('  - 旺月: 2月、3月、8月');
console.log('  - 平淡月: 6月、10月');
console.log('  - 建議: 2-3月把握新戀情，8月社交活躍');
console.log('');
console.log('================================================================');
console.log('   🔮 你的命格特點');
console.log('================================================================');
console.log('');
console.log('財運特質:');
console.log('  - 日主丙火生辰土，適合穩健理財');
console.log('  - 八字金水弱，宜儲蓄不宜投機');
console.log('  - 適合: 定期存款、基金、保險');
console.log('  - 不宜: 股票、期貨、杠杆投資');
console.log('');
console.log('桃花特質:');
console.log('  - 火行人，熱情主動');
console.log('  - 馬+狗，適合活潑開朗的對象');
console.log('  - 幸運色: 紅、粉、紫');
console.log('  - 幸運場所: 南方、火旺之地');
