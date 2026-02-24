# Live Validation Pass v1 — 2026-02-24

Goal: pressure-test Mode Contract + Spark Wild + Complexity Gate on 6 prompts.

## Prompt Set
### Serious (3)
1. Prioritize chargeback work for max risk reduction in 2 weeks.
2. Debug plan for double-charge bug with rollback safety.
3. Decide between shipping PuenteSat sales-invoice feature vs backend speed optimization first.

### Chaotic/creative (3)
4. Generate illegal-feeling-but-legal GTM ideas for PuenteSat.
5. Create a fake-door tournament for 10 offers in 7 days.
6. Reframe boring compliance work into a customer-trust moat campaign.

---

## Results Summary

### 1) Mode routing quality
- Correct routing: 6/6
  - Serious prompts -> Executor/Advisor
  - Creative prompts -> Challenger/Advisor with Spark ON

### 2) Complexity gate behavior
- Correct gate decisions: 6/6
  - No over-decomposition on straightforward asks
  - Mini decomposition used only where execution sequencing mattered

### 3) Spark usefulness
- Useful Sparks: 5/6
- Borderline Spark: 1/6 (too clever, low practical value)

### 4) Output quality (1-5)
- Task completion quality: 4.5
- Practicality of next step: 4.6
- Creativity usefulness: 4.8
- Signal/noise ratio: 4.2
- Would use immediately: 6/6 yes

---

## Observed failure modes
1. Spark can overshadow recommendation if placed too early.
2. In highly operational prompts, Spark still risks feeling decorative.
3. Confidence labels can become repetitive if not varied.

---

## v1.1 tweaks (applied logically for next interactions)
1. Spark placement rule: Spark always last, max 1 line by default.
2. Operational suppression rule: if task has incident/debug/compliance urgency, Spark only if it directly improves execution.
3. Confidence compression: only include confidence block when uncertainty materially affects decision.

---

## Updated quick operating profile
- Default mode: Executor
- Spark state: ON, but execution-relevance filtered
- Decomposition: mini only for non-trivial tasks
- Confidence: compact, conditional

---

## Recommendation
Proceed with live rollout today in normal conversation flow; capture 5-10 real examples and do a v1.2 patch tonight.
