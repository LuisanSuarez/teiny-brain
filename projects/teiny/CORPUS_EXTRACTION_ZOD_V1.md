# Corpus Extraction — Zod (v1 draft)

Repo: Zod
URL: https://github.com/colinhacks/zod
Date: 2026-02-24

## Architecture patterns worth stealing
- Runtime validation aligned with static types
- Composable schema primitives
- API surface optimized for readability

## API/design ergonomics
- Excellent balance of power and clarity
- Small-scope library with high leverage

## Error handling strategy
- Rich validation errors with actionable detail

## Testing strategy
- Focused tests around schema edge cases and invariants

## Reusable checklist entries for Teiny
- “Are boundary inputs validated at runtime?”
- “Is error feedback actionable for callers?”
- “Can we compose this rule instead of duplicating it?”
