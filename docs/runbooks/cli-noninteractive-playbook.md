# CLI Non-Interactive Playbook (Prevent "stuck on prompts")

Purpose: avoid silent stalls/timeouts during CLI auth/deploy/setup flows.

## Use this when
- Running deploy commands (`vercel`, `convex`, etc.)
- Doing CLI auth/login flows
- Any command that may open interactive prompts

## Preflight (mandatory)
1. Confirm tool exists (`<tool> --version`)
2. Confirm login/session state before long command
3. Prefer token/env auth over device-code flow when possible
4. Use non-interactive flags whenever available (`--yes`, `--confirm`, etc.)
5. Run long commands in background and monitor logs

## During execution
- If prompt waits >30 seconds, immediately report what's waiting.
- Post short milestone updates every 3–5 minutes for interactive phases.
- If auth code expires, restart flow once and announce fresh code immediately.

## Fallbacks
- If CLI prompt loop persists, switch to browser/API path if available.
- If still blocked, pause and ask for explicit user decision with exact next command.

## Done criteria
- Command finished OR blocked reason explicitly reported.
- No silent waiting.
