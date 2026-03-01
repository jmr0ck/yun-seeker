export type KnowledgeTopic = 'love' | 'career' | 'finance' | 'lottery' | 'decision';

export type KnowledgeRule = {
  id: string;
  topic: KnowledgeTopic;
  triggerKeywords: string[];
  insight: string;
  action: string;
  risk: string;
  timingHint: string;
};

export const FINAL_BOSS_RULES: KnowledgeRule[] = [
  {
    id: 'love-communication-window',
    topic: 'love',
    triggerKeywords: ['love', 'relationship', 'true love', 'romance', 'partner'],
    insight: 'Emotional momentum improves when expression is consistent rather than intense bursts.',
    action: 'Set one recurring check-in ritual each week and keep tone warm + direct.',
    risk: 'Over-reading signals can trigger avoidable conflict or withdrawal.',
    timingHint: 'Prioritize evening conversations on low-stress days; avoid major asks during fatigue spikes.',
  },
  {
    id: 'career-positioning',
    topic: 'career',
    triggerKeywords: ['career', 'job', 'promotion', 'work', 'boss'],
    insight: 'Role growth is strongest when visible outputs are tied to measurable business outcomes.',
    action: 'Ship one portfolio-grade deliverable per cycle and quantify impact in plain numbers.',
    risk: 'Scope creep without stakeholder alignment can dilute perceived value.',
    timingHint: 'Push for decisions right after milestone wins, not before evidence is visible.',
  },
  {
    id: 'finance-defense',
    topic: 'finance',
    triggerKeywords: ['money', 'finance', 'invest', 'trading', 'cash'],
    insight: 'Capital preservation compounds edge; avoid forcing entries during noisy conditions.',
    action: 'Use tiered position sizing and define invalidation levels before taking risk.',
    risk: 'Single-theme concentration risk increases drawdown volatility.',
    timingHint: 'Act when setup quality is high; reduce exposure before event risk clusters.',
  },
  {
    id: 'decision-clarity',
    topic: 'decision',
    triggerKeywords: ['decision', 'should i', 'choose', 'path', 'move'],
    insight: 'High-quality decisions come from clear constraints, not perfect certainty.',
    action: 'List 3 non-negotiables and score options against them before committing.',
    risk: 'Delay loops can become a hidden cost larger than a reversible wrong choice.',
    timingHint: 'Set a decision deadline and a 2-week review checkpoint.',
  },
  {
    id: 'lottery-discipline',
    topic: 'lottery',
    triggerKeywords: ['lottery', 'lucky number', 'numbers'],
    insight: 'Lucky selection works best as structured entertainment, never bankroll strategy.',
    action: 'Keep fixed budget and fixed cadence; do not chase losses.',
    risk: 'Emotion-driven increase in stake size can quickly break discipline.',
    timingHint: 'Use consistent play windows rather than impulse entries.',
  },
];

export function matchKnowledge(topic: KnowledgeTopic, question: string) {
  const q = question.toLowerCase();
  return FINAL_BOSS_RULES.filter((r) => r.topic === topic || r.triggerKeywords.some((k) => q.includes(k)));
}
