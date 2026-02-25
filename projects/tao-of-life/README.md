# Tao of Life (v1.1)

A calm, local-first web app to write and review personal maxims.

## Features
- Create, edit, delete maxims
- Mark **Favorite today**
- Mark **Lived today**
- Focus mode (single-card meditation)
- Prev/next card navigation
- Random card mode
- Chaos Oracle prompt button (fun wild reflection prompts)
- Spice levels (calm / zesty / feral)
- Expand/hide note (default hidden)
- Hide UI chrome for deeper meditation
- Sync phrase helper tools (generate/save/copy/email)
- Export/import data pack for cross-device transfer
- Keyboard shortcuts in focus mode:
  - `←` / `→` navigate cards
  - `Space` toggle note
  - `C` hide/show chrome
  - `R` random card
  - `O` oracle prompt
  - `S` spice level
- Before-bed mode
- Local storage persistence (no backend)
- Seed maxims included

## Run locally
```bash
cd /Users/luisan/.openclaw/workspace/projects/tao-of-life
python3 -m http.server 8787
```
Open: http://localhost:8787

## Stack
- Plain HTML/CSS/JS (zero install)
- localStorage for persistence

## Next (v2)
- Tags/categories
- Daily review streak
- Export/import (JSON)
- Passcode lock for private notes
