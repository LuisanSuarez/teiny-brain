#!/usr/bin/env bash
set -euo pipefail

TS_BIN="/opt/homebrew/bin/tailscale"

if ! command -v "$TS_BIN" >/dev/null 2>&1; then
  exit 0
fi

# If not connected, bring it up
if ! "$TS_BIN" status >/dev/null 2>&1; then
  "$TS_BIN" up --accept-routes=false --accept-dns=false || true
fi
