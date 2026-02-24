# TanStack Query Deep Briefing (Run 3, Project 1/5)

Date: 2026-02-24
Audience: "I’m about to start working in this codebase tomorrow"
Focus: architecture + execution flow + where to edit safely + what to avoid

---

## 0) Executive mental model (the 30-second version)

TanStack Query is split into:
1. **Framework-agnostic core** (`packages/query-core`) — cache, query state machine, retries, observers.
2. **Framework adapter** (`packages/react-query`) — React hooks and subscription glue.

If you remember one thing:
- **`Query` is the state machine** for one key.
- **`QueryCache` is the registry** of all queries.
- **`QueryObserver` is the per-consumer lens** (derived result + subscriptions).
- **`QueryClient` is the orchestrator API** you touch from app code.
- React hooks are mostly a thin adapter around Observer + external store subscription.

---

## 1) Monorepo shape (what matters for coding)

- `packages/query-core/src/*` → the engine.
- `packages/react-query/src/*` → React bindings.

Key files to know first:
- `query-core/src/queryClient.ts`
- `query-core/src/queryCache.ts`
- `query-core/src/query.ts`
- `query-core/src/queryObserver.ts`
- `query-core/src/retryer.ts`
- `react-query/src/useBaseQuery.ts`
- `react-query/src/QueryClientProvider.tsx`

---

## 2) End-to-end runtime flow (from `useQuery` to rendered data)

### Step A — Hook bootstraps observer (React layer)
In `useBaseQuery.ts`, the hook:
1. resolves default options
2. creates a `QueryObserver`
3. gets an optimistic result immediately
4. subscribes via `useSyncExternalStore`

Snippet:
```ts
const [observer] = React.useState(
  () => new Observer(client, defaultedOptions),
)
const result = observer.getOptimisticResult(defaultedOptions)
React.useSyncExternalStore(
  (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
  () => observer.getCurrentResult(),
  () => observer.getCurrentResult(),
)
```
Why this matters: it guarantees React-consistent subscriptions and avoids stale snapshots.

### Step B — Observer resolves/creates query in cache
`QueryObserver` points to a `Query` (same key -> shared cache entry).
If needed it triggers fetch (`shouldFetchOnMount`, option changes, timers).

### Step C — Query executes fetch state machine
In `query.ts#fetch()`:
- handles refetch cancellation/continuation semantics
- builds `AbortController`
- creates fetch context
- runs retry loop via `createRetryer`
- dispatches reducer actions (`fetch`, `success`, `error`, etc.)

Snippet:
```ts
this.#retryer = createRetryer({
  fn: context.fetchFn,
  onFail: (failureCount, error) => this.#dispatch({ type: 'failed', failureCount, error }),
  onPause: () => this.#dispatch({ type: 'pause' }),
  onContinue: () => this.#dispatch({ type: 'continue' }),
  retry: context.options.retry,
  retryDelay: context.options.retryDelay,
})
```

### Step D — State update and fan-out notifications
`#dispatch()` mutates state through reducer and then batch-notifies:
1. all observers (`observer.onQueryUpdate()`)
2. query cache listeners (`queryCache.notify`)

That batched notify is critical to avoid render storms.

---

## 3) Core components in practical terms

## `QueryClient` (orchestrator)
File: `query-core/src/queryClient.ts`

Responsibilities:
- holds caches (`QueryCache`, `MutationCache`)
- default options and key-specific defaults
- imperative API (`getQueryData`, `setQueryData`, `invalidateQueries`, etc.)
- wires focus/online events on `mount()`

Snippet:
```ts
this.#unsubscribeFocus = focusManager.subscribe(async (focused) => {
  if (focused) {
    await this.resumePausedMutations()
    this.#queryCache.onFocus()
  }
})
```
Interpretation: app lifecycle events are centralized in client; queries don’t directly listen to window events.

## `QueryCache` (registry)
File: `query-core/src/queryCache.ts`

Responsibilities:
- dedupe by `queryHash`
- create on demand (`build`)
- store/remove/find queries
- emit cache events

Snippet:
```ts
const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options)
let query = this.get(queryHash)
if (!query) {
  query = new Query({ ... })
  this.add(query)
}
```
Interpretation: query identity is hash + options; consistency of keying is everything.

## `Query` (single-query state machine)
File: `query-core/src/query.ts`

Responsibilities:
- canonical query state
- fetch/retry/pause/cancel lifecycle
- reducer transitions
- GC scheduling via `Removable`

Reducer actions you’ll see constantly:
- `fetch`, `success`, `error`, `failed`, `pause`, `continue`, `invalidate`, `setState`.

Important behavior:
- if fetch is cancelled with `revert`, it can roll back to pre-fetch state.
- background error with existing data marks query invalidated (keeps stale data usable).

## `QueryObserver` (consumer-specific derived view)
File: `query-core/src/queryObserver.ts`

Responsibilities:
- subscribe/unsubscribe lifecycle
- convert QueryState -> QueryObserverResult
- option change handling + conditional refetch
- stale/refetch timers
- property tracking optimization

This is the “adapter” from core state machine to hook-friendly result shape.

## `retryer` (retry/online/focus gate)
File: `query-core/src/retryer.ts`

Responsibilities:
- retry loop + backoff
- pause when offline/unfocused
- continue when conditions recover
- cancellation primitive

Default retry delay:
```ts
Math.min(1000 * 2 ** failureCount, 30000)
```

---

## 4) Why this design scales

1. **Decoupled architecture**: cache/state machine independent from React.
2. **Observer pattern**: many consumers, one source of truth.
3. **Batched notifications**: performance guardrail.
4. **Lifecycle-aware retries**: resilient in flaky network/browser context.
5. **Config-driven behavior**: same primitives power many frameworks.

---

## 5) Where you should edit (and where not) if contributing

Safe-ish zones for targeted contributions:
- React hook behavior: `packages/react-query/src/*`
- Option defaults and ergonomic behavior: `queryClient.ts`, `queryObserver.ts`
- Retry policy improvements: `retryer.ts`
- Specific state transitions: `query.ts` reducer (high caution)

High-risk zones:
- Query identity/hashing logic
- dispatch/notify ordering
- observer subscription semantics
- retry cancellation + revert behavior

Rule: anything touching fetch lifecycle or observer notifications needs very strong tests.

---

## 6) What I like most (for our own coding standards)

1. Clear separation of engine vs adapter.
2. Explicit state transitions (not hidden side effects).
3. Retry and pause logic centralized (not scattered).
4. Defensive runtime checks in dev mode.

Snippet (clean provider contract):
```tsx
if (!client) {
  throw new Error('No QueryClient set, use QueryClientProvider to set one')
}
```
Small but excellent: fail fast with precise guidance.

---

## 7) What I would NOT copy into normal product code

1. Heavy overload/type machinery used for library-level DX.
2. Extremely broad option surfaces unless truly needed.
3. Internal complexity that exists mainly for backwards compatibility.

Example of “library complexity, not app complexity”:
```ts
export function queryOptions<...>(...): ...
export function queryOptions<...>(...): ...
export function queryOptions<...>(...): ...
export function queryOptions(options: unknown) { return options }
```
This is valid for public API ergonomics, but overkill for internal app services.

---

## 8) If you gave me my first TanStack Query task tomorrow

I’d follow this execution order:
1. Reproduce with a small test in target package (`query-core` or `react-query`).
2. Trace call path:
   - `useBaseQuery` -> `QueryObserver` -> `Query.fetch` -> `#dispatch` -> `observer.onQueryUpdate`.
3. Identify whether issue is:
   - options resolution,
   - fetch lifecycle/retry,
   - observer result derivation,
   - subscription timing.
4. Patch smallest layer possible.
5. Add regression test for the exact broken lifecycle edge.

---

## 9) Practical "brief me to start coding" checklist

Before coding:
- Confirm package (`query-core` vs `react-query`).
- Read corresponding tests first.
- Map expected lifecycle transitions.

During coding:
- Preserve notify batching.
- Preserve cancellation semantics.
- Preserve query identity/hash assumptions.

Before PR:
- Run relevant Nx/Vitest tests from repo root.
- Verify no behavior regressions in suspense/error boundary paths.
- Add a short rationale comment for non-obvious lifecycle behavior.

---

## 10) Contribution commands (from repo guidance)

- Install + setup: `pnpm install`
- Build all: `pnpm build:all`
- Watch mode: `pnpm run watch`
- Test package from root (Nx):
  - `npx nx run @tanstack/react-query:test:lib`
  - `npx nx run @tanstack/query-core:test:lib`

---

## Final assessment for our learning goal

TanStack Query is a **high-value study target** for:
- state machine design,
- observer-based architecture,
- robust async lifecycle handling,
- practical separation of framework adapter vs core engine.

For our own coding standards, copy the **architectural patterns** and **runtime discipline**, not the full type-overload intensity.
