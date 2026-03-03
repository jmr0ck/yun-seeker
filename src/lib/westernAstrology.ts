/**
 * Western Astrology - 12 Zodiac Signs
 * Based on Classical Astrology from Abu Ma'shar
 */

export interface WesternZodiac {
  name: string;
  nameEN: string;
  symbol: string;
  ruler: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  quality: 'cardinal' | 'fixed' | 'mutable';
  modality: 'hot' | 'cold' | 'wet' | 'dry';
  polarity: 'positive' | 'negative';
  bodyPart: string;
  flavor: string;
  humor: string;
  characteristics: string;
  riseDegree: number;
  countries: string[];
}

export const ZODIAC: Record<string, WesternZodiac> = {
  // Fire signs
  '白羊座': {
    name: '白羊座',
    nameEN: 'Aries',
    symbol: '♈',
    ruler: '火星 (Mars)',
    element: 'fire',
    quality: 'cardinal',
    modality: 'hot',
    polarity: 'positive',
    bodyPart: '頭部、面部',
    flavor: '苦味',
    humor: '黃膽汁',
    characteristics: '直立升高、半臂缺失、易發怒、兩種顏色、重視色慾、子女稀少',
    riseDegree: 19,
    countries: '巴比倫、波斯(古代土耳其)、阿塞拜疆、巴勒斯坦'
  },
  '獅子座': {
    name: '獅子座',
    nameEN: 'Leo',
    symbol: '♌',
    ruler: '太陽 (Sun)',
    element: 'fire',
    quality: 'fixed',
    modality: 'hot',
    polarity: 'positive',
    bodyPart: '胃部以上、心臟、腋下、背部',
    flavor: '苦味',
    humor: '黃膽汁',
    characteristics: '半臂殘缺、易發怒、重視色慾、貧瘠、聰明伶俐、奸詐狡猾',
    riseDegree: 0,
    countries: '土耳其帝國、索格狄亞那、尼沙泊'
  },
  '射手座': {
    name: '射手座',
    nameEN: 'Sagittarius',
    symbol: '♐',
    ruler: '木星 (Jupiter)',
    element: 'fire',
    quality: 'mutable',
    modality: 'hot',
    polarity: 'positive',
    bodyPart: '兩條大腿',
    flavor: '苦味',
    humor: '黃膽汁',
    characteristics: '人形與獸形混合、子女稀少、半有聲、詭計多端',
    riseDegree: 0,
    countries: '巴格達、阿吉波島、伊斯法罕'
  },

  // Earth signs
  '金牛座': {
    name: '金牛座',
    nameEN: 'Taurus',
    symbol: '♉',
    ruler: '金星 (Venus)',
    element: 'earth',
    quality: 'fixed',
    modality: 'cold',
    polarity: 'negative',
    bodyPart: '脖子、喉結',
    flavor: '酸味',
    humor: '黑膽汁',
    characteristics: '形狀殘缺、半臂缺失、注重色慾、子女較少、半有聲',
    riseDegree: 3,
    countries: '奧蘇瓦德島、哈馬丹、庫爾德帝國'
  },
  '處女座': {
    name: '處女座',
    nameEN: 'Virgo',
    symbol: '♍',
    ruler: '水星 (Mercury)',
    element: 'earth',
    quality: 'mutable',
    modality: 'cold',
    polarity: 'negative',
    bodyPart: '腹部、大小腸、橫隔膜',
    flavor: '酸味',
    humor: '黑膽汁',
    characteristics: '三種形態、敏捷、貧瘠、美麗臉龐、慷慨靈魂',
    riseDegree: 15,
    countries: '傑拉馬恰、敘利亞、幼發拉底河流域'
  },
  '摩羯座': {
    name: '摩羯座',
    nameEN: 'Capricorn',
    symbol: '♑',
    ruler: '土星 (Saturn)',
    element: 'earth',
    quality: 'cardinal',
    modality: 'cold',
    polarity: 'negative',
    bodyPart: '膝蓋',
    flavor: '酸味',
    humor: '黑膽汁',
    characteristics: '形狀不全、兩種要素、前半土相、後半水相、易腐化、極度享受、缺乏發聲能力',
    riseDegree: 28,
    countries: '埃塞俄比亞、印度河地區、馬卡蘭、辛德'
  },

  // Air signs
  '雙子座': {
    name: '雙子座',
    nameEN: 'Gemini',
    symbol: '♊',
    ruler: '水星 (Mercury)',
    element: 'air',
    quality: 'mutable',
    modality: 'hot',
    polarity: 'positive',
    bodyPart: '肩膀、上臂、手掌',
    flavor: '甜味',
    humor: '多血質',
    characteristics: '多面性、天馬行空、高大樹人形、善辯、年輕美麗、慷慨善良',
    riseDegree: 3,
    countries: '約旦、阿米尼亞、阿塞拜疆、基蘭、埃及'
  },
  '天秤座': {
    name: '天秤座',
    nameEN: 'Libra',
    symbol: '♎',
    ruler: '金星 (Venus)',
    element: 'air',
    quality: 'cardinal',
    modality: 'hot',
    polarity: 'positive',
    bodyPart: '脊柱、下腹、肚臍、生殖器',
    flavor: '甜味',
    humor: '多血質',
    characteristics: '兩種顏色、兩種形態、略帶陰鬱、重視色慾、子女較少、漂亮臉龐',
    riseDegree: 21,
    countries: '拜占庭帝國、上埃及、喀布爾'
  },
  '水瓶座': {
    name: '水瓶座',
    nameEN: 'Aquarius',
    symbol: '♒',
    ruler: '土星 (Saturn)',
    element: 'air',
    quality: 'fixed',
    modality: 'hot',
    polarity: 'positive',
    bodyPart: '膝蓋以下小腿',
    flavor: '甜味',
    humor: '多血質',
    characteristics: '人形、子女較少、貧瘠、缺乏發聲能力',
    riseDegree: 0,
    countries: '阿爾蘇維德島、庫法島、埃及'
  },

  // Water signs
  '巨蟹座': {
    name: '巨蟹座',
    nameEN: 'Cancer',
    symbol: '♋',
    ruler: '月亮 (Moon)',
    element: 'water',
    quality: 'cardinal',
    modality: 'cold',
    polarity: 'negative',
    bodyPart: '胸腔、乳房、胃、腹腔、脾臟、肺葉',
    flavor: '鹹味',
    humor: '黏液質',
    characteristics: '子女很多、無聲星座、爬行動物、水生動物、中等高度樹',
    riseDegree: 15,
    countries: '小阿米尼亞、中國、馬爾拉德'
  },
  '天蠍座': {
    name: '天蠍座',
    nameEN: 'Scorpio',
    symbol: '♏',
    ruler: '火星 (Mars)',
    element: 'water',
    quality: 'fixed',
    modality: 'cold',
    polarity: 'negative',
    bodyPart: '陰莖、膀胱、臀部、會陰',
    flavor: '鹹味',
    humor: '黏液質',
    characteristics: '子女很多邪惡、謹慎、易發怒、擅長謊言、美麗臉龐',
    riseDegree: 0,
    countries: '阿拉伯沙漠、摩洛哥、伊朗'
  },
  '雙魚座': {
    name: '雙魚座',
    nameEN: 'Pisces',
    symbol: '♓',
    ruler: '木星 (Jupiter)',
    element: 'water',
    quality: 'mutable',
    modality: 'cold',
    polarity: 'negative',
    bodyPart: '腳部',
    flavor: '鹹味',
    humor: '黏液質',
    characteristics: '中等子女、半臂殘缺、無聲星座、極度小心、草率、多種形態',
    riseDegree: 27,
    countries: '拜占庭帝國、敘利亞、埃及'
  }
};

// Calculate Western zodiac from birth date
export function getZodiac(month: number, day: number): WesternZodiac {
  const signs = [
    { name: '摩羯座', start: [12, 22], end: [1, 19] },
    { name: '水瓶座', start: [1, 20], end: [2, 18] },
    { name: '雙魚座', start: [2, 19], end: [3, 20] },
    { name: '白羊座', start: [3, 21], end: [4, 19] },
    { name: '金牛座', start: [4, 20], end: [5, 20] },
    { name: '雙子座', start: [5, 21], end: [6, 20] },
    { name: '巨蟹座', start: [6, 21], end: [7, 22] },
    { name: '獅子座', start: [7, 23], end: [8, 22] },
    { name: '處女座', start: [8, 23], end: [9, 22] },
    { name: '天秤座', start: [9, 23], end: [10, 22] },
    { name: '天蠍座', start: [10, 23], end: [11, 21] },
    { name: '射手座', start: [11, 22], end: [12, 21] },
  ];

  for (const sign of signs) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;
    
    if (startMonth === 12 && endMonth === 1) {
      // Capricorn wraps around year
      if ((month === 12 && day >= startDay) || (month === 1 && day <= endDay)) {
        return ZODIAC[sign.name];
      }
    } else {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return ZODIAC[sign.name];
      }
    }
  }
  return ZODIAC['白羊座']; // Default
}

// Get element characteristics
export function getElement(element: string): string {
  const elements: Record<string, string> = {
    'fire': '火行人 - 熱情、主動、有魄力、執行力強',
    'earth': '土行人 - 務實、穩重、實際、傳統',
    'air': '風行人 - 思想型、溝通能力強、靈活、多變',
    'water': '水行人 - 感性、直覺強、情感豐富、適應力強'
  };
  return elements[element] || '';
}

// Get quality characteristics  
export function getQuality(quality: string): string {
  const qualities: Record<string, string> = {
    'cardinal': '开创型 - 有领导力、主动出击、适合创业',
    'fixed': '固定型 - 坚持、稳定、有耐心、适合守成',
    'mutable': '变动型 - 适应力强、多才多艺、善于调整'
  };
  return qualities[quality] || '';
}

// Western compatibility (simplified)
export function getCompatibility(zodiac1: string, zodiac2: string): {
  score: number;
  description: string;
} {
  const elements = ['fire', 'earth', 'air', 'water'];
  const sign1 = ZODIAC[zodiac1];
  const sign2 = ZODIAC[zodiac2];
  
  if (!sign1 || !sign2) return { score: 50, description: '無法確定' };
  
  // Same element = best compatibility
  if (sign1.element === sign2.element) {
    return { score: 85, description: '🌟 同屬性 - 天生夾夾！' };
  }
  
  // Fire + Air = good
  if ((sign1.element === 'fire' && sign2.element === 'air') || 
      (sign1.element === 'air' && sign2.element === 'fire')) {
    return { score: 75, description: '🔥 火+風 - 互相激勵' };
  }
  
  // Earth + Water = good
  if ((sign1.element === 'earth' && sign2.element === 'water') ||
      (sign1.element === 'water' && sign2.element === 'earth')) {
    return { score: 75, description: '🌊 土+水 - 互相支持' };
  }
  
  // Fire + Earth = challenging
  if ((sign1.element === 'fire' && sign2.element === 'earth') ||
      (sign1.element === 'earth' && sign2.element === 'fire')) {
    return { score: 45, description: '⚡ 火+土 - 需要磨合' };
  }
  
  return { score: 55, description: '➡️ 性格互補' };
}

export default {
  ZODIAC,
  getZodiac,
  getElement,
  getQuality,
  getCompatibility
};
