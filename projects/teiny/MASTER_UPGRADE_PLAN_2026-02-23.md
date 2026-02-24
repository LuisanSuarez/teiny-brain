# Teiny Master Upgrade Plan — 2026-02-23

## Scope & constraints
- Goal: general-purpose power-up (better thinker, coder, listener, mentor, operator) for any user.
- Not in scope: illegal/deceptive tactics, heavy builds before validation, maintenance-heavy low-ROI rabbit holes.

---

## Part A — 9+1 Run Synthesis (Dreamer → Researcher → Skeptic x3, then Summarizer)

### Top ranked bets (scored 1–5 on Speed / Demand clarity / Defensibility / Fun)
1. **Capability Router + Mode Contracts** (core brain + specialist sub-agents)
   - Score: 4 / 5 / 5 / 4
   - Why: prevents bloat, preserves quality, scales across domains.
2. **Source Quality Engine** (credibility + review-quality + recency + consensus scoring)
   - Score: 4 / 5 / 4 / 3
   - Why: converts internet noise into trustworthy learning.
3. **Execution Decomposer** (goal → milestones → tasks → blockers → next move)
   - Score: 5 / 5 / 4 / 3
   - Why: universally useful, highest practical impact.
4. **Adaptive Mentorship Layer** (coach styles: supportive/direct/tough-love/technical)
   - Score: 4 / 4 / 4 / 4
5. **Failure-Mode Library for Coding** (bug classes + prevention checklists)
   - Score: 3 / 5 / 5 / 3
6. **Unhinged-but-legal Idea Generator with guardrails**
   - Score: 5 / 4 / 2 / 5

### Implement now (no purchases needed)
- Add explicit interaction modes: Executor / Advisor / Challenger / Mentor.
- Add confidence language rubric: confident / medium / low + what would change confidence.
- Add “decompose-first” template for every non-trivial task.
- Add coding QA checklist for all code changes:
  - tests, rollback path, perf impact, failure modes, docs impact.
- Add source-eval mini-protocol for research answers:
  - source quality + date + consensus/opposition.

### Needs user buy/download/feed tomorrow
- Curated book/article corpus for coding + decision quality.
- Premium API/data sources if needed for higher-quality market research.
- Optional compute budget for local bulk-processing model(s).

### Resource wishlist (priority)
#### Must-have
- *Designing Data-Intensive Applications* — Martin Kleppmann
- *A Philosophy of Software Design* — John Ousterhout
- *Refactoring* — Martin Fowler
- *Good Strategy Bad Strategy* — Richard Rumelt
- *The Mom Test* — Rob Fitzpatrick

#### Nice-to-have
- *Superforecasting* — Tetlock
- *Lean Analytics* — Croll/Yoskovitz
- *Influence* — Cialdini

#### Unhinged experiments
- “100 fake doors” landing-page test framework (validation before building)
- “Skeptical buyer bot” to stress-test offers before launch

### Unhinged-but-legal experiments worth testing
1. **Fake-door tournament**: test 20 offer pages, build only top-2 by waitlist conversion.
2. **Pain-mining engine**: cluster recurring complaints from public forums into product candidates.
3. **Offer blender**: recombine audience/problem/format/price daily and rank by expected demand.

---

## Part B — 3-pass TypeScript OSS scouting (for LLM code-learning corpus)

### Research approach
- Pass 1: broad discovery (lists + community threads)
- Pass 2: quality signal check (active usage, maintainer reputation, architecture clarity)
- Pass 3: learning-value filter (readability, tests, patterns, docs)

### Candidate projects (GitHub URLs)
1. **VS Code** — https://github.com/microsoft/vscode
   - Learn: large-scale architecture, extension model, engineering discipline.
   - Like: industrial quality, strong boundaries.
   - Don’t like: very large/complex for quick pattern extraction.

2. **Deno** — https://github.com/denoland/deno
   - Learn: runtime architecture, tooling integration, TS-first ergonomics.
   - Like: clear standards mindset.
   - Don’t like: runtime-level complexity may overwhelm beginners.

3. **NestJS** — https://github.com/nestjs/nest
   - Learn: backend modular architecture, DI patterns, maintainable structure.
   - Like: readable conventions, widely used.
   - Don’t like: abstraction can hide fundamentals.

4. **Fastify** — https://github.com/fastify/fastify
   - Learn: performance-oriented Node design, plugin architecture.
   - Like: focused, practical server patterns.
   - Don’t like: fewer “enterprise app” examples than full frameworks.

5. **Prisma** — https://github.com/prisma/prisma
   - Learn: typed data tooling, schema-to-code workflows, DX patterns.
   - Like: strong TS ergonomics and tooling quality.
   - Don’t like: monorepo complexity.

6. **TanStack Query** — https://github.com/TanStack/query
   - Learn: API design, state/data synchronization patterns.
   - Like: excellent library-level TypeScript.
   - Don’t like: front-end specific focus.

7. **Zod** — https://github.com/colinhacks/zod
   - Learn: type-safe API/library design, validation ergonomics.
   - Like: concise, elegant, easy to dissect.
   - Don’t like: smaller scope than app architectures.

8. **tRPC** — https://github.com/trpc/trpc
   - Learn: end-to-end type safety patterns across boundaries.
   - Like: practical full-stack TS patterns.
   - Don’t like: stack assumptions may not fit all teams.

### Community/discovery references consulted
- HN thread: “What are the best open source TypeScript projects I can learn from?”
  - https://news.ycombinator.com/item?id=34205294
- Reddit discovery thread (Node/TS best-practices discussion)
  - https://www.reddit.com/r/node/comments/17uezyg/what_are_some_of_the_best_nodejs_typescript/
- Awesome TS project index (discovery only, needs curation)
  - https://github.com/brookshi/awesome-typescript-projects

### Is OpenClaw source useful as learning corpus?
- **Yes, selectively.**
- Strong for: agent orchestration patterns, tool-calling glue, operational constraints.
- Caveat: domain-specific architecture; pair with broadly-adopted OSS (above) for general coding best-practices.

---

## Final short action plan (tomorrow-ready)
1. Start with a curated coding corpus of 4 repos: NestJS, Fastify, Prisma, Zod.
2. Add extraction template per repo:
   - architecture patterns, testing strategy, error handling, API ergonomics, anti-patterns.
3. Build Teiny’s internal coding rubric from those extracted patterns.
4. Then expand to VS Code + Deno for large-system lessons.

---

## 3-Pass Continuation (Hybrid, optimized for fun/unhinged edge) — 2026-02-24

### Pass 1 — Strategy sharpen (keep what compounds, cut polite fluff)
**Keep as core pillars (in order):**
1. **Execution Decomposer** (default behavior, everywhere)
2. **Capability Router + Mode Contracts** (prevents personality/quality drift)
3. **Source Quality Engine** (only for research-heavy tasks)
4. **Adaptive Mentorship Layer** (style tuning, not core intelligence)

**Cut or defer:**
- Full “book/data corpus acquisition” as a phase-zero dependency (nice, but not blocker).
- Big-bang "power-up everything" wording. Replace with staged gains.

**Sharper thesis:**
- Teiny wins by being **decisive + playful + operationally useful**.
- “Fun/unhinged edge” is a feature, but with legal/safety rails and relevance checks.

---

### Pass 2 — Red-team with chaos lens (where this could fail)

#### Failure modes
1. **Unhinged mode spills into serious tasks**
   - Risk: wrong tone during high-stakes ops.
   - Guardrail: context classifier (serious vs creative); unhinged sparks auto-off in serious mode.

2. **Too many modes = indecision + latency**
   - Risk: meta-reasoning overhead.
   - Guardrail: max 4 primary modes + hard default fallback.

3. **Source scoring theater**
   - Risk: cites credibility rubric but still weak evidence.
   - Guardrail: require at least 2 independent sources for medium/high confidence research claims.

4. **Decomposer becomes bureaucracy**
   - Risk: over-structuring simple asks.
   - Guardrail: apply decompose-first only to tasks above complexity threshold.

5. **Fun edge becomes gimmick**
   - Risk: novelty without utility.
   - Guardrail: each “Spark” must either improve speed, quality, or user motivation.

---

### Pass 3 — Execution starter from survivors (2-week plan)

## Week 1 — Build usable backbone

### Deliverable 1: Mode Contract v1
Modes:
- **Executor** (do now)
- **Advisor** (options + recommendation)
- **Challenger** (stress-test assumptions)
- **Mentor** (teach/coach)

Each mode gets:
- Output format
- Tone profile
- Confidence rubric
- “No-go” behavior

### Deliverable 2: Spark Policy v1 (fun/unhinged edge)
- Add exactly one optional Spark only when task is non-urgent.
- Spark types:
  1) unhinged idea,
  2) illegal-feeling-but-legal angle,
  3) wildcard question.
- Auto-skip Spark for: safety-critical, legal/financial urgent, emotionally sensitive tasks.

### Deliverable 3: Complexity Gate
- **Simple tasks:** direct answer.
- **Non-trivial tasks:** mini decomposition (goal → steps → next action).

**Week 1 KPI targets**
- +20% perceived usefulness on non-trivial tasks.
- <10% responses flagged as “overcomplicated.”

---

## Week 2 — Make quality and creativity reliable

### Deliverable 4: Source Quality Engine v1
For research responses, append compact quality block:
- Source quality (high/med/low)
- Recency
- Consensus vs dissent
- Confidence + what would raise it

### Deliverable 5: Coding QA checklist enforcement
For code changes, always include:
- tests impact
- rollback path
- perf impact
- failure modes
- docs impact

### Deliverable 6: “Chaos Lab” prompts (fun but useful)
Create 15 prompts to train playful-but-practical output style:
- 5 idea generation
- 5 offer testing
- 5 strategic reframes

**Week 2 KPI targets**
- -30% weakly-supported research claims.
- +25% user-rated “fresh/useful ideas.”

---

## Minimal scorecard (run weekly)
- Task completion quality (1–5)
- Practicality of next step (1–5)
- Creativity usefulness (1–5)
- Signal/noise ratio (1–5)
- “Would use this output immediately?” (yes/no)

---

## First 5 tomorrow tasks (real start)
1. Write Mode Contract v1 in one page.
2. Implement Spark Policy decision tree (when to inject/skip).
3. Add complexity gate rule to planning behavior.
4. Add research quality block template.
5. Define 15 Chaos Lab prompts and test on 3 live scenarios.

---

## What changed vs previous version
- Shifted from broad ambition to staged system design.
- Converted “fun/unhinged” from vibe to controlled capability.
- Added anti-failure guardrails to prevent gimmick drift.
- Added measurable outcomes and immediate starting tasks.

---

## Execution update — 2026-02-24 (started)
Completed artifacts:
1. `projects/teiny/MODE_CONTRACT_V1.md`
2. `projects/teiny/SPARK_POLICY_WILD_V1.md`
3. `projects/teiny/COMPLEXITY_GATE_V1.md`
4. `projects/teiny/RESEARCH_QUALITY_BLOCK_V1.md`
5. `projects/teiny/CHAOS_LAB_PROMPTS_V1.md`

Next step to make this real:
- Run live acceptance pass in real conversations and score weekly with the Minimal scorecard.

---

## Execution update — 2026-02-24 (continued)
Completed artifacts:
6. `projects/teiny/CODING_QA_CHECKLIST_V1.md`
7. `projects/teiny/OSS_CORPUS_EXTRACTION_TEMPLATE_V1.md`
8. `projects/teiny/CORPUS_EXTRACTION_NESTJS_V1.md`
9. `projects/teiny/CORPUS_EXTRACTION_FASTIFY_V1.md`
10. `projects/teiny/CORPUS_EXTRACTION_PRISMA_V1.md`
11. `projects/teiny/CORPUS_EXTRACTION_ZOD_V1.md`

Now unlocked:
- Teiny coding-rubric bootstrapping from real OSS patterns.
- Reusable QA gate for non-trivial code changes.
