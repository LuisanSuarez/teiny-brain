# Tao of TypeScript

Date: 2026-03-01
Purpose: enforceable architecture laws for TypeScript code.

---

## Format Contract (mandatory)
Every maxim must use this minimal format:
- **Rule**
- **Bad signal**

For rationale and deeper context, see:
`/Users/luisan/.openclaw/workspace/projects/teiny/TAO_OF_TYPESCRIPT_EXPLANATIONS.md`

---

## Maxim 1 — Validate at the Boundary
**Rule:** Domain logic must not validate transport/input uncertainty.
**Bad signal:** `if (!x)` / shape parsing / request-derived null guards inside domain code.

## Maxim 2 — No Optional Chaining in Core Logic
**Rule:** Core/domain/business logic must not use optional chaining for required values.
**Bad signal:** `?.` in core flows to bypass missing data instead of fixing boundary contracts.

## Maxim 3 — Routes Orchestrate, They Don’t Decide
**Rule:** Route/controller files must not contain business-policy branching.
**Bad signal:** Route-level `if/switch` deciding eligibility, pricing, risk, or workflow policy.

## Maxim 4 — One Domain Entry per Route
**Rule:** A route handler should call one domain entry function for business flow.
**Bad signal:** Route stitching multiple business operations and policy branches inline.

## Maxim 5 — No Boolean Behavior Flags in Signatures
**Rule:** Domain function signatures must not use boolean behavior flags (`isX`, `skipY`, `shouldZ`).
**Bad signal:** One function changing behavior via booleans instead of explicit functions/strategies.

## Maxim 6 — Keep Domain Functions Short
**Rule:** Domain/business-logic functions over 40 lines must be split by concern.
**Bad signal:** Long functions combining validation, policy, persistence, and side effects.

## Maxim 7 — One Error Contract
**Rule:** API/domain errors must use one structured error shape (`code`, `message`, optional `context/path`).
**Bad signal:** Mixed raw strings, ad-hoc objects, and inconsistent throw/return error formats.

## Maxim 8 — Throw or Return Result, Never Both
**Rule:** A function chooses one error contract: throws typed errors OR returns result unions.
**Bad signal:** Same function sometimes throws and sometimes returns `{ ok: false }`.

## Maxim 9 — Name Lifecycle Phases Explicitly
**Rule:** Pipelines must use explicit phase names (`preValidate`, `validate`, `prepare`, `execute`, `finalize`).
**Bad signal:** Opaque phase names (`step1`, `doThing`, `runStage`) or banned vague verbs.

## Maxim 10 — Normalize Inputs at the Boundary
**Rule:** Public aliases/shorthand inputs must be normalized once before domain execution.
**Bad signal:** Domain code with fallback chains (`a ?? b ?? c`) or legacy/new alias branching.

## Maxim 11 — No Anonymous Side-Effect Fanout
**Rule:** Large side-effect fanout blocks must use named task functions.
**Bad signal:** Big inline `Promise.all` / `allSettled` arrays in domain flows.

## Maxim 12 — Non-Critical Side Effects Off Critical Path
**Rule:** Non-critical side effects must run after core persistence/response path.
**Bad signal:** Request path blocked by analytics/notifications/non-essential writes.

## Maxim 13 — Ban `as any` in Product Logic
**Rule:** `as any` is forbidden in domain/business code.
**Bad signal:** Type errors suppressed in core logic with `as any`.

## Maxim 14 — No Junk Drawer Files
**Rule:** Domain modules must not use generic junk drawers (`utils.ts`, `helpers.ts`, `common.ts`).
**Bad signal:** Unrelated domain logic accumulating in generic utility files.

## Maxim 15 — State Machines Use Plain Verbs
**Rule:** State/action names must be explicit and plain (`fetch`, `success`, `error`, `invalidate`).
**Bad signal:** Clever/ambiguous state names that hide transitions.

## Maxim 16 — Fail Fast, Loud, Actionable
**Rule:** Guard errors must state exactly what failed and what to fix.
**Bad signal:** Generic errors like `Invalid input` without actionable detail.

## Maxim 17 — Keep Arity Small
**Rule:** Product-code functions should have max 4 parameters.
**Bad signal:** Calls like `createSubmission(userId, orgId, connectionId, source, rows, forceIds)` or signatures with many optional positional args (`x, y, z, opts, flags`) instead of a cohesive input object.

## Maxim 18 — One Primary Exported Behavior per Domain File
**Rule:** Domain files should export one primary behavior (or a tiny cohesive pair).
**Bad signal:** One file exporting many unrelated operations.

## Maxim 19 — Ban Vague Names
**Rule:** Ban vague names in domain code: `handle`, `process`, `handler`, `result`, `data`, `info`.
**Bad signal:** APIs/variables named with placeholders instead of domain language.

## Maxim 20 — Pass the Framework Test
**Rule:** Domain/business code must not import vendor/framework SDKs directly.
**Bad signal:** Imports like `import OpenAI from 'openai'`, `import Stripe from 'stripe'`, `import { Resend } from 'resend'`, or `import { Request } from 'express'` inside domain/business modules instead of using project wrappers/adapters.

## Maxim 21 — Routes Have No Business Branches
**Rule:** Route files must not contain business-policy `if/switch` logic.
**Bad signal:** Route code like `if (user.plan==='pro') ... else ...` / `switch(riskLevel)` deciding policy; route should call one action (`await decideUpgradeEligibility(...)`) instead.

## Maxim 22 — Domain Services Return Domain Shapes
**Rule:** Domain services must not return framework/HTTP transport objects.
**Bad signal:** `return c.json(...)`, `return NextResponse.json(...)`, or `{ status: 403, body: ... }` from domain service; return domain result (e.g., `{ kind: 'forbidden' }`) instead.

## Maxim 23 — Null Is Not a Protocol
**Rule:** Layers must not encode behavior via implicit `null`/`undefined` conventions.
**Bad signal:** `const user = await findUser(id); if (!user) ...` where `null` means many things; return explicit union instead (`{ kind: 'not_found' } | { kind: 'ok', user }`).

## Maxim 24 — Use Cases Before Generic CRUD
**Rule:** Domain/service APIs should model concrete use cases, not generic CRUD-first abstractions.
**Bad signal:** Generic APIs like `updateEntity(type, id, payload, flags)`; prefer use-case actions like `approveWithdrawal(...)`, `retryAttachmentUpload(...)`.

## Maxim 25 — No Transport Objects in Core
**Rule:** Core/domain/business code must not import Request/Response/headers/cookies directly.
**Bad signal:** Core function signatures like `execute(req: Request, res: Response)` or reading `req.headers`; pass plain inputs instead (`{ userId, orgId, traceId }`).

## Maxim 26 — Middleware Is Cross-Cutting Only
**Rule:** Middleware may handle auth/logging/validation/rate-limit, not business policy.
**Bad signal:** Business decisions hidden in middleware chains.

## Maxim 27 — Explicit Empty/NotFound/Forbidden Semantics
**Rule:** Domain functions must distinguish `empty`, `not_found`, and `forbidden` explicitly.
**Bad signal:** Distinct semantic outcomes collapsed into one error/result path.

## Maxim 28 — Keep Public API Surface Narrow
**Rule:** Public signatures should expose minimal options with strong defaults.
**Bad signal:** Option explosion and kitchen-sink parameter objects.

## Maxim 29 — Integration Tests at Boundaries
**Rule:** Route→service, service→db, and service→vendor boundaries require integration tests.
**Bad signal:** Boundary behavior covered only by unit tests/mocks.

## Maxim 30 — Split Complex Types into `*.types.ts`
**Rule:** Co-locate only small local types (up to 3 fields). Types/interfaces with 4+ fields must live in adjacent `*.types.ts` within the same module.
**Bad signal:** Logic files declaring large type/interface blocks (4+ fields) alongside business behavior.
