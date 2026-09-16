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

Where `OneGodian Platform Plugin` v0.3.0+ is available, OMOS Core Tools should reuse its shared runtime-status contract rather than redefining the cross-site authority model.

Shared status capabilities include:

```text
GET  /wp-json/onegodian/v1/omos/status
GET  /wp-json/onegodian/v1/omos/manifest
GET  /wp-json/onegodian/v1/omos/providers
GET  /wp-json/onegodian/v1/omos/persistence
POST /wp-json/onegodian/v1/omos/sync
```

OMOS Core Tools adds richer OMOS-specific endpoints under `/wp-json/omos/v1/`.

## Implemented v1.4.0 Runtime Contract

The plugin source now implements:

```text
GET  /wp-json/omos/v1/status
GET  /wp-json/omos/v1/manifest
GET  /wp-json/omos/v1/health
GET  /wp-json/omos/v1/providers
GET  /wp-json/omos/v1/persistence
POST /wp-json/omos/v1/ask
```

`POST /omos/v1/ask` requires a logged-in WordPress user and a configured OMOS bridge key. It proxies to the canonical authenticated Council endpoint rather than running models inside WordPress.

Current canonical runtime reads are limited to routes that actually exist in the OMOS Node runtime:

```text
/api/health
/api/manifest
/api/v1/providers
/api/v1/persistence
```

Node heartbeat/registration is intentionally **not active** in this plugin version because the canonical OMOS runtime does not currently expose a verified `/api/v1/nodes/heartbeat` contract.

## Implemented Shortcodes

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

## Admin Screens

The v1.4.0 source provides:

- OMOS Dashboard
- App Bridge
- Settings
- API Keys
- Tools
- Status
- Production Checklist
- Documentation

The Status screen reads health, manifest, provider state, and persistence state from the canonical runtime.

## Security Boundary

- Provider API keys stay server-side in the OMOS runtime.
- The plugin may hold only an OMOS bridge credential for authenticated runtime access.
- `OMOS_BRIDGE_API_KEY` supplied through server configuration is preferred over storing a bridge key in WordPress options.
- Public REST endpoints expose status/manifest information only.
- Authenticated Ask OMOS requires a logged-in WordPress user plus the bridge credential.
- WordPress does not become the authoritative Decision Record store.
- Consequential external-system writes remain under the OMOS → Human Gate → ACC → action-adapter path.

## Target Properties

| Property | Core Tools Use | Shared Platform Bridge |
| --- | --- | --- |
| OneGodian.org | Optional OMOS education/status modules | Recommended |
| OneGodian.com | Optional OMOS commerce/product modules | Recommended |
| QuantumOHI.com | Recommended OMOS/O-H-I/developer modules | Recommended |
| U.OneGodian.org | Optional educational modules | Recommended where platform plugin is present |
| OMOS.OneGodian.org | Primary WordPress presentation candidate | Required if this property is deployed as a client |

## Maturity

Current package state: **Repository Implemented / Deployment Unverified**.

Executable plugin code, REST proxies, shortcodes, settings, status screens, credential boundary, and production checklist now exist in the repository. This is still not proof that v1.4.0 is installed or functioning on any target WordPress production site.

## Production Verification Gates

Before a target site is marked synchronized/verified:

1. Install the shared platform plugin v0.3.0+ where applicable.
2. Install OMOS Core Tools v1.4.0 where richer OMOS UI is required.
3. Configure `https://omos.onegodian.com` as the canonical runtime.
4. Verify health, manifest, providers, and persistence proxies.
5. Verify approved shortcodes render correctly.
6. Verify authenticated Ask OMOS works only for logged-in users with a valid bridge credential.
7. Verify no provider credentials appear in WordPress output or REST responses.
8. Verify degraded behavior when the central runtime is unavailable.
9. Record target-site screenshots, endpoint responses, plugin versions, and UTC timestamps.

## Production Rule

> Repository-ready is not deployment proof.

A target WordPress property is considered synchronized only after the plugin(s) are installed, the canonical OMOS node is configured, health/manifest/provider/persistence reads succeed, intended shortcodes render correctly, and target-specific evidence is recorded.
