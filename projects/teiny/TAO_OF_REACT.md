# Tao of React

Date: 2026-02-24
Purpose: frontend-focused Maxims for clear UI architecture, predictable state, and maintainable component systems.

---

## Maxim R1 — Components Speak One Concern
**Rule:** A component must have one primary UI responsibility.

**Behavior it enforces:**
Prevents mega-components and improves reuse + testing.

---

## Maxim R2 — State Must Be Minimal
**Rule:** Never store derivable state.

**Behavior it enforces:**
Avoids state duplication and synchronization bugs.

---

## Maxim R3 — Data Flows Down, Events Flow Up
**Rule:** Use one-way data flow; no hidden shared mutable state between siblings.

**Behavior it enforces:**
Predictable rendering and easier debugging.

---

## Maxim R4 — Build Static First
**Rule:** Implement static UI shape before wiring interactions/state.

**Behavior it enforces:**
Separates layout clarity from behavior complexity.

---

## Maxim R5 — Lift State to the Smallest Common Owner
**Rule:** State belongs to the nearest common parent that needs it.

**Behavior it enforces:**
Reduces prop drilling chaos and accidental global state.

---

## Maxim R6 — No Domain Logic in Components
**Rule:** Components may format and orchestrate UI, but business policy lives in hooks/services.

**Behavior it enforces:**
Prevents UI files from becoming decision engines.

---

## Maxim R7 — Hooks Are Behavior Modules
**Rule:** Complex behavior goes into custom hooks, not inline component bodies.

**Behavior it enforces:**
Reusable behavior and cleaner render functions.

---

## Maxim R8 — Async UI Needs Explicit States
**Rule:** Every async view must model: loading, success, error, and empty states.

**Behavior it enforces:**
No ambiguous UI behavior under network variance.

---

## Maxim R9 — Effects Are for Side Effects Only
**Rule:** `useEffect` should not compute pure derived values.

**Behavior it enforces:**
Eliminates stale effect bugs and unnecessary re-renders.

---

## Maxim R10 — Form State Is Boundary State
**Rule:** Validate form input at submit boundaries; avoid scattered field checks in random components.

**Behavior it enforces:**
Consistent UX and cleaner validation architecture.

---

## Maxim R11 — No Anonymous Handlers in Large Lists
**Rule:** Extract handlers when rendering large collections.

**Behavior it enforces:**
Improves readability and performance predictability.

---

## Maxim R12 — UI Errors Use a Standard Envelope
**Rule:** UI error display logic consumes a shared error shape (`code/message/context`).

**Behavior it enforces:**
Consistent failure UX across features.

---

## Maxim R13 — Framework Test (Frontend)
**Rule:** Vendor APIs (analytics, monitoring, feature flags, fetch clients) are imported through local wrappers only.

**Behavior it enforces:**
Swapping a library touches one adapter, not the whole frontend.

---

## Maxim R14 — No Junk Drawer Components
**Rule:** Ban generic folders/files like `misc/`, `common-ui/` dumping without explicit feature ownership.

**Behavior it enforces:**
Preserves discoverability and domain clarity.

---

## Maxim R15 — Name UI by User Intent
**Rule:** Component/hook names should describe user intent, not implementation details.

**Behavior it enforces:**
Improves product-language alignment in code.
