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
