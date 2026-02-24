# TanStack Query — Trace + Rewrite + Red Flags (Run 3B)

Date: 2026-02-24
Purpose: extract deeper, implementation-usable learning

---

## A) End-to-end Trace #1 — `useQuery` mount with no cached data

### Path
1. `react-query/src/useBaseQuery.ts`
2. `query-core/src/queryObserver.ts` (`onSubscribe`, `#executeFetch`)
3. `query-core/src/query.ts` (`fetch`, reducer dispatch)
4. notify fanout back through observer/cache

### Runtime sequence
1. Hook builds observer and optimistic result.
2. `useSyncExternalStore` subscribes.
3. `onSubscribe()` adds observer to query.
4. `shouldFetchOnMount()` returns true when enabled + no data.
5. `#executeFetch()` calls `query.fetch(...)`.
6. `Query.fetch()` dispatches `fetch`, runs retryer, awaits success.
7. On success: `setData` -> dispatch `success`.
8. `#dispatch()` batches observer updates + cache event.
9. Observer `onQueryUpdate()` recalculates result; React rerenders.

### Key snippet
```ts
// queryObserver.ts
protected onSubscribe(): void {
  if (this.listeners.size === 1) {
    this.#currentQuery.addObserver(this)
    if (shouldFetchOnMount(this.#currentQuery, this.options)) {
      this.#executeFetch()
    } else {
      this.updateResult()
    }
    this.#updateTimers()
  }
}
```
Why this matters: first subscriber controls initial fetch; subsequent subscribers share result.

---

## B) End-to-end Trace #2 — refetch while already fetching + cancellation semantics

### Path
1. `queryObserver.refetch()` -> `fetch()` -> `#executeFetch()`
2. `query.fetch()` early section checks existing in-flight retryer
3. branches based on `cancelRefetch` and data availability

### Runtime sequence
1. If query is already fetching and retryer not rejected:
   - if data exists and `cancelRefetch=true`: cancel silently and start new fetch path.
   - else: continue current retry and return existing promise.
2. Cancellation can be **silent** or **revert** depending on context.
3. AbortController is tied to retryer cancel callback.

### Key snippet
```ts
if (this.state.fetchStatus !== 'idle' && this.#retryer?.status() !== 'rejected') {
  if (this.state.data !== undefined && fetchOptions?.cancelRefetch) {
    this.cancel({ silent: true })
  } else if (this.#retryer) {
    this.#retryer.continueRetry()
    return this.#retryer.promise
  }
}
```
Why this matters: avoids duplicate fetch storms and encodes predictable refetch behavior.

---

## C) Teiny-style rewrites (same intent, lower complexity)

## Rewrite 1 — fail-fast context access
Original idea from `useQueryClient`.

```ts
// Teiny style
export function requireContext<T>(value: T | undefined, message: string): T {
  if (value === undefined) throw new Error(message)
  return value
}
```
Use in hooks/services to reduce repeated guard boilerplate.

## Rewrite 2 — explicit action reducer naming pattern
Inspired by `Query` reducer actions.

```ts
type FetchAction =
  | { type: 'fetch' }
  | { type: 'success'; data: unknown }
  | { type: 'error'; error: Error }
  | { type: 'invalidate' }

function reduce(state: State, action: FetchAction): State {
  switch (action.type) {
    case 'fetch': return { ...state, status: 'fetching' }
    case 'success': return { ...state, status: 'success', data: action.data }
    case 'error': return { ...state, status: 'error', error: action.error }
    case 'invalidate': return { ...state, invalidated: true }
  }
}
```
Intent kept: boring action verbs + deterministic transitions.

---

## D) Red flags (what not to copy directly)

1. **Type overload density**
- Great for library public API, costly for internal app code.

2. **Observer/proxy property tracking complexity**
- Powerful optimization, but easy to break and hard to maintain unless needed at scale.

3. **High-option-surface APIs**
- In product code, too many knobs create inconsistent behavior and cognitive load.

4. **Lifecycle subtlety without tests**
- cancellation + optimistic results + timers must be test-protected if adopted.

---

## E) Pattern scorecard

| Pattern | Readability | Reusability | Risk if copied wrong | Verdict |
|---|---:|---:|---:|---|
| Role-separated architecture (Client/Cache/Query/Observer) | 5 | 5 | 2 | Steal now |
| Plain reducer action verbs | 5 | 5 | 1 | Steal now |
| Batching notifications | 3 | 4 | 4 | Steal carefully |
| Retryer with pause/continue on offline/focus | 3 | 4 | 4 | Steal with tests |
| Type overload-heavy option builders | 2 | 2 | 3 | Avoid for app code |
| Proxy-based property tracking | 2 | 2 | 5 | Usually avoid |

---

## F) Concrete extraction for Teiny rules pipeline

Keep for future hard constraints:
1. Separate orchestration / registry / state machine / view adapter.
2. Use plain action verbs in state transitions.
3. Prefer fail-fast, actionable runtime errors.
4. Add cancellation semantics explicitly if doing concurrent fetches.
5. Don’t import library-level type gymnastics into product code.
