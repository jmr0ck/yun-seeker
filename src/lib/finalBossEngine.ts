import { Luck } from './luck';
import { BirthData } from './types';
import { KnowledgeTopic, matchKnowledge } from './finalBossKnowledge';

export type FinalBossReport = {
  title: string;
  summary: string;
  confidence: 'Low' | 'Medium' | 'High';
  highlights: string[];
  actionPlan: string[];
  risks: string[];
  timing: string[];
  citations: string[];
  payload: any;
};

function mapTopic(q: string): KnowledgeTopic {
  const t = q.toLowerCase();
  if (t.includes('love') || t.includes('relationship') || t.includes('romance')) return 'love';
  if (t.includes('career') || t.includes('job') || t.includes('promotion')) return 'career';
  if (t.includes('money') || t.includes('finance') || t.includes('invest') || t.includes('trade')) return 'finance';
  if (t.includes('lucky') || t.includes('lottery')) return 'lottery';
  return 'decision';
}

export class FinalBossEngine {
  static generate(question: string, birthData: BirthData, lang: 'en' | 'zh-HK' | 'zh-CN' | 'ja' | 'ko' | 'es' = 'en'): FinalBossReport {
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

    const knowledge = matched.slice(0, 3);
    const highlights = [
      `Day Master: ${base.details.dayMaster}`,
      `Strengths: ${base.details.strengths.join(', ') || 'N/A'}`,
      `Weaknesses: ${base.details.weaknesses.join(', ') || 'N/A'}`,
      ...knowledge.map((k) => k.insight),
    ].slice(0, 6);

    const actionPlan = knowledge.map((k) => k.action);
    const risks = knowledge.map((k) => k.risk);
    const timing = knowledge.map((k) => k.timingHint);

    let confidence: 'Low' | 'Medium' | 'High' = 'Medium';
    const uncertaintyWords = ['where', 'exactly', 'specific date', 'guarantee'];
    if (uncertaintyWords.some((w) => question.toLowerCase().includes(w))) confidence = 'Low';
    else if (topic === 'career' || topic === 'finance') confidence = 'High';

    const isChinese = lang === 'zh-HK' || lang === 'zh-CN';
    const summary = isChinese
      ? `【${topic.toUpperCase()}】分析：${base.summary} 重點是保持紀律執行，並按時機行動。`
      : `${topic.toUpperCase()} analysis: ${base.summary} Focus on disciplined execution and timing-aware decisions.`;

    const title = isChinese ? `${topic.toUpperCase()} 終極分析` : `${topic.toUpperCase()} Final Boss Reading`;

    return {
      title,
      summary,
      confidence,
      highlights,
      actionPlan: actionPlan.length ? actionPlan : ['Maintain consistency, avoid overreaction, and review outcomes weekly.'],
      risks: risks.length ? risks : ['Emotional overreach and unclear constraints can degrade outcomes.'],
      timing: timing.length ? timing : ['Act in planned windows; avoid high-noise periods.'],
      citations: knowledge.map((k) => `KB:${k.id}`),
      payload,
    };
  }
}
