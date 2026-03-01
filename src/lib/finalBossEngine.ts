import { Luck } from './luck';
import { BirthData } from './types';
import { KnowledgeTopic, matchKnowledge } from './finalBossKnowledge';

type Lang = 'en' | 'zh-HK' | 'zh-CN' | 'ja' | 'ko' | 'es';

export type FinalBossReport = {
  title: string;
  summary: string;
  confidence: 'Low' | 'Medium' | 'High';
  highlights: string[];
  actionPlan: string[];
  risks: string[];
  timing: string[];
  citations: string[];
  reasoning: string[];
  payload: any;
};

function localeTag(lang: Lang) {
  const map: Record<Lang, string> = {
    en: 'en-US',
    'zh-HK': 'zh-HK',
    'zh-CN': 'zh-CN',
    ja: 'ja-JP',
    ko: 'ko-KR',
    es: 'es-ES',
  };
  return map[lang] || 'en-US';
}

function formatNumberList(values: number[], lang: Lang) {
  return values.map((n) => new Intl.NumberFormat(localeTag(lang)).format(n)).join(', ');
}

function mapTopic(q: string): KnowledgeTopic {
  const t = q.toLowerCase();
  if (t.includes('love') || t.includes('relationship') || t.includes('romance')) return 'love';
  if (t.includes('career') || t.includes('job') || t.includes('promotion')) return 'career';
  if (t.includes('money') || t.includes('finance') || t.includes('invest') || t.includes('trade')) return 'finance';
  if (t.includes('lucky') || t.includes('lottery')) return 'lottery';
  return 'decision';
}

const LANG_PACK: Record<Lang, {
  titleSuffix: string;
  analysisPrefix: string;
  disciplineLine: string;
  fallbackAction: string;
  fallbackRisk: string;
  fallbackTiming: string;
  compatibilityLabel: string;
  strengthsLabel: string;
  weaknessesLabel: string;
  luckyNumbersLabel: string;
  luckyColorsLabel: string;
  luckyDirectionsLabel: string;
}> = {
  en: {
    titleSuffix: 'Final Boss Reading',
    analysisPrefix: 'analysis',
    disciplineLine: 'Focus on disciplined execution and timing-aware decisions.',
    fallbackAction: 'Maintain consistency, avoid overreaction, and review outcomes weekly.',
    fallbackRisk: 'Emotional overreach and unclear constraints can degrade outcomes.',
    fallbackTiming: 'Act in planned windows; avoid high-noise periods.',
    compatibilityLabel: 'Compatibility score',
    strengthsLabel: 'Strengths',
    weaknessesLabel: 'Weaknesses',
    luckyNumbersLabel: 'Lucky numbers',
    luckyColorsLabel: 'Lucky colors',
    luckyDirectionsLabel: 'Lucky directions',
  },
  'zh-HK': {
    titleSuffix: '終極分析',
    analysisPrefix: '分析',
    disciplineLine: '重點係保持紀律執行，同埋按時機行動。',
    fallbackAction: '保持穩定節奏，避免情緒化反應，每週復盤。',
    fallbackRisk: '過度情緒投入與目標不清會拉低判斷質素。',
    fallbackTiming: '按計劃時段行動，避免高噪音時段出手。',
    compatibilityLabel: '匹配分數',
    strengthsLabel: '優勢',
    weaknessesLabel: '弱點',
    luckyNumbersLabel: '幸運數字',
    luckyColorsLabel: '幸運顏色',
    luckyDirectionsLabel: '幸運方位',
  },
  'zh-CN': {
    titleSuffix: '终极分析',
    analysisPrefix: '分析',
    disciplineLine: '重点是保持纪律执行，并按时机行动。',
    fallbackAction: '保持稳定节奏，避免情绪化反应，每周复盘。',
    fallbackRisk: '过度情绪投入与目标不清会降低判断质量。',
    fallbackTiming: '按计划时段行动，避免高噪音时段出手。',
    compatibilityLabel: '匹配分数',
    strengthsLabel: '优势',
    weaknessesLabel: '弱点',
    luckyNumbersLabel: '幸运数字',
    luckyColorsLabel: '幸运颜色',
    luckyDirectionsLabel: '幸运方位',
  },
  ja: {
    titleSuffix: 'ファイナル分析',
    analysisPrefix: '分析',
    disciplineLine: '規律ある実行とタイミング重視の判断に集中してください。',
    fallbackAction: '一貫性を保ち、過剰反応を避け、週次で振り返る。',
    fallbackRisk: '感情先行と制約不明確は意思決定の質を下げます。',
    fallbackTiming: '計画した時間帯で行動し、ノイズの高い局面を避ける。',
    compatibilityLabel: '相性スコア',
    strengthsLabel: '強み',
    weaknessesLabel: '弱み',
    luckyNumbersLabel: 'ラッキーナンバー',
    luckyColorsLabel: 'ラッキーカラー',
    luckyDirectionsLabel: 'ラッキー方位',
  },
  ko: {
    titleSuffix: '파이널 분석',
    analysisPrefix: '분석',
    disciplineLine: '규율 있는 실행과 타이밍 중심 의사결정에 집중하세요.',
    fallbackAction: '일관성을 유지하고 과잉 반응을 피하며 주간 복기하세요.',
    fallbackRisk: '감정 과몰입과 불명확한 제약은 판단력을 떨어뜨립니다.',
    fallbackTiming: '계획된 타이밍에 행동하고 노이즈 구간은 피하세요.',
    compatibilityLabel: '궁합 점수',
    strengthsLabel: '강점',
    weaknessesLabel: '약점',
    luckyNumbersLabel: '행운 숫자',
    luckyColorsLabel: '행운 색상',
    luckyDirectionsLabel: '행운 방향',
  },
  es: {
    titleSuffix: 'Lectura Final Boss',
    analysisPrefix: 'análisis',
    disciplineLine: 'Enfócate en una ejecución disciplinada y decisiones con buen timing.',
    fallbackAction: 'Mantén consistencia, evita reaccionar en exceso y revisa semanalmente.',
    fallbackRisk: 'La sobrecarga emocional y límites poco claros degradan decisiones.',
    fallbackTiming: 'Actúa en ventanas planificadas y evita periodos de alto ruido.',
    compatibilityLabel: 'Puntaje de compatibilidad',
    strengthsLabel: 'Fortalezas',
    weaknessesLabel: 'Debilidades',
    luckyNumbersLabel: 'Números de la suerte',
    luckyColorsLabel: 'Colores de la suerte',
    luckyDirectionsLabel: 'Direcciones de la suerte',
  },
};

export class FinalBossEngine {
  static generate(question: string, birthData: BirthData, lang: Lang = 'en'): FinalBossReport {
    const topic = mapTopic(question);
    const base = Luck.read(birthData);
    const matched = matchKnowledge(topic, question);

    let payload: any = { base };
    if (topic === 'love') {
      payload.compatibility = Luck.compatibility(birthData, birthData);
    }
    if (topic === 'lottery') {
      payload.lucky = Luck.getLuckyElements(base.details.dayMaster);
    }

    const pack = LANG_PACK[lang] || LANG_PACK.en;
    const knowledge = matched.slice(0, 3);
    const highlights = [
      `Day Master: ${base.details.dayMaster}`,
      `${pack.strengthsLabel}: ${base.details.strengths.join(', ') || 'N/A'}`,
      `${pack.weaknessesLabel}: ${base.details.weaknesses.join(', ') || 'N/A'}`,
      ...knowledge.map((k) => k.insight),
    ].slice(0, 6);

    if (topic === 'love' && payload.compatibility?.score != null) {
      highlights.unshift(`${pack.compatibilityLabel}: ${new Intl.NumberFormat(localeTag(lang)).format(payload.compatibility.score)}`);
    }
    if (topic === 'lottery' && payload.lucky) {
      highlights.unshift(`${pack.luckyNumbersLabel}: ${formatNumberList(payload.lucky.numbers || [], lang)}`);
      highlights.push(`${pack.luckyColorsLabel}: ${(payload.lucky.colors || []).join(', ')}`);
      highlights.push(`${pack.luckyDirectionsLabel}: ${(payload.lucky.directions || []).join(', ')}`);
    }

    const actionPlan = knowledge.map((k) => k.action);
    const risks = knowledge.map((k) => k.risk);
    const timing = knowledge.map((k) => k.timingHint);
    let confidence: 'Low' | 'Medium' | 'High' = 'Medium';
    const uncertaintyWords = ['where', 'exactly', 'specific date', 'guarantee'];
    if (uncertaintyWords.some((w) => question.toLowerCase().includes(w))) confidence = 'Low';
    else if (topic === 'career' || topic === 'finance') confidence = 'High';

    const reasoning = [
      `Topic detected: ${topic}`,
      `Day master assessed: ${base.details.dayMaster}`,
      `Matched knowledge rules: ${knowledge.map((k) => k.id).join(', ') || 'none'}`,
      `Confidence basis: ${confidence === 'High' ? 'structured domain fit' : confidence === 'Low' ? 'high uncertainty question wording' : 'mixed-signal context'}`,
    ];

    const summary = `【${topic.toUpperCase()}】${pack.analysisPrefix}: ${base.summary} ${pack.disciplineLine}`;
    const title = `${topic.toUpperCase()} ${pack.titleSuffix}`;

    return {
      title,
      summary,
      confidence,
      highlights,
      actionPlan: actionPlan.length ? actionPlan : [pack.fallbackAction],
      risks: risks.length ? risks : [pack.fallbackRisk],
      timing: timing.length ? timing : [pack.fallbackTiming],
      citations: knowledge.map((k) => `KB:${k.id}`),
      reasoning,
      payload,
    };
  }
}
