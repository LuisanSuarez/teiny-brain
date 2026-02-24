# Corpus Extraction — Prisma (v1 draft)

Repo: Prisma
URL: https://github.com/prisma/prisma
Date: 2026-02-24

## Architecture patterns worth stealing
- Schema-to-generated-client workflow
- Strong type contracts across DB boundaries
- Tooling-first UX around migrations/introspection

## API/design ergonomics
- Developer productivity via autocomplete + compile-time guardrails
- Risk: complexity hidden behind generated artifacts

## Error handling strategy
- Typed errors and predictable client exceptions

## Testing strategy
- Emphasis on integration-style correctness around data behavior

## Reusable checklist entries for Teiny
- “Is schema source-of-truth explicit?”
- “Do generated/types align with runtime behavior?”
- “Are migration risks documented before ship?”
