# OMOS Analytics & Conversion Standard

## Purpose
Measure whether OMOS moves users from understanding to useful runtime activity and appropriate ecosystem actions without sending private prompt content to analytics providers.

## Core funnel

`Landing → Ask OMOS → Run Started → Governed Output → Human Decision → Product / App / Documentation Handoff`

## Required events

- `omos_page_view`
- `omos_ask_opened`
- `omos_run_started`
- `omos_layer1_completed`
- `omos_alignment_completed`
- `omos_council_started`
- `omos_council_completed`
- `omos_governed_output_viewed`
- `omos_human_decision`
- `omos_product_cta_clicked`
- `omos_app_handoff_clicked`
- `omos_docs_handoff_clicked`

## Safe event properties

Allowed properties include:

- route
- runtime version
- run mode: simulation / hybrid / live
- provider count
- run status
- decision status
- CTA destination class
- product slug or public product ID

Do not send raw prompts, model outputs, evidence text, names, email addresses, API keys, Decision Record contents, or other sensitive/private payloads to general analytics.

## Commerce attribution

OMOS product CTAs should point to OneGodian.com and append non-sensitive campaign attribution where supported by the destination. WooCommerce remains the checkout system of record for OMOS consumer products; OMOS remains the technical/context layer.

## KPIs

1. Ask OMOS start rate
2. Run completion rate
3. Human decision completion rate
4. Documentation engagement
5. Product CTA click-through rate
6. App handoff rate
7. Returning runtime users

## Production rule

Analytics is operational only after a provider ID is configured in the deployment environment and events are confirmed in that provider's live/debug view. Documentation alone does not establish tracking as active.
