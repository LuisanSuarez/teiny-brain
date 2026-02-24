# Teiny Coding Rubric v1

Distilled from: NestJS, Fastify, Prisma, Zod corpus extractions.

---

## Architecture

### Do
- Explicit module/plugin boundaries (NestJS, Fastify)
- Composable primitives over monolith functions (Zod, Fastify)
- Schema as source of truth (Prisma, Zod)
- Convention-first folder structure for discoverability

### Don't
- Hidden coupling via implicit globals
- Leaky abstractions that break under pressure
- Magic that juniors can't debug

---

## API Design

### Do
- Decorator/annotation-driven clarity where it helps (NestJS)
- Schema-first validation at boundaries (Fastify, Zod)
- Autocomplete-friendly, type-safe interfaces (Prisma)
- Composable rules over duplication

### Don't
- Stringly-typed APIs
- Validation scattered across layers
- Silent type coercion

---

## Error Handling

### Do
- Centralized exception filters/handlers (NestJS)
- Structured, actionable error objects (Zod)
- Fail fast on invalid input (Fastify)
- Typed errors with predictable shapes

### Don't
- Swallow errors silently
- Return generic "something went wrong"
- Mix user-facing and internal errors

---

## Testing

### Do
- Isolated unit tests + focused integration tests
- Test module/DI setup for clean dependency swaps (NestJS)
- Schema edge case coverage (Zod)
- Test patterns that mirror runtime behavior

### Don't
- Flaky tests relying on timing/network
- Mocking everything (lose integration signal)
- Skipping boundary/contract tests

---

## Performance

### Do
- Explicit fast paths (Fastify)
- Batch/debounce where appropriate
- Lazy loading for heavy dependencies
- Schema pre-compilation for hot paths

### Don't
- Premature optimization without measurement
- Hidden N+1 queries
- Polling when push is available

---

## Pre-commit checklist (use on every PR)
1. Are module boundaries preserved?
2. Can this be tested with swapped dependencies?
3. Are errors normalized and actionable?
4. Are boundary inputs validated at runtime?
5. Is schema source-of-truth explicit?
6. Any new hot path? Benchmarked?
7. Migration risks documented?

---

## Confidence
- Confidence: Medium-High
- What would raise it: more real-world application on Teiny's own code changes + feedback loop.
