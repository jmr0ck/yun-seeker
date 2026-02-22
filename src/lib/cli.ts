#!/usr/bin/env node

/**
 * 運 [yun] - CLI
 * 
 * Usage:
 *   yun read <birth-date> [time]     - Birth chart reading
 *   yun compat <date1> <date2>        - Compatibility analysis
 *   yun lucky                         - Lucky elements for today
 *   yun today [sign]                  - Daily horoscope
 *   yun stars                         - List all stars in the system
 */

import { Luck } from './luck';
import { FourPillars } from './fourPillars';
import { PurpleStar } from './purpleStar';
import { ChineseZodiac } from './chineseZodiac';
import { FiveElements } from './fiveElements';
import { cmdLottery } from './lottery';
import { cmdProfile, loadProfile } from './profile';

interface CLIArgs {
  command: string;
  args: string[];
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  return {
    command: args[0] || 'help',
    args: args.slice(1),
  };
}

function parseDate(input: string): { year: number; month: number; day: number } | null {
  // Support: YYYY-MM-DD, YYYY/MM/DD, YYYYMMDD
  const formats = [
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,
    /^(\d{4})(\d{2})(\d{2})$/,
  ];

  for (const format of formats) {
    const match = input.match(format);
    if (match) {
      return {
        year: parseInt(match[1]),
        month: parseInt(match[2]),
        day: parseInt(match[3]),
      };
    }
  }
  return null;
}

function parseTime(input: string): number | null {
  // Support: HH, HH:MM, HHMM
  const formats = [
    /^(\d{1,2}):(\d{2})$/,
    /^(\d{2})$/,
  ];

  for (const format of formats) {
    const match = input.match(format);
    if (match) {
      return parseInt(match[1]);
    }
  }
  return null;
}

function printHeader(title: string) {
  console.log('\n' + '='.repeat(50));
  console.log('  ' + title);
  console.log('='.repeat(50));
}

function printBirthChart(reading: ReturnType<typeof Luck.read>) {
  console.log('\n📊 ' + reading.summary);
  console.log('\n🌟 Strengths: ' + reading.details.strengths?.join(', '));
  console.log('💪 Weaknesses: ' + reading.details.weaknesses?.join(', '));
  
  if (reading.details.luckyElements) {
    const l = reading.details.luckyElements;
    console.log('\n🍀 Lucky Elements:');
    console.log('   Colors: ' + l.colors?.join(', '));
    console.log('   Numbers: ' + l.numbers?.join(', '));
    console.log('   Directions: ' + l.directions?.join(', '));
  }

  if (reading.recommendations) {
    console.log('\n💡 Recommendations:');
    reading.recommendations.forEach((r, i) => console.log(`   ${i + 1}. ${r}`));
  }
}

function cmdRead(args: string[]) {
  if (args.length < 1) {
    console.error('Usage: yun read <birth-date> [time]');
    console.error('Example: yun read 1990-08-15 14');
    return;
  }

  const date = parseDate(args[0]);
  if (!date) {
    console.error('Invalid date format. Use: YYYY-MM-DD');
    return;
  }

  const hour = args[1] ? parseTime(args[1]) : 12;
  
  const birthData = {
    year: date.year,
    month: date.month,
    day: date.day,
    hour: hour || 12,
    timezone: 'Asia/Hong_Kong',
  };

  printHeader('八字 Four Pillars Reading');
  
  const fp = new FourPillars();
  const chart = fp.analyze(birthData);

  console.log('\n📅 Four Pillars:');
  console.log(`   Year:  ${chart.year.stem.name}${chart.year.branch.name} (${chart.year.branch.animal})`);
  console.log(`   Month: ${chart.month.stem.name}${chart.month.branch.name} (${chart.month.branch.animal})`);
  console.log(`   Day:   ${chart.day.stem.name}${chart.day.branch.name} (${chart.day.branch.animal}) — 日主: ${chart.dayMaster}`);
  console.log(`   Hour:  ${chart.hour.stem.name}${chart.hour.branch.name} (${chart.hour.branch.animal})`);

  const reading = Luck.read(birthData);
  printBirthChart(reading);

  // Also show Chinese Zodiac
  printHeader('生肖 Chinese Zodiac');
  const cz = new ChineseZodiac();
  const zodiac = cz.getSign(date.year);
  const attrs = cz.getLuckyAttributes(zodiac.animal);
  
  console.log(`\n🐀 ${zodiac.animal} (${zodiac.element} ${zodiac.yinYang})`);
  console.log(`   Lucky Colors: ${attrs.colors.join(', ')}`);
  console.log(`   Lucky Numbers: ${attrs.numbers.join(', ')}`);
  console.log(`   Lucky Directions: ${attrs.directions.join(', ')}`);
}

function cmdCompat(args: string[]) {
  if (args.length < 2) {
    console.error('Usage: yun compat <date1> <date2>');
    console.error('Example: yun compat 1988-03-20 1990-08-15');
    return;
  }

  const date1 = parseDate(args[0]);
  const date2 = parseDate(args[1]);

  if (!date1 || !date2) {
    console.error('Invalid date format. Use: YYYY-MM-DD');
    return;
  }

  const data1 = { ...date1, hour: 12, timezone: 'Asia/Hong_Kong' };
  const data2 = { ...date2, hour: 12, timezone: 'Asia/Hong_Kong' };

  printHeader('Compatibility Analysis');
  
  const compat = Luck.compatibility(data1, data2);
  console.log(`\n💕 Compatibility Score: ${compat.score}/100`);
  console.log(`   ${compat.summary}`);
  console.log('\n   Details:');
  compat.details.forEach(d => console.log(`   • ${d}`));

  // Also show zodiac compatibility
  const cz = new ChineseZodiac();
  const z1 = cz.getSign(date1.year);
  const z2 = cz.getSign(date2.year);
  const zodiacCompat = cz.compatibility(z1.animal, z2.animal);

  console.log(`\n🐀🐂 Zodiac: ${z1.animal} + ${z2.animal}`);
  console.log(`   Score: ${zodiacCompat.score}/100`);
  console.log(`   ${zodiacCompat.description}`);
}

function cmdLucky(args: string[]) {
  printHeader('Lucky Elements for Today');
  
  // Default to Wood (甲) if no args
  const dayMaster = (args[0] as any) || 'wood';
  const lucky = Luck.getLuckyElements(dayMaster as any);

  console.log(`\nFor ${dayMaster} Day Master:`);
  console.log(`   Colors: ${lucky.colors.join(', ')}`);
  console.log(`   Numbers: ${lucky.numbers.join(', ')}`);
  console.log(`   Directions: ${lucky.directions.join(', ')}`);
  console.log(`   Lucky Months: ${lucky.months.join(', ')}`);
}

function cmdStars(args: string[]) {
  printHeader('14 Major Stars (十四主星)');
  
  const ps = new PurpleStar();
  const stars = ps.getStars();
  
  console.log('\n');
  stars.forEach((star, i) => {
    console.log(`${i + 1}. ${star.name} (${star.chinese})`);
    console.log(`   Element: ${star.element} | Keywords: ${star.keywords.join(', ')}`);
  });

  printHeader('12 Palaces (十二宮)');
  const palaces = ps.getPalaceInfo();
  
  console.log('\n');
  Object.keys(palaces).forEach((name) => {
    console.log(`${name}: ${palaces[name as keyof typeof palaces].description}`);
  });
}

function cmdHelp(args: string[]) {
  console.log(`
  運 [yun] - Chinese Astrology CLI

  Usage:
    yun read <birth-date> [time]     Birth chart reading (八字)
    yun compat <date1> <date2>       Compatibility analysis
    yun lucky [dayMaster]            Lucky elements for today
    yun stars                        List all stars & palaces
    yun lottery [date] [time]       Lottery numbers (uses profile if saved)
    yun profile [show|set|delete]    Manage user profile
    yun help                         Show this help

  Examples:
    yun read 1990-08-15 14
    yun compat 1988-03-20 1990-08-15
    yun lottery                     (uses saved profile)
    yun lottery 1982-12-12 4
    yun profile set "Guang Ming He" 1982-12-12 4 "Kaiping, China"

  Formats:
    Date: YYYY-MM-DD
    Time: HH (24-hour)
  `);
}

function main() {
  const { command, args } = parseArgs();

  switch (command) {
    case 'read':
      cmdRead(args);
      break;
    case 'compat':
      cmdCompat(args);
      break;
    case 'lucky':
      cmdLucky(args);
      break;
    case 'stars':
      cmdStars(args);
      break;
    case 'lottery':
      cmdLottery(args);
      break;
    case 'profile':
      cmdProfile(args);
      break;
    case 'help':
    default:
      cmdHelp(args);
  }
}

main();
