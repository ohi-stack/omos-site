# OMOS WordPress Plugin Production Integration Plan

Prepared for: ONEGODIAN, LLC  
Updated: 2026-09-16  
Canonical runtime: `https://omos.onegodian.com`  
Canonical bridge package: `plugins/omos-core-tools-v1.3.0/`

## Purpose

OMOS WordPress functionality is a distributed **client bridge** to the central OMOS runtime. WordPress may present OMOS status, tools, artifacts, launch surfaces, authorized Decision Record views, and site-specific commerce/education integrations. WordPress must not become a second Layer 1 / Alignment / Council / Synthesis / Decision Record runtime.

Canonical architecture: `docs/OMOS-WORDPRESS-BRIDGE-ARCHITECTURE-2026-09-16.md`.

## Domain roles

### OMOS.OneGodian.com

Central runtime and technical source of governed OMOS state:

- Ask OMOS runtime
- Layer 1
- Alignment Engine
- Council / Model Gateway
- Governed Synthesis
- Human Gate state
- canonical Decision Records and History
- provider/runtime provenance
- connector contracts and runtime health

### OneGodian.com

Commercial/member-facing WordPress property:

- OMOS product pathways
- WooCommerce products/orders as commerce source of record where applicable
- entitlement bridge into OMOS
- Ask OMOS launcher
- approved Decision Record/history views for authenticated users
- tool/artifact cards

### OneGodian.org

Public interpretation/educational WordPress property:

- OMOS explainers
- Protocol / Algorithm / O-H-I education
- public tools and artifact links
- public-safe runtime status
- contributor/learning pathways

### QuantumOHI.com

Technical/O-H-I WordPress property:

- O-H-I/Council architecture
- runtime/connector status
- technical documentation links
- approved enterprise/integration pathways

## v1.3.0 reference bridge scope

Implemented source baseline:

1. `OMOS Core Tools` plugin bootstrap.
2. Server-side `OMOS_Runtime_Client`.
3. HTTPS OMOS runtime URL setting.
4. Site profiles for OneGodian.com, OneGodian.org, QuantumOHI.com, and generic WordPress clients.
5. Runtime health retrieval from `/api/health`.
6. Runtime manifest retrieval from `/api/manifest`.
7. Safe WordPress REST status + bridge manifest.
8. `[omos_runtime_status]`.
9. `[omos_manifest]`.
10. `[omos_open_console_button]`.
11. `[omos_ask_launcher]`.
12. Server-only authenticated-request key boundary using `OMOS_RUNTIME_API_KEY`.
13. No external write/action capabilities enabled by default.

## Legacy/source assets

The repository also contains the older `wordpress/omos-platform-console.php`, page installer, menu builder, navigation assets, consensus widget, shortcode registry, and architecture documents. They are source material for modular migration. Any placeholder renderer remains a placeholder and must not be advertised as an operational OMOS capability.

## Production phases

### Phase 0 — canonical runtime parity

Before treating any WordPress integration as production-connected:

- deploy OMOS 1.1.0/current approved main to the canonical host;
- verify exact deployed SHA;
- verify durable PostgreSQL;
- verify health + manifest;
- complete OMOS-REF-0001 production evidence.

### Phase 1 — bridge activation on staging

For each WordPress property:

- activate `omos-core-tools`;
- set the runtime URL to `https://omos.onegodian.com`;
- select/verify the site profile;
- test server-side health and manifest;
- verify public status fallback when runtime is unavailable;
- verify no runtime key appears in HTML/REST/JS/logs.

### Phase 2 — manifest/content synchronization

Add allowlisted, versioned, idempotent synchronization for:

- OMOS tool catalog
- artifact catalog
- documentation links
- approved runtime status metadata
- page/module manifest where intentionally managed centrally

WordPress remains source of record for its own published posts/pages unless a specific field/object is explicitly delegated to OMOS synchronization.

### Phase 3 — authenticated Decision Record client

Add an authenticated server-side OMOS client for:

- user's authorized run history
- Decision Record retrieval
- safe status/provenance summaries
- approved Human Gate interactions only when the OMOS authorization contract is satisfied

Never expose an OMOS service credential to the browser. Preserve owner/tenant isolation.

### Phase 4 — OneGodian.com commerce entitlement bridge

Map WooCommerce/customer entitlement state into OMOS using minimum necessary data, stable source IDs, provenance, timestamps, and revocation state.

OMOS consumes the entitlement. It does not become the WooCommerce order ledger or payment processor.

### Phase 5 — separately authorized actions

Publishing, editing, deleting, emailing, charging, refunding, deploying, or other consequential WordPress actions do not belong to ordinary sync.

Use:

```text
OMOS governed decision
→ Human Gate / policy authorization
→ ACC / action router
→ WordPress action adapter
→ target result receipt
→ OMOS audit / Decision Record outcome
```

## Security requirements

- HTTPS only for runtime calls.
- Runtime key server-side only; `wp-config.php`/environment preferred.
- No arbitrary browser-supplied target URLs.
- Bounded timeouts and redirects.
- Sanitize input; escape output.
- Nonces + WordPress capability checks for WordPress mutations.
- Least-privilege external permissions.
- Idempotency for write operations.
- Audit receipts for writes/actions.
- No sensitive Decision Record caching on public pages.
- No automatic equation of WordPress user IDs with OMOS owner IDs without an explicit identity map.

## Deployment acceptance

A site is not an operational OMOS WordPress bridge merely because the plugin is installed. It must prove:

- plugin activation succeeds;
- site profile is correct;
- central runtime is reachable server-to-server;
- manifest/version state is accurate;
- shortcodes fail safely;
- secrets are absent from public output;
- source-of-record boundaries are correct;
- authenticated modules preserve owner isolation;
- entitlement state can be revoked/reconciled;
- any action path requires and records the correct authorization.

## Production rule

If a feature is not operational, documented, tested, observable, repeatable, and usable on the target WordPress property, it is not part of the production plugin version.
