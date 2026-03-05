# Claude Review + Confidence Prompt (Canonical Copy)

Source of truth: `/Users/luisan/.claude/CLAUDE.md`
Copied on: 2026-03-02 10:26 CST

## Tao review is mandatory after code changes
After implementing any non-trivial code change, run a strict Tao review before final output.

### Rule sources (in order)
1. If present in current repo:
   - `TAO_OF_TYPESCRIPT.md`
   - `TAO_OF_REACT.md`
   - `TAO_OF_DATA_MODELING.md`
   - `TAO_OF_ARCHITECTURE.md` (when file/module structure concerns are involved)
2. Fallback paths:
   - `/Users/luisan/.openclaw/workspace/projects/teiny/TAO_OF_TYPESCRIPT.md`
   - `/Users/luisan/.openclaw/workspace/projects/teiny/TAO_OF_REACT.md`
   - `/Users/luisan/.openclaw/workspace/projects/teiny/TAO_OF_DATA_MODELING.md`
   - `/Users/luisan/.openclaw/workspace/projects/teiny/TAO_OF_ARCHITECTURE.md` (when file/module structure concerns are involved)

### Scope
- If user gives specific files: review those.
- Otherwise: review changed files from git diff (staged + unstaged).

### Output format (concise)
Use adaptive depth:
- Small/low-risk changes: 1-2 lines per gate
- Medium/high-risk changes: full detail

1. Scope reviewed
2. Violations only (if any), each with:
   - Maxim (number + title)
   - Evidence (file + lines)
   - Why it violates
   - Concrete fix direction
   - Severity (high/medium/low)
3. If no issues: say exactly `Tao Review: no violations found in scope.`

## Reviewability pass is mandatory after Tao review
Run a second pass for readability/cohesion across the whole changed surface:
1. Files too large and extraction candidates
2. Functions too large and split candidates
3. Exported types/interfaces in logic files (must be in `*.types.ts`)
4. Repeated route/action patterns that should be extracted
5. Orchestrators containing implementation-detail helpers that should move out

If issues exist, propose a no-behavior-change extraction plan in priority order.

## Definition of Done: Architecture (mandatory)
Before final recommendation, include this yes/no checklist:
- [ ] No exported types/interfaces in logic files (`*.types.ts` rule)
- [ ] No function over agreed size limit without justification
- [ ] No file over agreed size limit without justification
- [ ] No repeated guard/pattern across 2+ handlers without extraction or rationale
- [ ] No new schema smell (prefix-cluster/null-cluster/lifecycle tests)
- [ ] Verification plan executed (or explicitly deferred with reason)

## PR size budget + split trigger (mandatory)
If change size exceeds either threshold:
- more than 15 changed files, or
- more than 600 total added+deleted lines,
then agent must do one of:
1) Provide a split plan (smaller PRs by concern), or
2) Provide a short "why not split" rationale.

## Risk tag (mandatory)
Before final recommendation, include:
- Risk: low | medium | high
- Why: one sentence

## Rollback note (mandatory)
Before final recommendation, include a 2-line rollback/containment plan:
1) Immediate containment action if breakage appears
2) Exact revert/rollback path

## Test Delta Rule (mandatory)
Any new feature must add or update at least one automated test (prefer E2E/Playwright for user-visible behavior).
If no test is added/updated, explicitly explain why and what follow-up test is required.

## Red Team Round (conditional)
Run Red Team Round when any are true:
- stacked PR sequence / multiple PRs touching same surface
- risk is medium or high
- auth/money/billing/payouts/permissions touched
- merge-conflict-heavy or refactor-heavy change

For low-risk small changes, Red Team Round is optional.

When run, include:
- "If I wanted this to fail in prod, I'd attack it by..."
- Two concrete failure attacks specific to this change
- One prevention/mitigation per attack

## Ship confidence is mandatory after reviewability pass
Use this exact prompt:

"Give a ship-confidence score from 0–100 for merging this to master now.

Keep it evidence-based, not optimistic.

Include briefly:
1) Why you believe it works
2) What evidence you actually verified
3) What could still fail
4) What would most increase confidence quickly

If confidence is under 90, say whether you can raise it yourself now, or what you need from me."

Always include:
- Confidence: <0-100>%
- Recommend merge now: yes/no
- One-line next best action

### Ship confidence hardening (coverage-first)
Before giving confidence, include a Surface Coverage Table:
- Surface: Data model | API contract | Business logic | UI render/text | End-to-end user flow
- Verified: yes/no
- Evidence: exact test/manual check

Rules:
- If change affects UI and UI render/text is unverified, confidence is capped at 70%.
- If any critical surface is unverified, Recommend merge now must be "no" (unless user explicitly accepts risk).
- “All tests pass” only increases confidence for the surfaces those tests directly validate.
- Include: “What the user will see (verified/unverified): ...”

### Enforcement
- Treat maxims as laws, not suggestions.
- Do not skip these gates unless user explicitly opts out for that task.
