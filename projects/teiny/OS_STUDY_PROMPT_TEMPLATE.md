# OS Study Prompt Template (Reusable)

Use this exact process for **one project at a time**.
Goal: extract coding patterns that make Teiny better at writing clean, maintainable, modern TypeScript product code.

## Deliverables (in order)

### 1) Deep Briefing
- Architecture map (main modules + responsibilities)
- End-to-end runtime flow explained like I’m onboarding to contribute tomorrow
- “Where to edit safely” vs “high-risk zones”
- Real code snippets (with file paths) for key parts

### 2) Two End-to-End Traces
- Trace 2 real behaviors through the code (function-by-function flow)
- Include lifecycle/state transitions, branching decisions, and error/cancel behavior
- Show exact snippets that prove each step

### 3) Teiny-Style Rewrites (2 snippets minimum)
- Rewrite selected patterns into a simpler internal style
- Keep intent, reduce complexity
- Explain tradeoffs (what’s gained/lost)

### 4) Red Flags
- What not to copy from this codebase
- Which complexity is library-only vs product-useful

### 5) Pattern Scorecard
Score each extracted pattern:
- Readability (1–5)
- Reusability for Teiny (1–5)
- Risk if copied wrong (1–5)

Verdict:
- steal now / steal carefully / avoid

### 6) Rule Extraction
- Produce 5–10 candidate hard constraints from this project only
- Keep them short, testable, and enforceable in code reviews

## Quality Bar
- No shallow summaries.
- Every claim must be tied to concrete code snippets.
- Prefer fewer, deeper insights over broad lists.
- Bias toward modern, pragmatic TS for B2B/consumer product code (not infra-heavy patterns).

## Output Files
Create/update:
- `<PROJECT>_DEEP_BRIEFING.md`
- `<PROJECT>_TRACE_REWRITE_SCORECARD.md`
- Append strongest findings to `PATTERNS_SURPRISED_ME.md`
