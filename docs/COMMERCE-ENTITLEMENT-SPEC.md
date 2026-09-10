# OMOS Commerce & Entitlement Specification

**Status:** Provisional commercial standard — September 10, 2026  
**Commercial authority:** ONEGODIAN, LLC  
**Runtime authority:** OMOS  

## Commercial principle

OMOS products are sold around outcomes customers can understand in the current AI economy: clearer decisions, cross-model review, persistent records, governed team workflows, and implementation support.

Foundational documents, white papers, standards, and system specifications remain educational, intellectual-property, developer, and trust resources. They may support commerce, but they are not the primary value proposition of OMOS.

## Canonical transaction flow

Checkout → Payment confirmation → OMOS entitlement → Run allowance/access state → Governed run → Decision Record → Dashboard History

Stripe is the payment/subscription authority. OMOS is the entitlement and governed-run authority. A browser redirect is never sufficient proof of payment.

## Provisional product ladder

Pricing below is a launch hypothesis, not a permanent pricing standard. It must be reviewed against provider inference cost, support burden, conversion, retention, usage, and customer willingness-to-pay before being treated as validated pricing.

| Product key | Customer product | Provisional price | Billing | Intended entitlement / outcome |
|---|---|---:|---|---|
| `ask_omos` | Ask OMOS | Free / limited | no charge | Entry experience for structured governed analysis within published free limits |
| `decision_review` | OMOS Decision Review | $99 USD | one-time | One structured decision review and persistent Decision Record when supported |
| `document_review` | OMOS Document Review | $49 USD | one-time | One supported document review focused on claims, assumptions, risks, omissions, and next questions |
| `omos_pro` | OMOS Pro | $19 USD | monthly | Individual recurring access under a separately versioned allowance policy |
| `omos_council` | OMOS Council | $49 USD | monthly | Recurring access to eligible multi-model Council workflows under a separately versioned allowance policy |
| `omos_business` | OMOS Business | $149 USD starting tier | monthly | Organization-level governed workflows, records, and team-oriented access as implemented |
| `omos_implementation` | OMOS Implementation | $1,500 USD+ | scoped service | Human-led workflow assessment, configuration, integration planning, training, and implementation support |

A future Developer/API plan may be introduced only after authentication, metering, rate limits, billing enforcement, support commitments, and API stability are operational and documented.

### Pricing rule

Do not advertise unlimited Council usage, fixed monthly run counts, guaranteed provider availability, team features, API access, or persistent-history capabilities until the corresponding runtime entitlement and production controls are implemented and enforced.

## Customer value definitions

### Ask OMOS
A low-friction acquisition experience that demonstrates the difference between a normal chatbot response and a governed OMOS review. The output should surface objective, constraints, assumptions, risk, uncertainty, alternatives, and human-review boundaries where applicable.

### OMOS Decision Review
For a meaningful business, project, planning, or opportunity decision. The deliverable is a structured governed review rather than a guaranteed answer. It should include the interpreted objective, material constraints, assumptions, important risks, alternatives, evidence/verification status, recommendation, uncertainty, and persistent Decision Record where supported.

### OMOS Document Review
For supported business documents, proposals, policies, specifications, reports, and working drafts. The service should identify claims, assumptions, contradictions, omissions, risks, unresolved questions, and recommended follow-up. It is not a substitute for qualified legal, financial, medical, investment, tax, or other regulated professional review.

### OMOS Pro
For individuals, founders, creators, researchers, and professionals who use OMOS repeatedly. Exact allowances remain implementation-controlled and must be disclosed at checkout/account level before purchase.

### OMOS Council
For users who need more than one model perspective. Eligible runs may use available provider adapters for independent outputs, cross-review, agreement zones, contradictions, missing information, novel insights, supported dissent, and governed synthesis. Provider availability and model configuration must be shown truthfully for each run. Model agreement is not factual verification.

### OMOS Business
For small organizations and teams that need repeatable governed decision workflows, organizational history, review controls, and clearer provenance. Team permissions, shared records, connectors, and API features may be sold only when actually implemented for the purchased tier.

### OMOS Implementation
A scoped human-led professional service for organizations adopting OMOS. Typical work may include workflow mapping, AI-use policy design, provider selection, human approval gates, Decision Record architecture, connector planning, training, and production-readiness review. Scope, deliverables, exclusions, timeline, and price must be stated in a written order or proposal before work begins.

## Required environment variables

```text
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_DECISION_REVIEW=
STRIPE_PRICE_DOCUMENT_REVIEW=
STRIPE_PRICE_OMOS_PRO=
STRIPE_PRICE_OMOS_COUNCIL=
STRIPE_PRICE_OMOS_BUSINESS=
OMOS_CHECKOUT_SUCCESS_URL=https://omos.onegodian.com/checkout/success?session_id={CHECKOUT_SESSION_ID}
OMOS_CHECKOUT_CANCEL_URL=https://omos.onegodian.com/shop
```

`ask_omos` does not require Stripe checkout. `omos_implementation` should route to a scoped sales/engagement workflow unless and until a fixed implementation package is formally published.

Stripe Product IDs and Price IDs MUST be supplied through server-side environment configuration. Do not hardcode live Stripe identifiers in browser code.

## Server routes

### `POST /api/v1/commerce/checkout`
Authenticated account/session recommended.

Request:
```json
{ "product_key": "decision_review" }
```

Server responsibilities:
1. Validate the product key against the server-side allowlist.
2. Reject free, quote-based, disabled, or unavailable products from paid checkout.
3. Resolve the server-side Stripe Price ID.
4. Create the Stripe Checkout Session in `payment` mode for one-time products or `subscription` mode for recurring plans.
5. Include safe metadata: `product_key`, OMOS account/user reference where available, and correlation ID.
6. Return only the Stripe-hosted checkout URL/session identifier required by the client.

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

One-time purchases grant the specific purchased entitlement. Subscriptions grant plan-scoped access according to a separately versioned allowance policy. Do not advertise an allowance until it is implemented and enforced.

## Run authorization

Before a paid governed run begins:
1. Resolve the authenticated subject.
2. Load active entitlement(s).
3. Confirm the requested run type is covered and currently available.
4. Atomically reserve/decrement a consumable entitlement or register subscription usage.
5. Create the OMOS run/Decision Record with `commerce.entitlement_id` and correlation metadata.
6. If run creation fails before execution begins, release the reservation according to policy.

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

Every paid completed run should surface, when implemented:
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
`ENTITLEMENT_ACTIVE` — eligible to use the purchased capability.  
`ENTITLEMENT_EXHAUSTED` — one-time or metered allowance consumed.  
`SUBSCRIPTION_PAST_DUE` — apply configured grace/restriction policy.  
`SUBSCRIPTION_CANCELED` — access ends according to paid-through period/policy.  
`CAPABILITY_UNAVAILABLE` — purchased/entitled feature cannot currently be executed; preserve the event and apply the published remedy policy.  
`RUN_FAILED` — preserve audit event; refund/re-credit behavior must follow explicit policy.

## Security, consumer, and compliance controls

- Stripe secret and webhook secrets are server-only.
- Verify webhook signatures.
- Make webhook writes idempotent.
- Never trust product, price, amount, or entitlement claims from the browser.
- Never unlock access solely from the success redirect.
- Show whether Council execution is live, hybrid/degraded, or simulated.
- Keep model consensus separate from factual verification.
- Preserve human authority for consequential decisions.
- Do not represent OMOS output as qualified professional advice where professional licensure or regulated judgment is required.
- Log entitlement grants, consumption, reversals, and subscription-state transitions.
- Store only Stripe identifiers required for reconciliation; Stripe remains payment-data system of record.
- Publish refund/re-credit, cancellation, recurring-billing, and capability-unavailability terms before paid launch.

## Commercial validation metrics

Before prices become canonical, measure at minimum:
- free-to-paid conversion;
- checkout conversion;
- provider/inference cost per paid run and per subscriber;
- gross margin by product;
- average Council provider count and cost;
- support minutes/cost per customer;
- failed/degraded run rate;
- entitlement utilization;
- monthly retention/churn;
- repeat purchase rate;
- refund/re-credit rate;
- customer-reported usefulness and decision follow-through.

## Definition of done

A stranger can understand the OMOS outcome being purchased, select an available paid product, enter Stripe-hosted Checkout, pay, return to OMOS, receive the correct entitlement from a verified webhook, launch the covered governed workflow, consume or register the correct allowance, produce a persistent Decision Record where promised, and reopen that record from Dashboard History. Duplicate webhooks, refreshes, failed payments, canceled subscriptions, unavailable capabilities, and failed runs do not create duplicate grants or silently lose usage.

Until that end-to-end path passes production verification, commercial pages must identify paid checkout/entitlements as unavailable, beta, waitlist, or otherwise accurately describe their actual state.