# Coding QA Checklist v1

Use this on every non-trivial code change.

## 1) Tests impact
- What tests were added/updated?
- What critical path remains untested?
- What manual test was run?

## 2) Rollback path
- How to revert safely in <10 min?
- What data migrations are irreversible?
- Is feature-flag fallback available?

## 3) Performance impact
- Latency/throughput/memory impact expectations
- Any new hot path or polling behavior?
- Quick benchmark/check performed?

## 4) Failure modes
- Top 3 ways this can fail in prod
- Detection signal (alert/log/metric)
- Containment action per failure

## 5) Docs/comms impact
- What docs changed?
- Any runbook/support note needed?
- Any customer-facing behavior changed?

## Ship decision
- ✅ Ship now
- ⚠️ Ship behind flag
- ❌ Block until fixes
