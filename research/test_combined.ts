/**
 * Complete Reading - Chinese + Western Astrology
 */

import { getZodiac, getElement, getQuality, ZODIAC } from './src/lib/westernAstrology.js';

function getLuckyColor(element) {
  const colors = {
    'fire': '紅色、橙色、紫色',
    'earth': '黃色、棕色、金色',
    'air': '白色、銀色、淺藍',
    'water': '藍色、黑色、海軍藍'
  };
  return colors[element] || '白色';
}

function getLuckyStone(element) {
  const stones = {
    'fire': '紅寶石、石榴石',
    'earth': '黃玉、翡翠',
    'air': '水晶、鑽石',
    'water': '藍寶石、海藍寶石'
  };
  return stones[element] || '水晶';
}

function generateWesternSection(year, month, day) {
  const zodiac = getZodiac(month, day);
  
  let section = '';
  section += '═══════════════════════════════════════════════════════════════════════\n';
  section += '                    第十四部分：西方占星\n';
  section += '═══════════════════════════════════════════════════════════════════════\n';
  section += '\n';
  section += '【星座】' + zodiac.name + ' ' + zodiac.symbol + '\n';
  section += '\n';
  section += '【守護星】' + zodiac.ruler + '\n';
  section += '\n';
  section += '【元素】' + zodiac.element + ' — ' + getElement(zodiac.element) + '\n';
  section += '\n';
  section += '【特質】' + zodiac.quality + ' — ' + getQuality(zodiac.quality) + '\n';
  section += '\n';
  section += '【陰陽】' + (zodiac.polarity === 'positive' ? '陽' : '陰') + '\n';
  section += '\n';
  section += '【掌管身體】' + zodiac.bodyPart + '\n';
  section += '\n';
  section += '【性格特點】' + zodiac.characteristics + '\n';
  section += '\n';
  section += '【幸運色】' + getLuckyColor(zodiac.element) + '\n';
  section += '\n';
  section += '【幸運石】' + getLuckyStone(zodiac.element) + '\n';
  section += '\n';
  
  return section;
}

// Test
const birthData = [
  { name: 'Yanicelee', year: 2002, month: 11, day: 4 },
  { name: 'Ming', year: 1982, month: 12, day: 12 },
];

console.log('Testing combined reports...\n');

birthData.forEach(b => {
  console.log('\n' + '='.repeat(60));
  console.log('   ' + b.name + ' - ' + b.year + '-' + b.month + '-' + b.day);
  console.log('='.repeat(60));
  console.log(generateWesternSection(b.year, b.month, b.day));
});
