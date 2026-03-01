/**
 * Generate Complete Reading for Friend
 * 2002-11-04 4:00 AM HK
 */

import { generateCompleteReading } from './src/lib/completeReading.js';

const birthData = {
  year: 2002,
  month: 11,
  day: 4,
  hour: 4,
  timezone: 'Asia/Hong_Kong'
};

const reading = generateCompleteReading(birthData);

console.log('================================================================');
console.log('   🔮 八字命理完整分析報告 (進階版)');
console.log('================================================================');
console.log('');
console.log(`出生: 2002年11月4日 4:00 AM`);
console.log(`時區: Asia/Hong_Kong`);
console.log('');

// Basic
console.log('================================================================');
console.log('   🐀 四柱十神');
console.log('================================================================');
console.log('');
console.log(`年柱: ${reading.basic.year} = ${reading.basic.tenGodYear}`);
console.log(`月柱: ${reading.basic.month} = ${reading.basic.tenGodMonth} ⭐`);
console.log(`日柱: ${reading.basic.day} = ${reading.basic.tenGodDay} (日主=${reading.basic.dayMaster})`);
console.log(`時柱: ${reading.basic.hour} = ${reading.basic.tenGodHour}`);
console.log('');
console.log(`生肖: ${reading.basic.zodiac}`);
console.log('');

// Elements
console.log('================================================================');
console.log('   ⚖️ 五行強弱');
console.log('================================================================');
console.log('');
reading.basic.elements.forEach(e => {
  console.log(`  ${e.element}: ${e.count}個 (${e.strength})`);
});
console.log('');

// Structures
if (reading.structures.length > 0) {
  console.log('================================================================');
  console.log('   🔥 格局結構');
  console.log('================================================================');
  console.log('');
  reading.structures.forEach(s => console.log(`  ✅ ${s}`));
  console.log('');
}

// Clashes
if (reading.clashes.length > 0) {
  console.log('================================================================');
  console.log('   ⚠️ 刑沖合害');
  console.log('================================================================');
  console.log('');
  reading.clashes.forEach(c => console.log(`  ⚠️ ${c}`));
  console.log('');
}

// Career
console.log('================================================================');
console.log('   💼 事業分析');
console.log('================================================================');
console.log('');
console.log(`概述: ${reading.career.summary}`);
console.log(`特質: ${reading.career.traits.join(', ')}`);
console.log(`適合: ${reading.career.suitableJobs.join(', ')}`);
console.log(`建議: ${reading.career.advice}`);
console.log('');

// Finance
console.log('================================================================');
console.log('   💰 財運分析');
console.log('================================================================');
console.log('');
console.log(`概述: ${reading.finance.summary}`);
console.log(`特質: ${reading.finance.traits.join(', ')}`);
console.log(`建議: ${reading.finance.advice}`);
console.log('');

// Love
console.log('================================================================');
console.log('   💕 桃花/戀愛分析');
console.log('================================================================');
console.log('');
console.log(`概述: ${reading.love.summary}`);
console.log(`特質: ${reading.love.traits.join(', ')}`);
console.log(`理想對象: ${reading.love.idealPartner}`);
console.log(`挑戰: ${reading.love.challenges}`);
console.log(`建議: ${reading.love.advice}`);
console.log('');

// Health
console.log('================================================================');
console.log('   🏥 健康建議');
console.log('================================================================');
console.log('');
console.log(`弱點: ${reading.health.weakPoints.join(', ')}`);
console.log(`養生: ${reading.health.careAdvice}`);
console.log('');

// Yearly
console.log('================================================================');
console.log('   📅 流年預測');
console.log('================================================================');
console.log('');
console.log(`2025 ${reading.yearly['2025'].stem}${reading.yearly['2025'].branch}: ${reading.yearly['2025'].luck}`);
console.log(`  → ${reading.yearly['2025'].advice}`);
console.log('');
console.log(`2026 ${reading.yearly['2026'].stem}${reading.yearly['2026'].branch}: ${reading.yearly['2026'].luck}`);
console.log(`  → ${reading.yearly['2026'].advice}`);
console.log('');
console.log(`2027 ${reading.yearly['2027'].stem}${reading.yearly['2027'].branch}: ${reading.yearly['2027'].luck}`);
console.log(`  → ${reading.yearly['2027'].advice}`);
console.log('');

// DSA
console.log('================================================================');
console.log('   🚀 大運');
console.log('================================================================');
console.log('');
console.log(`現在大運 (${reading.dsa.current.years}): ${reading.dsa.current.element}`);
console.log(`  → ${reading.dsa.current.summary}`);
console.log('');
console.log(`下一步大運 (${reading.dsa.next.years}): ${reading.dsa.next.element}`);
console.log(`  → ${reading.dsa.next.summary}`);
console.log('');
