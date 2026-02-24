# Hono — Trace + Rewrite + Scorecard (Run 3B)

Date: 2026-02-24
Purpose: go beyond overview into execution-level understanding

---

## A) End-to-end Trace #1 — Request dispatch with middleware chain

### Path
1. `app.fetch(request, env, executionCtx)` in `hono-base.ts`
2. `#dispatch()` computes path + router match
3. `Context` created with env/match/notFound handler
4. `compose(matchResult[0], errorHandler, notFoundHandler)`
5. middleware chain executes with `next()` recursion
6. context must be finalized (`context.res` set) or Hono throws

### Key snippet
```ts
const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler)
const context = await composed(c)
if (!context.finalized) {
  throw new Error(
    'Context is not finalized. Did you forget to return a Response object or `await next()`?'
  )
}
return context.res
```

### Why this is important
- Hono makes middleware correctness explicit.
- You can’t accidentally "forget to return" without getting a hard error.
- This reduces silent 200-with-empty-body bugs.

---

## B) End-to-end Trace #2 — Router strategy resolution (SmartRouter)

### Path
1. `Hono` constructor sets default router to `SmartRouter(RegExpRouter + TrieRouter)`.
2. Routes are added to SmartRouter via `add` (stored in `#routes`).
3. First `match()` call replays routes into candidate routers.
4. First compatible router wins.
5. SmartRouter mutates itself to bind directly to winner’s `match` implementation.

### Key snippet
```ts
for (...) {
  const router = routers[i]
  try {
    for (...) router.add(...routes[i])
    res = router.match(method, path)
  } catch (e) {
    if (e instanceof UnsupportedPathError) continue
    throw e
  }

  this.match = router.match.bind(router)
  this.#routers = [router]
  this.#routes = undefined
  break
}
```

### Why this is important
- It pays startup flexibility cost once, then runs hot path fast.
- This is a practical “adaptive strategy then lock-in” pattern we can reuse.

---

## C) Teiny-style rewrites (intent preserved, complexity reduced)

## Rewrite 1 — Dispatch contract guard (clean app-level pattern)

```ts
async function runPipeline(ctx: Ctx, run: () => Promise<Ctx>) {
  const result = await run()
  if (!result.finalized) {
    throw new Error('Pipeline did not finalize response')
  }
  return result.response
}
```

**Why useful for Teiny:** enforce response finalization in internal middleware pipelines without carrying full framework complexity.

## Rewrite 2 — Strategy lock-in pattern (generic)

```ts
class AdaptiveMatcher {
  private selected?: Matcher

  match(input: Input) {
    if (this.selected) return this.selected.match(input)

    for (const candidate of this.candidates) {
      if (candidate.supports(input)) {
        this.selected = candidate
        return candidate.match(input)
      }
    }
    throw new Error('No matcher supports input')
  }
}
```

**Tradeoff:** less powerful than Hono’s exact router behavior, but easier to reason about for product code.

---

## D) Red flags (what not to copy blindly)

1. Dynamic method construction + `any` casts in internals.
2. Over-generalized framework flexibility when app domain is stable.
3. Hidden complexity around route matching internals if not performance-critical.
4. Large central class (`HonoBase`) for everything in product apps.

---

## E) Pattern scorecard

| Pattern | Readability | Reusability | Risk if copied wrong | Verdict |
|---|---:|---:|---:|---|
| Finalization guard in pipeline | 5 | 5 | 2 | Steal now |
| Double-`next()` protection | 5 | 5 | 2 | Steal now |
| Smart adaptive strategy lock-in | 4 | 4 | 3 | Steal carefully |
| Single-handler fast path | 4 | 4 | 3 | Steal carefully |
| Dynamic method generation in core class | 2 | 2 | 4 | Usually avoid |
| Heavy framework-level type plumbing | 2 | 2 | 4 | Avoid for app code |

---

## F) Rule extraction candidates (from Hono only)

1. Middleware pipeline must enforce single `next()` progression.
2. Every request pipeline must end in explicit response finalization.
3. Prefer one normalized registration path for routes/actions.
4. Use adaptive strategy selection only when performance/compatibility justifies it.
5. Keep request-boundary helpers cached (e.g., parsed body) to avoid duplicate work.
6. Keep handler APIs small and web-standard-aligned.
7. In product code, avoid framework-style dynamic meta-programming unless necessary.
