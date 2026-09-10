# OMOS Site

Public site and documentation repository for **OMOS — OneGodian Metaphysical Operating System**.

Canonical site target: `https://omos.onegodian.com`

## Purpose

This repo holds the public-facing OMOS site plan, documentation map, WordPress import assets, protocol references, tool-page requirements, plugin page-generation logic, runtime manifests, environment files, static API fallbacks, and production deployment notes for building OMOS.OneGodian.com.

OMOS is positioned as the operating layer where OneGodian identity, OHI synthesis, model pages, protocol documents, tools, post categories, shop pathways, and developer-facing assets are organized into a usable public platform.

## Current repository status

This repository is a hybrid documentation + lightweight Node runtime + WordPress support repository.

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

Some API extension routes are currently provided as static fallback JSON under `/public/api/` until the dynamic runtime controller is expanded.

The WordPress layer contains the OMOS page generator / core tools architecture used to create and repair the public page structure and to support plugin deployment on OneGodian.com, OneGodian.org, and QuantumOHI.com.

Use this rule for version discipline:

> If a feature is not implemented, versioned, documented, repeatable, logged where applicable, and testable, it is not operational in the current version.

## Runtime architecture

OMOS.OneGodian.com acts as:

- the canonical OMOS runtime node
- the public protocol/documentation layer
- the manifest provider for plugins and dashboards
- the synchronization target for WordPress OMOS integrations
- the bridge layer into app.OneGodian.com

## Source documents integrated

This repo maps the following source materials into implementation-ready documentation:

- OHI Runtime technical specification
- OTS-V5 corrected timekeeping standard
- OneGodian Algorithm whitepaper
- OneGodian AI System Prompt
- OneGodian Frequency Standard
- OHI Output Pipeline HTML animation
- Agent Authority Model
- Founder and origin statement
- OMOS WordPress/WXR assets
- OMOS Core Tools / Page Generator plugin assets
- Bridge-Builder Protocol specification
- Bridge-Builder Tool specification and WordPress page draft
- OMOS Node Content and Plugin Bridge Plan
- OneGodian ecosystem manifest
- ODIN-SCI-0004 — OneGodian Particle Science™ research standard

## Science registry additions

The repository now includes:

```text
docs/ODIN-SCI-0004-ONEGODIAN-PARTICLE-SCIENCE.md
```

This record classifies OneGodian Particle Science™ as a theoretical/research-development discipline, preserves the historical `OELA-0007-PARTICLES` cross-reference, and separates established physics, OneGodian theoretical models, and metaphysical interpretation.

## Master site architecture

```text
/
/omos
/ohi
/models
/tools
/tools/bridge-builder
/artifacts
/docs
/shop
/latest-news
/dashboard
/admin
/legal
/contact
/protocol
/algorithm
/digital-sanctuary
/ohi-output-pipeline
```

## Primary mega menu

The public mega menu should use these seven primary links:

1. OMOS
2. OHI
3. Models
4. Tools
5. Artifacts
6. Docs
7. Shop

`Open Console` should remain a persistent CTA that links to `/dashboard` or the app control plane.

Supporting links such as Latest News, Legal, Contact, Protocol, Algorithm, and OHI Output Pipeline may appear in secondary navigation, footer links, cards, and contextual page CTAs.

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

## Manifests and static API fallbacks

Machine-readable setup files:

```text
config/ecosystem.manifest.json
public/api/ecosystem
public/api/tools
public/api/artifacts
public/api/docs
public/api/bridge/status
```

These files support plugin and dashboard development before all dynamic API controllers are finalized.

## WordPress plugin bridge

The OMOS plugin used on:

- OneGodian.com
- OneGodian.org
- QuantumOHI.com

should:

- consume `/api/manifest`
- consume `/api/ecosystem`
- consume `/api/bridge/status`
- sync route inventories
- expose OMOS shortcodes
- render OMOS cards and documentation blocks
- provide dashboard launch links
- connect WooCommerce OMOS products
- preserve canonical OMOS routes

### Expected plugin shortcodes

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
```

## Commerce bridge

Commercial checkout remains on OneGodian.com.

OMOS routes explain, document, and route traffic into:

- WooCommerce products
- PDF guides
- protocol kits
- developer downloads
- courses
- memberships

## Deployment checklist

1. Copy `.env.example` to `.env`
2. Configure runtime keys
3. `npm install`
4. `npm run check`
5. `npm run smoke`
6. `npm run smoke:pages`
7. Deploy Node runtime
8. Confirm `/api/manifest` output
9. Confirm `/api/ecosystem` output
10. Confirm `/api/bridge/status` output
11. Confirm plugin sync on connected WordPress sites
12. Confirm app.OneGodian.com connectivity

## Priority implementation order

1. Complete `OMOS-REF-0001` production deployment proof against `omos.onegodian.com`.
2. Deploy the current `main` revision containing production persistence hardening.
3. Verify PostgreSQL durability, restart survival, owner isolation, and Decision Record reopening.
4. Verify live provider configuration for OpenAI, Anthropic, Gemini, and xAI.
5. Reconcile or close superseded open pull requests after confirming their changes are already represented on `main`.
6. Install and test the OMOS WordPress bridge separately on each approved target.
7. Publish and expose science/standards records, beginning with ODIN-SCI-0004.
8. Connect commerce entitlements to governed OMOS runs.
9. Add analytics and conversion tracking.
10. Confirm all public claims match implemented/runtime status.
