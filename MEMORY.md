# MEMORY.md - Teiny's Long-Term Memory

*Last updated: 2026-02-13*

---

## About Luisan

- Prefers chill, casual communication — no corporate speak
- Has a son named Simon
- Timezone: America/Guatemala (CST)
- Works across 3 projects with Recurrente being the busiest (day job)
- **Life stage:** "Convert knowledge into leverage" phase — processing bottleneck, not input deficit
- **Decompression is valid** — don't need to optimize every moment; recovery matters
- See `memory/luisan-books-decompression.md` for book recs & context

---

## Projects Overview

### Recurrente (Day Job) 🔥
- Payment processing / Payfac in Guatemala
- Luisan handles: fraud prevention, chargebacks, payment operations
- High demand on time

### Tributax (Startup)
- Accounting contractors platform in Guatemala
- Luisan is Co-founder & CTO
- **Feb 2026:** Major codebase refactor in progress (Opus handling it — large codebase)
- **Check-in pattern:** Ask about refactor progress on weekends

### PuenteSat (Side Project) 💜
- Parser for SAT invoice data → bulk upload to QuickBooks
- Goal: Grow enough to eventually go full-time
- **Feb 2026:** Big architecture refactor completed
  - Verb-noun file structure with separated controller routes
  - Logic moved into models
  - Now supports: bundled invoices (evolved from viáticos), custom columns, XLS uploads, unlock repeated invoices, remove invoices from batch

---

## Key Decisions & Context

### PuenteSat Architecture (Feb 2026)
- Refactored to verb-noun controllers + models
- "Viáticos" feature became generic "bundled invoice" feature
- Client meeting on Feb 6 drove feature priorities

---

## People & Contacts

*(Add as I learn them)*

---

## Preferences & Patterns

- Brave browser (not Chrome) — has all cookies/sessions
- Ask before installing anything (Homebrew, npm, pip, etc.)
- Basecamp: Always save as draft or notify only Luisan (ID: 47257318)
- Prefers a lean, low-token setup when usage is low; disable non-essential daily automations if they’re not being used.
- For coding while mobile/on-the-fly: default to **single-agent, milestone-only updates, no raw terminal log dumps**, and concise review output.
- Wants proactive warnings when a workflow is likely to burn many tokens (e.g., parallel agents, frequent polling, verbose logs).
- **Checklist-first workflow:** checklists are a core operating preference and should be surfaced proactively in planning/execution conversations.
- **Weekly rhythm preference (Mar 2026):** reserve Wednesday afternoons for side projects + outreach (Tributax/PuenteSat), with Recurrente paused unless urgent.
- Canonical checklist library: `/Users/luisan/.openclaw/workspace/docs/workflows/checklists.md`.
- Taskboard source of truth is the online board: `https://taskboard-kappa.vercel.app/` (not local kanban files).
- Treat the taskboard as the default main task force/execution hub.
- Taskboard repo/location on disk: `/Users/luisan/Trabajo/taskboard`.
- **Recurring reliability issue:** avoid getting stuck on interactive CLI prompts. Use `/Users/luisan/.openclaw/workspace/docs/runbooks/cli-noninteractive-playbook.md` for deploy/auth/setup CLI flows.

---

## Lessons Learned

- **2026-02-13:** Environment is now running on a VPS. Workspace bootstrap + import from `teiny-brain` succeeded, and local git commit flow works.

---

- **2026-03-12 (corrected 2026-03-16):** Canonical workstation/control center is the online taskboard `https://taskboard-kappa.vercel.app/`; git repo on disk is `/Users/luisan/Trabajo/taskboard`. Treat this as default execution hub.
