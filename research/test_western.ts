/**
 * Test Western Astrology
 */

import { getZodiac, getElement, getQuality, getCompatibility, ZODIAC } from './src/lib/westernAstrology.js';

// Test with Yanicelee's birthday (2002-11-04)
console.log('═══════════════════════════════════════════════════════════════');
console.log('   🔯 Western Astrology Test');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

// Yanicelee - November 4, 2002
console.log('【Yanicelee - 2002年11月4日】');
const zodiac1 = getZodiac(11, 4);
console.log(`  星座: ${zodiac1.name} ${zodiac1.symbol}`);
console.log(`  守護星: ${zodiac1.ruler}`);
console.log(`  元素: ${zodiac1.element} → ${getElement(zodiac1.element)}`);
console.log(`  特質: ${zodiac1.quality} → ${getQuality(zodiac1.quality)}`);
console.log(`  掌管身體: ${zodiac1.bodyPart}`);
console.log(`  性格: ${zodiac1.characteristics}`);
console.log('');

// Ming - December 12, 1982
console.log('【Ming - 1982年12月12日】');
const zodiac2 = getZodiac(12, 12);
console.log(`  星座: ${zodiac2.name} ${zodiac2.symbol}`);
console.log(`  守護星: ${zodiac2.ruler}`);
console.log(`  元素: ${zodiac2.element} → ${getElement(zodiac2.element)}`);
console.log(`  特質: ${zodiac2.quality} → ${getQuality(zodiac2.quality)}`);
console.log('');

// Compatibility test
console.log('【兼容性】');
const comp = getCompatibility(zodiac1.name, zodiac2.name);
console.log(`  ${zodiac1.name} + ${zodiac2.name}: ${comp.score}% - ${comp.description}`);
console.log('');

// Full list
console.log('═══════════════════════════════════════════════════════════════');
console.log('   📋 12星座完整列表');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
Object.values(ZODIAC).forEach(z => {
  console.log(`${z.symbol} ${z.name} (${z.nameEN})`);
  console.log(`   守護星: ${z.ruler}`);
  console.log(`   元素: ${z.element} | 特質: ${z.quality} | 陰陽: ${z.polarity}`);
  console.log('');
});
