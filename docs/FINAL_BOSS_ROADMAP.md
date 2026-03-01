# Final Boss Roadmap (yun-seeker)

## North star
Build the most practical, trusted, multilingual astrology decision assistant on mobile.

## Phase FB-1: Evidence Mode (2-3 days)
### Goal
Show *why* each conclusion is produced.

### Deliverables
- Add citation blocks in report UI (KB rule IDs + reasoning chain)
- Add "How this was derived" section
- Add confidence reason breakdown

### Acceptance
- Every report includes at least 2 evidence references
- Users can trace action/risk/timing back to source rules

---

## Phase FB-2: Depth Mode Toggle (1-2 days)
### Goal
Offer both speed and depth.

### Deliverables
- Mode selector: Quick / Master
- Quick: concise 5 bullets
- Master: expanded report with scenarios, invalidation, alternatives

### Acceptance
- Quick response <= 15s perceived
- Master output >= 2x detail quality vs Quick

---

## Phase FB-3: Domain-specific Engines (3-5 days)
### Goal
Specialized logic per question type.

### Deliverables
- Love engine templates
- Career engine templates
- Finance/risk engine templates
- Decision engine templates

### Acceptance
- Benchmark score improvement >= 20% in actionability for each domain

---

## Phase FB-4: Feedback Loop + Calibration (3-4 days)
### Goal
Learn from user outcomes.

### Deliverables
- Post-report feedback prompts (accurate? useful?)
- 1-week / 1-month follow-up check
- Confidence calibration update based on outcomes

### Acceptance
- Collect >= 30 feedback datapoints
- Confidence calibration error reduced over time

---

## Phase FB-5: Benchmark Automation (2-3 days)
### Goal
Beat competitors with measurable proof.

### Deliverables
- Script to run 50 benchmark prompts
- Auto-score with rubric
- Leaderboard report

### Acceptance
- yun-seeker ranks #1 in actionability + risk + consistency

---

## Data/knowledge expansion plan
- Expand rule library to 300+ entries
- Add multilingual phrase banks (EN, zh-HK, zh-CN, ja, ko, es)
- Add scenario retrieval tags (topic, risk level, time horizon)

---

## Product polish checklist
- Language picker (done)
- Full-screen localization (done)
- Locale date formatting (done)
- Confidence label localization (done)
- Report section localization (done)
- Evidence mode UI (next)

---

## Suggested execution order now
1. FB-1 Evidence Mode
2. FB-3 Domain-specific engines
3. FB-5 Benchmark automation
4. FB-2 Depth mode toggle
5. FB-4 Feedback loop/calibration
