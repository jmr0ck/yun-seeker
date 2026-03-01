# Competitor Benchmark Sheet (yun-seeker)

## Objective
Systematically compare yun-seeker against competitor GPT/apps on output quality, actionability, consistency, and multilingual experience.

## Competitors to test
1. AI算命 GPT (g-XdLeDRZSF)
2. 算命先生 prompt variant (linexjlin)
3. Bazilogy Chartmaster Ba Zi GPT
4. Destara app (Marites Allen)
5. AI八字算命 (g-zxGdfmmgK)

---

## Test protocol (must stay fixed)
- Use the same profile inputs for all systems
- Use same 50 questions (below)
- Run in 2 languages where possible: EN + zh-HK
- Save raw outputs for audit
- Blind-score outputs (hide system name when scoring)

---

## Standard profile packs (use all 3)

### Profile A (balanced)
- Birth Date: 1993/06/07
- Birth Time: 08:30 AM
- Birth Place: Hong Kong, China

### Profile B (high volatility use case)
- Birth Date: 1988/11/21
- Birth Time: 11:45 PM
- Birth Place: New York, USA

### Profile C (career transition use case)
- Birth Date: 1998/03/14
- Birth Time: 02:15 PM
- Birth Place: Tokyo, Japan

---

## 50 benchmark prompts

### Love (10)
1. What is my love outlook this month?
2. Where am I likely to meet a serious partner?
3. Should I reconnect with my ex now?
4. What is my biggest relationship blind spot?
5. What timing window is best for confession?
6. Is this relationship stable long-term?
7. How can I avoid repeating old patterns?
8. What kind of partner is most compatible with me?
9. What should I do if communication suddenly cools off?
10. Give me a 30-day love action plan.

### Career (10)
11. Should I switch jobs this quarter?
12. What’s my strongest career edge right now?
13. Best timing for salary negotiation?
14. Should I prioritize leadership or specialist path?
15. What role type suits me best this year?
16. How do I recover from burnout without losing momentum?
17. What is blocking my promotion?
18. What 3 skills should I build next?
19. Should I join a startup or stay in a stable company?
20. Give me a 60-day career execution plan.

### Finance (10)
21. How should I structure risk this month?
22. What is my biggest money mistake pattern?
23. Should I increase or reduce exposure now?
24. What event risks should I watch this month?
25. How do I avoid emotional overtrading?
26. What is the best capital allocation approach for me?
27. What should I do after a drawdown week?
28. How should I set position size and stop rules?
29. What’s my high-probability setup style?
30. Give me a practical weekly finance checklist.

### Decision / Life path (10)
31. Should I move to a new city this year?
32. What decision framework fits me best?
33. How do I choose between two good options?
34. What should I prioritize in the next 90 days?
35. What am I overthinking right now?
36. What irreversible decision should I delay?
37. What reversible experiment should I run now?
38. How do I stop decision paralysis?
39. What does “good enough” look like for my next step?
40. Give me a 2-week decision plan.

### Lottery / luck / timing (10)
41. Give me lucky numbers for this week.
42. What colors and directions improve my luck today?
43. Which days this month have better timing for key actions?
44. What should I avoid on low-energy days?
45. Best routine to improve overall luck consistency?
46. What is my strongest lucky element?
47. How should I use lucky timing without becoming superstitious?
48. Give a conservative “luck with discipline” plan.
49. What are my best hours for important meetings?
50. Summarize my luck profile in practical terms.

---

## Scoring rubric (0-5 each, weighted)
1. Personalization depth (x1.5)
2. Actionability (x2.0)
3. Risk management quality (x2.0)
4. Timing precision usefulness (x1.5)
5. Consistency across repeated runs (x1.5)
6. Explanation transparency / citations (x1.5)
7. Multilingual quality (x1.0)
8. UX clarity and readability (x1.0)

Total max weighted score: 60

### Grade bands
- 52-60: Final Boss
- 44-51: Strong
- 34-43: Mid
- <34: Weak

---

## Output capture template (per run)
- System:
- Profile pack:
- Language:
- Prompt #:
- Raw response:
- Score breakdown:
- Notes:

---

## Win conditions for yun-seeker
- Beat each competitor by >= 15% total score
- Rank #1 in Actionability + Risk Management + Consistency
- No major quality drop between EN and zh-HK
