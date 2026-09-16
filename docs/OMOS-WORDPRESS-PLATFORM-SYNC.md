# OMOS WordPress + Cross-Platform Synchronization

**Date:** September 16, 2026  
**Canonical runtime repository:** `ohi-stack/omos-site`  
**Canonical runtime host:** `https://omos.onegodian.com`  
**WordPress bridge package:** `omos-core-tools` v1.3.0  
**Status:** Repository integration implemented; live target-by-target deployment verification still required.

## 1. Source-of-truth hierarchy

```text
ohi-stack/omos-site @ main
│
├── Node/Express OMOS runtime
│   └── https://omos.onegodian.com
│
├── OMOS Core Tools v1.3.0
│   └── read-only WordPress bridge package
│
├── Google AI Studio mirror
│   └── ohi-stack/OneGodian-Metaphysical-Operating-System-AI-Studio
│       scheduled sync from canonical main; mirror is not runtime authority
│
├── Shared WordPress platform architecture
│   └── ohi-stack/onegodian-platform-plugin
│
├── WordPress action/execution adapter
│   └── ohi-stack/acc-wp-adapter
│       separate authority path; not part of the public read-only bridge
│
├── ACC control plane
│   └── ohi-stack/acc
│
└── OLLM provider runtime
    └── ohi-stack/onegodian-llm
```

The canonical repository wins on OMOS runtime behavior, public OMOS APIs, plugin bridge contracts, versioning, and production evidence requirements.

## 2. Domain architecture

### `omos.onegodian.com`

Role: **canonical OMOS runtime**.

This is the source for runtime health, manifest, ecosystem, tools, artifacts, documentation, governed workspace, providers, persistence, and other OMOS Node APIs.

### `omos.onegodian.org`

Role: **WordPress presentation client** unless the domain policy is intentionally changed later.

It may present OMOS pages and WordPress-managed editorial content, but runtime truth must come from `https://omos.onegodian.com`. It must not create a second independent OMOS state store or label WordPress-local state as canonical runtime state.

As of this synchronization record, the `.org` presentation host has not been independently verified as deployed and connected. That is a live deployment gate, not a repository assumption.

## 3. WordPress targets

| Property | Role | Required | Bridge behavior |
| --- | --- | ---: | --- |
| `OneGodian.com` | Commerce | Yes | Read OMOS product/tool/artifact/status data; checkout remains on OneGodian.com. |
| `OneGodian.org` | Public identity + education | Yes | Read public OMOS explanations, docs, tools, and status. |
| `QuantumOHI.com` | Technology positioning | Yes | Read OMOS/O-H-I technical, alignment, docs, and developer pathways. |
| `OMOS.OneGodian.org` | OMOS WordPress presentation | Yes | Present OMOS through WordPress while sourcing runtime state from the canonical `.com` node. |
| `U.OneGodian.org` | Education | Optional | Optional read-only OMOS status/learning bridge. |

## 4. OMOS Core Tools v1.3.0

The canonical package now lives at:

```text
plugins/omos-core-tools-v1.3.0/
```

Repository implementation:

```text
omos-core-tools.php
includes/class-omos-node-client.php
includes/class-omos-shortcodes.php
includes/class-omos-admin.php
readme.txt
uninstall.php
```

### Runtime characteristics

- HTTPS-only configurable OMOS Node URL.
- Default Node: `https://omos.onegodian.com`.
- Public Node requests are allowlisted.
- Read-only remote transport; no WordPress-to-OMOS write call is enabled in this package.
- Five-minute WordPress transient caching.
- Public-safe bridge status route.
- Admin-only Node settings and health/sync checks.
- No provider API keys, database credentials, or OMOS private keys are stored or exposed by the bridge.
- Bridge Builder remains explicitly planned/non-operational.

### Public shortcodes

```text
[omos_manifest]
[omos_runtime_status]
[omos_system_status]
[omos_ecosystem_cards]
[omos_tool_grid]
[omos_artifact_grid]
[omos_docs_grid]
[omos_open_console_button]
[omos_unity_dashboard]
[omos_bridge_builder]
```

### Local WordPress status endpoint

```text
GET /wp-json/omos/v1/bridge/status
```

A target is not considered synchronized merely because this route exists. Verification requires the expected plugin version, canonical Node URL, read-only authority state, successful OMOS health check, and successful OMOS manifest check.

## 5. Node endpoints consumed by WordPress

```text
/api/health
/api/manifest
/api/ecosystem
/api/tools
/api/artifacts
/api/docs
/api/bridge/status
```

Unavailable Node modules must render public-safe fallback states. They must not be represented as operational.

## 6. Repository synchronization

The AI Studio repository is synchronized from `ohi-stack/omos-site@main` by a scheduled GitHub Actions workflow. Its synchronization record must identify the canonical SHA that was mirrored.

The shared WordPress platform repository may document and discover the OMOS integration, but it must not fork the OMOS bridge implementation. The installable `omos-core-tools` source remains in the canonical OMOS repository.

`acc-wp-adapter` is a separate action/execution concern. A future WordPress write or consequential action must route through authenticated ACC/authorization controls rather than being added to the public read-only OMOS bridge.

## 7. Verification commands

Repository package contract:

```bash
npm run verify:wordpress-bridge
```

Live target verification:

```bash
npm run verify:wordpress-targets
```

To make required WordPress targets a deployment gate:

```bash
OMOS_REQUIRE_WORDPRESS_TARGETS=true npm run verify:wordpress-targets
```

The live verifier checks:

1. expected `omos-core-tools` version;
2. canonical Node URL;
3. read-only bridge authority;
4. remote OMOS `/api/health` connectivity;
5. remote OMOS `/api/manifest` connectivity.

## 8. Production evidence per property

Retain this evidence for each target:

- WordPress site URL;
- installed plugin version;
- deployment timestamp UTC;
- plugin package/source SHA or release identifier;
- configured OMOS Node URL;
- `/wp-json/omos/v1/bridge/status` response;
- OMOS health result;
- OMOS manifest result;
- shortcode/page smoke screenshots;
- WordPress/PHP version;
- approving operator/reference;
- rollback plugin version.

## 9. Maturity boundary

The repository-side plugin package may be called **repository-ready** after its contract verification passes.

A WordPress property is **Verified** only after its installed runtime passes the target verifier and page/shortcode smoke checks.

“Synced across all platforms” therefore means all required properties independently pass the same canonical version and Node contract. Repository synchronization alone is not sufficient.
