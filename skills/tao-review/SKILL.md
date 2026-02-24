---
name: tao-review
description: Review code changes against Teiny's maxims in Tao of TypeScript and Tao of React. Use after implementing changes, during self-review, before commits/PRs, or when asked to "run the Tao review" to detect violations and propose concrete fixes.
---

Run a strict maxim-compliance review for the current change.

## Load rule sources
1. Read `/Users/luisan/.openclaw/workspace/projects/teiny/TAO_OF_TYPESCRIPT.md`.
2. Read `/Users/luisan/.openclaw/workspace/projects/teiny/TAO_OF_REACT.md` when frontend files are involved.

## Determine review scope
- If the user provides files/paths, review those files.
- Otherwise review changed files from git diff (`git status --short` and diff of staged/unstaged changes).
- Classify each file as backend, frontend, or shared.

## Review method
For each file, evaluate maxim-by-maxim using only applicable laws.

For every violation found, report:
- **Maxim**: exact maxim number + title
- **Evidence**: file path + line(s) + snippet
- **Why it violates**: one sentence
- **Fix**: concrete patch direction (or exact replacement if simple)
- **Severity**: high / medium / low

If no violations are found, explicitly state:
- "Tao Review: no violations found in scope."

## Output format
1. Scope reviewed
2. Summary score:
   - files reviewed
   - violations by severity
   - maxims most frequently violated
3. Violations table/list
4. Recommended fix order (highest leverage first)
5. Optional: apply fixes immediately if user asked for autofix

## Strictness rules
- Treat all maxims as laws.
- Do not waive violations unless user explicitly requests an exception.
- Prefer architectural fixes over superficial edits.
- Keep recommendations minimal, actionable, and diff-friendly.
