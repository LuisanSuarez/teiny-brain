# Dub.co — Trace + Rewrite + Scorecard (Run 3B)

Date: 2026-02-24
Purpose: extract reusable product-code patterns from a real SaaS codebase

---

## A) End-to-end Trace #1 — POST /api/links orchestration flow

### Path
1. `app/api/links/route.ts` POST handler wrapped by `withWorkspace`.
2. Optional usage/rate-limit checks.
3. Zod parse of request body (`parseAsync`).
4. Domain processor `processLink` returns either error or normalized link.
5. On success -> `createLink` persists and returns transformed link.
6. optional webhook trigger in background (`waitUntil`).

### Proving snippet
```ts
const body = await createLinkBodySchemaAsync.parseAsync(await parseRequestBody(req))
const { link, error, code } = await processLink({ payload: body, workspace, ...(session && { userId: session.user.id }) })
if (error != null) throw new DubApiError({ code: code as ErrorCodes, message: error })
const response = await createLink(link)
```

### Why it matters
- Classic clean layering for product APIs.
- Route remains readable despite complex domain rules.

---

## B) End-to-end Trace #2 — domain policy -> persistence -> async side effects

### Path
1. `processLink.ts` applies policy checks:
   - URL validity
   - plan restrictions
   - domain ownership
   - key checks
   - externalId uniqueness
2. Returns structured success/error object.
3. `createLink.ts` persists in DB.
4. background `waitUntil(Promise.allSettled([...]))` does cache, analytics, uploads, usage update, webhooks, scheduling.

### Proving snippet
```ts
if (!isValidUrl(url)) {
  return { link: payload, error: "Invalid destination URL", code: "unprocessable_entity" }
}
...
const response = await withPrismaRetry(() => prisma.link.create({ data: { ... } }))
...
waitUntil((async () => {
  await Promise.allSettled([
    linkCache.set(...),
    recordLink(...),
    updateLinksUsage(...),
    ...
  ])
})())
```

### Why it matters
- Keeps request path resilient and fast.
- Policies are explicit and testable before writes.

---

## C) Teiny-style rewrites (intent preserved)

## Rewrite 1 — route orchestration skeleton

```ts
export async function postHandler(req: Request) {
  const input = await schema.parseAsync(await parseBody(req))
  const processed = await processDomainInput(input)
  if (!processed.ok) throw apiError(processed.code, processed.message)

  const entity = await saveEntity(processed.data)
  queueBackground(() => runSideEffects(entity))
  return json(entity)
}
```

Preserves Dub’s best shape with fewer product-specific details.

## Rewrite 2 — policy engine split by concerns

```ts
function validatePolicy(input: Input, ctx: Ctx): PolicyResult {
  return chain([
    () => checkUrl(input),
    () => checkPlan(input, ctx.plan),
    () => checkDomainOwnership(input, ctx.workspace),
    () => checkKey(input, ctx.workspace),
  ])
}
```

This is how we’d prevent one giant `processLink` function from growing forever.

---

## D) Red flags (avoid copying blindly)

1. Huge policy function with many branches (hard to keep mentally loaded).
2. Controller creep: too much orchestration in route files over time.
3. Large side-effect fanout list without clear grouping boundaries.

---

## E) Pattern scorecard

| Pattern | Readability | Reusability | Risk if copied wrong | Verdict |
|---|---:|---:|---:|---|
| Thin route + service orchestration | 5 | 5 | 2 | Steal now |
| Boundary validation with async schema parse | 5 | 5 | 2 | Steal now |
| Structured domain return `{error, code}` | 4 | 5 | 2 | Steal now |
| Background side-effect fanout (`waitUntil`) | 4 | 4 | 3 | Steal carefully |
| Giant domain policy function | 2 | 2 | 4 | Avoid/Refactor |
| Route-level responsibility creep | 2 | 2 | 4 | Avoid |

---

## F) Rule extraction candidates (from Dub only)

1. API routes must be orchestration-only: validate -> process -> persist -> respond.
2. All input validation happens at boundaries before domain logic.
3. Domain processors return structured machine-readable errors.
4. Keep non-critical side effects off critical request path.
5. Split policy checks into composable concern-level functions before they become giant.
6. Keep a single centralized API error envelope.
7. Permission/auth wrappers should be reusable decorators, not repeated inline logic.
