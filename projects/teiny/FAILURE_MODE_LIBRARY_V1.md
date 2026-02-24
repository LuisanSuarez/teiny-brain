# Failure Mode Library v1

High-frequency bug classes + prevention checks for Teiny coding work.

---

## 1) State & Data Bugs

### Race conditions
- Symptom: intermittent wrong results, "works on my machine"
- Prevention: identify shared mutable state; use locks/queues/idempotency keys
- Check: "Can two requests hit this at once?"

### Stale cache
- Symptom: user sees old data after update
- Prevention: explicit cache invalidation strategy; TTLs
- Check: "What invalidates this cache?"

### N+1 queries
- Symptom: slow page loads, DB spikes
- Prevention: eager loading, query batching
- Check: "Am I querying inside a loop?"

---

## 2) Boundary & Integration Bugs

### Unchecked external input
- Symptom: crashes, injection, weird edge cases
- Prevention: validate/sanitize at every boundary (Zod-style)
- Check: "What if this input is garbage?"

### Silent API failures
- Symptom: data loss, ghost errors
- Prevention: explicit error handling, alerts on unexpected responses
- Check: "What happens if this external call fails?"

### Schema drift
- Symptom: runtime type errors, broken integrations
- Prevention: contract tests, generated types from source
- Check: "Is schema source-of-truth synced?"

---

## 3) Deployment & Rollout Bugs

### Irreversible migrations
- Symptom: can't rollback, data loss
- Prevention: two-phase migrations, backfill scripts
- Check: "Can I undo this in 10 minutes?"

### Feature flag leaks
- Symptom: users see half-baked features
- Prevention: explicit flag checks at entry points, cleanup old flags
- Check: "Is this flag checked everywhere it matters?"

### Config drift
- Symptom: works in staging, breaks in prod
- Prevention: environment parity checks, config validation on boot
- Check: "Are prod configs verified?"

---

## 4) UX & Feedback Bugs

### Silent failures
- Symptom: user doesn't know something went wrong
- Prevention: explicit error states, toast/alert on failure
- Check: "What does the user see if this fails?"

### Misleading success
- Symptom: user thinks action worked, but it didn't
- Prevention: confirm actual backend state before success message
- Check: "Am I showing success before confirmation?"

### Infinite spinners
- Symptom: stuck UI, user rage-refreshes
- Prevention: timeouts, error states, retry affordances
- Check: "What's the max wait before fallback?"

---

## 5) Security & Trust Bugs

### Broken access control
- Symptom: users see/do things they shouldn't
- Prevention: authorization checks at data layer, not just UI
- Check: "Can a malicious user bypass this?"

### Secrets in logs/errors
- Symptom: leaked credentials, PII exposure
- Prevention: scrub logs, audit error payloads
- Check: "What gets logged if this fails?"

### Unvalidated redirects
- Symptom: phishing vectors
- Prevention: allowlist redirect targets
- Check: "Can an attacker control this URL?"

---

## Quick pre-ship scan (5 questions)
1. What's the worst thing that happens if this fails?
2. How will I know it failed in prod?
3. Can I roll back in 10 minutes?
4. What does the user see on error?
5. Did I check auth at the data layer?

---

## Confidence
- Confidence: High (these are the classics)
- Living doc: add new failure modes as they're discovered
