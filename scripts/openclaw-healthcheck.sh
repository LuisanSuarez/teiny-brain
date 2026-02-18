#!/usr/bin/env bash
set -euo pipefail

# Local checks (Mac)
TS_BIN="/opt/homebrew/bin/tailscale"
OC_BIN="/usr/local/bin/openclaw"

if command -v "$TS_BIN" >/dev/null 2>&1; then
  echo "[mac] tailscale status:" 
  "$TS_BIN" status || true
else
  echo "[mac] tailscale not installed"
fi

if command -v "$OC_BIN" >/dev/null 2>&1; then
  echo "[mac] openclaw node status:"
  "$OC_BIN" node status || true
else
  echo "[mac] openclaw not found"
fi

# VPS checks
if command -v ssh >/dev/null 2>&1; then
  echo "[vps] gateway status:"
  ssh hetzner '/home/luis/.npm-global/bin/openclaw gateway status' || true
  echo "[vps] tailscale status:"
  ssh hetzner 'tailscale status' || true
else
  echo "[mac] ssh not available"
fi
