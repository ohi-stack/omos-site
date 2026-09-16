# OMOS WordPress Cross-Platform Sync Architecture

**Status date:** September 16, 2026  
**Canonical runtime:** `https://omos.onegodian.com`  
**Runtime repository:** `ohi-stack/omos-site`  
**Shared WordPress repository:** `ohi-stack/onegodian-platform-plugin`  
**Governed WordPress action repository:** `ohi-stack/acc-wp-adapter`

## Executive Status

The repository architecture is synchronized around one authoritative OMOS runtime and two distinct WordPress integration layers:

1. **Shared WordPress platform bridge** — OneGodian Platform Plugin v0.3.0+ for read-through OMOS health, manifest, provider, and persistence state across approved OneGodian WordPress properties.
2. **OMOS Core Tools v1.4.0** — richer OMOS-specific WordPress UI, shortcodes, status proxies, and authenticated Ask OMOS interface.
3. **ACC WordPress Adapter** — authenticated operational-write layer for approved WordPress/WooCommerce actions after the applicable OMOS/Human Gate/ACC authorization path.

This prevents each site from becoming a separate OMOS runtime.

## Canonical Architecture

```text
                        USER / ADMIN
                             │
                             ▼
                 OMOS CENTRAL RUNTIME
              https://omos.onegodian.com
                             │
       ┌─────────────────────┼─────────────────────┐
       │                     │                     │
  governed AI          Decision Records      runtime status
  Council/Align        persistence/audit     manifest/providers
       │                     │                     │
       └─────────────────────┼─────────────────────┘
                             │
              OneGodian Platform Plugin
                    v0.3.0+ shared bridge
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
 OneGodian.org        OneGodian.com       QuantumOHI.com
 public/identity       commerce/store       technology/O-H-I
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    optional presentation
                    OMOS.OneGodian.org
                             │
                   OMOS Core Tools v1.4.0
                    richer OMOS interface

Consequential external WordPress action path:

OMOS → Human Gate → ACC → acc-wp-adapter → WordPress/WooCommerce → evidence
```

## Repository Responsibilities

### `ohi-stack/omos-site`

Authoritative for:

- OMOS Node/Express runtime;
- Ask OMOS;
- Layer 1 and Alignment;
- provider/model gateway;
- Council and cross-review;
- governed synthesis;
- Human Gate;
- Decision Records and history;
- PostgreSQL persistence and audit state;
- OMOS admin dashboard;
- OMOS-specific WordPress package source;
- OMOS WordPress target architecture.

### `ohi-stack/onegodian-platform-plugin`

Authoritative for shared WordPress infrastructure:

- WordPress platform health/manifest;
- common API bridge patterns;
- site-role detection;
- common OMOS status synchronization;
- public-safe runtime proxy endpoints;
- common OMOS status/navigation shortcodes;
- WordPress administrator sync/status screen.

Current OMOS bridge baseline: **v0.3.0**.

### `plugins/omos-core-tools-v1.4.0` inside `ohi-stack/omos-site`

OMOS-specific WordPress interface layer:

- runtime health/status;
- runtime manifest;
- provider proxy status;
- persistence proxy status;
- Ask OMOS authenticated proxy;
- OMOS-specific shortcodes;
- OMOS Tools/Docs/Council/History/Belief Mapper links;
- WordPress admin Dashboard, App Bridge, Settings, API Keys, Tools, Status, Production Checklist, and Documentation.

Current maturity: **Repository Implemented / Deployment Unverified**.

### `ohi-stack/acc-wp-adapter`

Authoritative for governed WordPress/WooCommerce actions that require authenticated operational writes.

It is not the public OMOS status bridge.

## Current Shared WordPress OMOS Endpoints

OneGodian Platform Plugin v0.3.0+:

```text
GET  /wp-json/onegodian/v1/health
GET  /wp-json/onegodian/v1/manifest
GET  /wp-json/onegodian/v1/omos/status
GET  /wp-json/onegodian/v1/omos/manifest
GET  /wp-json/onegodian/v1/omos/providers
GET  /wp-json/onegodian/v1/omos/persistence
POST /wp-json/onegodian/v1/omos/sync
```

The sync POST is administrator-only and refreshes cached public runtime state; it does not execute an OMOS decision workflow.

## Current OMOS Core Tools Endpoints

```text
GET  /wp-json/omos/v1/status
GET  /wp-json/omos/v1/manifest
GET  /wp-json/omos/v1/health
GET  /wp-json/omos/v1/providers
GET  /wp-json/omos/v1/persistence
POST /wp-json/omos/v1/ask
```

The Ask endpoint requires a logged-in WordPress user and a configured OMOS bridge credential, and calls the canonical OMOS Council endpoint rather than running model providers inside WordPress.

## Runtime Endpoints Consumed By WordPress

The current synchronized contract uses implemented OMOS Node endpoints only:

```text
GET /api/health
GET /api/manifest
GET /api/v1/providers
GET /api/v1/persistence
```

Authenticated OMOS Core Tools additionally uses:

```text
POST /api/v1/council/run
```

No WordPress integration should assume `/api/tools`, `/api/artifacts`, `/api/docs`, `/api/ecosystem`, `/api/bridge/status`, or `/api/v1/nodes/heartbeat` are active until the canonical Node runtime implements and verifies those routes.

## Site Role Matrix

| Property | Canonical role | Shared OMOS status | OMOS Core Tools | Production sync status |
| --- | --- | --- | --- | --- |
| `https://onegodian.org` | Public identity / education / participation | Repository-ready | Optional | Live site reachable; plugin v0.3.0 deployment not independently verified |
| `https://onegodian.com` | Commerce / products / checkout | Repository-ready | Optional commerce modules | Live site reachable; plugin v0.3.0 deployment not independently verified |
| `https://quantumohi.com` | Technology / O-H-I / enterprise | Repository-ready | Recommended | Live site reachable; plugin v0.3.0 deployment not independently verified |
| `https://u.onegodian.org` | Education | Repository-ready where installed | Optional | Not checked in this sync pass |
| `https://omos.onegodian.org` | OMOS WordPress presentation client | Repository-ready target | Primary candidate | Not independently verified as reachable/deployed in this sync pass |
| `https://omos.onegodian.com` | Canonical OMOS runtime | N/A | Source authority | Live/reachable, but latest public production evidence still reports runtime 1.0.1 while repository target is 1.1.0 |

## OMOS.OneGodian.org Policy

The `.org` OMOS property is reserved as a **WordPress presentation/client surface** unless architecture is explicitly changed later.

It must not independently own:

- provider credentials;
- Council execution authority;
- Human Gate state;
- Decision Records;
- production persistence;
- factual verification state.

Those remain with `https://omos.onegodian.com`.

## Cross-Site Content Responsibilities

### OneGodian.org

Use OMOS for:

- public explanation;
- Protocol/Algorithm education;
- Belief Mapper pathways;
- public-safe runtime status;
- links to Ask OMOS, Docs, Digital Sanctuary, and O-H-I.

### OneGodian.com

Use OMOS for:

- products and services;
- OMOS plan/product context;
- entitlement/checkout pathways when separately implemented;
- technical documentation links;
- runtime status where buyer-facing status is useful.

Commerce remains controlled by the commerce layer; the WordPress status bridge does not grant entitlements by itself.

### QuantumOHI.com

Use OMOS for:

- O-H-I/OMOS architecture;
- model/provider status;
- Alignment/Council technical context;
- developer/runtime links;
- enterprise implementation pathways.

## Security and Authority Rules

1. Provider/model credentials remain server-side in the canonical OMOS runtime.
2. Public WordPress REST endpoints must not expose secrets.
3. Shared WordPress sync is read-through and cache-backed.
4. Authenticated Ask OMOS requires a WordPress login plus a bridge credential.
5. Bridge credentials should preferably be supplied as server configuration (`OMOS_BRIDGE_API_KEY`) rather than rendered or exposed in browser markup.
6. Consequential WordPress writes belong to the governed OMOS → Human Gate → ACC → WordPress Adapter path.
7. WordPress properties do not become independent Decision Record authorities.
8. Model agreement remains distinct from factual verification.

## Current Repo-Sync Completion

Repository-level synchronization completed in this pass:

- OneGodian Platform Plugin upgraded to v0.3.0 OMOS bridge contract;
- shared OMOS status/manifest/providers/persistence endpoints added;
- site-role auto-detection added;
- shared OMOS shortcodes added;
- WordPress admin runtime sync/status UI added;
- OMOS integration manifest and documentation added to the shared plugin repo;
- OMOS WordPress target architecture updated to current real runtime endpoints;
- OMOS Core Tools v1.4.0 implementation hardened to current runtime routes;
- non-existent heartbeat route removed from active behavior;
- provider/persistence proxies added to OMOS Core Tools;
- obsolete Council route corrected;
- OMOS Core Tools security boundary documented;
- ACC WordPress Adapter boundary updated so shared status reads and governed writes are not duplicated.

## What Remains for “All Platforms Live-Synced”

Repository synchronization is complete enough to establish one architecture, but live production synchronization still requires property-by-property proof:

1. Deploy OneGodian Platform Plugin v0.3.0+ to each approved WordPress property.
2. Deploy OMOS Core Tools v1.4.0 only where richer OMOS-specific UI/functionality is required.
3. Configure the canonical OMOS runtime URL.
4. Configure a bridge credential only on sites that need authenticated Ask OMOS.
5. Test local WordPress health/manifest/OMOS endpoints.
6. Verify health/manifest/providers/persistence data matches the canonical runtime.
7. Verify approved shortcodes/pages.
8. Test degraded fallback behavior.
9. Record installed plugin versions, endpoint results, screenshots, UTC timestamp, and target domain.
10. Promote each property individually from `repository-ready` → `installed` → `configured` → `connected` → `verified` → `production-verified`.

## Production Rule

> Repository synchronization does not equal live deployment synchronization.

All target properties must be independently proven before “synced across all platforms” is used as a production-status claim.
