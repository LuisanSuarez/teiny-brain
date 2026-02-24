# OS Project Executive Summaries — Run 2 (Deep Curated)

Date: 2026-02-24
Selected set: TanStack Query, Hono, Fastify, Zod, Dub.co
Goal lens: modern, readable, scalable, LLM-friendly patterns for better coding (not infra rabbit holes)

---

## 1) TanStack Query (Frontend / server-state)

**Verdict:** Keep. Great frontend data orchestration patterns. Use selectively; avoid copying type-overload complexity.

### What I like
- Clean provider/context baseline pattern.
- Strong separation between consumer hooks and core query client.

**Snippet (good):** `query/packages/react-query/src/QueryClientProvider.tsx`
```tsx
export const useQueryClient = (queryClient?: QueryClient) => {
  const client = React.useContext(QueryClientContext)
  if (queryClient) return queryClient
  if (!client) throw new Error('No QueryClient set, use QueryClientProvider to set one')
  return client
}
```
Why good: tiny, explicit fallback and failure mode.

### What I don't like
- Heavy overload/type gymnastics in option builders can reduce readability.

**Snippet (less good for our style):** `query/packages/react-query/src/queryOptions.ts`
```ts
export function queryOptions<...>(options: DefinedInitialDataOptions<...>): ...
export function queryOptions<...>(options: UnusedSkipTokenOptions<...>): ...
export function queryOptions<...>(options: UndefinedInitialDataOptions<...>): ...
export function queryOptions(options: unknown) {
  return options
}
```
Why less good: powerful for library consumers, but too much ceremony for internal product code.

---

## 2) Hono (Backend / modern web standards)

**Verdict:** Keep. Strong modern backend ergonomics and portability. Good fit for readable TS services.

### What I like
- Concise route API construction.
- Multi-runtime mindset without bloated framework ceremony.

**Snippet (good):** `hono/src/hono-base.ts`
```ts
allMethods.forEach((method) => {
  this[method] = (args1: string | H, ...args: H[]) => {
    if (typeof args1 === 'string') this.#path = args1
    else this.#addRoute(method, this.#path, args1)
    args.forEach((handler) => this.#addRoute(method, this.#path, handler))
    return this as any
  }
})
```
Why good: compact API surface generation, easy to reason about behavior.

### What I don't like
- Internal use of `any`/dynamic method assignment hurts strict readability in core internals.

**Snippet (less good for our style):** `hono/src/hono-base.ts`
```ts
/* eslint-disable @typescript-eslint/no-explicit-any */
...
return this as any
```
Why less good: acceptable in framework internals, but not ideal default for app/domain code.

---

## 3) Fastify (Backend / scalable architecture)

**Verdict:** Keep. Excellent architecture patterns (plugins, lifecycle, validation boundaries). But core internals are dense.

### What I like
- Strong explicit server lifecycle/state handling.
- Plugin-centric architecture and route preparation model.

**Snippet (good):** `fastify/fastify.js`
```js
[kState]: {
  listening: false,
  closing: false,
  started: false,
  ready: false,
  booting: false,
  aborted: false,
  readyResolver: null
},
```
Why good: explicit state model = fewer hidden lifecycle bugs.

### What I don't like
- Very large factory/object initialization in one file; harder to digest quickly.

**Snippet (less good for our style):** `fastify/fastify.js`
```js
const fastify = {
  ...many internal symbols..., routing: httpHandler,
  delete: function _delete (...) { ... },
  get: function _get (...) { ... },
  head: function _head (...) { ... },
  ...
}
```
Why less good: powerful, but dense; not a style we should copy for day-to-day product modules.

---

## 4) Zod (Types + runtime validation)

**Verdict:** Keep. Best pragmatic model for “types that help.” High ROI for boundary validation.

### What I like
- Clear parse/safeParse split.
- Centralized issue normalization and consistent error path.

**Snippet (good):** `zod/packages/zod/src/v4/core/parse.ts`
```ts
return result.issues.length
  ? { success: false, error: new _Err(result.issues.map(...)) }
  : ({ success: true, data: result.value } as any)
```
Why good: predictable result contract; excellent for app boundaries.

### What I don't like
- Internal API breadth (parse/encode/decode sync+async variants) can become overwhelming.

**Snippet (less good for our style):** `zod/packages/zod/src/v4/core/parse.ts`
```ts
export const parse ...
export const parseAsync ...
export const safeParse ...
export const safeParseAsync ...
export const encode ...
export const decode ...
...
```
Why less good: this is library-level completeness, not app-level simplicity.

---

## 5) Dub.co (Overall modern product app)

**Verdict:** Keep. Good real-world product code reference (API auth, validation, usage limits, webhooks).

### What I like
- Route-level auth + schema validation + limits integrated cleanly.
- Good example of “real product constraints” in one flow.

**Snippet (good):** `dub/apps/web/app/api/links/route.ts`
```ts
const body = await createLinkBodySchemaAsync.parseAsync(await parseRequestBody(req))
...
const { link, error, code } = await processLink({ payload: body, workspace, ...(session && { userId: session.user.id }) })
```
Why good: validates at boundary, then hands off to domain process function.

### What I don't like
- Route handler carries many responsibilities (auth, rate limit, processing, webhook, error mapping).

**Snippet (less good for our style):** `dub/apps/web/app/api/links/route.ts`
```ts
if (!session) { ...ratelimit... }
...
const { link, error, code } = await processLink(...)
...
const response = await createLink(link)
...
waitUntil(sendWorkspaceWebhook(...))
```
Why less good: operationally practical, but starts to look controller-heavy.

---

## Cross-project shared patterns worth stealing now
1. Validate inputs at boundaries (Zod + Dub).
2. Keep lifecycle/state explicit (Fastify).
3. Compose middleware/plugins over giant controllers (Hono/Fastify).
4. Prefer tiny context/provider primitives for dependency access (TanStack).
5. Keep type safety useful, avoid type gymnastics unless building a reusable library.

## Cross-project anti-patterns to avoid
1. Controller/routes doing too much orchestration.
2. Giant factory files with too many concerns.
3. Type overload density in app code.
4. Dynamic/any-heavy internals in domain business logic.
