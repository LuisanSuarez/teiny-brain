# OS Cross-Project Synthesis v1

Date: 2026-02-24
Scope: TanStack Query, Hono, Fastify, Zod, Dub.co
Goal: identify shared patterns that should shape Teiny coding defaults

---

## 1) Patterns common across projects (high confidence)

## A. Strong boundary contracts
Observed in: Zod, Dub, Fastify, Hono
- Validate at boundaries before domain logic.
- Fail fast with explicit errors.
- Keep response/result contracts deterministic.

Why it matters for Teiny:
- Fewer hidden assumptions.
- Better debuggability and safer refactors.

## B. Separation of responsibilities
Observed in: TanStack, Zod, Dub, Hono
- Core engine separated from adapters/wrappers.
- Routing/orchestration separated from business policy.
- Registry/state/orchestration concerns split.

Why it matters:
- Localized complexity and easier testing.

## C. Explicit lifecycle/state transitions
Observed in: TanStack, Fastify, Hono
- Named phases and predictable transitions.
- Guardrails for illegal transitions (`next()` twice, unfinished context, etc.).

Why it matters:
- Less spooky behavior, easier incident debugging.

## D. Async work discipline
Observed in: TanStack, Fastify, Zod, Dub
- Explicit sync vs async paths.
- Retry/pause/cancel semantics are intentional.
- Non-critical side effects can run off critical path.

Why it matters:
- Better latency + fewer race-condition surprises.

## E. Structured error models
Observed in: Zod, Dub, Fastify
- Error codes + message + often path/context.
- Not just string exceptions.

Why it matters:
- Machine-readable handling and consistent API behavior.

---

## 2) Patterns that are contextual (use carefully)

1. Adaptive strategy lock-in (Hono SmartRouter style)
- Useful when multiple matching strategies are needed.
- Overkill for stable app domains.

2. Proxy/property tracking optimizations (TanStack)
- Useful at library scale.
- Risky and unnecessary for most product code.

3. Symbol-heavy internal architecture (Fastify)
- Great for framework internals.
- Usually too indirect for app/business modules.

4. Huge type-overload public API design (TanStack/Zod internals)
- Good for reusable libraries.
- Bad default for product feature velocity.

---

## 3) What all five collectively suggest for Teiny

### Default architecture posture
- Thin orchestration layer
- Domain policy layer
- Persistence/service layer
- Background side-effect layer

### Default quality posture
- Validate early
- Fail fast with structured errors
- Keep sync/async behavior explicit
- Keep state transitions plain and named

### Default complexity posture
- Prefer readability first
- Add advanced abstractions only with proven need
- Avoid framework-level meta-programming in product code

---

## 4) Proposed shared principles (Step 2 output)

1. **Boundary First:** all external input is validated at entry.
2. **Single Responsibility Layers:** orchestration, policy, persistence, side-effects are distinct.
3. **Named Lifecycles:** request/state phases must be explicit and ordered.
4. **Deterministic Async:** sync vs async behavior must be obvious and testable.
5. **Structured Errors:** errors use stable machine-readable shape.
6. **Small, Composable Units:** avoid giant policy functions; split by concern early.
7. **Framework Complexity is Optional:** copy concepts, not internal machinery.
8. **Optimize After Signal:** no premature optimization abstractions.

---

## 5) Immediate implications for Teiny coding defaults

- Route/controller files should orchestrate only.
- Domain checks return typed result objects.
- Use parse/safeParse-style dual validation when helpful.
- Keep one normalized config path for registration-style APIs.
- Require finalization/invariant checks in middleware-like pipelines.

---

## Confidence
High confidence on principles 1–6.
Medium confidence on principle 7–8 (depends on workload/perf constraints).
