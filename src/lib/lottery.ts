/**
 * Lottery Feature for 運 [yun]
 * 
 * Generate lottery numbers based on:
 * - User's Four Pillars (八字)
 * - Five Elements balance
 * - Current celestial influences
 * - Hot numbers from recent draws
 * - Realistic distribution across range
 */

import { Luck } from './luck';
import { FourPillars } from './fourPillars';
import { ChineseZodiac } from './chineseZodiac';
import { BirthData } from './types';
import { loadProfile } from './profile';

// Number ranges for different lotteries
const LOTTO_649_RANGE = { min: 1, max: 49 };
const LOTTO_MAX_RANGE = { min: 1, max: 50 };

// Hot numbers from recent draws (Feb 2026)
const HOT_NUMBERS_649 = [27, 3, 33, 44, 49, 43, 15, 21, 13, 16, 28, 30, 40, 45, 34, 31];
const HOT_NUMBERS_MAX = [2, 11, 14, 18, 19, 38, 25, 20];

interface LotteryRecommendation {
  lotteryType: '649' | 'max' | 'either';
  reason: string;
  numbers: {
    main: number[];
    max?: number[];
  };
  sources: string[];
  lastDraw?: {
    date: string;
    numbers: number[];
    bonus?: number;
  };
}

/**
 * Get current hour stem-branch influence
 */
function getCurrentInfluences(): { hour: number; element: string } {
  const now = new Date();
  const hour = now.getHours();
  
  const branchIndex = Math.floor((hour + 1) / 2) % 12;
  const elements = ['water', 'wood', 'fire', 'earth', 'metal', 'water'];
  
  return {
    hour: branchIndex,
    element: elements[Math.floor(hour / 4) % 6],
  };
}

/**
 * Generate numbers with realistic distribution
 * - 2-3 from lucky numbers (filtered to valid range)
 * - 2-3 from hot numbers
 * - Fill rest with random to ensure distribution
 */
function generateNumbers(
  luckyNumbers: number[],
  count: number,
  range: { min: number; max: number },
  isMax: boolean = false
): number[] {
  // Filter lucky numbers to valid range
  const validLucky = luckyNumbers.filter(n => n >= range.min && n <= range.max);
  
  // Combine hot numbers with lucky
  const hotPool = isMax ? HOT_NUMBERS_MAX : HOT_NUMBERS_649;
  const poolNumbers = [...new Set([...validLucky, ...hotPool])]
    .filter(n => n >= range.min && n <= range.max);
  
  const result: number[] = [];
  
  // Take 2-3 from pool (lucky + hot)
  const poolCount = Math.min(Math.floor(count * 0.5), poolNumbers.length);
  const shuffledPool = poolNumbers.sort(() => Math.random() - 0.5);
  result.push(...shuffledPool.slice(0, poolCount));
  
  // Fill remaining with random (ensures distribution)
  while (result.length < count) {
    const rand = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    if (!result.includes(rand)) {
      result.push(rand);
    }
  }
  
  // Ensure we have exactly count numbers
  return result.slice(0, count).sort((a, b) => a - b);
}

/**
 * Recommend lottery type and generate numbers
 */
export function getLotteryRecommendation(birthData: BirthData): LotteryRecommendation {
  const fp = new FourPillars();
  const chart = fp.analyze(birthData);
  const balance = fp.getElementBalance(chart);
  const cz = new ChineseZodiac();
  const influences = getCurrentInfluences();
  
  // Determine lottery type based on element balance
  let lotteryType: '649' | 'max' | 'either' = 'either';
  let reason = '';
  
  const earthScore = balance.earth;
  const fireScore = balance.fire + balance.water;
  
  if (earthScore >= 5) {
    lotteryType = '649';
    reason = 'Your chart is Earth-dominant (stable). Lotto 649 suits your steady fortune.';
  } else if (fireScore >= 5) {
    lotteryType = 'max';
    reason = 'Your chart has dynamic Fire/Water energy. Lotto Max matches your volatile fortune.';
  } else {
    lotteryType = 'either';
    reason = 'Your chart is balanced. Both lottries work — pick based on jackpot size!';
  }
  
  // Collect lucky numbers
  const luckyNumbers: number[] = [];
  const sources: string[] = [];
  
  // From zodiac
  const zodiac = cz.getSign(birthData.year);
  luckyNumbers.push(...cz.getLuckyAttributes(zodiac.animal).numbers);
  sources.push(`Zodiac (${zodiac.animal}): ${cz.getLuckyAttributes(zodiac.animal).numbers.join(', ')}`);
  
  // From Day Master
  const luckyForDayMaster = Luck.getLuckyElements(chart.dayMaster);
  luckyNumbers.push(...luckyForDayMaster.numbers);
  sources.push(`Day Master (${chart.dayMaster}): ${luckyForDayMaster.numbers.join(', ')}`);
  
  // From current hour
  const hourElements = ['water', 'wood', 'fire', 'earth', 'metal'];
  const hourElement = hourElements[influences.hour % 5];
  const hourLucky = Luck.getLuckyElements(hourElement as any);
  luckyNumbers.push(...hourLucky.numbers);
  sources.push(`Current Hour (${hourElement}): ${hourLucky.numbers.join(', ')}`);
  
  // Universal lucky
  luckyNumbers.push(8, 6, 9);
  
  // Generate numbers for BOTH lotteries
  const mainNumbers649 = generateNumbers(luckyNumbers, 6, LOTTO_649_RANGE, false);
  const mainNumbersMax = generateNumbers(luckyNumbers, 7, LOTTO_MAX_RANGE, true);
  
  return {
    lotteryType,
    reason,
    numbers: {
      main: mainNumbers649,
      max: mainNumbersMax,
    },
    sources,
    lastDraw: {
      date: 'Feb 18, 2026',
      numbers: [5, 6, 16, 17, 33, 44],
      bonus: 29,
    },
  };
}

/**
 * CLI command for lottery
 */
export function cmdLottery(args: string[]) {
  let birthData: BirthData;
  let useProfile = false;
  
  if (args.length < 1) {
    const profile = loadProfile();
    if (!profile) {
      console.log('\n❌ No birth data provided and no profile found.');
      console.log('\nUsage:');
      console.log('   yun lottery                    (uses saved profile)');
      console.log('   yun lottery <birth-date> [time]');
      console.log('\nTo save your profile:');
      console.log('   yun profile set "Your Name" 1982-12-12 4 "Kaiping, China"');
      return;
    }
    
    const match = profile.birthDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!match) {
      console.error('Invalid birth date in profile');
      return;
    }
    
    birthData = {
      year: parseInt(match[1]),
      month: parseInt(match[2]),
      day: parseInt(match[3]),
      hour: profile.birthTime,
      timezone: profile.timezone,
    };
    useProfile = true;
  } else {
    const dateStr = args[0];
    const timeStr = args[1] || '12';
    
    const match = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!match) {
      console.error('Invalid date format. Use: YYYY-MM-DD');
      return;
    }
    
    birthData = {
      year: parseInt(match[1]),
      month: parseInt(match[2]),
      day: parseInt(match[3]),
      hour: parseInt(timeStr),
      timezone: 'Asia/Hong_Kong',
    };
  }
  
  const profile = useProfile ? loadProfile() : null;
  
  console.log('\n🎱 Lottery Recommendation');
  console.log('='.repeat(50));
  console.log(`\n📅 Birth: ${birthData.year}-${String(birthData.month).padStart(2,'0')}-${String(birthData.day).padStart(2,'0')} ${birthData.hour}:00` +
    (profile ? ` (${profile.name})` : ''));
  console.log(`🕐 Today: ${new Date().toLocaleString()}`);
  
  const rec = getLotteryRecommendation(birthData);
  
  console.log('\n🎯 Recommended: ' + (rec.lotteryType === 'max' ? 'Lotto Max' : rec.lotteryType === '649' ? 'Lotto 649' : 'Either — pick based on jackpot!'));
  console.log(`💡 ${rec.reason}`);
  
  // Show last draw for reference
  if (rec.lastDraw) {
    console.log(`\n📊 Last Draw (${rec.lastDraw.date}):`);
    console.log(`   Lotto 649: ${rec.lastDraw.numbers.join(', ')} + Bonus ${rec.lastDraw.bonus}`);
  }
  
  console.log('\n🍀 Your Lucky Numbers:');
  console.log(`\n   🎰 Lotto 649 (6 numbers from 1-49):`);
  console.log(`      ${rec.numbers.main.join('  ')}`);
  console.log(`\n   🎰 Lotto Max (7 numbers from 1-50):`);
  console.log(`      ${rec.numbers.max ? rec.numbers.max.join('  ') : 'N/A'}`);
  
  console.log('\n📊 Number Sources:');
  rec.sources.forEach(s => console.log(`   • ${s}`));
  
  console.log('\n📈 Generation Method:');
  console.log('   • 50% from your lucky numbers + hot draws');
  console.log('   • 50% random for realistic distribution');
  console.log('   • All numbers within valid range (649: 1-49, Max: 1-50)');
  
  console.log('\n⚠️  Remember: This is for entertainment only. Play responsibly!\n');
}

export default cmdLottery;
