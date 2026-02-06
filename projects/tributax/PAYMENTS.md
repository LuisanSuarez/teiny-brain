# Tributax Payments - Migo Integration

## How It Works

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Tributax   │────▶│    Migo     │────▶│   User's    │
│   (our app) │     │  (provider) │     │    Bank     │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │
      │  1. Generate link │
      │◀──────────────────│
      │                   │
      │  2. Display to user (iframe/redirect)
      │                   │
      │  3. Webhooks      │
      │◀──────────────────│
      │   - payment_received ($10)
      │   - subscription_started
```

**Key points:**
- We call Migo API to generate a payment link
- We display that link to users in our app
- Migo handles ALL tokenization and card processing
- We NEVER see card numbers
- Migo sends us webhooks:
  - `payment_received` - "We got $10"
  - `subscription_started` - "Subscription is active"

## The Problem (Feb 2026)

### Scenario: Failed payment → duplicate subscriptions

1. User tries to pay → payment fails
2. Migo sets subscription to **inactive** (not cancelled)
3. Migo keeps retrying the failed payment
4. We create a **new payment link** for the user
5. User pays on the new link ✅
6. BUT: Old inactive subscription is still there
7. Old subscription eventually retries and succeeds
8. **Result:** User has 2 active subscriptions, gets charged twice

### Root Cause
- When we create a new link, we don't cancel the old inactive subscription
- Migo's retry logic eventually succeeds on the old one

### Potential Solutions (brainstorm)

1. **Cancel old subscription before creating new link**
   - When generating new payment link, explicitly cancel any existing inactive subscriptions via Migo API
   
2. **Track subscription IDs**
   - Store Migo subscription ID in our DB
   - On new payment, check if there's an existing sub and cancel it first
   
3. **Webhook deduplication**
   - When we receive `subscription_started`, check if user already has active sub
   - If yes, cancel the new one (or the old one)
   
4. **Idempotency on our side**
   - Generate a unique `external_id` per user subscription intent
   - Pass this to Migo so they can dedupe on their end

### Questions to Answer
- Does Migo API support cancelling inactive subscriptions?
- Can we pass an idempotency key when generating links?
- What's the retry window before Migo gives up?

---
*Last updated: 2026-02-05*
