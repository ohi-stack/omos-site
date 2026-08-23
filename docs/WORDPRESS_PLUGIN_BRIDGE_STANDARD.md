# OMOS WordPress Plugin Bridge Standard

## Purpose

The OMOS Core Tools plugin installed on OneGodian.org, OneGodian.com, and QuantumOHI.com must operate as a distributed bridge into the central OMOS runtime, not as three separate OMOS systems.

## Target Sites

| Site | Primary role | Plugin role |
|---|---|---|
| OneGodian.org | Organization, education, institutional explanation | Public OMOS pages, identity tools, declaration handoff, education links |
| OneGodian.com | Store, WooCommerce, digital products, memberships | Product cards, OMOS kits, checkout handoff, download delivery context |
| QuantumOHI.com | Enterprise technology positioning | OHI framework demos, AI governance service positioning, system prompt and protocol materials |

## Minimum Bridge Capabilities

The plugin should expose the following features:

- Runtime Status check
- Manifest Sync
- Tool Registry Sync
- Embedded OMOS components through shortcodes or blocks
- Ask OMOS launcher
- Council Review launcher
- Site Context declaration
- Authentication handoff target
- Run Status display
- Artifact return pathway

## Required Admin Screens

```text
Dashboard
App Bridge
API Keys
Settings
Tools
Submissions
Status
Production Checklist
Documentation
Motion Lab
OHI / Council Review
```

## Required Shortcodes

```text
[omos_runtime_status]
[omos_manifest]
[omos_tool_grid]
[omos_docs_grid]
[omos_ohi_pipeline]
[omos_ask_launcher]
[omos_council_review_launcher]
[omos_bridge_status_board]
[omos_decision_record_preview]
```

## Required REST Endpoints

```text
/wp-json/omos/v1/status
/wp-json/omos/v1/app-manifest
/wp-json/omos/v1/tools
/wp-json/omos/v1/submissions/stats
/wp-json/omos/v1/motion/manifest
/wp-json/omos/v1/motion/components
/wp-json/omos/v1/motion/status
```

Future OHI bridge endpoints:

```text
/wp-json/omos/v1/ohi/run
/wp-json/omos/v1/ohi/adapters
/wp-json/omos/v1/ohi/review
/wp-json/omos/v1/ohi/records
```

## Runtime Bridge Flow

```text
WordPress page
   ↓
OMOS plugin shortcode/block
   ↓
OMOS runtime manifest
   ↓
OMOS API / bridge key
   ↓
Algorithm / OHI / Models / Agents
   ↓
Governed output
   ↓
WordPress display or artifact handoff
```

## Security Rules

- Provider keys must not be stored in public JavaScript.
- Bridge keys must be generated, rotated, masked, and stored using WordPress options with admin-only access.
- Admin actions must use nonces.
- REST endpoints must sanitize inputs and hide secret values.
- Public shortcodes must not expose provider credentials, bridge keys, or server environment variables.

## Maturity Labels

Each bridge feature must expose one of the following statuses:

```text
PLANNED
PROTOTYPE
FUNCTIONAL
VERIFIED
PRODUCTION
```

The plugin must not present a feature as production-ready unless it is implemented, documented, repeatable, and tested.

## Immediate Upgrade Target

The next plugin release should implement:

- OHI / Council Review admin tab
- public Council Review launcher shortcode
- manifest display of Simulation Mode vs Live Model Mode
- run record preview block
- plugin status board for the three installed sites
- documented handoff to app.OneGodian.com
