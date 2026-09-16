# OMOS Core Tools v1.4.0

OMOS-specific WordPress interface package for OneGodian properties that need richer OMOS presentation and governed runtime access.

## Architectural Role

OMOS Core Tools is **not** the shared transport layer for every OneGodian WordPress property.

The canonical division is:

- `ohi-stack/omos-site` — canonical OMOS Node/Express runtime and OMOS-specific WordPress source.
- `ohi-stack/onegodian-platform-plugin` v0.3.0+ — shared WordPress infrastructure and common read-through OMOS status synchronization.
- `OMOS Core Tools v1.4.0` — OMOS-specific UI, shortcodes, workspace surfaces, and optional authenticated runtime features layered on top of the shared platform contract.
- `ohi-stack/acc-wp-adapter` — governed ACC-to-WordPress action adapter for authenticated operational writes.

This separation prevents each WordPress site from implementing its own competing OMOS bridge.

## Canonical Runtime

`https://omos.onegodian.com`

The canonical runtime owns:

- Layer 1 and Alignment execution;
- provider/model credentials;
- Council orchestration;
- governed synthesis;
- Human Gate state;
- Decision Records;
- persistence and audit state.

WordPress remains a client/interface layer.

## WordPress Presentation Target

`https://omos.onegodian.org` may be used as an OMOS WordPress presentation surface if deployed, but it remains a client of the canonical runtime at `omos.onegodian.com`.

It must not become a second independent runtime authority unless that architecture is intentionally revised and documented.

## Shared-Plugin Dependency Boundary

Where `OneGodian Platform Plugin` v0.3.0+ is available, OMOS Core Tools should reuse its shared runtime-status contract rather than duplicating it.

Shared status capabilities include:

```text
GET  /wp-json/onegodian/v1/omos/status
GET  /wp-json/onegodian/v1/omos/manifest
GET  /wp-json/onegodian/v1/omos/providers
GET  /wp-json/onegodian/v1/omos/persistence
POST /wp-json/onegodian/v1/omos/sync
```

OMOS Core Tools may add richer OMOS-specific endpoints under `/wp-json/omos/v1/`, but overlapping endpoints should delegate to or remain compatible with the shared plugin contract.

## Planned / OMOS-Specific Capabilities

- OMOS runtime connection/status screen
- Ask OMOS interface/embed
- Council presentation and run inspection
- Decision History presentation
- Belief Mapper presentation
- OMOS Tools and Docs grids
- Unity Dashboard presentation
- node registration/heartbeat contract where the runtime endpoint exists
- capability-safe admin access and nonce-protected WordPress operations
- production checklist and documentation screens

No provider API keys should be stored in public WordPress content or returned by WordPress public REST endpoints. Model credentials remain server-side in OMOS.

## Shortcodes

OMOS-specific shortcode targets:

```text
[omos_runtime_status]
[omos_manifest]
[omos_ask]
[omos_council]
[omos_tool_grid]
[omos_docs_grid]
[omos_decision_history]
[omos_belief_mapper]
[omos_unity_dashboard]
```

Shared cross-platform status shortcodes supplied by OneGodian Platform Plugin v0.3.0+:

```text
[onegodian_platform_dashboard]
[onegodian_omos_status]
[onegodian_omos_manifest]
[onegodian_omos_links]
```

## Target Properties

| Property | Core Tools Use | Shared Platform Bridge |
| --- | --- | --- |
| OneGodian.org | Optional OMOS education/status modules | Recommended |
| OneGodian.com | Optional OMOS commerce/product modules | Recommended |
| QuantumOHI.com | Recommended OMOS/O-H-I/developer modules | Recommended |
| U.OneGodian.org | Optional educational modules | Recommended where platform plugin is present |
| OMOS.OneGodian.org | Primary WordPress presentation candidate | Required if this property is deployed as a client |

## Maturity

Current package state: **Development / package scaffold**.

The README and architecture contract exist, but v1.4.0 must not be represented as a production-installed plugin until its executable package, REST routes, shortcodes, admin screens, security checks, and target-property installation tests are present and verified.

## Production Rule

> Repository-ready is not deployment proof.

A target WordPress property is considered synchronized only after the plugin(s) are installed, the canonical OMOS node is configured, health/manifest/provider/persistence reads succeed, intended shortcodes render correctly, and target-specific evidence is recorded.
