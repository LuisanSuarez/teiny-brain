# CODE_STYLE.md — Shared Code Style Guide

*Applies to all TypeScript projects. These are patterns we've agreed on through real code, not theoretical best practices.*

*Last updated: 2026-02-22*

---

## 1. Context Object Pattern (Orchestrators)

When a function orchestrates multiple steps that share state, use a typed context object instead of threading parameters.

**Build it once. Pass it everywhere. Never mutate it.**

```ts
// ✅ Reads like English
const ctx = await prepareContext(params);
const stored = await persistData(ctx);
await learnFromInput(ctx, stored.processedRows);
const results = await submitToProvider(ctx, stored.groups);
await recordOutcome(ctx, results);
return buildResponse(ctx, stored, results);

// ❌ Parameter soup
const results = await submitToProvider(connection, invoices, invoiceMap, submissionId, source, forceIds);
await recordOutcome(connection, submissionId, results, forceIds);
```

**Rules:**
- Context is **immutable after creation** — steps never mutate it
- Build it in a single `prepare*` function at the top of the orchestrator
- Steps take `ctx` as first arg + their own step-specific inputs
- Step outputs flow forward explicitly (not hidden in ctx)
- The orchestrator function should read as a flat list of named steps
- Keep context type flat and focused — if it grows past ~10 fields, the orchestration is doing too much

**When to use:** Multi-step orchestration with 4+ shared values.
**When not to use:** Simple functions with 1-2 params, or heavily branching logic where different paths need different context shapes.

**Origin:** `create-submission.ts` in PuenteSAT — `SubmissionContext` + `handleCreateSubmission`.

---

## 2. Type File Discipline

Type files should stay under ~100 lines. When they grow past that, split by domain.

```
// ❌ One 250-line junk drawer
quickbooks.types.ts

// ✅ Split by concern
qb-api.types.ts        — raw QB request/response shapes
submission.types.ts     — domain submission types
attachment.types.ts     — attachment job types
```

**Rules:**
- One domain per type file
- Re-exports are fine for barrel files, but the source file should be focused
- Error classes go in their own file or with the domain they serve
- Shared API DTOs live in `packages/shared/types/` — domain internals stay backend-only

---

## 3. No Semantic Lies in Naming

Names must reflect what they hold, not what they historically held.

```ts
// ❌ vendorRef that sometimes means customer
vendorRef: string;

// ✅ Name reflects the actual domain
entityRef: string;       // when it can be vendor OR customer
customerRef: string;     // when it's always a customer
```

If a rename touches many files, that's a sign the concept is foundational — do it early, not later. Semantic lies compound.

---

## 4. Adapter Classes Stay Thin

When using a base adapter class (template method pattern), keep subclasses under ~50 lines.

```ts
// ✅ Subclass is just wiring
class QBOInvoiceAdapter extends QBDocumentAdapter<QBInvoiceLine, QBInvoicePayload> {
  protected readonly missingRefError = 'Missing customer reference';
  protected formatLine(line, adapter) { return formatInvoiceLine(line, adapter); }
  protected assemblePayload(attrs, lines, taxCalc) { /* ~10 lines */ }
}
```

**Rules:**
- Business logic lives in standalone functions (`formatInvoiceLine`), not in the class
- The class wires things together — it doesn't compute
- If a subclass needs >50 lines, extract logic into functions it calls

---

## 5. One Responsibility Per Hook (Frontend)

React hooks should do one thing. If a hook takes >5 parameters, it's probably a god-hook.

```ts
// ❌ God-hook with mode switches
useXMLConverterState(mode, sendAsBundle, bundleVendorRef, documentType)

// ✅ Compose smaller hooks
const upload = useInvoiceUpload({ api, mode, documentType });
const submission = useInvoiceSubmission({ api, items, mode });
const qbData = useQuickBooksData({ api, connectionId });
```

**Rules:**
- One exported hook per file
- Prefer composition of small hooks over one mega-hook
- If a hook returns >8 values, consider splitting it
- Parameters should be a single options object when there are 3+

---

## 6. Declarative Over Imperative

Avoid inlining logic. Name your operations.

```ts
// ❌ What does this do?
const ids = lines.filter(l => !seen.has(l.invoiceId) && (seen.add(l.invoiceId), true)).map(l => l.invoiceId);

// ✅ Named and clear
const uniqueInvoiceIds = getUniqueInvoiceIds(lines);
```

**Rules:**
- No logic in loops — extract to named functions
- Complex `.reduce()` calls should be named functions
- `useMemo` with complex computation → extract the computation into a named function
- One exported component per file

---

## 7. Module Boundaries

External services are named by **capability**, not vendor.

```
// ❌ Vendor-named
external/resend/
external/openai/

// ✅ Capability-named
external/email/
external/ai/
external/storage/
```

Internal files may reference the vendor, but the folder and barrel export must be vendor-agnostic.

**Data flow:**
- Routes → Actions → Repositories → Database
- Provider adapters must **not** import DB code
- Stores must **not** be used in routes
- Provider types must **not** leak outside adapters

---

## 8. Strategy Injection Over Internal Branching

When an orchestrator needs to support multiple modes (bill vs invoice, XML vs XLS), inject the varying behavior as a function parameter.

```ts
// ✅ Strategy injection — clean, testable
export async function handleCreateSubmission(params, submitToQB: SubmitToQB) { ... }

// Thin wrappers per document type
export async function handleCreateInvoiceSubmission(...) {
  return handleCreateSubmission({ ...params, documentType: 'invoice' }, submitInvoicesToQB);
}

// ❌ Internal branching — grows into a mess
if (documentType === 'invoice') { ... } else { ... }
```

**When to use:** When the orchestration steps are the same but one or more steps have different implementations per mode.

---

## 9. Function Naming — No `handle*` or `process*`

These prefixes communicate nothing. Name functions by what they actually do.

```ts
// ❌ Vague
handleSubmission(data)
processLines(lines)

// ✅ Says what it does
createSubmission(data)
categorizeLines(lines)
postBillsToQuickBooks(groups)
```

Pick a verb that describes the action. If you can't name it clearly, the function is probably doing too much.

---

## 10. No Inline Functions in Loops

Every function inside a loop must be named and extracted.

```ts
// ❌ Inline logic in loop
for (const line of lines) {
  const tax = line.taxAmount != null ? line.taxAmount * 1.12 : 0;
  // ... more logic
}

// ✅ Named function
const computeTax = (line: Line): number =>
  line.taxAmount != null ? line.taxAmount * 1.12 : 0;

for (const line of lines) {
  const tax = computeTax(line);
}
```

Same applies to `.map()`, `.filter()`, `.reduce()` callbacks when they have logic beyond a simple property access.

---

## 11. Functions Stay Under 20 Lines

If a function exceeds 20 lines, break it up. Extract steps into named functions.

This forces clarity — each function does one thing, and the parent function reads as a sequence of named steps (see Context Object Pattern).

**Exceptions:** Type definitions, switch statements with many cases, and test setup can exceed this if splitting would hurt readability. Use judgment.

---

## 12. Verify After Every Change — Three Checks

After every change, run all three:

1. **`bun run test`** — unit tests pass
2. **`npx tsc --noEmit`** — type checking passes
3. **`bun run dev`** — server actually starts (catches runtime import errors, missing env vars, circular deps)

Tests and TS check alone are not enough. They mock imports and skip runtime resolution. Only `bun run dev` catches real import chain failures.

---

## 13. Zero Lint and TypeScript Errors

Never allow lint or TS errors to accumulate. If we let errors slide "temporarily," they become noise and we stop reading them.

**After every change:**
- Run `bun run typecheck` (or `tsc --noEmit`)
- Run the linter
- Fix errors properly — don't hack around them with `@ts-ignore` or `eslint-disable`

**If a rule is genuinely wrong for the codebase**, change the rule in config. Don't suppress it inline.

---

## 14. Drizzle-Kit Migrations — Always Register in the Journal

When writing hand-crafted SQL migrations for Drizzle:

1. Create the SQL file in `drizzle/` (e.g., `0013_my_migration.sql`)
2. **Also add an entry to `drizzle/meta/_journal.json`** — without this, drizzle-kit silently skips the file
3. Run `bun db:migrate` and verify the changes actually applied

```json
// drizzle/meta/_journal.json — add entry like:
{
  "idx": 13,
  "version": "7",
  "when": 1740249600000,
  "tag": "0013_my_migration",
  "breakpoints": true
}
```

**Why:** Drizzle-kit only executes migrations listed in `_journal.json`. A `.sql` file without a journal entry is invisible to the migrator — it runs "successfully" but does nothing.

**Alternative:** Use `drizzle-kit generate` to auto-generate migrations from schema changes. It handles the journal automatically. Hand-written SQL is only needed for things like `ALTER TABLE RENAME`.

**Origin:** PuenteSAT Phase 2 — bills → documents rename. Migration file existed but wasn't in journal, tables never renamed.

---

## Adding New Patterns

When we discover a pattern that works well in real code, add it here with:
1. The rule
2. A ✅/❌ example
3. Where it originated (file/project)

This is a living document. Update it as we learn.
