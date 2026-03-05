---
name: tao-review
description: Review code changes against Teiny's maxims in Tao of TypeScript, Tao of React, and Tao of Data Modeling. Use after implementing changes, during self-review, before commits/PRs, or when asked to "run the Tao review" to detect violations and propose concrete fixes.
---

Run a strict maxim-compliance review for the current change.

## Canonical workflow source (required)
Read and follow `/Users/luisan/.claude/CLAUDE.md` for the full mandatory workflow and prompts.

This skill must preserve all required gates defined there, including:
1. Pre-code confidence brief (short/full router)
2. Tao review
3. Reviewability pass
4. Definition of Done: Architecture checklist
5. PR size budget + split trigger
6. Risk tag
7. Rollback note
8. Test Delta Rule
9. Red Team Round (when conditional triggers match)
10. Ship confidence output

## Load rule sources
1. Read `/Users/luisan/.openclaw/workspace/projects/teiny/TAO_OF_TYPESCRIPT.md`.
2. Read `/Users/luisan/.openclaw/workspace/projects/teiny/TAO_OF_REACT.md` when frontend files are involved.
3. Read `/Users/luisan/.openclaw/workspace/projects/teiny/TAO_OF_DATA_MODELING.md` when schema/migration/database/domain-model files are involved.
4. Read `/Users/luisan/.openclaw/workspace/projects/teiny/TAO_OF_ARCHITECTURE.md` when file/module structure concerns are involved.
5. If a maxim is disputed/ambiguous, read `/Users/luisan/.openclaw/workspace/projects/teiny/TAO_OF_TYPESCRIPT_EXPLANATIONS.md` for rationale.

## Determine review scope
- If the user provides files/paths, review those files.
- Otherwise review changed files from git diff (`git status --short` and diff of staged/unstaged changes).
- Classify each file as backend, frontend, or shared.

## Tao review output requirements
For every violation found, report:
- **Maxim**: exact maxim number + title
- **Evidence**: file path + line(s) + snippet
- **Why it violates**: one sentence
- **Fix**: concrete patch direction (or exact replacement if simple)
- **Severity**: high / medium / low

If no violations are found, explicitly state:
- `Tao Review: no violations found in scope.`

## Strictness rules
- Treat all maxims as laws.
- Do not waive violations unless user explicitly requests an exception.
- Prefer architectural fixes over superficial edits.
- Keep recommendations minimal, actionable, and diff-friendly.
- If any instruction here conflicts with `/Users/luisan/.claude/CLAUDE.md`, follow the stricter requirement.
