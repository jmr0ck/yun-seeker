/**
 * 生肖 - Chinese Zodiac
 * 
 * 12 Animal signs with compatibility analysis
 */

import { ZodiacSign, Element, YinYang } from './types';

const ZODIAC_ANIMALS = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
];

const ZODIAC_ELEMENTS: Record<string, { element: Element; yinYang: YinYang }> = {
  'Rat': { element: 'water', yinYang: 'yang' },
  'Ox': { element: 'earth', yinYang: 'yin' },
  'Tiger': { element: 'wood', yinYang: 'yang' },
  'Rabbit': { element: 'wood', yinYang: 'yin' },
  'Dragon': { element: 'earth', yinYang: 'yang' },
  'Snake': { element: 'fire', yinYang: 'yin' },
  'Horse': { element: 'fire', yinYang: 'yang' },
  'Goat': { element: 'earth', yinYang: 'yin' },
  'Monkey': { element: 'metal', yinYang: 'yang' },
  'Rooster': { element: 'metal', yinYang: 'yin' },
  'Dog': { element: 'earth', yinYang: 'yang' },
  'Pig': { element: 'water', yinYang: 'yin' },
};

export class ChineseZodiac {
  /**
   * Get zodiac sign for a given year
   */
  getSign(year: number): ZodiacSign {
    const cycle = (year - 1900) % 12;
    const animal = ZODIAC_ANIMALS[cycle];
    const { element, yinYang } = ZODIAC_ELEMENTS[animal];

    // Calculate element for the year (60-year cycle)
    const yearElementIndex = Math.floor((year - 1984) / 2) % 5;
    const elements: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
    const yearElement = elements[(yearElementIndex + 5) % 5];

    return {
      animal,
      element: yearElement,
      yinYang,
      year,
    };
  }

  /**
   * Get compatibility between two animals
   */
  compatibility(animal1: string, animal2: string): {
    score: number;
    type: string;
    description: string;
  } {
    // Six Harmonies (六合) - best matches
    const harmonies: Record<string, string> = {
      'Rat': 'Ox', 'Ox': 'Rat',
      'Tiger': 'Rabbit', 'Rabbit': 'Tiger',
      'Dragon': 'Snake', 'Snake': 'Dragon',
      'Horse': 'Goat', 'Goat': 'Horse',
      'Monkey': 'Rooster', 'Rooster': 'Monkey',
      'Dog': 'Pig', 'Pig': 'Dog',
    };

    if (harmonies[animal1] === animal2) {
      return { score: 95, type: '最佳', description: 'Six Harmonies (六合) - Soulmates' };
    }

    // Three Harmonies (三合)
    const triads: Record<string, string[]> = {
      'Rat': ['Dragon', 'Monkey'],
      'Dragon': ['Rat', 'Monkey'],
      'Monkey': ['Rat', 'Dragon'],
      'Tiger': ['Horse', 'Dog'],
      'Horse': ['Tiger', 'Dog'],
      'Dog': ['Tiger', 'Horse'],
      'Rabbit': ['Goat', 'Pig'],
      'Goat': ['Rabbit', 'Pig'],
      'Pig': ['Rabbit', 'Goat'],
      'Ox': ['Snake', 'Rooster'],
      'Snake': ['Ox', 'Rooster'],
      'Rooster': ['Ox', 'Snake'],
    };

    if (triads[animal1]?.includes(animal2)) {
      return { score: 85, type: '三合', description: 'Three Harmonies - Great match' };
    }

    // Six Conflicts (六沖) - worst matches
    const conflicts: Record<string, string> = {
      'Rat': 'Horse', 'Horse': 'Rat',
      'Ox': 'Goat', 'Goat': 'Ox',
      'Tiger': 'Monkey', 'Monkey': 'Tiger',
      'Rabbit': 'Rooster', 'Rooster': 'Rabbit',
      'Dragon': 'Dog', 'Dog': 'Dragon',
      'Snake': 'Pig', 'Pig': 'Snake',
    };

    if (conflicts[animal1] === animal2) {
      return { score: 35, type: '六沖', description: 'Six Conflicts - Challenging' };
    }

    return { score: 60, type: '普通', description: 'Neutral compatibility' };
  }

  /**
   * Get lucky attributes for an animal
   */
  getLuckyAttributes(animal: string): {
    colors: string[];
    numbers: number[];
    directions: string[];
    flowers: string[];
    gemstones: string[];
  } {
    const attrs: Record<string, any> = {
      'Rat': {
        colors: ['blue', 'gold', 'green'],
        numbers: [2, 3],
        directions: ['east', 'northwest'],
        flowers: ['jasmine', 'rose'],
        gemstones: ['amethyst', 'citrine'],
      },
      'Ox': {
        colors: ['white', 'yellow', 'green'],
        numbers: [1, 9],
        directions: ['north', 'southeast'],
        flowers: ['tulip', 'rose'],
        gemstones: ['emerald', 'citrine'],
      },
      'Tiger': {
        colors: ['blue', 'gray', 'orange'],
        numbers: [1, 3, 4],
        directions: ['north', 'south'],
        flowers: ['jasmine', 'purple flower'],
        gemstones: ['emerald', 'sapphire'],
      },
      'Rabbit': {
        colors: ['red', 'pink', 'purple', 'blue'],
        numbers: [3, 4, 9],
        directions: ['south', 'east', 'northwest'],
        flowers: ['orchid', ' jasmine'],
        gemstones: ['alexandrite', ' pearl'],
      },
      'Dragon': {
        colors: ['gold', 'silver', 'white'],
        numbers: [1, 6, 7],
        directions: ['north', 'south'],
        flowers: ['jasmine', 'hydrangea'],
        gemstones: ['agate', 'diamond'],
      },
      'Snake': {
        colors: ['red', 'black', 'yellow'],
        numbers: [2, 8, 9],
        directions: ['southeast', 'southwest'],
        flowers: ['orchid', 'ivy'],
        gemstones: ['carbuncle', 'jade'],
      },
      'Horse': {
        colors: ['yellow', 'green'],
        numbers: [2, 3, 7],
        directions: ['south', 'northeast'],
        flowers: ['carnation', 'jasmine'],
        gemstones: ['emerald', ' jade'],
      },
      'Goat': {
        colors: ['green', 'red', 'purple'],
        numbers: [3, 9],
        directions: ['southwest', 'northeast'],
        flowers: ['carnation', ' primrose'],
        gemstones: ['agates', ' jade'],
      },
      'Monkey': {
        colors: ['white', 'blue', 'gold'],
        numbers: [1, 7, 8],
        directions: ['west', 'north'],
        flowers: ['chrysanthemum', ' jasmine'],
        gemstones: ['garnet', 'topaz'],
      },
      'Rooster': {
        colors: ['gold', 'brown', 'yellow'],
        numbers: [5, 7, 8],
        directions: ['west', 'northeast'],
        flowers: ['gladiolus', ' morning glory'],
        gemstones: ['onyx', 'sapphire'],
      },
      'Dog': {
        colors: ['red', 'green', 'purple'],
        numbers: [3, 4, 9],
        directions: ['southeast', 'northeast'],
        flowers: ['rose', 'cymbidium'],
        gemstones: ['ruby', ' jade'],
      },
      'Pig': {
        colors: ['yellow', 'gray', 'brown', 'gold'],
        numbers: [2, 5, 8],
        directions: ['northeast', 'southwest'],
        flowers: ['lily', ' chrysanthemum'],
        gemstones: ['emerald', ' jade'],
      },
    };

    return attrs[animal] || {
      colors: [],
      numbers: [],
      directions: [],
      flowers: [],
      gemstones: [],
    };
  }
}

export default ChineseZodiac;
