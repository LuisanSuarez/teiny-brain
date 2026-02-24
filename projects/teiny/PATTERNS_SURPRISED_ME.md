# Patterns That Surprised Me (OS Study)

Date started: 2026-02-24
Purpose: Keep only high-signal patterns that were genuinely clever, readable, or reusable.

---

## Project 1 — TanStack Query

### 1) Role-separated architecture is unusually clean
- `QueryClient` = orchestrator
- `QueryCache` = registry
- `Query` = state machine
- `QueryObserver` = consumer lens

**Why it surprised me:** many libs blur these roles; this one keeps boundaries sharp.

---

### 2) Reducer action names are boring and excellent
Actions like:
- `fetch`, `success`, `error`, `pause`, `continue`, `invalidate`, `setState`

**Why it surprised me:** no clever naming tax. Debugging is straightforward.

---

### 3) Clever abort-signal consumption tracking
File: `packages/query-core/src/query.ts`

```ts
const addSignalProperty = (object: unknown) => {
  Object.defineProperty(object, 'signal', {
    enumerable: true,
    get: () => {
      this.#abortSignalConsumed = true
      return abortController.signal
    },
  })
}
```

**Why it surprised me:** they can differentiate cancellation behavior based on whether queryFn actually consumed the signal.

---

### 4) Subscription race-window hardening
File: `packages/react-query/src/useBaseQuery.ts`

```ts
const unsubscribe = shouldSubscribe
  ? observer.subscribe(notifyManager.batchCalls(onStoreChange))
  : noop

observer.updateResult()
```

**Why it surprised me:** they explicitly refresh after subscription to avoid missing updates between observer creation and subscribe.

---

### 5) Tiny fail-fast ergonomics that improve DX
File: `packages/react-query/src/QueryClientProvider.tsx`

```ts
if (!client) {
  throw new Error('No QueryClient set, use QueryClientProvider to set one')
}
```

**Why it surprised me:** minimal code, maximum clarity.

---

## Candidate rules we might derive later
- Prefer explicit role boundaries over “god objects”.
- Name state transitions with plain verbs.
- Add guardrails for subscription race windows.
- Fail fast with actionable errors.
- Only add complexity when defending real lifecycle edge cases.

## Added from Run 3B (trace+rewrite)
- Treat refetch semantics as first-class behavior: define whether to cancel, dedupe, or join in-flight requests.
- Keep cancellation modes explicit (silent vs revert) when state rollback matters.
- Avoid proxy-based “smart tracking” unless perf profiling proves it needed.
- For product code, cap option surfaces; fewer knobs, stronger defaults.

---

## Project 2 — Hono

### 1) Finalization guard is brutally useful
File: `src/hono-base.ts`
```ts
if (!context.finalized) {
  throw new Error(
    'Context is not finalized. Did you forget to return a Response object or `await next()`?'
  )
}
```
**Why it surprised me:** it kills a whole class of silent middleware bugs with one explicit invariant.

### 2) `next()` misuse protection in compose
File: `src/compose.ts`
```ts
if (i <= index) {
  throw new Error('next() called multiple times')
}
```
**Why it surprised me:** tiny guard, massive debugging payoff.

### 3) SmartRouter lock-in after first viable strategy
File: `src/router/smart-router/router.ts`
```ts
this.match = router.match.bind(router)
this.#routers = [router]
this.#routes = undefined
```
**Why it surprised me:** adaptive-at-start, fast-forever-after pattern is elegant and practical.

### 4) Route registration normalized through one path
File: `src/hono-base.ts`
```ts
this.router.add(method, path, [handler, r])
this.routes.push(r)
```
**Why it surprised me:** all entry methods converge into one registration primitive; very maintainable.

---

## Project 3 — Fastify

### 1) Lifecycle phases are very explicit
File: `lib/handle-request.js`
```js
preValidationHookRunner(...)
const validationErr = validateSchema(...)
preHandlerHookRunner(...)
result = context.handler(request, reply)
```
**Why it surprised me:** clean phase boundaries make debugging and correctness work much easier.

### 2) Sync/async handler outputs are handled deterministically
File: `lib/handle-request.js`
```js
if (result !== null && typeof result.then === 'function') {
  wrapThenable(result, reply, store)
} else {
  reply.send(result)
}
```
**Why it surprised me:** avoids ambiguous behavior around Promise returns.

### 3) Route shorthand normalization before core route processing
File: `lib/route.js`
```js
options = Object.assign({}, options, { method, url, path: url, handler: ... })
return route.call(this, { options, isFastify })
```
**Why it surprised me:** one internal shape before deeper logic is a strong maintainability pattern.

### 4) Hook taxonomy is deliberate
File: `lib/hooks.js`
```js
const applicationHooks = [...]
const lifecycleHooks = [...]
```
**Why it surprised me:** strong conceptual split reduces plugin/lifecycle confusion.

---

## Project 4 — Zod

### 1) parse/safeParse dual contract is excellent
Files: `v4/classic/parse.ts`, `v4/core/parse.ts`
```ts
export const parse = core._parse(ZodRealError)
export const safeParse = core._safeParse(ZodRealError)
```
**Why it surprised me:** two explicit ergonomics for the same validator (throwing vs non-throwing) is super practical.

### 2) Sync parse explicitly rejects async execution paths
File: `v4/core/parse.ts`
```ts
if (result instanceof Promise) {
  throw new core.$ZodAsyncError();
}
```
**Why it surprised me:** clear guardrail prevents subtle async misuse in sync flows.

### 3) Structured issue taxonomy is very reusable
File: `v4/core/errors.ts`
```ts
export interface $ZodIssueInvalidType ...
export interface $ZodIssueTooSmall ...
export interface $ZodIssueInvalidUnion ...
```
**Why it surprised me:** machine-readable error categories make downstream handling much cleaner.

### 4) Engine vs wrapper split is disciplined
Files: `v4/core/*` and `v4/classic/*`
**Why it surprised me:** great separation between hard internals and user-facing API ergonomics.

---

## Project 5 — Dub.co

### 1) Thin route, explicit orchestration chain
File: `apps/web/app/api/links/route.ts`
```ts
const body = await createLinkBodySchemaAsync.parseAsync(await parseRequestBody(req))
const { link, error, code } = await processLink({ payload: body, workspace, ...(session && { userId: session.user.id }) })
const response = await createLink(link)
```
**Why it surprised me:** very practical API shape for real product code.

### 2) Structured domain output before throwing API error
File: `apps/web/app/api/links/route.ts`
```ts
if (error != null) {
  throw new DubApiError({ code: code as ErrorCodes, message: error })
}
```
**Why it surprised me:** domain logic returns explicit machine-friendly error state before transport-level formatting.

### 3) Massive policy validation in one domain function (good and risky)
File: `apps/web/lib/api/links/process-link.ts`
**Why it surprised me:** impressive coverage of business constraints, but also a warning sign for future maintainability if not split.

### 4) Async side-effect fanout after persistence
File: `apps/web/lib/api/links/create-link.ts`
```ts
waitUntil((async () => {
  await Promise.allSettled([
    linkCache.set(...),
    recordLink(...),
    updateLinksUsage(...),
    ...
  ])
})())
```
**Why it surprised me:** excellent pattern for keeping request latency low in SaaS workloads.
