# Recurrente Tasks & Context

## 🔥 Active Bugs (High Priority)

### Payment Stuck in Verification Bug
- **Impact:** HIGH — causes double charges
- **Problem:** Payment gets processed by acquirer but shows "stuck in verification" in DB/UI
- **Result:** Client thinks it didn't go through → runs another charge → double charge
- **Status:** Needs fix

### Old PRs Backlog
- Need to run through Sandy Metz reviewer
- **Status:** Backlogged, needs dedicated time

---

## 📋 1-on-1 Action Items (from Feb 2024 meeting with Alejo)

### Overdue from Last 1-1
| Task | Status | Notes |
|------|--------|-------|
| Facturación con InFile | ❌ | Was reviewing with Max, adding improvements |
| Update chargeback states (won/lost) | ❌ | + investigate unnotified ones. *Could Claude help?* |
| Auto-void invoices in dev testing | ❌ | Forgot — ask Claude this week |

### For Next 1-1
- [ ] Research: How do Stripe, Adyen, Square handle **sales incentives**?
- [ ] Research: How do Stripe, Adyen, Square handle **chargebacks**?
- [ ] Talk to big merchants — exempt them from chargebacks? What do they feel/want?
- [ ] Bank accounts in other countries — what's needed? (BAM, Promerica)

---

## 🎯 Objectives (from 1-1)
- Inhouse invoice system
- Cuadres automáticos (automatic reconciliation)
- +80% target (clarify what this refers to)

---

## 💭 Open Topics/Decisions

### Crypto Risk Engine
- **Problem:** Crooks get through, legit users wait too long
- **Current:** Pre-approval is too blunt
- **Proposed solutions:**
  1. Liveness check upfront (better UX than waiting for swap approval)
  2. AI review per transaction (rules proposed in Basecamp)

### Prioritization Question
- Automated revenue/cashflow calculation — this month?
- Luisan prefers: AI Withdrawals + crypto protection first
- Open Q: Does Waterproof or Exodus change priority?

### POS In-Person Sales
- Does the LOI change anything?
- Still want to do it?

### Work Schedule
- Proposed: Tue/Thu on-site
- Stop midday for CS issues

### Incentives
- Luisan wants sales-style incentive scheme

### Chargeback Avoidance
- One merchant changed accounts to avoid paying chargeback — need policy?

---

## 📅 Last Updated
2026-02-04
