# Tao of TypeScript

Date: 2026-02-24
Purpose: simple, easy-to-spot Maxims that enforce good architecture by default.

---

## Maxim 1 — Validate at the Gate
**Rule:** No `if (!x)` / null checks inside domain logic files.

**Behavior it enforces:**
All input uncertainty is resolved at boundaries (route/controller/adapter), so domain code runs on trusted shapes.

---

## Maxim 2 — No Optional Chaining in the Core
**Rule:** No `?.` in `domain/`, `policy/`, or `core/` files.

**Behavior it enforces:**
Core logic must rely on explicit contracts, not “maybe” values. If value can be missing, boundary validation is incomplete.

---

## Maxim 3 — Routes Orchestrate, They Don’t Decide
**Rule:** Route/controller files may call services, but may not contain business policy branches.

**Behavior it enforces:**
Business rules live in policy/service modules, making route handlers thin, readable, and test-friendly.

---

## Maxim 4 — One Domain Call per Route
**Rule:** A route handler may call at most **one** domain entry function.

**Behavior it enforces:**
Makes routes pure transport/orchestration boundaries and pushes all business flow into domain application services.

---

## Maxim 5 — No Boolean Flags in Signatures
**Rule:** No function params like `isX`, `skipY`, `shouldZ` in domain code.

**Behavior it enforces:**
Avoids branching-heavy APIs; encourages separate explicit functions/strategies per behavior.

---

## Maxim 6 — Keep Policy Functions Short
**Rule:** Any function in `policy/` over 180 lines must be split by concern.

**Behavior it enforces:**
Prevents policy accretion and preserves maintainability as constraints grow.

---

## Maxim 7 — One Error Shape to Rule Them All
**Rule:** API/domain errors must use a structured shape (`code`, `message`, optional `path/context`).

**Behavior it enforces:**
Consistent, machine-readable error handling across modules and transport layers.

---

## Maxim 8 — Throw or Return Result, Never Both
**Rule:** A function must choose one contract:
- throws typed errors, or
- returns result unions (`ok/fail`),
not a mixed pattern.

**Behavior it enforces:**
Predictable control flow and simpler call-site error handling.

---

## Maxim 9 — Name the Lifecycle
**Rule:** Pipeline/lifecycle code must use explicit phase names (`preValidate`, `validate`, `preHandle`, `handle`, etc.).

**Behavior it enforces:**
Makes flow and debugging obvious; avoids hidden middleware spaghetti.

---

## Maxim 10 — Normalize Before Registering
**Rule:** Public shorthand inputs must be normalized into one internal config shape before execution.

**Behavior it enforces:**
Reduces branching and inconsistency in downstream logic.

---

## Maxim 11 — No Anonymous Side-Effect Fanout
**Rule:** No large inline `Promise.all` / `allSettled` arrays in domain flows; use named task functions.

**Behavior it enforces:**
Improves observability, ownership, and failure debugging for background work.

---

## Maxim 12 — Side Effects Off the Critical Path
**Rule:** Non-critical side effects must run after core persistence/response path.

**Behavior it enforces:**
Better user-facing latency and fewer request-path failures.

---

## Maxim 13 — Ban `as any` in Product Logic
**Rule:** `as any` is forbidden in domain/policy/core; allowed only in adapter/integration boundaries with comment.

**Behavior it enforces:**
Keeps type unsafety quarantined and contracts trustworthy in core logic.

---

## Maxim 14 — No Junk Drawer Files
**Rule:** No `utils.ts`, `helpers.ts`, or `common.ts` in domain folders.

**Behavior it enforces:**
Forces modules to represent explicit responsibilities and meaningful names.

---

## Maxim 15 — Every State Machine Uses Plain Verbs
**Rule:** State/action names must be clear verbs (`fetch`, `success`, `error`, `invalidate`) — no clever names.

**Behavior it enforces:**
Improves readability and reduces debugging ambiguity in lifecycle/state transitions.

---

## Maxim 16 — Fail Fast, Loud, and Actionable
**Rule:** Guard errors must say exactly what is missing/wrong and where to fix it.

**Behavior it enforces:**
Shortens debugging loops and prevents silent invalid states.

---

## Maxim 17 — Keep Arity Small
**Rule:** Max 4 parameters per function in product code.

**Behavior it enforces:**
Pushes toward cohesive input objects and cleaner interfaces.

---

## Maxim 18 — One Exported Function, One Clear Job
**Rule:** Domain files should export one primary behavior (or a tiny cohesive pair).

**Behavior it enforces:**
Small, composable units that are easier to test, read, and reuse.

---

## Maxim 19 — Ban Vague Names
**Rule:** Ban these names in domain code: `handle`, `process`, `handler`, `result`, `data`, `info` (except in adapter/framework boundary code).

**Behavior it enforces:**
Forces explicit domain language in APIs and variables, which improves readability and architectural intent.

---

## Maxim 20 — Pass the Framework Test
**Rule:** Never import vendor/framework SDKs directly in domain/policy/route code. Import project wrappers only (e.g., `api.ts`, `monitor.ts`, `queue.ts`).

**Behavior it enforces:**
If a vendor/framework changes, usually one adapter file changes—not the whole codebase.

---

## Maxim 21 — Domain-First Folders
**Rule:** Backend code is organized by domain modules, not by technical layers.

**Behavior it enforces:**
Keeps business boundaries obvious and reduces controller/service/repo sprawl.

---

## Maxim 22 — Routes Have No Business Branches
**Rule:** No `if`/`switch` business policy logic in route files.

**Behavior it enforces:**
Routes remain transport boundaries; policy decisions stay in domain code.

---

## Maxim 23 — Domain Services Return Domain Shapes
**Rule:** No framework/HTTP response objects may cross into domain services.

**Behavior it enforces:**
Prevents framework leakage into business logic and simplifies testing.

---

## Maxim 24 — Null Is Not a Protocol
**Rule:** Do not use `null`/`undefined` as implicit behavior flags between layers.

**Behavior it enforces:**
Forces explicit state/intent fields and avoids fragile convention coupling.

---

## Maxim 25 — Use Cases Before Generic Endpoints
**Rule:** Design service/domain functions around concrete use cases, not generic CRUD-first abstractions.

**Behavior it enforces:**
Aligns code with product behavior and avoids accidental architecture bloat.

---

## Maxim 26 — No Transport Objects in Core
**Rule:** Core/policy/domain layers may not import Request/Response/headers/cookies directly.

**Behavior it enforces:**
Maintains backend architecture independence from transport framework.

---

## Maxim 27 — Middleware Does Cross-Cutting Only
**Rule:** Middleware can handle auth/logging/validation/rate-limit, never domain policy decisions.

**Behavior it enforces:**
Prevents hidden business logic and keeps domain rules centralized.

---

## Maxim 28 — Explicit Empty and Not Found Semantics
**Rule:** Domain functions must distinguish `empty`, `not_found`, and `forbidden` explicitly.

**Behavior it enforces:**
Removes ambiguity and improves API behavior consistency.

---

## Maxim 29 — Keep API Surface Narrow
**Rule:** Public function signatures should expose minimal options and strong defaults.

**Behavior it enforces:**
Prevents option explosion and inconsistent behavior across call sites.

---

## Maxim 30 — Prefer Integration Tests at Boundaries
**Rule:** Every module boundary (route->service, service->db, service->vendor wrapper) requires integration tests.

**Behavior it enforces:**
Catches contract drift where most production bugs happen.

---

## Suggested Adoption Mode
- Start as code review checklist.
- Promote 8–12 Maxims to lint/CI where possible.
- Revisit monthly: keep rules that improve outcomes, drop performative ones.
