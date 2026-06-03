# OMOS Plugin Sync Guide

## Purpose

This guide defines how the OMOS WordPress plugin should synchronize with `OMOS.OneGodian.com`.

The Node site is the canonical runtime and manifest source. The WordPress plugin used on OneGodian.com, OneGodian.org, and QuantumOHI.com should consume this manifest and render matching public pages, cards, tool grids, and documentation links.

## Canonical Runtime Endpoints

```text
GET https://omos.onegodian.com/api/health
GET https://omos.onegodian.com/api/manifest
POST https://omos.onegodian.com/process
```

`/process` requires the `x-omos-key` header.

## Required Plugin Behavior

1. Fetch `/api/manifest`.
2. Read `routes.public`.
3. Compare routes against the local WordPress page generator manifest.
4. Flag missing local pages.
5. Render OMOS route cards with canonical links back to OMOS.OneGodian.com.
6. Render shop bridge links to OneGodian.com.
7. Render app bridge links to app.OneGodian.com.
8. Render public explanation links to OneGodian.org.
9. Never treat unsupported routes as operational.

## Required Shortcodes

```text
[omos_manifest]
[omos_runtime_status]
[omos_bridge_builder]
[omos_tool_grid]
[omos_docs_grid]
```

## Plugin Target Sites

```text
OneGodian.com
OneGodian.org
QuantumOHI.com
```

## Sync Contract

The plugin should treat OMOS.OneGodian.com as the source of truth for:

- public route inventory
- API route inventory
- content model labels
- product bridge URLs
- app bridge URLs
- safety/disclaimer metadata

The plugin should treat WordPress as the presentation and distribution layer for:

- product pages
- blog posts
- SEO landing pages
- category archives
- public education pages
- WooCommerce checkout flows

## Production Safety Rules

1. Do not make OMOS claims beyond what exists in the runtime manifest.
2. Do not claim a shortcode is operational unless it renders and passes a test page.
3. Do not mix ONEGODIAN, LLC commercial pages with INO governance language without clarification.
4. Do not present OMOS as replacing civil, financial, legal, or governmental systems.
5. Keep all public statements aligned with the manifest safety block.

## Definition of Done

The sync layer is production-ready only when:

- `/api/health` returns status `ok`.
- `/api/manifest` returns public routes.
- the plugin displays runtime status.
- route comparison works.
- missing pages are listed in admin.
- shortcodes render without fatal errors.
- product links resolve to OneGodian.com.
- app links resolve to app.OneGodian.com.
- smoke tests confirm the public OMOS routes.
