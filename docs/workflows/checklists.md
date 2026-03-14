# Checklists — Luisan

Last updated: 2026-03-12

## 1) Daily Operating Checklists

### Recurrente non-negotiable pre-9:00 AM (Mon–Fri)
- [ ] Approve withdrawals
- [ ] Check Intercom for chargebacks
- [ ] Check acceptance dashboard
- [ ] Check Basecamp for withdrawal review responses
- [ ] Upload a Neonet settlement

Rule: completed before 9:00 AM, no exceptions.

### Start of day (5–10 min)
- Check calendar for next 24h
- Pick top 1 outcome for Recurrente
- Pick top 1 outcome for PuenteSat
- Process urgent messages only (10 min cap)
- Define what would make today a win

### OOO coverage checklist (full day or partial)
- [ ] Confirm OOO window (start/end + timezone)
- [ ] Ask Pao or Max to cover withdrawal processing
- [ ] Confirm who is primary owner and backup owner
- [ ] Share status/context (pending withdrawals, risky accounts, blockers)
- [ ] Share where to check: Intercom chargebacks, acceptance dashboard, Basecamp withdrawal responses
- [ ] Confirm Neonet settlement ownership for that window
- [ ] Post a quick handoff note in team channel/Basecamp
- [ ] On return: review what happened and close follow-ups

### Before deep work block (2 min)
- Write one-line definition of done
- Ask: **How can AI do this for me, or help me do it faster/better?**
- Timebox block (45–60 min)
- Close distractions
- Start with hardest item first

### End of day shutdown (5 min)
- Log what got shipped
- Write first step for tomorrow
- Capture loose ends/questions
- Decide if anything is urgent for morning

---

## 2) Recurrente — New Feature / Pricing Discovery Checklist

Use this whenever a new charge, fee, or monetization component appears.

### A) Commercial model (what and why)
- What exactly are we charging for?
- Who pays (merchant, end user, both)?
- How much is the charge?
- Is it fixed, variable, tiered, or blended?
- Since when / from what trigger does it apply?

### B) Charging mechanics (how and when)
- At what event is it charged? (authorization, capture, settlement, invoice cycle)
- Is it a separate transaction line item or bundled?
- Is it in the same balance transaction as payment fees or separate?
- For which channels does it apply? (digital / in-person / POS)
- Any edge-case exclusions?

### C) User visibility (where it appears)
- Where should end users see price disclosure?
- Does it appear as separate line descriptor vs "comisión"?
- Where in product activity/timeline is it shown?
- Does it appear in reports? Which reports exactly?

### D) Merchant billing + bookkeeping
- How do we track revenue from this charge internally?
- How does it appear in monthly merchant invoice?
- Ledger mapping/accounting treatment (revenue vs pass-through)
- Reconciliation source of truth (tables/reports/events)

### E) Go-to-market / communication
- Are we advertising this? If yes, where and with what wording?
- Internal FAQ / support script updated?
- Risk/compliance review done?

### F) Decision capture (must fill)
- Owner:
- Decision date:
- Effective date:
- Open questions:
- Links to spec/docs:

---

## 3) Today’s Captured Discovery Questions (Recurrente)

### Raw questions
- Cuánto vamos a cobrar nosotros?
- Cómo vamos a track ganancias + incluír esto en la factura que le emitimos a nuestros comercios cada mes?
- Cuál es el lugar correcto para mostrarle el precio al usuario?
- Le va a salir como un "line descriptor" separado de "comisión" en la actividad de un pago?
- Sale en "reportes" también?
- El cobro va a ser en el mismo balance transaction que el del paymentIntent?
- Una vez esté activado va a facturar para ambos "digital" e "in-person" payments? Aunque no meta NIT del cliente en el flow del POS?

### Consolidated themes
- Pricing policy: how much and why
- Timing: when charge is applied
- Accounting: how revenue is tracked + invoiced
- UX disclosure: where users and merchants see it
- Reporting + reconciliation: where it lands operationally
- Coverage/scope: digital + in-person + POS edge cases
- GTM: if/how this is communicated publicly

---

## 4) Fast Reusable Prompt (copy/paste)

"I’m evaluating a new monetization/fee feature. Help me fill this checklist:
1) what are we charging,
2) who pays,
3) how much,
4) when charged,
5) where shown to users,
6) line descriptor behavior,
7) reporting visibility,
8) bookkeeping and invoice treatment,
9) channel coverage (digital/in-person/POS),
10) communication/GTM plan,
11) owner/date/effective date/open questions."

---

## 5) PuenteSat — Feature Build Checklist (minimal, evolving)

- [ ] Is this provider-agnostic? Will it be easily adaptable to a new provider?

---

## 6) PuenteSat — Publish Checklist (minimal)

- [ ] Check that it deployed well on all platforms
- [ ] Check that it works on production
- [ ] Smoke test the main happy path end-to-end
- [ ] Verify logs/monitoring show no new errors right after release
- [ ] Confirm rollback path is clear if something breaks

---

## 7) Feature Test Checklist (create during planning)

Use this before implementation starts. The goal is to define what we must verify, so testing is execution, not improvisation.

- [ ] Happy path(s)
- [ ] Core edge cases
- [ ] Error handling states
- [ ] Data persistence + integrity checks
- [ ] Permissions/roles impact (if applicable)
- [ ] Regression checks (what existing flow could break)
- [ ] Manual vs automated: mark each case as Manual / Playwright / Unit
- [ ] Production smoke tests after deploy

Template per feature:
- Feature:
- Test case:
- Expected result:
- Type: Manual | Playwright | Unit
- Status: Pending | Passed | Failed

---

## 8) Personal Routine Checklists

### Bedtime winddown checklist
- [ ] Meditate
- [ ] Brush teeth
- [ ] Put deodorant
- [ ] Melatonin & magnesium

### Morning body-basics checklist
- [ ] Go pee
- [ ] Take creatine

