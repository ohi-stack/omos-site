# OMOS WordPress Bridge Architecture — 2026-09-16

## Authority

Canonical OMOS runtime: `https://omos.onegodian.com`  
Canonical runtime/source repository: `ohi-stack/omos-site`  
Canonical WordPress bridge package source: `plugins/omos-core-tools-v1.3.0/`

WordPress is a distributed client and publishing/commerce surface for OMOS. It is **not** a second OMOS reasoning runtime.

## Architectural rule

```text
WordPress User / Site
        ↓
OMOS Core Tools WordPress Bridge
        ↓  server-to-server HTTPS
OMOS Runtime / Model Gateway / Decision Store
        ↓
Human Gate / Decision Record / History
        ↓ (only when separately authorized)
ACC / Connector Action Layer
        ↓
External System
```

The following stay in the central OMOS runtime:

- Layer 1 distillation
- Alignment Engine
- Model Gateway / Council orchestration
- Governed Synthesis
- Human Gate state
- canonical Decision Records
- runtime provider provenance
- durable Decision Record history

The WordPress plugin may present, launch, synchronize, and display approved OMOS functions, but it must not silently fork or reimplement those authorities locally.

## Repository roles

| Repository | Role |
| --- | --- |
| `ohi-stack/omos-site` | Canonical OMOS runtime, APIs, schemas, WordPress bridge contract, and reference bridge package. |
| `ohi-stack/onegodian-platform-plugin` | OneGodian WordPress platform shell and consumer integration. May expose OMOS Core Tools modules but must point back to the canonical OMOS runtime. |
| `ohi-stack/acc-wp-adapter` | Separately authorized WordPress execution/action adapter. It is not the normal OMOS read/sync bridge and must not bypass Human Gate/ACC authorization. |
| Domain-specific WordPress repositories | Site/business-specific capabilities. Integrate through declared contracts rather than being absorbed into OMOS Core Tools. |

## Site profiles

### OneGodian.com — commerce and member-facing product surface

WordPress remains authoritative for its published commerce pages and, where WooCommerce is used, product/order state. OMOS may receive entitlement state required to authorize a governed product experience.

Bridge responsibilities:

- OMOS product/feature cards
- Ask OMOS launcher
- authenticated member Decision Record/history display when implemented
- WooCommerce entitlement adapter
- runtime/version status
- approved artifact/tool displays

OMOS must not fabricate an entitlement or payment state. Payment/order truth comes from the applicable commerce source.

### OneGodian.org — public interpretation and education

Bridge responsibilities:

- public OMOS explanations
- Protocol/Algorithm/O-H-I links
- public tools approved for embedding
- artifact/document links
- public-safe runtime status
- Ask OMOS links or approved lightweight launch surfaces

OneGodian.org should not become the heavy OMOS execution/control-plane host.

### QuantumOHI.com — technical/O-H-I integration surface

Bridge responsibilities:

- O-H-I and Council explanations
- OMOS runtime/connector status modules
- developer/integration links
- technical artifacts
- approved enterprise/service pathways

## WordPress bridge layers

### 1. Runtime Client

`OMOS_Runtime_Client` owns all server-to-server calls to the canonical OMOS runtime.

Requirements:

- HTTPS only
- finite timeout
- bounded redirects
- JSON validation
- normalized WordPress errors
- no browser-side runtime secret
- `OMOS_RUNTIME_API_KEY` only for authenticated server-side requests

### 2. Site Profile

Each installation declares or auto-detects its role. Site profile determines which modules may be enabled; it never grants external authority by itself.

### 3. Manifest / Sync Layer

Future production sync should pull a versioned OMOS manifest and reconcile only allowlisted objects. Every synchronized object should retain:

- source system
- source object ID
- OMOS/external reference
- source version or hash where available
- observed timestamp
- sync timestamp
- sync direction
- provenance state
- conflict/source-of-record policy

Use webhook/event delivery where reliable and polling as a fallback. Sync must be idempotent.

### 4. Presentation Layer

Shortcodes/blocks render safe OMOS data inside WordPress. Presentation code must not contain OMOS reasoning business logic.

v1.3.0 baseline shortcodes:

```text
[omos_runtime_status]
[omos_manifest]
[omos_open_console_button]
[omos_ask_launcher]
```

### 5. Commerce / Entitlement Adapter

OneGodian.com may map WooCommerce state into OMOS entitlement claims. The adapter must transmit the minimum required state and retain source IDs/provenance. OMOS consumes entitlement state; it does not become the payment processor or order ledger.

### 6. Decision Record Client

Future authenticated modules may list and render Decision Records belonging to the authorized user/tenant. They must respect OMOS owner isolation and must not cache sensitive records publicly.

### 7. Action Boundary

Ordinary bridge sync is not permission to publish, delete, charge, merge, email, deploy, or otherwise perform consequential external actions.

Action flow:

```text
Governed OMOS decision
→ Human Gate / policy authorization
→ ACC or authorized action router
→ WordPress action adapter
→ WordPress result/receipt
→ OMOS audit + Decision Record outcome
```

## Source-of-record matrix

| Data class | Source of record | OMOS/WordPress behavior |
| --- | --- | --- |
| Governed Decision Record | OMOS durable Decision Store | WordPress displays authorized projections only. |
| OMOS provider/Council provenance | OMOS | WordPress may display safe summaries. |
| WordPress published page/post | Individual WordPress site | OMOS may reference/sync metadata but does not become publisher automatically. |
| WooCommerce products/orders | OneGodian.com/WooCommerce where applicable | OMOS consumes authorized entitlement/commerce state. |
| OMOS artifact/tool manifest | OMOS | WordPress may cache/render versioned projections. |
| User identity/session | Owning application/site identity system | Bridge maps identities explicitly; no implicit account equivalence. |
| External actions | ACC/action system + target source receipt | Persist receipt/provenance back to OMOS. |

## Security baseline

- no raw OMOS key in HTML or JavaScript;
- prefer a server environment or `wp-config.php` constant for runtime credentials;
- never return secrets through WordPress REST;
- sanitize input and escape output;
- WordPress writes require capability checks and nonces;
- remote mutations require explicit capability plus OMOS/ACC authorization where applicable;
- reject arbitrary remote URLs/SSRF-style configuration in production policy;
- use least-privilege scopes;
- redact sensitive payloads from logs;
- preserve tenant/user ownership on Decision Record requests;
- maintain idempotency keys and audit receipts for writes.

## Current implementation status

### Implemented in reference package source

`plugins/omos-core-tools-v1.3.0/` now contains:

- plugin bootstrap;
- server-side runtime client;
- WordPress admin bridge screen;
- HTTPS runtime URL setting;
- site profiles;
- runtime health check;
- runtime manifest retrieval;
- safe bridge REST status/manifest routes;
- four public shortcodes;
- server-only credential boundary;
- zero external write capabilities by default.

### Existing legacy/prototype assets

The repository also contains `wordpress/omos-platform-console.php`, page generators, navigation builders, consensus widgets, and other WordPress experiments. These remain useful source material, but they are not allowed to redefine the canonical architecture. Features that merely render placeholders must not be represented as production functionality.

## Production gates

A WordPress installation is considered an operational OMOS bridge only after all applicable checks pass:

1. plugin activates without PHP errors;
2. target site profile is correct;
3. `/api/health` and `/api/manifest` are reachable server-to-server;
4. runtime version/status is displayed accurately;
5. no secret reaches page source, REST output, logs, or browser JS;
6. shortcodes render with safe failure states;
7. WordPress permissions and nonce behavior are tested;
8. site-specific source-of-record boundaries are verified;
9. any entitlement adapter is tested against real staging orders without creating false entitlement state;
10. any action/write adapter has separate Human Gate/ACC authorization and an auditable result receipt.

## Next engineering increment

After OMOS 1.1.0 production parity is established, the WordPress bridge priority is:

1. stage `omos-core-tools` on OneGodian.com, OneGodian.org, and QuantumOHI.com;
2. prove health/manifest compatibility against the canonical runtime;
3. add signed/versioned manifest synchronization;
4. add Decision Record/history client with owner isolation;
5. add WooCommerce entitlement bridge on OneGodian.com;
6. connect separately authorized WordPress actions through ACC rather than giving the ordinary bridge broad write power;
7. add PHP/WordPress regression tests and package a release ZIP only after those gates pass.
