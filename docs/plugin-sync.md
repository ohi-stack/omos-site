# OMOS Plugin Sync Guide

## Purpose

This guide defines how the OMOS WordPress plugin synchronizes with `OMOS.OneGodian.com`.

The Node site is the canonical runtime and manifest source. The WordPress plugin used on OneGodian.com, OneGodian.org, and QuantumOHI.com consumes this manifest and renders domain-appropriate runtime status, content cards, tool launchers, documentation links, and commerce handoffs.

## Canonical Runtime Endpoints

```text
GET https://omos.onegodian.com/api/health
GET https://omos.onegodian.com/api/manifest
GET https://omos.onegodian.com/api/v1/providers
GET https://omos.onegodian.com/api/v1/persistence
POST https://omos.onegodian.com/process
POST https://omos.onegodian.com/api/v1/council/run
```

Protected execution endpoints require `x-omos-key`. Keys must remain server-side and must never be embedded in public WordPress markup or browser JavaScript.

## Canonical Plugin Manifest Contract

The plugin must read these runtime-manifest fields when present:

- `version`
- `status`
- `canonicalHost`
- `routes.public`
- `routes.api`
- `endpoints`
- `orchestration`
- `wordpressPlugin.compatibleHosts`
- `wordpressPlugin.requiredEndpoints`
- `wordpressPlugin.shortcodes`
- `appBridge`
- `links`

A local plugin manifest may cache these values, but it must identify its `last_synced_at` timestamp and must not silently advertise routes or capabilities absent from the canonical runtime manifest.

## Host Profiles

### OneGodian.com — Commerce Profile

Primary purpose: products, downloads, memberships, licensing, WooCommerce checkout, and conversion.

Required OMOS surfaces:

- OMOS Product Hub
- product cards with WooCommerce destination URLs
- runtime-status badge
- Ask OMOS / technical-context links back to OMOS.OneGodian.com
- developer/commercial licensing pathways where offered

Commerce CTA contract:

```text
Learn / Evaluate on OMOS → Buy / Subscribe on OneGodian.com → Return to OMOS/App for use where applicable
```

The plugin must not duplicate checkout inside the OMOS Node runtime.

### OneGodian.org — Public / Institutional Profile

Primary purpose: public explanation, history, identity, education, institutional orientation, contributor and partner pathways.

Required OMOS surfaces:

- What is OMOS?
- Protocol explainer
- Algorithm explainer
- OHI explainer
- runtime-status badge
- canonical links to OMOS documentation
- institutional/domain-separation notices where relevant

### QuantumOHI.com — Enterprise / Technical Profile

Primary purpose: OHI, Quantum-OHI, enterprise architecture, governance, verification-oriented design, and technical strategy.

Required OMOS surfaces:

- OMOS operating-layer explanation
- OHI synthesis architecture
- Council / provider status
- GCD synthesis explainer
- API/runtime links
- enterprise consultation or licensing CTA where offered

## Required Plugin Behavior

1. Fetch `/api/manifest`.
2. Read `routes.public` and runtime capability fields.
3. Compare canonical routes against the local page/shortcode manifest.
4. Flag missing or stale local surfaces in WordPress admin.
5. Render OMOS route cards with canonical links back to OMOS.OneGodian.com.
6. Render WooCommerce product links only on the commerce profile or where explicitly appropriate.
7. Render app bridge links to app.OneGodian.com.
8. Render public explanation links to OneGodian.org.
9. Never treat unsupported routes or capabilities as operational.
10. Never expose OMOS API secrets client-side.

## Required Shortcodes

```text
[omos_manifest]
[omos_runtime_status]
[omos_bridge_builder]
[omos_tool_grid]
[omos_docs_grid]
[omos_ohi_pipeline]
```

## Cross-Site Navigation Standard

Every plugin host should expose these consistent ecosystem destinations without pretending each site has the same role:

- OMOS Runtime → `https://omos.onegodian.com`
- Public / Organization → `https://onegodian.org`
- Commerce → `https://onegodian.com`
- Application → `https://app.onegodian.com`
- Enterprise / OHI → `https://quantumohi.com`

Use the same labels in headers, footers, OMOS cards, and plugin settings wherever practical.

## Production Safety Rules

1. Do not make OMOS claims beyond what exists in the runtime manifest.
2. Do not claim a shortcode is operational unless it renders and passes a test page.
3. Do not mix ONEGODIAN, LLC commercial pages with INO governance language without clarification.
4. Do not present OMOS as replacing civil, financial, legal, or governmental systems.
5. Keep public statements aligned with the current runtime maturity level.
6. Model agreement must not be represented as factual verification.

## Definition of Done

The sync layer is production-ready only when:

- `/api/health` returns status `ok`.
- `/api/manifest` returns the expected runtime version and public routes.
- plugin admin displays last sync time and runtime status.
- route comparison works.
- missing/stale surfaces are listed in admin.
- required shortcodes render without fatal errors.
- WooCommerce product CTAs resolve on OneGodian.com.
- app links resolve to app.OneGodian.com.
- QuantumOHI.com receives the enterprise/technical profile.
- smoke tests confirm the public OMOS routes.
