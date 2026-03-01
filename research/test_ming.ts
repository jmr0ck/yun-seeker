/**
 * Ultimate Reading Test - MING
 */

import { generateUltimateReading } from './src/lib/ultimateReading.js';

const birthData = {
  year: 1982,
  month: 12,
  day: 12,
  hour: 4,
  timezone: 'Asia/Hong_Kong'
};

const reading = generateUltimateReading(birthData);

console.log('═══════════════════════════════════════════════════════════════');
console.log('          🔮 終極命理分析報告 - Ultimate Reading');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log(`📅 出生: ${reading.basic.birthDate}`);
console.log('');

// Basic
console.log('═══════════════════════════════════════════════════════════════');
console.log('   🐀 四柱八字');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log(`  年柱: ${reading.basic.yearPillar} (${reading.tenGods.year})`);
console.log(`  月柱: ${reading.basic.monthPillar} (${reading.tenGods.month}) ⭐`);
console.log(`  日柱: ${reading.basic.dayPillar} (${reading.tenGods.day}) ← 日主: ${reading.basic.dayMaster}`);
console.log(`  時柱: ${reading.basic.hourPillar} (${reading.tenGods.hour})`);
console.log(`  生肖: ${reading.basic.zodiac}`);
console.log('');

// Elements
console.log('═══════════════════════════════════════════════════════════════');
console.log('   ⚖️ 五行強弱');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
reading.elements.forEach(e => {
  const bar = '█'.repeat(Math.min(e.count, 6));
  console.log(`  ${e.element}: ${bar} (${e.strength})`);
});
console.log('');

// Structures
console.log('═══════════════════════════════════════════════════════════════');
console.log('   🔥 格局 & ⚠️ 刑沖');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
reading.structures.forEach(s => console.log(`  ✅ ${s}`));
reading.clashes.forEach(c => console.log(`  ⚠️ ${c}`));
reading.combinations.forEach(c => console.log(`  🔗 ${c}`));
console.log('');

// Purple Star
console.log('═══════════════════════════════════════════════════════════════');
console.log('   🟣 紫微斗數');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log(`  主星: ${reading.purpleStar.mainStar}`);
console.log(`  命宮: ${reading.purpleStar.palace}`);
console.log(`  四化: ${reading.purpleStar.fourHua.star} ${reading.purpleStar.fourHua.type}`);
console.log('');

// Career
console.log('═══════════════════════════════════════════════════════════════');
console.log('   💼 事業分析');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log(`  宮位: ${reading.career.palace}`);
console.log(`  適合行業: ${reading.career.industries.join(', ')}`);
console.log(`  創業傾向: ${reading.career.entrepreneurial ? '✅ 適合創業' : '❌ 打工為主'}`);
console.log(`  建議: ${reading.career.advice}`);
console.log('');

// Finance
console.log('═══════════════════════════════════════════════════════════════');
console.log('   💰 財運分析');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log(`  特質: ${reading.finance.traits.join(', ')}`);
console.log(`  策略: ${reading.finance.strategy}`);
console.log('');
reading.finance.yearly.forEach(y => {
  console.log(`  ${y.year}: ${y.outlook}`);
});
console.log('');

// Love
console.log('═══════════════════════════════════════════════════════════════');
console.log('   💕 桃花/戀愛');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log(`  夫妻宮: ${reading.love.palace}`);
console.log(`  理想結婚年齡: ${reading.love.marriageAge.min}-${reading.love.marriageAge.max}歲`);
console.log(`  理想對象: ${reading.love.idealType.join(', ')}`);
console.log(`  建議: ${reading.love.advice}`);
console.log('');

// Lucky
console.log('═══════════════════════════════════════════════════════════════');
console.log('   🍀 幸運元素');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log(`  幸運色: ${reading.lucky.colors.join(', ')}`);
console.log(`  幸運方向: ${reading.lucky.directions.join(', ')}`);
console.log(`  幸運數字: ${reading.lucky.numbers.join(', ')}`);
console.log(`  幸運日: ${reading.lucky.days.join(', ')}`);
console.log(`  幸運月: ${reading.lucky.months.join(', ')}`);
console.log('');

// Da Yun
console.log('═══════════════════════════════════════════════════════════════');
console.log('   🚀 大運');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log(`  現在: ${reading.daYun.current.years} (${reading.daYun.current.age})`);
console.log(`    → ${reading.daYun.current.theme}`);
console.log('');
console.log(`  下一步: ${reading.daYun.next.years} (${reading.daYun.next.age})`);
console.log(`    → ${reading.daYun.next.theme}`);
console.log('');

// Liu Nian
console.log('═══════════════════════════════════════════════════════════════');
console.log('   📅 流年預測 2025-2028');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log('  年份   天干   地支   運勢      事業      戀愛      財運');
console.log('  ' + '─'.repeat(70));
Object.entries(reading.liuNian).forEach(([year, data]) => {
  console.log(`  ${year}    ${data.stem}      ${data.branch}     ${data.luck}    ${data.career}    ${data.love}    ${data.finance}`);
});
console.log('');

// Summary
console.log('═══════════════════════════════════════════════════════════════');
console.log('   📝 總結');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log(`  ${reading.summary}`);
console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log('          生成時間: 2026-02-24');
console.log('          Powered by yun-seeker (運)');
console.log('═══════════════════════════════════════════════════════════════');
