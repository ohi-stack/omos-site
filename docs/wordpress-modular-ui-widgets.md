# OMOS WordPress Modular UI & Widget Architecture

Status: Implementation specification
Target plugin family: OMOS Core Tools / OMOS WordPress Bridge
Canonical runtime: https://omos.onegodian.com
Target hosts: OneGodian.org, OneGodian.com, QuantumOHI.com

## Objective

Upgrade the OMOS WordPress integration from a collection of isolated shortcode outputs into a reusable modular interface system. Every shortcode should render through a shared component layer with consistent design tokens, responsive behavior, loading/error/empty states, accessibility, host-aware presentation, and runtime capability checks.

The Node runtime remains the canonical source of operational state. WordPress adapts the canonical manifest and runtime data for each approved host profile without duplicating OMOS business logic.

## Design Principles

1. One component system, multiple host profiles.
2. Shortcodes are entry points; widgets/components are the visual implementation.
3. No client-side secrets.
4. No UI may advertise a capability absent from the canonical runtime manifest.
5. Every module has loading, ready, empty, degraded, stale, and error states where applicable.
6. Every module must be responsive, keyboard-accessible, screen-reader-friendly, and usable without animation.
7. Every module should expose version/source metadata to admins for troubleshooting.
8. Host-specific presentation is allowed; host-specific forks of core logic are not.

## Canonical Shortcode-to-Widget Map

| Shortcode | Widget / Module |
|---|---|
| `[omos_manifest]` | Manifest Summary Widget |
| `[omos_runtime_status]` | Runtime Status Widget |
| `[omos_ecosystem_cards]` | Ecosystem Card Grid |
| `[omos_bridge_builder]` | Bridge Builder Workspace |
| `[omos_tool_grid]` | Tool Launcher Grid |
| `[omos_artifact_grid]` | Artifact Library Grid |
| `[omos_docs_grid]` | Documentation Library Grid |
| `[omos_open_console_button]` | Console Launcher |
| `[omos_ohi_pipeline]` | OHI Pipeline Visualization |
| `[omos_unity_dashboard]` | Unity Dashboard Shell |

## Shared UI Component Library

Required primitives:

- AppShell
- ModuleCard
- StatusBadge
- MetricTile
- DataTable
- FilterBar
- SearchField
- Tabs
- Accordion
- Modal / Drawer
- Toast / InlineNotice
- LoadingSkeleton
- EmptyState
- ErrorState
- StaleDataNotice
- ProviderBadge
- VersionBadge
- ProgressStepper
- Timeline
- ActivityFeed
- RecordCard
- ToolLauncher
- DocumentCard
- ArtifactCard
- CTAButton / ButtonGroup
- HostProfileBadge

All modules should be composed from these primitives rather than hand-coded independently.

## Layout System

Support four reusable layouts:

### Compact
For sidebars, account panels, WPBakery rows, narrow containers, and mobile-first embeds.

### Standard
Default shortcode presentation with a title, optional description, controls, and responsive card/grid area.

### Workspace
Full-width operational surface for Bridge Builder, Unity Dashboard, Decision History, Council, or other interactive OMOS tools.

### Dashboard
Modular grid supporting draggable/reorderable widget regions where WordPress/admin capabilities permit.

## Widget State Contract

Each runtime-connected widget should implement:

```text
INITIALIZING
LOADING
READY
EMPTY
STALE
DEGRADED
ERROR
UNAUTHORIZED
UNAVAILABLE
```

A widget must not fail silently. The user should see an appropriate human-readable state, while admins can inspect machine-readable diagnostic details.

## Runtime Data Contract

Widgets should consume the canonical OMOS API through the WordPress server-side bridge when authentication or sensitive configuration is involved.

Primary sources:

- `/api/health`
- `/api/manifest`
- `/api/ecosystem`
- `/api/bridge/status`
- `/api/tools`
- `/api/artifacts`
- `/api/docs`
- `/api/v1/providers`
- `/api/v1/persistence`

Protected execution remains server-to-server and must never expose `x-omos-key` to browser JavaScript.

## Host Profiles

### OneGodian.org — Public / Institutional

Prioritize:
- What is OMOS?
- Protocol / Algorithm / OHI explainers
- Belief Mapper and identity-oriented launchers where approved
- public runtime status
- education / documentation cards
- contribution / participation pathways

Presentation: educational, accessible, public-facing, low technical density by default.

### OneGodian.com — Commerce

Prioritize:
- product cards
- pricing / entitlement state
- license/download CTAs
- Ask OMOS / Decision Review launchers
- WooCommerce handoff
- purchase-to-use workflow state

Presentation: conversion-focused, compact, product-centered.

### QuantumOHI.com — Enterprise / Technical

Prioritize:
- provider health
- OHI pipeline
- Council architecture
- API / technical docs
- governance / verification modules
- enterprise consultation and implementation CTAs

Presentation: technical, operational, enterprise-oriented.

## Admin Interface Upgrade

Add an OMOS admin control center with these screens:

1. Dashboard
   - runtime health
   - manifest version
   - plugin version
   - canonical host
   - last sync
   - stale-state warning

2. Connections
   - OMOS runtime
   - app bridge
   - commerce bridge
   - OneGodian.org profile
   - OneGodian.com profile
   - QuantumOHI.com profile

3. Widgets
   - registered shortcodes
   - enabled/disabled state
   - last render test
   - data source
   - host compatibility
   - test/preview action

4. Sync
   - route comparison
   - local vs canonical manifest
   - missing pages
   - stale pages
   - last successful sync
   - manual refresh

5. Appearance
   - density
   - border radius
   - spacing scale
   - typography scale
   - host profile inheritance
   - optional light/dark/container variants

6. Diagnostics
   - API response health
   - cache status
   - WordPress REST status
   - WooCommerce dependency state
   - PHP/runtime requirements
   - recent sync failures

7. Documentation
   - shortcode catalog
   - attributes
   - WPBakery usage
   - examples
   - troubleshooting

## Shortcode Attributes

All visual shortcodes should support a common baseline where meaningful:

```text
layout="compact|standard|workspace|dashboard"
theme="inherit|dark|light"
title="..."
show_header="true|false"
show_status="true|false"
limit="N"
columns="1|2|3|4"
category="..."
profile="auto|org|commerce|enterprise"
cache="default|refresh"
```

Individual modules may add specific attributes. Unsupported attributes must be ignored safely and documented.

## WordPress Blocks and Builder Support

Shortcodes remain the compatibility layer, but the target UI should also expose:

- Gutenberg blocks for each canonical module
- WPBakery elements for each canonical module
- widget-area / sidebar compatibility where appropriate
- reusable page templates for Workspace and Dashboard layouts

All builder integrations should call the same render/controller layer as the shortcodes.

## Front-End Asset Architecture

Recommended plugin structure:

```text
omos-wordpress-bridge/
  includes/
    api/
    admin/
    auth/
    cache/
    manifest/
    profiles/
    render/
    shortcodes/
  assets/
    css/
      tokens.css
      components.css
      modules.css
      admin.css
    js/
      runtime.js
      widgets.js
      admin.js
  templates/
    components/
    modules/
    states/
  blocks/
  wpbakery/
  tests/
```

## Performance

- Server-side cache public manifest/runtime summaries.
- Avoid loading widget JS/CSS site-wide when no OMOS module is present.
- Lazy-load heavy visualizations such as OHI Pipeline.
- Debounce search/filter controls.
- Preserve a no-JavaScript readable fallback for informational modules.

## Accessibility

Minimum requirements:

- semantic headings and landmarks
- keyboard navigation
- visible focus state
- ARIA labels only where native semantics are insufficient
- status changes announced where appropriate
- reduced-motion support
- color is never the only indicator of status
- responsive tables/cards with readable small-screen behavior

## Analytics

Widgets may emit privacy-conscious behavioral events such as:

- `omos_widget_viewed`
- `omos_tool_opened`
- `omos_console_launched`
- `omos_doc_opened`
- `omos_product_cta_clicked`
- `omos_runtime_status_viewed`

Do not send sensitive belief/profile answers into ordinary advertising analytics.

## Acceptance Criteria

The modular UI upgrade is complete only when:

1. All 10 canonical shortcodes register successfully.
2. Each shortcode renders through the shared component system.
3. Every runtime-backed widget implements loading/error/stale states.
4. Host profiles alter presentation without forking core logic.
5. Gutenberg and WPBakery integrations exist for the canonical modules or are explicitly version-scoped as pending.
6. Admin Widgets screen reports registration, connection, and render-test status.
7. Assets load conditionally.
8. No OMOS secret appears in public HTML or JS.
9. Responsive tests pass for phone, tablet, desktop, and wide workspace layouts.
10. Basic accessibility checks pass.
11. OneGodian.org, OneGodian.com, and QuantumOHI.com each pass smoke tests with their assigned profile.
12. UI capability claims match the canonical OMOS runtime manifest.

## Version Discipline

A visual module is not operational merely because a shortcode name exists. It becomes operational only when it is implemented, connected to the correct data source, testable, documented, and repeatable on its approved host profile.
