# Dub.co Skeptical Review Add-on

Date: 2026-02-24
Goal: stress-test value of our Dub study and extract hard, enforceable insights

---

## Verdict

Yes, we got real value — but we can still extract more by attacking maintainability hotspots.

Biggest finding:
- The architecture pattern is strong (thin route + domain + persistence + async side effects),
- but `process-link.ts` has clear signs of "policy accretion" that will eventually slow velocity.

---

## Top 3 maintainability risks (with concrete code evidence)

## 1) Policy accretion in one large function
File: `apps/web/lib/api/links/process-link.ts` (591 lines)

Evidence:
- URL checks, plan checks, domain ownership checks, key checks, tag checks, folder checks, program checks, webhook checks, expiration checks, and payload shaping all happen in one function.
- Also includes skip flags (`skipKeyChecks`, `skipExternalIdChecks`, `skipFolderChecks`, `skipProgramChecks`) that signal branching complexity.

Why risky:
- Hard to reason about interactions across checks.
- Hard to test branch coverage comprehensively.
- Easy to introduce regressions when adding new business rules.

---

## 2) Repeated error-return pattern increases drift risk
File: `process-link.ts`

Evidence pattern repeated dozens of times:
```ts
return {
  link: payload,
  error: "...",
  code: "unprocessable_entity",
};
```

Why risky:
- Inconsistent phrasing/status mapping can drift over time.
- Hard to ensure all branches carry equivalent metadata.
- Makes refactoring to structured error types harder later.

---

## 3) Side-effect fanout concentration can hide operational failure modes
File: `apps/web/lib/api/links/create-link.ts`

Evidence:
```ts
waitUntil(
  (async () => {
    await Promise.allSettled([
      linkCache.set(...),
      recordLink(...),
      storage.upload(...),
      prisma.link.update(...),
      updateLinksUsage(...),
      propagateWebhookTriggerChanges(...),
      scheduleABTestCompletion(...),
    ]);
  })(),
);
```

Why risky:
- Great for latency, but operational visibility can get murky.
- `allSettled` avoids failing request (good), but can bury side-effect failures if observability isn’t explicit per task.

---

## Refactor boundaries I’d apply (practical, incremental)

## Boundary 1 — Split `processLink` into policy modules
Suggested modules:
1. `policy/url-policy.ts`
2. `policy/plan-policy.ts`
3. `policy/domain-policy.ts`
4. `policy/key-policy.ts`
5. `policy/metadata-policy.ts` (tags/folders/program/webhooks)
6. `policy/expiry-policy.ts`
7. `policy/finalize-link.ts`

Orchestrator remains `processLink`, but each concern becomes testable in isolation.

## Boundary 2 — Introduce a typed PolicyResult helper
Instead of ad-hoc object literals everywhere:
```ts
type PolicyResult<T> = { ok: true; data: T } | { ok: false; code: ErrorCode; message: string }
```

And helper constructors:
- `ok(data)`
- `fail(code, message)`

## Boundary 3 — Group side effects into named tasks with explicit logging
In `create-link.ts`, split fanout into named functions:
- `cacheLinkTask`
- `recordAnalyticsTask`
- `uploadImageTask`
- `updateUsageTask`
- `webhookPropagationTask`
- `abTestSchedulingTask`

Then run through task runner that logs failures with task names.

---

## 3 hard constraints we can enforce now

1. **Policy function size constraint**
- No domain policy function above ~180 lines.
- If exceeded, split by concern module.

2. **Standardized policy return contract**
- All policy checks must return `PolicyResult` (`ok/fail`) — no ad-hoc error objects.

3. **Named side-effect tasks only**
- Background fanouts must call named task functions (no large inline arrays of anonymous operations).
- Each task failure must include task name in logs.

---

## Final skeptical assessment

Am I getting valuable insights from Dub? **Yes.**

Most valuable insight:
- Product-grade architecture is solid, and we can copy the flow.

Most important skepticism:
- Without constraints, policy modules become giant “everything functions.”

So the real value is not just what Dub does well — it’s also the maintainability guardrails we derive from where Dub is starting to strain.
