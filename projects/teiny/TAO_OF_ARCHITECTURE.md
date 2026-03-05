# Tao of Architecture

Date: 2026-03-01
Purpose: enforceable file/module structure laws for backend architecture.

---

## Format Contract (mandatory)
Every maxim uses:
- **Rule**
- **Bad signal**

---

## Maxim A1 — Organize by Domain Capability
**Rule:** Structure backend code by domain capability (billing, submissions, members), not by technical layer buckets.
**Bad signal:** Large top-level controller/service/repository sprawl disconnected from business nouns.

## Maxim A2 — Every Module Has an `actions/` Folder
**Rule:** Any module with multiple business operations must expose operations through an `actions/` folder.
**Bad signal:** Many operation files dumped at module root or mixed with repositories/routes.

## Maxim A3 — One Primary Export per File
**Rule:** Action/domain files export one primary behavior.
**Bad signal:** One file exporting several unrelated operations.

## Maxim A4 — Verb–Noun Action File Naming
**Rule:** Action files must be named as explicit verb–noun behaviors (e.g., `create-submission.ts`, `retry-attachments.ts`).
**Bad signal:** Generic names like `helpers.ts`, `process.ts`, `doStuff.ts`, `misc.ts`.

## Maxim A5 — Apply Same Structure to External Integrations
**Rule:** External integration modules follow the same action structure (`external/<capability>/actions/*` + one primary export per action file).
**Bad signal:** Vendor adapters with many exports per file and mixed responsibilities.

## Maxim A6 — Routes Stay Thin and Call Actions
**Rule:** Routes/controllers call action entry points; they do not host operation logic.
**Bad signal:** Route files containing business branching, persistence calls, and orchestration details.

## Maxim A7 — Repositories Own Persistence Only
**Rule:** Repository files perform data access only; no business policy/orchestration.
**Bad signal:** Repository functions making domain decisions or managing workflows.

## Maxim A8 — New Feature = New Action, Not Action Growth
**Rule:** New behavior should normally create a new action file instead of inflating an existing action.
**Bad signal:** Existing action files growing into multi-purpose workflow hubs.
