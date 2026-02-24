# Dub.co Deep Briefing (Run 3, Project 5/5)

Date: 2026-02-24
Audience: onboarding brief to contribute quickly
Focus: modern product backend patterns (API boundary, auth, domain processing, persistence side-effects)

---

## 0) 30-second mental model

Dub is a product-grade Next.js monorepo where API routes are thin orchestration layers over domain services.

Typical stack in one endpoint:
1. `withWorkspace(...)` auth/permissions/rate-limit wrapper
2. Zod validation at request boundary
3. domain processor (`processLink`) for business rules
4. persistence service (`createLink`) for DB + async side effects
5. standardized API error model (`DubApiError`)

If you remember one thing:
> route handler should orchestrate, while business rules live in domain modules and side effects are queued via `waitUntil`.

---

## 1) Key files to know first

- `apps/web/app/api/links/route.ts`
  - canonical route composition pattern (GET + POST)

- `apps/web/lib/auth/workspace.ts`
  - central request wrapper for auth/session/token/workspace permissions + ratelimits

- `apps/web/lib/api/links/process-link.ts`
  - business validation + plan/domain/key rules

- `apps/web/lib/api/links/create-link.ts`
  - data creation + async side-effect fanout (`waitUntil`)

- `apps/web/lib/api/errors.ts`
  - canonical error mapping and response shape

---

## 2) Request lifecycle for POST `/api/links`

1. Route is wrapped by `withWorkspace(...)` with required permissions.
2. Workspace usage checks run.
3. Body parsed + validated via Zod `parseAsync`.
4. Optional anonymous-user ratelimit.
5. `processLink` executes business constraints and normalization.
6. `createLink` persists data + triggers async side effects.
7. Optional workspace webhook publish (`waitUntil`).
8. Return `NextResponse.json`.

Snippet (`route.ts`):
```ts
const body = await createLinkBodySchemaAsync.parseAsync(await parseRequestBody(req))
const { link, error, code } = await processLink({ payload: body, workspace, ...(session && { userId: session.user.id }) })
const response = await createLink(link)
```

This is a strong orchestration pattern: validate -> process -> persist.

---

## 3) Why Dub is a strong product-code study target

### A) Boundary validation before domain work
Route validates upfront with Zod (async-aware). Good contract safety.

### B) Auth/permission concerns centralized in wrapper
`withWorkspace` handles token/session auth, plan checks, role/permission checks, and rate limits. Route logic remains focused.

### C) Domain logic in dedicated service (`processLink`)
`processLink` holds business policy (plan restrictions, domain ownership, malicious checks, key validity, tag/folder constraints).

### D) Persistence separate from policy (`createLink`)
`createLink` handles DB inserts + tagging + webhooks + analytics + cache + async cleanup in one structured side-effect fanout.

### E) Standardized error envelope
`DubApiError` + central handler yields consistent API responses.

---

## 4) Surprising/cool patterns

1. **Process-before-create split**
- Many apps collapse this into one function.
- Dub keeps policy and persistence mostly separate.

2. **Asynchronous side-effect fanout with `waitUntil` + `Promise.allSettled`**
- Core request returns quickly, background jobs still run.

3. **Open-core but product-centric architecture**
- This repo looks like real SaaS code, not a toy framework example.

---

## 5) What I like most (for Teiny style)

1. Thin route, fat domain functions.
2. Explicit boundary validation and permission checks.
3. Clear error semantics and centralized handling.
4. Side effects grouped and labeled in one background block.

---

## 6) What I would NOT copy blindly

1. Very large domain function (`processLink`) can become too dense over time.
2. Route handlers can still get orchestration-heavy if responsibilities creep.
3. Side-effect fanout in one function can become operationally noisy if not segmented.

For our code, we should keep same separation, but split oversized domain functions by concern modules earlier.

---

## 7) Safe edit zones vs high-risk zones

### Safe-ish zones
- Endpoint-specific orchestration improvements with tests.
- New validator schemas and explicit error messages.
- Additional side effects appended carefully to background fanout.

### High-risk zones
- `withWorkspace` auth/token/rate-limit logic.
- `processLink` business policy logic (lots of constraints).
- shared error handling contract (`errors.ts`).

Changes in these areas can impact many endpoints and customers.

---

## 8) If I start coding in Dub tomorrow

1. First map whether change is boundary/auth, policy, or persistence.
2. Avoid putting new policy directly in route file.
3. Add tests around policy function outputs (`error`, `code`, normalized payload).
4. Preserve error envelope consistency.
5. Keep user-path latency low; push non-critical work to background.

---

## 9) Immediate patterns to steal for Teiny

1. Validate input at route boundary.
2. Keep route as orchestrator, business logic in services.
3. Return structured `{error, code}` from domain processors.
4. Separate sync critical path from async side effects.
5. Centralize auth/permission/rate-limit wrappers.
