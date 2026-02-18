# OpenClaw VPS ↔ Local Mac Node Bridge (Teiny ↔ TeinyVPS)

This is the repeatable setup we used to connect a local Mac node to a VPS gateway (so the VPS can run commands on the Mac).

## 0) Assumptions
- VPS user: `luis`
- VPS host/IP: `46.225.96.146`
- SSH alias: `hetzner`
- VPS gateway port: `18789` (OpenClaw default)
- Local Mac node display name: `Luisan-MacBook-Pro`
- OpenClaw installed on local Mac already

---

## 1) Preferred: Tailscale link (no SSH tunnel)
We switched to Tailscale for a clean always‑on link between Mac and VPS.

### Install
**Mac:**
```bash
brew install tailscale
brew services start tailscale
```

**VPS:**
```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

### Login
Run on each machine (or use the login URLs returned by `tailscale up`):
```bash
tailscale up --accept-routes=false --accept-dns=false
```

### Tailscale IPs (as of setup)
- **Mac**: `100.95.159.105` (luisans‑macbook‑pro)
- **VPS**: `100.110.239.72` (openclawgermany)

### Start Mac node host (over Tailscale)
```bash
openclaw node run --host 100.110.239.72 --port 18789 --display-name "Luisan-MacBook-Pro"
```

### Make Mac node host persistent (launchd)
```bash
openclaw node install --force --display-name "Luisan-MacBook-Pro" --host 100.110.239.72 --port 18789
```

Logs: `~/.openclaw/logs/node.log`

---

## 2) Fallback: SSH tunnel (Mac → VPS)
Use this only if Tailscale is down.

```bash
# Terminal A (keep open)
ssh -i ~/.ssh/teinyvps -N -L 38789:127.0.0.1:18789 luis@46.225.96.146
```

> If the port is in use, pick another local port (e.g., 28789/38789/48789).

### Start Mac node host (connects through the tunnel)
```bash
# Terminal B (keep open)
openclaw node run --host 127.0.0.1 --port 38789 --display-name "Luisan-MacBook-Pro"
```

This creates a pending node on the VPS gateway.

---

## 3) Install OpenClaw on VPS (if missing)
We found OpenClaw wasn’t on PATH, so we installed it via curl (no onboarding):

```bash
ssh hetzner 'curl -fsSL --proto "=https" --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --no-onboard'
```

After install, the binary lived here:

```
/home/luis/.npm-global/bin/openclaw
```

(Your npm prefix might differ; check with `npm config get prefix`.)

---

## 4) Gateway bind for Tailscale (VPS)
Make the gateway listen on the Tailscale IP (not loopback):

```bash
/home/luis/.npm-global/bin/openclaw config set gateway.bind tailnet
/home/luis/.npm-global/bin/openclaw gateway restart
```

Verify:
```bash
/home/luis/.npm-global/bin/openclaw gateway status
```

---

## 4.5) Web UI (Tailscale HTTPS)
The UI requires HTTPS or localhost. Use Tailscale Serve:

```bash
sudo tailscale serve --https 443 http://127.0.0.1:18789
sudo tailscale serve status
```

**URL:** `https://openclawgermany.tail843b20.ts.net/`

VPS shell alias (already set):
```bash
openclaw-ui
```

---

## 5) Approvals (on VPS gateway)
This build didn’t accept `approvals set` with a JSON allowlist. Instead we used allowlist commands:

```bash
# Example allowlist (safe basics)
/home/luis/.npm-global/bin/openclaw approvals allowlist add --agent "*" --node "Luisan-MacBook-Pro" "/usr/bin/uname"
/home/luis/.npm-global/bin/openclaw approvals allowlist add --agent "*" --node "Luisan-MacBook-Pro" "/usr/bin/whoami"
/home/luis/.npm-global/bin/openclaw approvals allowlist add --agent "*" --node "Luisan-MacBook-Pro" "/bin/pwd"
/home/luis/.npm-global/bin/openclaw approvals allowlist add --agent "*" --node "Luisan-MacBook-Pro" "/bin/ls"
/home/luis/.npm-global/bin/openclaw approvals allowlist add --agent "*" --node "Luisan-MacBook-Pro" "/bin/cat"
/home/luis/.npm-global/bin/openclaw approvals allowlist add --agent "*" --node "Luisan-MacBook-Pro" "/bin/echo"
/home/luis/.npm-global/bin/openclaw approvals allowlist add --agent "*" --node "Luisan-MacBook-Pro" "/usr/bin/git"
```

> You can expand this list later (e.g., `rg`, `sed`, `jq`, `python`, `node`, etc.).

---

## 6) Sanity test (from VPS)
From the VPS, run a basic command against the node to confirm approval:

```
whoami
```

Output should be `luisan` without approval prompts.

---

## Health check + auto‑reconnect (Mac)
We installed a small watchdog to keep Tailscale up on the Mac:

- Script: `/Users/luisan/.openclaw/workspace/scripts/tailscale-watchdog.sh`
- LaunchAgent: `~/Library/LaunchAgents/com.luisan.tailscale.watchdog.plist`
- Runs every 15 minutes; logs in `~/.openclaw/logs/`

Manual health check:
```bash
/Users/luisan/.openclaw/workspace/scripts/openclaw-healthcheck.sh
```

---

## Troubleshooting Notes
- **Tailscale not connected**: `tailscale status` on both machines; re-run `tailscale up` if needed.
- **SSH tunnel error** `Address already in use`: pick a new local port.
- **SSH key issues**: ensure correct private key and file permissions (600).
- **OpenClaw not found on VPS**: check npm prefix and PATH.
- **Node not connected**: confirm tunnel/Tailscale + node host are running and VPS gateway restarted.

---

## Shared Memory Repo Reminder
Both Teiny (local) and TeinyVPS share a soul:
- **Always `git pull` on entry**
- **Always `git push` after memory updates**
