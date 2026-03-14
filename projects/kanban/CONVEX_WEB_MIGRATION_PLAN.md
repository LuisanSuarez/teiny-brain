# Taskboard Convex + Web Migration Plan (No Frontend Framework)

Status: Draft for fast execution
Target: first online release in ~2 hours

## Locked decisions
- Convex from day 1 (DB + backend logic + realtime sync)
- Keep web app first (desktop + mobile browser)
- Native app later
- No frontend framework right now
- Scope is migration + online access, not new features
- Deploy on Vercel

## Current feature baseline to preserve
- Board columns (Today, Teiny, Recurrente, Recurrente Accounting, PuenteSat, Tributax, Personal)
- Add/edit/delete task
- Reorder in column
- Move between columns
- Due date rendering
- Mark done behavior
- Keyboard shortcuts in board
- Checklist tab with card previews
- Checklist detail view

## V1 architecture
- Frontend: static HTML/CSS/JS (existing `app.html`, split JS if helpful)
- Data/backend: Convex (`tasks`, `checklists`, lightweight settings)
- Hosting: Vercel static deployment
- Realtime: Convex subscriptions where trivial; otherwise poll fallback

## Data model (Convex)

### `tasks`
- `_id`
- `title: string`
- `desc?: string`
- `column: string` (enum of existing columns)
- `priority: "high" | "medium" | "low"`
- `dueDate?: string`
- `createdAt: number`
- `updatedAt: number`
- `lastTouchedAt: number`
- `completedAt?: number`
- `fromColumn?: string`

### `checklists`
- `_id`
- `group: string` (from `##` section)
- `title: string` (from `###` section)
- `description?: string`
- `items: string[]`
- `orderKey: number`
- `updatedAt: number`

### `settings` (optional, tiny)
- `_id`
- `key: string`
- `value: any`

## API/function map (Convex)

### Queries
- `tasks:listByColumn()`
- `tasks:listAll()`
- `checklists:listCards()`
- `checklists:getById(id)`

### Mutations
- `tasks:create(taskInput)`
- `tasks:update(id, patch)`
- `tasks:delete(id)`
- `tasks:move({id, toColumn, toIndex?})`
- `tasks:reorder({column, orderedIds})`
- `tasks:markDone(id)`
- `checklists:replaceAll(cards)` (bulk upsert for migration)

## Migration approach (fast, safe)
1. Export current `data.json` tasks into Convex `tasks`.
2. Parse `docs/workflows/checklists.md` and import into Convex `checklists`.
3. Keep local JSON files as backup for rollback.
4. Switch frontend fetch layer from local `/data` and `/checklists` to Convex functions.

## 2-hour execution checklist

### 0:00–0:20 — Convex bootstrap
- Initialize Convex project in `projects/kanban`
- Define schema (`tasks`, `checklists`)
- Add base queries/mutations

### 0:20–0:45 — Data import
- Script: `data.json` -> `tasks`
- Script: `checklists.md` -> `checklists`
- Verify counts match source

### 0:45–1:20 — Frontend wiring
- Replace local fetch calls with Convex client calls
- Keep existing UI behavior unchanged
- Preserve keyboard and checklist-detail behavior

### 1:20–1:40 — Vercel deploy
- Deploy static app
- Configure env vars for Convex URL
- Verify public URL

### 1:40–2:00 — Smoke test
- Add/edit/delete task
- Move/reorder task
- Mark done
- Open checklist cards and details
- Open from phone browser + desktop simultaneously

## Out of scope (explicit)
- React Native implementation
- New product features (stale badges, new flows)
- Advanced auth hardening
- Offline mode

## Risks + mitigations
- Risk: minor behavior drift during data layer swap
  - Mitigation: strict smoke checklist + keep UI untouched
- Risk: migration misses a field
  - Mitigation: run pre/post counts + sample compare
- Risk: realtime complexity
  - Mitigation: use live updates only where trivial; fallback to simple refresh/poll

## Security for this v1
- You allowed no password initially.
- If exposed publicly, add basic protection next pass (shared secret gate or Vercel protection).

## Deliverables
- Public Vercel URL
- Convex-backed taskboard with same current features
- Migration scripts saved in repo for repeatability
- Quick runbook update with deploy steps
