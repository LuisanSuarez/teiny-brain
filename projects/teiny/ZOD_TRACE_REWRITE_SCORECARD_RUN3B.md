# Zod — Trace + Rewrite + Scorecard (Run 3B)

Date: 2026-02-24
Purpose: implementation-level extraction for Teiny coding rules

---

## A) End-to-end Trace #1 — `parse` (throwing mode)

### Path
1. Public API wrapper (`v4/classic/parse.ts`) binds `core._parse` with `ZodRealError`.
2. `core/_parse` executes schema `_zod.run`.
3. If async result appears in sync mode -> throw `$ZodAsyncError`.
4. If issues exist -> finalize issues + throw typed error.
5. Else return parsed output.

### Proving snippet
```ts
export const parse = core._parse(ZodRealError)
...
const result = schema._zod.run({ value, issues: [] }, ctx)
if (result instanceof Promise) throw new core.$ZodAsyncError()
if (result.issues.length) throw new (_params?.Err ?? _Err)(...)
return result.value
```

### Why it matters
- Extremely explicit contract for sync parse.
- Avoids accidental async leakage into sync call sites.

---

## B) End-to-end Trace #2 — `safeParse` (non-throw mode)

### Path
1. Public wrapper binds `core._safeParse`.
2. `_safeParse` runs schema internals same as parse.
3. Returns discriminated union:
   - `{ success: false, error }`
   - `{ success: true, data }`

### Proving snippet
```ts
return result.issues.length
  ? { success: false, error: new _Err(...) }
  : { success: true, data: result.value }
```

### Why it matters
- Product code can choose exception-free validation flow.
- Great for API/controller boundaries.

---

## C) Teiny-style rewrites (intent preserved)

## Rewrite 1 — minimal dual validation API

```ts
type ValidationResult<T> = { ok: true; data: T } | { ok: false; issues: Issue[] }

function parseOrThrow<T>(schema: Schema<T>, input: unknown): T {
  const r = schema.validate(input)
  if (!r.ok) throw new ValidationError(r.issues)
  return r.data
}

function safeParse<T>(schema: Schema<T>, input: unknown): ValidationResult<T> {
  return schema.validate(input)
}
```

Tradeoff: less feature-complete than Zod internals, but captures the most useful product behavior.

## Rewrite 2 — simple structured issue model

```ts
type Issue = {
  code: 'invalid_type' | 'invalid_value' | 'too_small' | 'too_big' | 'custom'
  path: (string | number)[]
  message: string
}
```

Tradeoff: fewer issue categories than Zod, easier to adopt consistently in app code.

---

## D) Red flags (do not copy blindly)

1. Full internal parse/encode/decode API surface unless needed.
2. Deep generic/type-level complexity from library internals.
3. Over-expanding issue taxonomy before real use cases demand it.

---

## E) Pattern scorecard

| Pattern | Readability | Reusability | Risk if copied wrong | Verdict |
|---|---:|---:|---:|---|
| parse vs safeParse dual API | 5 | 5 | 1 | Steal now |
| Structured issue taxonomy | 5 | 5 | 2 | Steal now |
| Engine vs wrapper separation | 4 | 5 | 2 | Steal now |
| Async guard in sync parse | 4 | 4 | 2 | Steal now |
| Full codec API breadth | 2 | 2 | 3 | Usually avoid |
| Deep library-level generic machinery | 2 | 2 | 4 | Avoid for app code |

---

## F) Rule extraction candidates (from Zod only)

1. Every boundary validator should expose both throwing and non-throwing APIs.
2. Validation errors must be structured (`code`, `path`, `message`).
3. Keep validation core isolated from framework-specific wrappers.
4. Sync APIs must reject async-only validation flows explicitly.
5. Default to small issue code set; expand only with proven need.
6. Don’t mirror library-level type complexity in product domain code.
