# OMOS Node Content and Plugin Bridge Plan

Status: v1.0 setup plan  
Target Node: `https://omos.onegodian.com`  
Primary Repo: `ohi-stack/omos-site`  
Primary Plugin: `omos-core-tools`  
Plugin Targets: `OneGodian.com`, `OneGodian.org`, `QuantumOHI.com`

## 1. Operational Purpose

OMOS.OneGodian.com is the dedicated protocol, specification, and alignment system node for the OneGodian digital ecosystem. It must remain separate from commerce, LMS, galaxy/lore, and capital/funding properties.

The node should publish and serve:

- OMOS documentation;
- OMOS-1.0 protocol pages;
- OneGodian Algorithm pages;
- OHI / model synthesis explanations;
- alignment API documentation;
- developer-facing schemas and manifests;
- human / AI / agent / humanoid alignment framework;
- tool pages such as Bridge-Builder;
- artifact and download references;
- runtime health and manifest endpoints.

## 2. Repository Responsibilities

| Repository | Responsibility |
| --- | --- |
| `ohi-stack/omos-site` | Node runtime, OMOS public pages, content manifest, environment variables, protocol/spec documentation, WXR/plugin support assets. |
| `ohi-stack/onegodian-app` | Control plane that mirrors OMOS and all ecosystem properties as system cards. |
| `ohi-stack/onegodian-protocol` | Canonical protocol specification, schemas, examples, and developer-facing alignment docs. |
| `ohi-stack/onegodian-org` | Public organization/institutional explanation layer. |
| `ohi-stack/onegodian-api` | Shared OneGodian API support where needed. |
| `ohi-stack/acc-wp-adapter` | WordPress bridge/adaptor layer for plugin-to-node communication where applicable. |

## 3. OMOS Node Pages

Required Node routes:

```text
/
/omos
/ohi
/models
/protocol
/algorithm
/tools
/tools/bridge-builder
/artifacts
/docs
/shop
/latest-news
/digital-sanctuary
/dashboard
/legal
/contact
```

The WordPress plugin page installer should mirror the same page map where WordPress pages are used.

## 4. Content Source Map

| Content Area | Primary Source |
| --- | --- |
| Timekeeping / dual date display | OTS-V5 corrected edition |
| Algorithm explanation | OneGodian Algorithm White Paper |
| AI prompt / agent rules | OneGodian AI System Prompt |
| Protocol + Algorithm book structure | OneGodian Protocol and Algorithm unified framework |
| OHI output / model synthesis | OHI Output Pipeline Animation + GCD Model Synthesis |
| Youth / future-facing content | Gen Alpha & Gen Beta strategy |
| Founder authority | Founder and author statement |
| Financial/institutional safety | OMOS Financial and Institutional Classification |
| Seeger / sincerity context | Seeger Test and OneGodian Identity |

## 5. Plugin Bridge Model

The OMOS Core Tools plugin should be installable on:

1. `OneGodian.com`
2. `OneGodian.org`
3. `QuantumOHI.com`

The plugin should not make those sites into OMOS itself. It should display OMOS-linked content modules and status cards from the OMOS node.

### Plugin Bridge Outputs

- OMOS protocol card;
- OneGodian Algorithm card;
- OHI synthesis card;
- Bridge-Builder tool card;
- artifact/download grid;
- OMOS node health status;
- OMOS manifest status;
- Open Console button;
- compliance notice.

### Suggested Shortcodes

```text
[omos_dashboard]
[omos_tool_grid]
[omos_artifact_grid]
[omos_system_status]
[omos_registry_verify]
[omos_open_console_button]
[omos_consensus_counter]
[omos_bridge_builder]
[omos_node_manifest]
[omos_ecosystem_cards]
```

`[omos_bridge_builder]` must remain a planned placeholder until implemented and tested.

## 6. API / Health Requirements

OMOS node should expose:

```text
GET /health
GET /manifest
GET /api/health
GET /api/manifest
GET /api/ecosystem
GET /api/tools
GET /api/artifacts
GET /api/docs
GET /api/bridge/status
POST /process
```

The WordPress plugin should expose:

```text
GET /wp-json/omos/v1/health
GET /wp-json/omos/v1/manifest
GET /wp-json/omos/v1/tools
GET /wp-json/omos/v1/artifacts
GET /wp-json/omos/v1/docs
GET /wp-json/omos/v1/registry/verify
GET /wp-json/omos/v1/bridge/status
```

## 7. Environment Setup

Use `.env.example` as the baseline for deployment. Required variables include:

```text
OMOS_CANONICAL_HOST
ONEGODIAN_ORG_URL
ONEGODIAN_STORE_URL
ONEGODIAN_APP_URL
ONEGODIAN_UNIVERSITY_URL
ONEGODIAN_GALAXY_URL
ONEGODIAN_CAPITAL_URL
QUANTUMOHI_URL
OMOS_API_KEYS
OMOS_WP_PLUGIN_VERSION
```

## 8. Deployment Rule

The OMOS node is considered production-stable only when:

1. all required public routes return 200;
2. `/health` and `/api/health` return `status: ok`;
3. `/manifest` includes the seven-property ecosystem map;
4. plugin bridge status is visible;
5. the WordPress plugin has matching page/shortcode manifests;
6. app.OneGodian.com mirrors OMOS as a system card;
7. claims on public pages match implemented/runtime status.

## 9. Current Execution Priority

1. Align `server.js` manifest with the full page map.
2. Add route files for missing node pages.
3. Add `/api/ecosystem`, `/api/tools`, `/api/artifacts`, `/api/docs`, and `/api/bridge/status`.
4. Add page smoke tests for every public route.
5. Update README with plugin target usage.
6. Update app.OneGodian.com with OMOS card and plugin bridge cards.
7. Package `omos-core-tools` after shortcode/endpoint testing.

## 10. Production Safety Note

OMOS.OneGodian.com is a protocol/specification/alignment node. ONEGODIAN, LLC should be represented as the commercial/IP/software entity. INO governance/religious society language should remain separated and used only where appropriate.
