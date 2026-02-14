# HEARTBEAT.md

## Overnight Execution Update (active)
While sales-invoice overnight work is in progress, send a **short progress update every heartbeat** (1-2 lines) instead of HEARTBEAT_OK.
Focus update on: what was completed since last heartbeat and what's next.

## Task Reminders
On heartbeat, check `projects/kanban/data.json` for tasks with due dates:
- **1 week before**: Gentle reminder ("X is coming up next week")
- **1 day before**: Nudge ("X is due tomorrow!")  
- **Day of**: Alert ("X is due today!")

Track which reminders you've sent in `memory/reminder-state.json` to avoid spamming.
Format: `{"taskId": {"1week": true, "1day": true, "dayof": true}}`

Only remind once per milestone. If they say "not yet", note it and remind next day.

## Reminder Logic
```
For each task with dueDate:
  - Calculate days until due
  - If 7 days and not reminded: remind + mark 1week
  - If 1 day and not reminded: remind + mark 1day  
  - If 0 days (today) and not reminded: remind + mark dayof
  - If overdue: include in daily summary (don't spam per heartbeat)
```
