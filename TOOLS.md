# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## ⚠️ Rules

### Ask Before Installing
Always ask Luisan before installing anything — Homebrew, npm, pip, curl, etc. Security first.

### Browser
Use **Brave**, not Chrome. Brave is the default browser with all cookies/sessions.

### Basecamp Posting
When posting to Basecamp:
- **Default:** Save as draft OR publish with only Luisan notified
- **Never** auto-notify the whole team
- Luisan will add people to notify later
- Use `status: "draft"` or remove all subscribers except Luisan's ID
- **Luisan's Basecamp ID:** 47257318

---

## PuenteSat Dev

⚠️ **Always use dev database locally!**
Bun's hot reload burns through database connections. Don't kill production connections for real users.

---

### Shared Memory Repo Workflow (Teiny + TeinyVPS)
For `teiny-brain` / memory repo changes:
- **Always `git pull --rebase` before starting work**
- Commit locally
- Push after changes
- If push rejects, rebase first, then push

This avoids soul/memory drift between local and VPS agents.

---

## What Goes Here

### SSH
- `hetzner` host pinned to `~/.ssh/teinyvps` with `IdentitiesOnly yes` to avoid 1Password agent stalls.

### Repos
- Puentesat repo: /Trabajo/Fluxio/code

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
