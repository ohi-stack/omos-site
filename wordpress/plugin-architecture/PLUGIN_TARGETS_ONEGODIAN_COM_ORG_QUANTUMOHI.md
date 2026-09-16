# OMOS WordPress Runtime Bridge Targets

Status: repository-ready integration baseline  
Canonical Runtime: `https://omos.onegodian.com`  
Canonical Runtime Repository: `ohi-stack/omos-site`  
Shared WordPress Plugin Repository: `ohi-stack/onegodian-platform-plugin`  
Shared Plugin Baseline: `0.3.0`  
Primary Target Properties: `OneGodian.org`, `OneGodian.com`, `QuantumOHI.com`  
Optional OMOS WordPress Presentation Target: `OMOS.OneGodian.org`

## Purpose

The OMOS WordPress integration connects approved OneGodian WordPress properties to the central OMOS runtime.

The integration must not turn each WordPress property into a separate OMOS runtime. The Node runtime remains authoritative for runtime health, model/provider state, governed processing, persistence state, Council execution, and Decision Records.

WordPress remains a presentation, commerce, education, or technology client according to the role of the property.

## Canonical Architecture

```text
                        OMOS CENTRAL RUNTIME
                     https://omos.onegodian.com
                               │
              health / manifest / providers / persistence
                               │
                    OneGodian Platform Plugin
                      ohi-stack/onegodian-platform-plugin
                               │
       ┌───────────────────────┼────────────────────────┐
       │                       │                        │
OneGodian.org           OneGodian.com            QuantumOHI.com
Public / identity       Commerce / store          Technology / OHI
       │                       │                        │
       └───────────────────────┼────────────────────────┘
                               │
                    optional WordPress presentation
                      OMOS.OneGodian.org
```

## Current Runtime Endpoints Used By WordPress

The shared WordPress bridge reads only current, implemented public OMOS endpoints:

```text
GET https://omos.onegodian.com/api/health
GET https://omos.onegodian.com/api/manifest
GET https://omos.onegodian.com/api/v1/providers
GET https://omos.onegodian.com/api/v1/persistence
```

The bridge does **not** assume `/api/tools`, `/api/artifacts`, `/api/docs`, `/api/ecosystem`, or `/api/bridge/status` exist unless those routes are separately implemented and verified in the Node runtime.

## Shared WordPress REST Surface

OneGodian Platform Plugin v0.3.0 exposes:

```text
GET  /wp-json/onegodian/v1/health
GET  /wp-json/onegodian/v1/manifest
GET  /wp-json/onegodian/v1/omos/status
GET  /wp-json/onegodian/v1/omos/manifest
GET  /wp-json/onegodian/v1/omos/providers
GET  /wp-json/onegodian/v1/omos/persistence
POST /wp-json/onegodian/v1/omos/sync
```

`POST /omos/sync` is administrator-only and refreshes the cached public runtime state. It is not an execution endpoint.

## Shared Shortcodes

```text
[onegodian_platform_dashboard]
[onegodian_omos_status]
[onegodian_omos_manifest]
[onegodian_omos_links]
```

OMOS-specific presentation plugins may add additional shortcodes, but these four form the shared cross-platform status baseline.

## Target Site Roles

| Site | Role | OMOS Integration Use |
| --- | --- | --- |
| `OneGodian.org` | Public identity / education / participation | Explain OMOS, display runtime status, link to Protocol, Algorithm, O-H-I, Docs, Belief Mapper, and Ask OMOS. |
| `OneGodian.com` | Commerce / products / checkout | Display OMOS commercial offerings and technical context; commerce remains on the store. |
| `QuantumOHI.com` | Technology / O-H-I / enterprise positioning | Display provider/runtime status, OMOS/O-H-I architecture, developer links, and implementation pathways. |
| `U.OneGodian.org` | Education | Optional OMOS education/status widgets and course references. |
| `OMOS.OneGodian.org` | WordPress presentation client, if deployed | Render OMOS presentation content while consuming the canonical runtime at `omos.onegodian.com`. |

## OMOS.OneGodian.org Boundary

The `.org` OMOS property should be treated as a **presentation client or redirect/alias target**, not a second execution authority, unless the architecture is deliberately changed later.

It must not independently own:

- model provider credentials;
- Council execution authority;
- Decision Record storage;
- production persistence;
- human-gate authority;
- runtime verification state.

Those remain with the canonical OMOS runtime.

## Admin Surfaces

### Canonical Node Admin

```text
https://omos.onegodian.com/admin
```

Responsibilities:

- runtime status;
- provider status;
- persistence status;
- Decision Record inspection;
- human approval/rejection;
- manifest inspection.

### WordPress Shared Admin

OneGodian Platform Plugin reports:

- detected/configured site role;
- canonical OMOS node URL;
- bridge connection state;
- runtime version;
- provider count;
- persistence backend/durability;
- last manual sync timestamp;
- direct link to the OMOS Admin control plane.

## Repository Boundaries

### `ohi-stack/omos-site`

Owns:

- Node/Express runtime;
- Ask OMOS;
- Layer 1 and Alignment execution;
- Council/provider adapters;
- governed synthesis;
- Human Gate;
- Decision Records;
- persistence;
- runtime/admin pages;
- OMOS-specific WordPress source assets.

### `ohi-stack/onegodian-platform-plugin`

Owns:

- shared WordPress service framework;
- cross-property OMOS status synchronization;
- site-role detection;
- WordPress status REST endpoints;
- shared OMOS shortcodes;
- shared admin connection/status UI.

### `ohi-stack/acc-wp-adapter`

Owns or should own authenticated ACC-to-WordPress action operations where a governed control plane needs to perform writes. It is distinct from public/read-through OMOS status sync.

## Security Rules

1. Provider API keys never enter WordPress public markup or public REST responses.
2. WordPress status synchronization is read-through and cache-backed.
3. Consequential OMOS actions require authenticated runtime/control-plane APIs.
4. Human approval remains separate from model agreement and from factual verification.
5. WordPress target sites must not claim independent OMOS runtime authority.
6. A failed node request must render a public-safe degraded/unavailable state rather than fabricated operational data.

## Deployment Checklist — Per Target Site

1. Install OneGodian Platform Plugin v0.3.0 or later.
2. Configure OMOS Node URL as `https://omos.onegodian.com`.
3. Confirm target-site role.
4. Test local `/wp-json/onegodian/v1/health`.
5. Test local `/wp-json/onegodian/v1/omos/status`.
6. Confirm the OMOS runtime version is returned.
7. Confirm provider status is returned without secrets.
8. Confirm persistence status is returned.
9. Trigger one administrator OMOS sync and record the UTC timestamp.
10. Add approved shortcodes to site-specific pages.
11. Test the degraded fallback by temporarily simulating node unavailability in staging.
12. Capture screenshots and endpoint evidence.
13. Mark the property `verified` only after those checks pass.

## Maturity States

```text
repository-ready
→ installed
→ configured
→ connected
→ verified
→ production-verified
```

A Git commit does not by itself advance a target WordPress property past `repository-ready`.
