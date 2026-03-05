# Tao of TypeScript — Explanations

Date: 2026-03-01
Purpose: rationale and deeper context for each maxim in `TAO_OF_TYPESCRIPT.md`.

Use this file for:
- evaluating whether a maxim should be kept/changed
- understanding tradeoffs and exception intent
- resolving disagreements during review

Keep the canonical enforceable rules in `TAO_OF_TYPESCRIPT.md` minimal.

---

## 1) Validate at the Boundary
Prevents “defensive coding” spread across domain logic and keeps business flows deterministic.

## 2) No Optional Chaining in Core Logic
Optional chaining in core is usually a symptom of missing boundary validation or weak contracts.

## 3) Routes Orchestrate, They Don’t Decide
Separates transport concerns from business policy so routes stay thin and testable.

## 4) One Domain Entry per Route
Avoids route-level workflow accretion and centralizes business flow in domain/application services.

## 5) No Boolean Behavior Flags in Signatures
Boolean flags collapse multiple behaviors into one ambiguous API and scale poorly.

## 6) Keep Domain Functions Short
Long functions hide mixed concerns and make change-safety/reviewability worse.

## 7) One Error Contract
Consistent error shape improves API reliability, observability, and client handling.

## 8) Throw or Return Result, Never Both
Mixed contracts create ambiguous call-site error handling and hidden failure paths.

## 9) Name Lifecycle Phases Explicitly
Explicit phases make orchestration intent visible and debugging faster.

## 10) Normalize Inputs at the Boundary
Normalization once at the edge prevents alias/fallback drift across core code.

## 11) No Anonymous Side-Effect Fanout
Named tasks improve ownership, observability, retries, and incident debugging.

## 12) Non-Critical Side Effects Off Critical Path
Protects latency and reliability of user-critical request paths.

## 13) Ban `as any` in Product Logic
Quarantines unsafety at boundaries and preserves type trust in core logic.

## 14) No Junk Drawer Files
Generic buckets become architecture debt magnets and bury domain intent.

## 15) State Machines Use Plain Verbs
Clear states reduce ambiguity in transitions and debugging.

## 16) Fail Fast, Loud, Actionable
Actionable guard failures shorten feedback loops and reduce silent corruption.

## 17) Keep Arity Small
Encourages cohesive argument objects and stable APIs.

## 18) One Primary Exported Behavior per Domain File
Preserves module cohesion and keeps files easy to reason about.

## 19) Ban Vague Names
Domain language in names reduces ambiguity and prevents conceptual drift.

## 20) Pass the Framework Test
Framework/vendor isolation reduces blast radius when dependencies change.

## 21) Domain-First Backend Organization
Organizing by business capability improves discoverability and ownership.

## 22) Routes Have No Business Branches
Reinforces route/domain boundary and avoids hidden policy logic in transport layer.

## 23) Domain Services Return Domain Shapes
Prevents transport leakage into core logic and improves portability/testing.

## 24) Null Is Not a Protocol
Implicit null conventions create fragile inter-layer coupling.

## 25) Use Cases Before Generic CRUD
Use-case APIs map to product behavior and avoid abstraction bloat.

## 26) No Transport Objects in Core
Maintains framework independence and protects core architecture.

## 27) Middleware Is Cross-Cutting Only
Keeps policy logic visible and centralized in domain modules.

## 28) Explicit Empty/NotFound/Forbidden Semantics
Avoids semantic ambiguity and improves API correctness.

## 29) Keep Public API Surface Narrow
Strong defaults + narrow surfaces reduce misuse and branching complexity.

## 30) Integration Tests at Boundaries
Boundary contracts are where production drift hides; integration tests catch it early.

## 30) Split Complex Types into `*.types.ts`
Allows tiny local types for readability, while moving larger contracts (4+ fields) out of logic files to keep behavior-focused files easy to scan and review.

---

## Notes on Exceptions
These are laws by default. Exceptions are allowed when justified by concrete constraints (performance, framework boundary, migration stage). Document exceptions in PR notes when relevant.
