# OMOS Core Tools — Production Plugin Structure

Status: v1.0 architecture baseline  
Target Plugin: `omos-core-tools`  
Target Site: `OMOS.OneGodian.com`  
Purpose: Turn OMOS.OneGodian.com into a controlled WordPress protocol/specification console for OMOS documentation, tools, artifacts, registry references, compliance, and system status.

## 1. Production Directory Structure

```text
omos-core-tools/
├── omos-core-tools.php
├── uninstall.php
├── readme.txt
│
├── includes/
│   ├── class-omos-loader.php
│   ├── class-omos-activator.php
│   ├── class-omos-admin-menu.php
│   ├── class-omos-cpt.php
│   ├── class-omos-rest-api.php
│   ├── class-omos-shortcodes.php
│   ├── class-omos-page-installer.php
│   ├── class-omos-mega-menu.php
│   ├── class-omos-artifacts.php
│   ├── class-omos-tools.php
│   ├── class-omos-dashboard-builder.php
│   ├── class-omos-registry.php
│   ├── class-omos-docs.php
│   ├── class-omos-shop-integration.php
│   ├── class-omos-compliance.php
│   ├── class-omos-import-export.php
│   ├── class-omos-system-health.php
│   ├── class-omos-engagement-counter.php
│   └── class-omos-settings.php
│
├── admin/
│   ├── views/
│   │   ├── dashboard.php
│   │   ├── page-installer.php
│   │   ├── mega-menu.php
│   │   ├── artifacts.php
│   │   ├── tools.php
│   │   ├── dashboard-builder.php
│   │   ├── registry.php
│   │   ├── docs.php
│   │   ├── shop-integration.php
│   │   ├── compliance.php
│   │   ├── import-export.php
│   │   ├── system-health.php
│   │   └── settings.php
│   ├── css/
│   │   └── omos-admin.css
│   └── js/
│       └── omos-admin.js
│
├── public/
│   ├── css/
│   │   └── omos-public.css
│   └── js/
│       ├── omos-public.js
│       └── omos-consensus-counter.js
│
├── templates/
│   ├── dashboard.php
│   ├── artifact-grid.php
│   ├── tool-grid.php
│   ├── system-status.php
│   ├── registry-verify.php
│   └── open-console-button.php
│
└── assets/
    └── index.html
```

## 2. Core Plugin Purpose

The OMOS Core Tools plugin should operate as the WordPress control layer for OMOS.OneGodian.com.

It should manage:

- OMOS page installation and repair;
- mega menu structure;
- artifacts and download resources;
- tool library and shortcode output;
- dashboard routes and public console components;
- custom post types;
- REST API routes;
- registry references;
- documentation indexes;
- WooCommerce/shop pathways;
- compliance notices;
- import/export utilities;
- system health checks;
- engagement/consensus counters;
- settings and feature flags.

## 3. File Responsibilities

### Root Files

| File | Responsibility |
| --- | --- |
| `omos-core-tools.php` | Plugin header, constants, includes, loader bootstrapping, activation/deactivation hooks. |
| `uninstall.php` | Controlled cleanup of plugin options, transients, temporary data, and plugin-created records when selected. |
| `readme.txt` | WordPress plugin metadata, changelog, installation instructions, shortcodes, and admin screens. |

### Includes

| File | Responsibility |
| --- | --- |
| `class-omos-loader.php` | Registers actions, filters, shortcodes, admin assets, public assets, and route hooks. |
| `class-omos-activator.php` | Creates default options, registers CPTs, flushes rewrites, seeds required pages if enabled. |
| `class-omos-admin-menu.php` | Builds the OMOS admin menu and connects all admin view screens. |
| `class-omos-cpt.php` | Registers OMOS CPTs such as artifacts, tools, docs, registry records, and system notices. |
| `class-omos-rest-api.php` | Registers REST endpoints for status, manifest, tools, artifacts, registry verification, and bridge checks. |
| `class-omos-shortcodes.php` | Registers public shortcodes such as `[omos_tool_grid]`, `[omos_artifact_grid]`, `[omos_system_status]`, `[omos_open_console_button]`, and future `[omos_bridge_builder]`. |
| `class-omos-page-installer.php` | Creates and repairs the master sitemap pages and tool routes. |
| `class-omos-mega-menu.php` | Builds or validates the seven-link OMOS mega menu and footer link groups. |
| `class-omos-artifacts.php` | Manages artifacts, PDFs, downloads, protocols, prompt packs, and documentation products. |
| `class-omos-tools.php` | Manages tool records, tool cards, tool routes, shortcode mapping, and enabled/disabled tool states. |
| `class-omos-dashboard-builder.php` | Builds public dashboard sections and admin-configurable cards. |
| `class-omos-registry.php` | Manages registry references, verification metadata, ODIN references, and record lookup display. |
| `class-omos-docs.php` | Builds documentation indexes and protocol/specification archives. |
| `class-omos-shop-integration.php` | Bridges OMOS tools/artifacts to WooCommerce products and Stripe-backed purchase flows. |
| `class-omos-compliance.php` | Provides disclaimers, institutional safety language, footer notices, and page-level compliance blocks. |
| `class-omos-import-export.php` | Imports/exports plugin settings, tool manifests, artifact manifests, and WXR support references. |
| `class-omos-system-health.php` | Checks WordPress, WooCommerce, REST, pages, menus, shortcodes, plugin bridge status, and API health. |
| `class-omos-engagement-counter.php` | Provides public counters for consensus, interactions, downloads, or tool usage where appropriate. |
| `class-omos-settings.php` | Central settings registry, option sanitization, capability checks, feature flags, and defaults. |

### Admin Views

Each file in `admin/views/` should be a display-only admin screen. Logic belongs in `includes/` classes.

### Public Templates

Templates in `templates/` should render shortcode output and public dashboard components without containing business logic.

## 4. Required Admin Screens

| Admin Screen | Purpose |
| --- | --- |
| OMOS → Dashboard | Site status, route count, active tools, artifacts, docs, menu status, WooCommerce status, health warnings. |
| OMOS → Page Installer | Generate or repair `/omos`, `/ohi`, `/models`, `/tools`, `/artifacts`, `/docs`, `/shop`, `/latest-news`, `/dashboard`, `/legal`, `/contact`, and child pages. |
| OMOS → Mega Menu | Build the seven-link primary mega menu and footer link groups. |
| OMOS → Artifacts | Manage protocol PDFs, prompt packs, specs, WXR files, and downloads. |
| OMOS → Tools | Manage tool cards, shortcodes, status, and routes. |
| OMOS → Dashboard Builder | Configure cards shown on the public OMOS dashboard. |
| OMOS → Registry | Manage verification references and registry lookup display. |
| OMOS → Docs | Manage protocol/specification documentation indexes. |
| OMOS → Shop Integration | Map tools/artifacts to WooCommerce products. |
| OMOS → Compliance | Manage public-safe disclaimers, institutional classification language, and footer notices. |
| OMOS → Import / Export | Export settings, import manifests, and support migration. |
| OMOS → System Health | Test pages, shortcodes, REST endpoints, plugin bridges, WooCommerce, and required settings. |
| OMOS → Settings | Global plugin configuration and feature flags. |

## 5. Required Public Shortcodes

| Shortcode | Output |
| --- | --- |
| `[omos_dashboard]` | Public OMOS dashboard shell. |
| `[omos_artifact_grid]` | Artifact/download card grid. |
| `[omos_tool_grid]` | Tool library grid. |
| `[omos_system_status]` | Public-safe system status. |
| `[omos_registry_verify]` | Registry lookup/verification display. |
| `[omos_open_console_button]` | CTA button linking to `/dashboard` or app control plane. |
| `[omos_consensus_counter]` | Public engagement/consensus counter where enabled. |
| `[omos_bridge_builder]` | Future Bridge-Builder tool interface. Must remain non-operational until implemented and tested. |

## 6. REST API Baseline

Recommended routes:

```text
/wp-json/omos/v1/health
/wp-json/omos/v1/manifest
/wp-json/omos/v1/tools
/wp-json/omos/v1/artifacts
/wp-json/omos/v1/docs
/wp-json/omos/v1/registry/verify
/wp-json/omos/v1/bridge/status
/wp-json/omos/v1/settings
```

Write routes must require nonce checks and appropriate capabilities. Public read routes must sanitize output and avoid exposing private configuration.

## 7. Master Sitemap Alignment

The plugin must align with the current OMOS master sitemap:

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
```

Primary mega menu:

```text
OMOS
OHI
Models
Tools
Artifacts
Docs
Shop
```

`Open Console` remains a separate CTA, not a primary mega menu item.

## 8. Production Rules

1. No public feature should be labeled operational unless the shortcode, route, or endpoint exists and is tested.
2. All input must be sanitized.
3. All output must be escaped.
4. Admin actions must use nonce checks.
5. Settings must use capability checks.
6. Compliance language must separate ONEGODIAN, LLC commercial/IP functions from INO governance/religious society functions.
7. OMOS.OneGodian.com must remain the protocol/specification/alignment platform, not the store, LMS, galaxy, or capital platform.
8. Any new route must be added to both the sitemap/source-map documentation and the page installer manifest.

## 9. Production Priority

The next build priority is:

1. Confirm the existing plugin zip matches this structure.
2. Add missing class files as stubs if needed.
3. Add admin screens as view files.
4. Register shortcodes.
5. Register REST health and manifest endpoints.
6. Add page installer manifest for the master sitemap.
7. Add system health checks.
8. Add Bridge-Builder as a documented planned tool, not an operational tool, until implemented.
9. Package as `omos-core-tools-v1.3.0.zip` after testing.
