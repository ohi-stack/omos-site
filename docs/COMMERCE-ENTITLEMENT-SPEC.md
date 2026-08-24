# OMOS Commerce & Entitlement Specification

## Canonical transaction flow

Checkout → Payment confirmation → OMOS entitlement → Run allowance → Decision Record → Dashboard History

This document defines the product-to-runtime contract. Stripe is the payment/subscription authority; OMOS is the entitlement and governed-run authority. A client redirect is never sufficient proof of payment.

## Product catalog

| Product key | Customer product | Price | Billing | Entitlement |
|---|---|---:|---|---|
| `decision_review` | OMOS Decision Review | $19 USD | one-time | 1 Decision Review run |
| `ai_council` | OMOS AI Council | $29 USD | one-time | 1 eligible Council run |
| `document_review` | OMOS Document Review | $29 USD | one-time | 1 Document Review run |
| `omos_pro` | OMOS Pro | $29 USD | monthly | recurring Pro plan allowance |
| `omos_business` | OMOS Business | $99 USD starting tier | monthly | recurring Business plan allowance |

Stripe Product IDs and Price IDs MUST be supplied through server-side environment configuration. Do not hardcode live Stripe identifiers in browser code.

## Required environment variables

```text
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_DECISION_REVIEW=
STRIPE_PRICE_AI_COUNCIL=
STRIPE_PRICE_DOCUMENT_REVIEW=
STRIPE_PRICE_OMOS_PRO=
STRIPE_PRICE_OMOS_BUSINESS=
OMOS_CHECKOUT_SUCCESS_URL=https://omos.onegodian.com/checkout/success?session_id={CHECKOUT_SESSION_ID}
OMOS_CHECKOUT_CANCEL_URL=https://omos.onegodian.com/shop
```

## Server routes

### `POST /api/v1/commerce/checkout`
Authenticated account/session recommended.

Request:
```json
{ "product_key": "decision_review" }
```

Server responsibilities:
1. Validate product key against the allowlist.
2. Resolve the server-side Stripe Price ID.
3. Create the Stripe Checkout Session in `payment` mode for one-time products or `subscription` mode for Pro/Business.
4. Include safe metadata: `product_key`, OMOS account/user reference where available, and correlation ID.
5. Return only the Stripe-hosted checkout URL/session identifier required by the client.

### `POST /api/v1/commerce/webhook`
The raw request body must be verified with `STRIPE_WEBHOOK_SECRET` before any entitlement mutation.

Relevant events should include, as applicable:
- `checkout.session.completed`
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Webhook processing MUST be idempotent using Stripe event IDs.

### `GET /api/v1/commerce/entitlements`
Returns the authenticated user's current grants, balances, subscription state, and expiration/renewal metadata.

### `POST /api/v1/commerce/portal`
Creates a Stripe Customer Portal session for subscription/billing management where configured.

## Entitlement model

Minimum record:
```json
{
  "entitlement_id": "ent_...",
  "subject_id": "user_or_org_id",
  "product_key": "decision_review",
  "source": "stripe",
  "stripe_customer_id": "cus_...",
  "stripe_checkout_session_id": "cs_...",
  "stripe_subscription_id": null,
  "status": "active",
  "quantity_granted": 1,
  "quantity_consumed": 0,
  "period_start": null,
  "period_end": null,
  "created_at": "UTC timestamp",
  "updated_at": "UTC timestamp"
}
```

One-time purchases grant one consumable run. Subscriptions grant plan-scoped allowances according to a separately versioned allowance policy. Do not advertise an allowance until it is implemented and enforced.

## Run authorization

Before a paid run begins:
1. Resolve the authenticated subject.
2. Load active entitlement(s).
3. Confirm the requested run type is covered.
4. Atomically reserve/decrement a consumable allowance or register subscription usage.
5. Create the OMOS run/Decision Record with `commerce.entitlement_id` and correlation metadata.
6. If run creation fails before execution begins, release the reservation.

A successful payment must never directly imply that a governed run completed.

## Decision Record commerce fields

```json
{
  "commerce": {
    "product_key": "decision_review",
    "entitlement_id": "ent_...",
    "billing_source": "stripe",
    "checkout_session_id": "cs_...",
    "subscription_id": null,
    "allowance_consumed": 1
  }
}
```

Do not store full payment-card data in OMOS.

## Dashboard History

Every paid completed run should surface:
- Decision/run ID
- product/service type
- created date
- run state
- human review state
- verification state
- Council mode/providers where applicable
- entitlement/plan label
- Open Decision Record action

## Failure states

`PAYMENT_PENDING` — no active grant yet.
`PAYMENT_FAILED` — do not grant entitlement.
`ENTITLEMENT_ACTIVE` — eligible to run.
`ENTITLEMENT_EXHAUSTED` — one-time allowance consumed.
`SUBSCRIPTION_PAST_DUE` — apply configured grace/restriction policy.
`SUBSCRIPTION_CANCELED` — access ends according to paid-through period/policy.
`RUN_FAILED` — preserve audit event; refund/re-credit behavior must follow explicit policy.

## Security and compliance controls

- Stripe secret and webhook secrets are server-only.
- Verify webhook signatures.
- Make webhook writes idempotent.
- Never trust product, price, amount, or entitlement claims from the browser.
- Never unlock access solely from the success redirect.
- Keep model consensus separate from factual verification.
- Preserve human authority for consequential decisions.
- Log entitlement grants, consumption, reversals, and subscription-state transitions.
- Store only Stripe identifiers required for reconciliation; Stripe remains payment-data system of record.

## Definition of done

A stranger can select an OMOS product, enter Stripe-hosted Checkout, pay, return to OMOS, receive the correct entitlement from a verified webhook, launch the covered governed run, consume the correct allowance, produce a persistent Decision Record, and reopen that record from Dashboard History. Duplicate webhooks, refreshes, failed payments, canceled subscriptions, and failed runs do not create duplicate grants or silently lose usage.
