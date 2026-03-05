# Tao of Data Modeling

Date: 2026-03-01
Purpose: hard laws for schema/domain modeling decisions.

---

## Maxim D1 — Model Domain Concepts, Not Delivery Shortcuts
**Law:** If data has an independent business meaning, create an entity/table for it.

---

## Maxim D2 — Prefix Pair Triggers Design Review
**Law:** Adding **2+ columns with the same prefix** (`payment_*`, `invoice_*`, `kyc_*`) to an existing table requires explicit split-vs-inline review.

---

## Maxim D3 — Prefix Triple Defaults to Split
**Law:** Adding **3+ same-prefix columns** means create a new table + FK by default.

**Exception:** Keep inline only with explicit PR rationale.

---

## Maxim D4 — Null-Cluster Means Wrong Boundary
**Law:** If a new column cluster is null for many rows, the concept is in the wrong table. Split it.

---

## Maxim D5 — Inline Only If All Four Tests Pass
**Law:** Keep fields in the parent table only if all are true:
1. Same lifecycle (created/updated/deleted together)
2. Same cardinality (truly 1:1)
3. Same query boundary (usually fetched together)
4. No independent status/workflow/history

If any test fails, split.

---

## Maxim D6 — Model Cardinality Explicitly
**Law:** Model 1:N and N:N with tables. Never fake multiplicity with repeated prefixed columns.

---

## Maxim D7 — Name for Domain, Not Vendor Payload
**Law:** Table/column names must express domain meaning, not temporary API/provider shapes.

---

## Maxim D8 — Exceptions Must Be Written
**Law:** Any exception to D3 or D4 must be documented in PR notes (short ADR-style rationale).

---

## Review Checklist (required on schema changes)
- Did we add 2+ same-prefix columns?
- Did we introduce a null-cluster?
- If we kept inline, is the rationale written?
