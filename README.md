# OMOS Site

Public site and documentation repository for **OMOS — OneGodian Metaphysical Operating System**.

Canonical site target: `https://omos.onegodian.com`

## Purpose

This repo holds the public-facing OMOS site plan, documentation map, WordPress import assets, protocol references, tool-page requirements, plugin page-generation logic, runtime manifests, and production deployment notes for building OMOS.OneGodian.com.

OMOS is positioned as the operating layer where OneGodian identity, OHI synthesis, model pages, protocol documents, tools, post categories, shop pathways, and developer-facing assets are organized into a usable public platform.

## Current repository status

This repository is a hybrid documentation + lightweight Node runtime + WordPress support repository.

The Node layer currently provides:

- `/health`
- `/api/health`
- `/manifest`
- `/api/manifest`
- `/process`
- `/dashboard`

The WordPress layer contains the OMOS page generator plugin used to create and repair the public page structure.

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

`Open Console` should remain a persistent CTA that links to `/dashboard`.

Supporting links such as Latest News, Legal, and Contact belong in the footer, mobile menu, and secondary navigation, not in the seven-slot primary mega menu.

## WordPress plugin bridge

The OMOS plugin used on:

- OneGodian.com
- OneGodian.org
- QuantumOHI.com

should:

- consume `/api/manifest`
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
[omos_bridge_builder]
[omos_tool_grid]
[omos_docs_grid]
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
9. Confirm plugin sync on connected WordPress sites
10. Confirm app.OneGodian.com connectivity

## Priority implementation order

1. Import WXR pages and category taxonomies into WordPress.
2. Activate the OMOS page generator / core tools plugin.
3. Run **Tools → OMOS Page Generator** to generate or repair route pages.
4. Set Home as the static front page.
5. Build the seven-link main navigation and 4-column footer.
6. Connect tool shortcodes to generated pages.
7. Implement and test `[omos_bridge_builder]`, then connect `/tools/bridge-builder`.
8. Connect shop pages to Stripe/WooCommerce products.
9. Publish first OMOS news, OHI reports, and Council updates.
10. Add analytics and conversion tracking.
11. Confirm all public claims match implemented/runtime status.

## WordPress assets

Store WXR/XML, shortcodes, import instructions, menu/footer structure, and plugin support files in `/wordpress`.

Current WordPress page drafts:

- `wordpress/pages/bridge-builder-tool-page.md`

## Documentation assets

Store protocol, runtime, algorithm, timekeeping, agent authority, declaration generator, and founder references in `/docs`.

Current documentation additions:

- `docs/bridge-builder-protocol.md`

## Tool requirements

Store interactive tool specs in `/tools`.

Current tool specs:

- `tools/bridge-builder-tool-spec.md`

## Plugin sync rule

The WordPress plugin manifest must match the master sitemap. Any new public route, tool route, product pathway, or documentation route should be added to both:

1. the sitemap/source-map documentation; and
2. the WordPress page generator manifest.

For Bridge-Builder, the route `/tools/bridge-builder` and shortcode `[omos_bridge_builder]` should not be treated as operational until the shortcode is implemented, tested, and connected through the plugin manifest.

## Commercial path

The immediate commercial objective is to turn OMOS from documentation into a customer path:

```text
Understand OMOS → Use a tool → Get product/download → Join/member → Follow updates
```

## Production note

The OMOS site should be public-safe and commercially disciplined. ONEGODIAN, LLC should be described as the commercial/IP/software entity. Governance language belongs only where legally appropriate and should not be mixed into LLC product pages without clarification.
