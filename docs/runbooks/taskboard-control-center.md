# Taskboard Control Center

Canonical board URL: `https://taskboard-kappa.vercel.app/`
Taskboard repo on disk: `/Users/luisan/Trabajo/taskboard`

## Operating rule
This online taskboard is the shared control center/workstation for Luisan + Teiny and the **only source of truth** for tasks.
All task reads/writes happen on the live Convex/Vercel board.
Local JSON files/mirrors are not authoritative and must not be used for task operations.

## Board organization
- **Work Tasks** tab: active work, to-dos, and execution items.
- **Checklists** tab: checklist library cards with quick preview + click-to-expand details.

## Non-browser task creation (preferred for agent automation)
Use the repo script that writes directly to Convex, no browser needed.

From `/Users/luisan/Trabajo/taskboard`:

```bash
npm run task:add -- --column tributax --title "Verify Facebook event tracking works in production" --desc "Validate Meta/Facebook conversion events in prod with test evidence"
```

### Supported flags
- `--column` (required): `today|teiny|recurrente|recurrenteAccounting|puentesat|tributax|personal|done`
- `--title` (required)
- `--desc` (optional)
- `--priority` (optional): `high|medium|low` (default: `medium`)
- `--due` (optional): any parseable date/time (stored as ISO)

### Quick throwaway checklist creation (CLI)
From `/Users/luisan/Trabajo/taskboard`:

```bash
npm run checklist:quick:add -- --title "Today quick wins" --desc "Knock these out today" --item "Fix Vini request" --item "Reply WhatsApp"
```

Supported flags:
- `--title` (required)
- `--desc` (optional)
- `--item` (repeatable, one item per flag)
- `--items` (optional multiline string, newline-separated)

### Implementation location
- Task script: `/Users/luisan/Trabajo/taskboard/scripts/add-task.mjs`
- Throwaway checklist script: `/Users/luisan/Trabajo/taskboard/scripts/add-quick-checklist.mjs`
- NPM aliases in `/Users/luisan/Trabajo/taskboard/package.json`: `task:add`, `checklist:quick:add`

## Current checklist cards
- Recurrente pre-9:00 AM (Mon–Fri)
- OOO coverage
- PuenteSat feature build (minimal)
- PuenteSat publish (minimal)
- Bedtime winddown
- Morning body-basics
