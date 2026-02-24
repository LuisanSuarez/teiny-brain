# Fastify Deep Briefing (Run 3, Project 3/5)

Date: 2026-02-24
Audience: onboarding to contribute confidently
Focus: architecture, request lifecycle, plugin/hooks model, safe edit zones

---

## 0) 30-second mental model

Fastify is a **high-performance HTTP framework with plugin encapsulation**.

Core split:
- `fastify.js` builds the app instance and wires subsystems.
- `lib/route.js` handles route registration + router integration.
- `lib/handle-request.js` runs runtime request lifecycle (content-type -> validation -> hooks -> handler).
- `lib/hooks.js` defines hook system and execution runners.

If you remember one thing:
> Fastify is a pipeline engine where correctness depends on preserving **hook order + encapsulation + reply/send semantics**.

---

## 1) Where the important logic lives

- `fastify.js`
  - Creates central instance object with symbols for internal state.
  - Exposes public API (`get/post/route/addHook/...`) by delegating to routing/hook internals.

- `lib/route.js`
  - Route normalization, schema compilation, method validation, router registration.
  - Integrates `find-my-way` router.

- `lib/handle-request.js`
  - Per-request flow:
    - body/content-type handling
    - preValidation hooks
    - schema validation
    - preHandler hooks
    - handler execution + async wrapping

- `lib/hooks.js`
  - Hook registry + validation + runner generation for lifecycle/application hooks.

---

## 2) Runtime request flow (actual execution)

1. Incoming request is routed by `router.lookup` (from `find-my-way`).
2. Route context is attached to request/reply.
3. `handleRequest()` runs:
   - checks bodyless/bodywith method sets
   - parses content-type and payload when needed
   - enters preValidation hooks
   - validates schema
   - runs preHandler hooks
   - executes route handler
   - sends sync result or wraps promise result

Snippet (`lib/handle-request.js`):
```js
if (request[kRouteContext].preValidation !== null) {
  preValidationHookRunner(...)
} else {
  preValidationCallback(null, request, reply)
}
```

And handler execution:
```js
result = context.handler(request, reply)
if (result !== undefined) {
  if (result !== null && typeof result.then === 'function') {
    wrapThenable(result, reply, store)
  } else {
    reply.send(result)
  }
}
```

Why this matters: lifecycle is explicit and layered, not hidden in magical middleware.

---

## 3) Fastify architecture patterns worth studying

### A) Internal state by symbols
`fastify.js` uses symbol keys (e.g. `kState`, `kHooks`, `kSchemaController`) to avoid accidental public mutation.

### B) Method capability split
`kSupportedHTTPMethods` separates bodyless vs bodywith methods.
This makes request parsing behavior explicit and fast.

### C) Hook taxonomy is clean
`hooks.js` clearly separates:
- application hooks (`onReady`, `onClose`, ...)
- lifecycle hooks (`onRequest`, `preValidation`, `preHandler`, `onSend`, ...)

That separation reduces plugin confusion.

### D) Route registration normalization
`prepareRoute()` converts shorthand calls into full route options object before passing to route engine.

---

## 4) What I like most (for Teiny style)

1. **Pipeline clarity** in request handling.
2. **Explicit hook phases** and validation.
3. **Strong error handling discipline** (`reply[kReplyIsError] = true; reply.send(err)`).
4. **Schema-first encouragement** near route definitions.

---

## 5) What I would NOT copy directly

1. Giant central instance object pattern from `fastify.js` (framework-level complexity).
2. Symbol-heavy architecture for normal product modules (too much indirection).
3. Full hook surface area unless truly needed.

For app code: keep core ideas, simplify surface.

---

## 6) Safe edit zones vs high-risk zones

### Safe-ish zones
- Docs/examples/tests for hook usage.
- Isolated hook behavior adjustments with tests.
- Non-breaking route ergonomics.

### High-risk zones
- `lib/handle-request.js` lifecycle order.
- `lib/route.js` schema + router integration.
- internal state/symbol wiring in `fastify.js`.

Any change here can break many plugins and subtle lifecycle guarantees.

---

## 7) If I start coding in Fastify tomorrow

1. First identify lifecycle phase where bug occurs (onRequest? preValidation? preHandler? handler?).
2. Reproduce with route-level test in `test/`.
3. Patch smallest phase possible.
4. Verify both sync and async handler paths.
5. Verify error status mapping + reply sent behavior.

---

## 8) Practical takeaways to steal now

1. Keep request pipeline phases explicit and ordered.
2. Distinguish app-level hooks vs request lifecycle hooks.
3. Normalize user-facing shorthand into one internal route config shape.
4. Handle async/sync handler returns explicitly (never ambiguous).
