# OMOS WordPress Plugin Integration Standard

## Purpose

This document defines how the OMOS Node runtime integrates with WordPress plugin deployments across:

- OneGodian.com
- OneGodian.org
- QuantumOHI.com

OMOS.OneGodian.com remains the canonical runtime, protocol, documentation, and manifest authority.

WordPress acts as:

- presentation layer;
- commerce layer;
- distribution layer;
- shortcode/render layer.

## Core architecture rule

```text
OMOS.OneGodian.com = authority/runtime/docs
WordPress plugins = rendering/distribution/sync layer
```

## Plugin responsibilities

The OMOS plugin must:

1. pull canonical manifest from `/api/manifest`;
2. render synced route cards;
3. expose OMOS shortcodes;
4. display runtime health;
5. bridge products into WooCommerce;
6. maintain canonical links back to OMOS;
7. support app.OneGodian.com synchronization.

## Required endpoints

```text
GET /api/health
GET /api/manifest
POST /process
GET /api/zolfi/manifest
```

## Required shortcodes

```text
[omos_manifest]
[omos_runtime_status]
[omos_tool_grid]
[omos_docs_grid]
[omos_bridge_builder]
[omos_protocol_summary]
[omos_algorithm_summary]
```

## Recommended plugin admin screens

```text
OMOS Dashboard
OMOS Runtime Status
Manifest Sync
Canonical Routes
WooCommerce Bridge
API Keys
Deployment Checklist
```

## Canonical page responsibilities

### OneGodian.org

Use for:

- public explanations;
- institutional summaries;
- FAQ;
- public-safe identity documentation.

### OneGodian.com

Use for:

- WooCommerce products;
- digital downloads;
- memberships;
- Stripe checkout;
- prompt packs;
- courses.

### QuantumOHI.com

Use for:

- OHI infrastructure;
- runtime positioning;
- governance tooling;
- advanced architecture pages.

### OMOS.OneGodian.com

Use for:

- canonical protocol docs;
- runtime tooling;
- manifests;
- architecture;
- deployment notes;
- technical references.

## Sync rules

1. OMOS routes are authoritative.
2. Plugins mirror — not redefine — canonical content.
3. Canonical URLs must always point back to OMOS routes.
4. Product checkout must stay on OneGodian.com.
5. Public institutional explanations remain on OneGodian.org.
6. Runtime and protocol authority remain on OMOS.OneGodian.com.

## Production checklist

- [ ] Manifest endpoint reachable.
- [ ] Health endpoint reachable.
- [ ] Plugin routes synchronized.
- [ ] WooCommerce bridge active.
- [ ] Canonical links verified.
- [ ] Dashboard widgets connected.
- [ ] Smoke tests passing.
- [ ] Deployment documented.
