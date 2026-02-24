# Fastify — Trace + Rewrite + Scorecard (Run 3B)

Date: 2026-02-24
Purpose: extract implementation-grade patterns from Fastify

---

## A) End-to-end Trace #1 — Request lifecycle through `handle-request`

### Path
1. Router matches route context (`lib/route.js` / find-my-way)
2. `lib/handle-request.js#handleRequest`
3. Method/body branch:
   - bodyless -> handler directly
   - bodywith -> content-type parse + parser run
4. preValidation hooks
5. schema validation
6. preHandler hooks
7. user handler execution
8. reply send / async wrap

### Proving snippet
```js
if (this[kSupportedHTTPMethods].bodyless.has(method)) {
  handler(request, reply)
  return
}
...
const validationErr = validateSchema(reply[kRouteContext], request)
...
result = context.handler(request, reply)
if (result !== undefined) {
  if (result !== null && typeof result.then === 'function') {
    wrapThenable(result, reply, store)
  } else {
    reply.send(result)
  }
}
```

### Why it matters
- Lifecycle phases are explicit and testable.
- Async vs sync handler behavior is deterministic.

---

## B) End-to-end Trace #2 — Route registration normalization

### Path
1. public API call (`fastify.get/post/...`) in `fastify.js`
2. delegates to `router.prepareRoute`
3. `prepareRoute` normalizes shorthand/signatures
4. forwards to `route({ options })`
5. method/schema/body-limit validation
6. route added to router

### Proving snippet
```js
options = Object.assign({}, options, {
  method,
  url,
  path: url,
  handler: handler || (options && options.handler)
})

return route.call(this, { options, isFastify })
```

### Why it matters
- Public API flexibility is isolated from core route engine complexity.
- one normalized config path reduces branching bugs.

---

## C) Teiny-style rewrites (intent preserved)

## Rewrite 1 — explicit request phase runner

```ts
async function runRequestPipeline(ctx: ReqCtx) {
  await runPhase('preValidation', ctx)
  validateInput(ctx)
  await runPhase('preHandler', ctx)
  const result = await runHandler(ctx)
  return sendResult(ctx, result)
}
```

Keeps Fastify’s phase clarity, strips framework-level details.

## Rewrite 2 — normalize route signatures once

```ts
function normalizeRoute(input: RouteInput): RouteConfig {
  if (typeof input.handler !== 'function') throw new Error('handler required')
  return {
    method: input.method.toUpperCase(),
    path: input.path,
    handler: input.handler,
    schema: input.schema ?? null,
  }
}
```

Same idea as `prepareRoute`: one canonical config shape.

---

## D) Red flags (avoid copying blindly)

1. Framework-scale symbol indirection in normal app modules.
2. Very broad hook surface for small products.
3. Huge central factory object with many concerns.
4. Performance micro-optimizations before profiling.

---

## E) Pattern scorecard

| Pattern | Readability | Reusability | Risk if copied wrong | Verdict |
|---|---:|---:|---:|---|
| Explicit lifecycle phases | 5 | 5 | 2 | Steal now |
| Route normalization before engine | 5 | 5 | 2 | Steal now |
| Sync/async result split with explicit send | 4 | 5 | 2 | Steal now |
| Hook taxonomy (app vs lifecycle) | 4 | 4 | 3 | Steal carefully |
| Symbol-heavy internal architecture | 2 | 2 | 4 | Avoid for product code |
| Giant factory object style | 2 | 2 | 4 | Usually avoid |

---

## F) Rule extraction candidates (from Fastify only)

1. Define request handling as named phases, not ad-hoc middleware spaghetti.
2. Normalize all route definitions into one internal shape before registration.
3. Separate lifecycle hooks from app/bootstrap hooks.
4. Explicitly handle sync vs async handler returns.
5. Fail fast on invalid route configuration.
6. Keep error propagation explicit and central.
7. Don’t introduce symbol-heavy indirection unless building a framework.
