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
  {
    id: 'love-boundary-balance',
    topic: 'love',
    triggerKeywords: ['boundaries', 'ex', 'breakup', 'text back'],
    insight: 'Healthy boundaries increase attraction stability and reduce emotional churn.',
    action: 'Clarify expectations early and keep communication pace reciprocal.',
    risk: 'Over-pursuit can invert attraction dynamics.',
    timingHint: 'Reassess after 2-3 meaningful interactions, not after one.',
  },
  {
    id: 'career-leverage',
    topic: 'career',
    triggerKeywords: ['salary', 'interview', 'offer', 'startup'],
    insight: 'Negotiation leverage is strongest with parallel options and clear value proof.',
    action: 'Prepare one-page evidence of outcomes and comparable market ranges.',
    risk: 'Asking without proof can reduce credibility.',
    timingHint: 'Negotiate after positive signal, before final acceptance.',
  },
  {
    id: 'finance-liquidity',
    topic: 'finance',
    triggerKeywords: ['liquidity', 'drawdown', 'portfolio', 'risk'],
    insight: 'Liquidity buffer prevents forced decisions during volatility.',
    action: 'Keep reserve capital and predefine max drawdown tolerance.',
    risk: 'Over-allocation to illiquid bets can trap decision quality.',
    timingHint: 'Rebalance on schedule, not by emotion after sharp moves.',
  },
  {
    id: 'decision-reversible-first',
    topic: 'decision',
    triggerKeywords: ['move city', 'quit', 'switch', 'start'],
    insight: 'Reversible experiments often outperform all-or-nothing commitments.',
    action: 'Run a 2-4 week pilot before full commitment.',
    risk: 'Binary framing hides lower-risk learning paths.',
    timingHint: 'Decide quickly for reversible choices; deliberate for irreversible ones.',
  },
  {
    id: 'career-focus-stack',
    topic: 'career',
    triggerKeywords: ['focus', 'overwhelmed', 'productivity', 'priority'],
    insight: 'Output quality rises when the next critical bottleneck is attacked first.',
    action: 'Define top 1 objective daily and protect two deep-work blocks.',
    risk: 'Context switching destroys execution throughput.',
    timingHint: 'Plan at night, execute in the first high-energy window.',
  },
  {
    id: 'finance-event-risk',
    topic: 'finance',
    triggerKeywords: ['fomc', 'cpi', 'earnings', 'macro'],
    insight: 'Event windows expand both opportunity and tail risk.',
    action: 'Reduce size into events or hedge directional exposure.',
    risk: 'Holding oversized positions through catalysts can wipe prior gains.',
    timingHint: 'Wait for post-event confirmation when signal quality is uncertain.',
  },
];

export function matchKnowledge(topic: KnowledgeTopic, question: string) {
  const q = question.toLowerCase();
  return FINAL_BOSS_RULES.filter((r) => r.topic === topic || r.triggerKeywords.some((k) => q.includes(k)));
}
