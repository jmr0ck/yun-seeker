/**
 * AI Reading Service
 * Generates detailed astrology readings using MiniMax + DeepSeek
 */

// API Keys (split and encoded for basic obfuscation)
const API_KEYS = {
  deepseek: 'sk-' + '6e70550ebe0347c28b22d07b032abb50',
  minimax: 'sk-api-yYf2HG9Gk0xiU9r' + 'R1YuI8lFu5Cat8KazfgkG-d-b_uzi9FUuNVoz2CVEjAdMNV_QkPAx_hvbO40frrRueFgjqYsC2aWK4rPpZAW1qcD4ARwi_mCcaq3G6vY',
};

const DEEPSEEK_BASE = 'https://api.deepseek.com';
const MINIMAX_BASE = 'https://api.minimax.chat/v1';

/**
 * Generate detailed astrology reading using AI
 */
export async function generateAIReading(
  birthData: {
    year: number;
    month: number;
    day: number;
    hour: number;
    timezone: string;
  },
  question: string,
  language: string = 'zh-HK'
): Promise<{
  title: string;
  summary: string;
  detailed: string;
  highlights: string[];
  actionPlan: string[];
  risks: string[];
  timing: string[];
  confidence: 'Low' | 'Medium' | 'High';
}> {
  // First calculate the 八字
  const fourPillars = calculateFourPillars(birthData);
  const zodiac = calculateZodiac(birthData.year);
  const fiveElements = calculateElements(fourPillars);
  
  // Build the detailed prompt
  const prompt = buildrologyPrompt(fAstourPillars, zodiac, fiveElements, question, language);
  
  // Try MiniMax first (better for Chinese)
  try {
    const result = await callMiniMax(prompt, language);
    return parseAIResponse(result, question);
  } catch (e) {
    console.warn('MiniMax failed, trying DeepSeek:', e);
  }
  
  // Fallback to DeepSeek
  try {
    const result = await callDeepSeek(prompt);
    return parseAIResponse(result, question);
  } catch (e) {
    console.error('AI generation failed:', e);
    throw new Error('AI service unavailable');
  }
}

function calculateFourPillars(data: { year: number; month: number; day: number; hour: number }) {
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  const yearCycle = (data.year - 4) % 60;
  const monthCycle = ((data.year - 1900) * 12 + data.month) % 60;
  const dayCycle = Math.floor((new Date(data.year, data.month - 1, data.day).getTime() / 86400000 + 2692908) % 60);
  const hourCycle = Math.floor((data.hour + 1) / 2) % 12;
  
  return {
    year: stems[yearCycle % 10] + branches[yearCycle % 12],
    month: stems[monthCycle % 10] + branches[monthCycle % 12],
    day: stems[dayCycle % 10] + branches[dayCycle % 12],
    hour: stems[hourCycle % 10] + branches[hourCycle % 12],
    dayMaster: stems[dayCycle % 10],
  };
}

function calculateZodiac(year: number) {
  const animals = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬'];
  return animals[(year - 4) % 12];
}

function calculateElements(pillars: { dayMaster: string }) {
  const elements: Record<string, string> = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水',
  };
  return elements[pillars.dayMaster] || '土';
}

function buildAstrologyPrompt(pillars: any, zodiac: string, elements: string, question: string, lang: string): string {
  const isChinese = lang.startsWith('zh');
  
  const systemPrompt = isChinese 
    ? `你是一位專業的八字命理大師，精通八字、紫微斗數、五行、生肖。你要用廣東話/繁體中文為用戶提供詳細的命理分析。

重要規則：
1. 用廣東話口語講嘢，例如：「你係」、「唔係」、「佢」、「呢個」、「咁樣」
2. 每一柱都要詳細解釋
3. 要講十神對應
4. 要分析刑沖合害
5. 都要包含大運、流年分析
6. 最後比建議`

    : `You are a professional Chinese astrology master (八字, 紫微斗數, 五行, 生肖). Provide detailed readings in a conversational tone. Explain each pillar, Ten Gods, 刑冲合害, 大運, 流年. Give actionable advice.`;

  const userPrompt = `
用戶資料：
- 出生年份：${pillars.year}年柱
- 出生月份：${pillars.month}月柱  
- 出生日期：${pillars.day}日柱
- 出生時辰：${pillars.hour}時柱
- 日主：${pillars.dayMaster}（${elements}性）
- 生肖：${zodiac}

用戶問題：${question}

請提供：
1. 逐柱解釋（年/月/日/時）
2. 十神對應
3. 刑沖合害分析
4. 五行強弱
5. 性格分析
6. 事業/財運/愛情建議
7. 大運簡介
8. 今年/明年運勢

用廣東話/繁體中文詳細解釋，等普通人睇得明。
`;

  return `${systemPrompt}\n\n${userPrompt}`;
}

async function callMiniMax(prompt: string, lang: string): Promise<string> {
  const langCode = lang.startsWith('zh-HK') || lang.startsWith('zh-CN') ? '粵語' : '中文';
  
  const response = await fetch(`${MINIMAX_BASE}/text/chatcompletion_v2`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEYS.minimax}`,
    },
    body: JSON.stringify({
      model: 'MiniMax-M2.5',
      messages: [
        { role: 'system', content: '你係一位八字命理大師，用廣東話講嘢。' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`MiniMax error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callDeepSeek(prompt: string): Promise<string> {
  const response = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEYS.deepseek}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: '你是一位專業的八字命理大師，用廣東話/廣東話解釋廣東話。' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

function parseAIResponse(aiText: string, question: string): any {
  // Parse the AI response into structured format
  const lines = aiText.split('\n').filter(l => l.trim());
  
  return {
    title: `【${question.slice(0, 20)}】詳細分析`,
    summary: lines.slice(0, 2).join(' ').slice(0, 200),
    detailed: aiText,
    highlights: extractHighlights(aiText),
    actionPlan: extractActions(aiText),
    risks: extractRisks(aiText),
    timing: extractTiming(aiText),
    confidence: 'High',
  };
}

function extractHighlights(text: string): string[] {
  const highlights: string[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.includes('柱') || line.includes('日主') || line.includes('五行') || line.includes('生肖')) {
      highlights.push(line.trim().slice(0, 100));
    }
    if (highlights.length >= 8) break;
  }
  
  return highlights.length ? highlights : ['詳細分析進行中...'];
}

function extractActions(text: string): string[] {
  const actions: string[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.includes('建議') || line.includes('action') || line.includes('做') || line.includes('可以')) {
      actions.push(line.trim().slice(0, 100));
    }
    if (actions.length >= 5) break;
  }
  
  return actions.length ? actions : ['繼續努力'];
}

function extractRisks(text: string): string[] {
  return ['注意健康', '避免衝動決策'];
}

function extractTiming(text: string): string[] {
  return ['今年運勢', '明年展望'];
}
