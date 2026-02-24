# Zod Deep Briefing (Run 3, Project 4/5)

Date: 2026-02-24
Audience: onboarding to contribute + extract practical patterns
Focus: validation engine design, parse flow, error model, what to copy vs avoid

---

## 0) 30-second mental model

Zod is a **schema-driven validation engine** with TypeScript inference layered on top.

Core split in v4 source:
- `v4/core/*` → engine internals (`schemas`, `parse`, `errors`, checks, util)
- `v4/classic/*` → public API wrappers around core internals

If you remember one thing:
> Schema objects carry a `_zod` internal with `run/parse/checks`; parse functions execute schema logic and return either data or structured issues.

---

## 1) Important files to understand first

- `packages/zod/src/v4/core/parse.ts`
  - parse/safeParse sync+async + encode/decode variants
- `packages/zod/src/v4/core/schemas.ts`
  - core schema interfaces, parse payload/context, schema internals
- `packages/zod/src/v4/core/errors.ts`
  - issue taxonomy and error mapping model
- `packages/zod/src/v4/classic/parse.ts`
  - user-facing wrappers that bind core parse functions to `ZodRealError`

---

## 2) Parse runtime flow (end-to-end)

### Sync parse path
`_parse` in `core/parse.ts`:
1. Build parse context (`async:false`)
2. Run schema internals: `schema._zod.run({ value, issues: [] }, ctx)`
3. If run returns Promise in sync mode -> throw async error
4. If issues exist -> construct error class with finalized issues and throw
5. Return parsed output

Snippet:
```ts
const result = schema._zod.run({ value, issues: [] }, ctx)
if (result instanceof Promise) throw new core.$ZodAsyncError()
if (result.issues.length) {
  const e = new (_params?.Err ?? _Err)(result.issues.map(...))
  throw e
}
return result.value
```

### Safe parse path
`_safeParse` returns discriminated union (`success: true/false`) instead of throw.

This gives two ergonomic modes:
- exception flow (`parse`)
- data-first flow (`safeParse`)

---

## 3) Schema internals (how the engine is structured)

In `core/schemas.ts`:
- every schema implements `$ZodType` with `_zod` internals
- internals expose:
  - `def` (schema definition)
  - `run` and `parse`
  - checks/refinements
  - metadata (traits, pattern, etc.)

Important type:
```ts
export interface ParsePayload<T = unknown> {
  value: T;
  issues: errors.$ZodRawIssue[];
  aborted?: boolean;
}
```

Why it matters: parse pipeline mutates a structured payload, accumulating issues instead of ad-hoc throwing at every check.

---

## 4) Error model quality

`core/errors.ts` defines explicit issue types:
- `invalid_type`, `too_small`, `too_big`, `invalid_format`, `unrecognized_keys`, `invalid_union`, etc.

This is excellent for product APIs because error payloads are machine-readable and precise.

Pattern to steal: strict issue taxonomy over free-form strings.

---

## 5) What I like most

1. **Clear parse contract** (throw vs safe result).
2. **Engine/public API separation** (`core` vs `classic`).
3. **Rich, typed error issue taxonomy**.
4. **Context-driven parsing** (sync/async directionality, error maps).

---

## 6) What I would NOT copy blindly

1. Full breadth of codec/parse variants unless needed.
2. Deep internal generic machinery from library code.
3. Massive type unions if app needs only a subset of validations.

For product code, we should keep: boundary validation + clear error envelope + safe/throw dual API.

---

## 7) Safe edit zones vs high-risk zones

### Safe-ish zones
- public wrapper ergonomics (`classic/*`) with tests
- docs/examples around parse/safeParse usage
- specific check modules with isolated behavior

### High-risk zones
- `core/schemas.ts` internals and run/check pipeline
- `core/parse.ts` behavior contracts
- issue taxonomy compatibility in `core/errors.ts`

Any changes here can break broad ecosystem expectations.

---

## 8) If I start coding in Zod tomorrow

1. First identify: API wrapper issue vs core parse issue.
2. Reproduce with targeted test around parse/safeParse and async variants.
3. Preserve contracts:
   - sync parse must reject async schema paths
   - safeParse never throws for validation failures
   - issue objects remain structured and stable
4. Keep changes local; avoid touching shared internals unless necessary.

---

## 9) Immediate patterns to steal for Teiny

1. Validation boundary API should provide both `parse` (throw) and `safeParse` (result object).
2. Keep error objects structured with `code/path/message`.
3. Separate core engine from convenience wrappers.
4. Prefer typed issue categories over generic exceptions.
