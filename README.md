# OMOS Site

Public runtime, documentation, and integration repository for **OMOS — OneGodian Metaphysical Operating System™**.

Canonical runtime: `https://omos.onegodian.com`

## Purpose

OMOS.OneGodian.com is the execution and systems-integration node for the OneGodian ecosystem. It organizes identity services, OHI synthesis, multi-model reasoning, workflow orchestration, developer infrastructure, runtime manifests, learning pathways, verification routing, public documentation, and commercial handoffs.

OMOS is not the storefront and does not replace civil, legal, financial, medical, or institutional authority. ONEGODIAN, LLC is the commercial, software, publishing, education, and IP operator for this repository.

## Current repository status

This repository currently combines:

- a lightweight Express/Node runtime;
- public route generation;
- runtime and ecosystem manifests;
- static API fallbacks;
- OHI pipeline animation assets;
- WordPress plugin and page-generator support;
- implementation specifications and production backlogs.

Use this versioning rule:

> If a feature is not implemented, versioned, documented, repeatable, and testable, it is not operational in the current version.

## Production platform architecture

The approved platform architecture is documented in:

- `docs/OMOS_PRODUCTION_PLATFORM_ARCHITECTURE.md`
- `docs/OMOS_PRODUCTION_IMPLEMENTATION_BACKLOG.md`
- `config/production-platform.manifest.json`

The production domains are:

1. Identity Runtime
2. OHI Intelligence Engine
3. Multi-Agent Workspace
4. Interactive OneGodian Algorithm
5. Developer Center
6. Runtime Dashboard
7. Learning Center
8. Verification Center
9. Digital Sanctuary
10. Production Control Center
11. Commerce Integration

## Runtime architecture

OMOS.OneGodian.com acts as:

- the canonical OMOS runtime node;
- the public protocol and documentation layer;
- the manifest provider for plugins and dashboards;
- the synchronization target for WordPress OMOS integrations;
- the bridge into app.OneGodian.com and ACC;
- the public entry point for OHI, Algorithm, developer, learning, and verification pathways.

The Node layer currently provides:

- `/health`
- `/api/health`
- `/manifest`
- `/api/manifest`
- `/api/ecosystem`
- `/api/tools`
- `/api/artifacts`
- `/api/docs`
- `/api/bridge/status`
- `/process`
- `/dashboard`
- `/ohi-output-pipeline`

Some extension endpoints remain static fallbacks under `/public/api/` until dynamic controllers are implemented and tested.

## Approved primary navigation

The production navigation standard is:

1. Platform
2. Identity
3. Intelligence
4. Workspace
5. Developers
6. Learn
7. Enterprise

`Open Console` remains the persistent action and links to `/dashboard` or the authenticated command center.

Supporting routes belong in secondary navigation, contextual cards, and the footer: Resources, Docs, Verification, Registry, Status, Legal, Contact, Shop, Digital Sanctuary, and OHI Output Pipeline.

## Production route plan

```text
/
/omos
/identity
/identity/belief-mapper
/identity/declarations
/identity/certificates
/identity/records
/members
/intelligence
/models
/ohi-output-pipeline
/intelligence/gcd-synthesis
/intelligence/verification
/workspace
/workspace/projects
/workspace/workflows
/workspace/runs
/workspace/agents
/protocol
/algorithm
/algorithm/observe
/algorithm/distill
/algorithm/align
/algorithm/select
/algorithm/execute
/algorithm/verify
/developers
/developers/api
/developers/openapi
/developers/schemas
/developers/playground
/developers/webhooks
/developers/status
/learn
/verification
/registry
/status
/settings
/dashboard
/admin
/enterprise
/resources
/docs
/artifacts
/tools
/shop
/latest-news
/digital-sanctuary
/legal
/contact
```

Routes must carry explicit implementation status. Planned or draft capabilities must not be presented as active.

## OHI workflow

The active OHI pipeline explains this sequence:

1. one controlled human question;
2. independent model outputs;
3. cross-model review;
4. agreement, contradiction, omission, and novelty detection;
5. human synthesis and final authority;
6. governed OHI output;
7. execution into a page, document, tool, task, API response, or artifact.

The existing animation asset remains the foundation for `/ohi-output-pipeline`.

## OneGodian Algorithm sequence

```text
Observe → Distill → Align → Select → Execute → Verify
```

This sequence should remain consistent across documentation, runtime metadata, plugins, dashboards, and interactive tools.

## Ecosystem separation

- **OneGodian.org:** public explanation, education, organizational and institutional context.
- **OneGodian.com:** commerce, products, memberships, courses, downloads, and checkout.
- **OMOS.OneGodian.com:** runtime, execution, developer infrastructure, tools, manifests, and documentation.
- **QuantumOHI.com:** enterprise technology, consulting, infrastructure, and advanced OHI services.
- **QRV.Network:** document, credential, and registry verification.
- **app.OneGodian.com / ACC:** authenticated command and operations control plane.

## Node and environment setup

Primary environment file:

```text
.env.example
```

Required production variables include:

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

## Machine-readable manifests

```text
config/ecosystem.manifest.json
config/production-platform.manifest.json
public/api/ecosystem
public/api/tools
public/api/artifacts
public/api/docs
public/api/bridge/status
```

The production platform manifest is the approved architectural reference. The runtime manifest and WordPress page-generator manifest must be updated to match it as implementation proceeds.

## WordPress plugin bridge

The OMOS plugin used on OneGodian.com, OneGodian.org, and QuantumOHI.com should:

- consume `/api/manifest`;
- consume `/api/ecosystem`;
- consume `/api/bridge/status`;
- synchronize route inventories;
- expose OMOS shortcodes;
- render documentation, identity, tool, Algorithm, and OHI blocks;
- provide dashboard launch links;
- connect WooCommerce OMOS products;
- preserve canonical OMOS routes;
- cache remote health responses and fail gracefully.

Expected shortcodes include:

```text
[omos_manifest]
[omos_runtime_status]
[omos_ecosystem_cards]
[omos_bridge_builder]
[omos_tool_grid]
[omos_artifact_grid]
[omos_docs_grid]
[omos_open_console_button]
[omos_ohi_pipeline]
[omos_about_llm]
[omos_algorithm_summary]
[omos_identity_overview]
```

A shortcode is not active until its handler, output, failure state, tests, and documentation are complete.

## Commerce bridge

Commercial checkout remains on OneGodian.com. OMOS routes explain, document, and route traffic into:

- WooCommerce products;
- PDF guides and whitepapers;
- protocol and prompt kits;
- SDKs and developer downloads;
- courses and memberships;
- institutional licensing and integration services.

## Deployment checklist

1. Copy `.env.example` to `.env`.
2. Configure runtime keys and allowed origins.
3. Run `npm install`.
4. Run `npm run check`.
5. Run `npm run smoke`.
6. Run `npm run smoke:pages`.
7. Confirm the runtime and production manifests agree.
8. Deploy the Node runtime.
9. Confirm `/api/health` reports the deployed version.
10. Confirm `/api/manifest` reports the correct routes and statuses.
11. Confirm `/api/ecosystem` and `/api/bridge/status` respond.
12. Confirm the OHI pipeline is accessible.
13. Confirm plugin sync on connected WordPress sites.
14. Confirm app.OneGodian.com connectivity.
15. Confirm planned tools are labeled planned.
16. Confirm rollback instructions are current.

## Immediate implementation priority

1. Make the runtime manifest the single route authority.
2. Retire or archive obsolete static homepage fallbacks.
3. Expand route groups and status metadata.
4. Upgrade the homepage to the approved production flow.
5. Preserve and integrate the OHI cross-model animation.
6. Add OpenAPI and JSON Schema assets.
7. Align the WordPress plugin manifest and shortcodes.
8. Add authenticated administrative controls.
9. Add route, API, accessibility, and security tests.
10. Verify all public claims against actual implementation status.

## Attribution

Authored and developed by Gregory Lamar Jones / One Gregory Onegodian™ for the OneGodian ecosystem.

One Gregory Onegodian™, All Rights Reserved – UCC 1-308
