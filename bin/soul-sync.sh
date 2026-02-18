#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/luisan/.openclaw/workspace"
cd "$ROOT"

echo "[soul-sync] pull/rebase"
git pull --rebase

# Commit SOUL.md if changed
if git status --porcelain | grep -q "SOUL.md"; then
  echo "[soul-sync] commit SOUL.md"
  git add SOUL.md
  git commit -m "soul update"
else
  echo "[soul-sync] no SOUL.md changes"
fi

echo "[soul-sync] push"
git push
