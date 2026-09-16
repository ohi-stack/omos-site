# OMOS Core Tools — Production WordPress Bridge Structure

Status: v1.3.0 architecture baseline  
Canonical runtime: `https://omos.onegodian.com`  
Canonical runtime repository: `ohi-stack/omos-site`  
Reference plugin source: `plugins/omos-core-tools-v1.3.0/`

## 1. Role

`omos-core-tools` is a WordPress **client bridge** to the canonical OMOS Node/Express runtime. It may render approved OMOS data, launch OMOS experiences, synchronize allowlisted manifests, bridge entitlements, and expose site-specific WordPress integration surfaces.

It must **not** reproduce Layer 1, Alignment, Council orchestration, Governed Synthesis, Human Gate authority, or the canonical Decision Store in WordPress.

Target WordPress properties:

- OneGodian.com — commerce/member-facing bridge
- OneGodian.org — public education/interpretation bridge
- QuantumOHI.com — O-H-I/technical integration bridge
- additional WordPress properties only through an explicit site profile and source-of-record contract

OMOS.OneGodian.com remains the central OMOS runtime rather than a WordPress plugin host.

## 2. Production directory target

```text
omos-core-tools/
├── omos-core-tools.php
├── readme.txt
├── uninstall.php
│
├── includes/
│   ├── class-omos-core-tools.php
│   ├── class-omos-runtime-client.php
│   ├── class-omos-site-profile.php
│   ├── class-omos-manifest-sync.php
│   ├── class-omos-shortcodes.php
│   ├── class-omos-admin.php
│   ├── class-omos-system-health.php
│   ├── class-omos-decision-record-client.php
│   ├── class-omos-entitlements.php
│   ├── class-omos-audit.php
│   └── class-omos-webhooks.php
│
├── admin/
│   ├── views/
│   │   ├── dashboard.php
│   │   ├── connection.php
│   │   ├── sync.php
│   │   ├── entitlements.php
│   │   ├── audit.php
│   │   └── settings.php
│   ├── css/omos-admin.css
│   └── js/omos-admin.js
│
├── public/
│   ├── css/omos-public.css
│   └── js/omos-public.js
│
└── templates/
    ├── runtime-status.php
    ├── manifest-card.php
    ├── ask-launcher.php
    ├── decision-history.php
    └── artifact-grid.php
```

The current v1.3.0 reference source implements the bootstrap, runtime client, control layer, bridge status/manifest REST routes, and initial shortcodes. The remaining classes above are modularization/next-increment targets rather than claims of current completion.

## 3. Core responsibilities

### Runtime client

Server-to-server HTTPS access to the canonical OMOS APIs. Provider/model keys remain at OMOS; the WordPress bridge needs only its own OMOS client credential when authenticated calls are enabled.

### Site profile

Controls which WordPress integration modules are appropriate for the host. A profile is configuration, not authorization.

### Manifest synchronization

Synchronizes allowlisted OMOS tools/artifacts/docs/status projections with provenance, source IDs, hashes/versions, timestamps, conflict policy, and idempotency.

### Decision Record client

Displays only records the authenticated OMOS identity/tenant is authorized to retrieve. WordPress does not become the canonical Decision Store.

### Entitlement adapter

On OneGodian.com, translates WooCommerce/customer entitlement state into an OMOS-readable entitlement claim with source identifiers and revocation state. Payment/order truth remains with the commerce source.

### Action boundary

Consequential WordPress writes are not enabled by normal sync. They require a separately authorized action path such as OMOS → Human Gate → ACC → WordPress action adapter → result receipt → OMOS audit.

## 4. v1.3.0 implemented baseline

The reference package currently provides:

- WordPress admin `OMOS Bridge` screen;
- HTTPS runtime URL setting;
- automatic/manual site profile;
- server-side runtime client;
- health retrieval from `/api/health`;
- manifest retrieval from `/api/manifest`;
- provider/persistence client methods for later diagnostics;
- `/wp-json/omos/v1/bridge/status`;
- `/wp-json/omos/v1/manifest`;
- `[omos_runtime_status]`;
- `[omos_manifest]`;
- `[omos_open_console_button]`;
- `[omos_ask_launcher]`;
- server-only `OMOS_RUNTIME_API_KEY` boundary;
- zero external write capabilities by default.

## 5. Existing WordPress source assets

The canonical repository also contains legacy/prototype components including:

- `wordpress/omos-platform-console.php`
- `wordpress/omos-page-generator.php`
- `wordpress/omos-ai-consensus-widget.php`
- navigation/menu builders
- page templates
- shortcode registry

These are migration inputs. They do not override the central-runtime architecture. A registered shortcode that renders only a placeholder is not an operational feature.

## 6. WordPress REST baseline

Current reference bridge:

```text
GET /wp-json/omos/v1/bridge/status
GET /wp-json/omos/v1/manifest
```

Future read surfaces may include tools, artifacts, docs, and authorized Decision Record projections. Future write routes must require WordPress capability checks, nonces where browser-admin initiated, explicit OMOS/ACC authorization where consequential, idempotency, and audit receipts.

## 7. Public shortcode baseline

```text
[omos_runtime_status]
[omos_manifest]
[omos_open_console_button]
[omos_ask_launcher]
```

Additional artifact/tool/history shortcodes should be promoted only after their backing data path is connected and tested.

## 8. Source-of-record rules

| Data | Authority |
| --- | --- |
| Governed OMOS runs / Decision Records | OMOS runtime + durable Decision Store |
| Model/Council provenance | OMOS runtime |
| WordPress pages/posts | owning WordPress site |
| WooCommerce products/orders | OneGodian.com/WooCommerce where applicable |
| OMOS tool/artifact manifest | OMOS runtime |
| WordPress execution result | target WordPress site, with receipt returned to OMOS |

Synchronization never changes source authority by itself.

## 9. Security rules

1. OMOS runtime secrets are never exposed to browser code.
2. `OMOS_RUNTIME_API_KEY` is server-side only; environment/`wp-config.php` is preferred.
3. All runtime URLs must use HTTPS.
4. Sanitize input and escape output.
5. WordPress mutations require appropriate capabilities and nonce protection.
6. Remote actions require least privilege and explicit authorization.
7. Never persist raw external credentials in Decision Records.
8. Preserve identity/tenant ownership on authenticated OMOS requests.
9. Redact sensitive data from logs/status output.
10. Public bridge health proves connectivity only; it does not prove factual truth or authorization to act.

## 10. Production sequence

1. Establish canonical OMOS 1.1.0 live-host parity.
2. Stage v1.3.0 on OneGodian.com, OneGodian.org, and QuantumOHI.com.
3. Verify activation, runtime health, manifest compatibility, safe failure behavior, and secret non-exposure.
4. Add signed/versioned manifest sync.
5. Add authorized Decision Record/history client.
6. Add OneGodian.com WooCommerce entitlement adapter.
7. Connect consequential WordPress actions through ACC/separate action authorization.
8. Add PHP/WordPress regression tests and packaging checks.
9. Publish a release ZIP only after the target installation is documented, tested, repeatable, and usable.

Canonical details: `docs/OMOS-WORDPRESS-BRIDGE-ARCHITECTURE-2026-09-16.md`.
