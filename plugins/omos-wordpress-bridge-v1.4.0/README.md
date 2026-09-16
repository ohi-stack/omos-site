# OMOS WordPress Bridge v1.4.0

**Author / Originator:** One Gregory Onegodian™  
**Publisher:** ONEGODIAN, LLC  
**Canonical runtime:** https://omos.onegodian.com  
**Target hosts:** OneGodian.org, OneGodian.com, QuantumOHI.com

## Purpose

OMOS WordPress Bridge v1.4.0 is the canonical WordPress integration layer for OMOS™. It replaces isolated shortcode concepts with one versioned bridge codebase, one module registry, one branded component system, and one runtime-health/status interface.

The WordPress layer does not become the canonical OMOS runtime. It consumes and presents approved state from OMOS.OneGodian.com.

## Canonical Shortcodes

All ten canonical shortcodes are registered from `omos-wordpress-bridge.php`:

1. `[omos_manifest]`
2. `[omos_runtime_status]`
3. `[omos_ecosystem_cards]`
4. `[omos_bridge_builder]`
5. `[omos_tool_grid]`
6. `[omos_artifact_grid]`
7. `[omos_docs_grid]`
8. `[omos_open_console_button]`
9. `[omos_ohi_pipeline]`
10. `[omos_unity_dashboard]`

## Shortcode Status Screen

WordPress Admin → **OMOS Bridge** exposes a canonical module health matrix.

Each shortcode reports:

- **Registered** — WordPress recognizes the shortcode from the canonical bridge codebase.
- **Working** — the shortcode completes a controlled render test and returns non-empty output.
- **Connected** — the canonical OMOS runtime is reachable through the public health contract.
- **Error** — a human-readable registration, rendering, or runtime connectivity failure is present.

The screen also reports:

- bridge version
- canonical runtime connection
- OMOS runtime version when exposed by `/api/manifest`
- detected host profile
- runtime cache refresh control

## Branding

The bridge uses the OneGodian / OMOS interface standard:

- Obsidian backgrounds: `#050507`, `#070607`
- Elevated surfaces: `#15111f`, `#17121f`
- OneGodian gold: `#d8b35a`
- Highlight gold: `#f0d98a`
- OMOS purple: `#6f3cff`
- Primary text: `#f5f1e8`
- Gold-bordered modular cards
- Purple/gold radial lighting
- 22px primary card radius
- responsive metric, card, status, dashboard, and workspace modules

Canonical module header:

`OneGodian™ • OMOS™ • WordPress Bridge`

Branding is implemented in `assets/omos-bridge.css` using shared design tokens so host sites may inherit the same core identity without copying module CSS independently.

## Host Profiles

### OneGodian.org

Profile: `org`

Public/institutional orientation: OMOS explainers, documentation, runtime status, approved identity/education pathways, and public tools.

### OneGodian.com

Profile: `commerce`

Commercial orientation: OMOS products, WooCommerce handoffs, purchase/use pathways, licensing, subscriptions, and product-linked launchers.

### QuantumOHI.com

Profile: `enterprise`

Technical/enterprise orientation: OHI architecture, runtime/provider context, Council surfaces, APIs, technical documentation, and implementation pathways.

The plugin automatically detects the host profile. Shortcodes may also specify `profile="org|commerce|enterprise"` where an explicit override is appropriate.

## Common Shortcode Attributes

Where meaningful, canonical modules support:

```text
layout="compact|standard|workspace|dashboard"
theme="inherit|dark|light"
title="Custom title"
show_header="true|false"
show_status="true|false"
limit="12"
columns="1|2|3|4"
category="..."
profile="auto|org|commerce|enterprise"
```

Example:

```text
[omos_tool_grid layout="workspace" columns="3" profile="auto"]
```

## Runtime Sources

Public bridge data is sourced server-side from approved OMOS endpoints including:

- `/api/health`
- `/api/manifest`
- `/api/ecosystem`
- `/api/tools`
- `/api/artifacts`
- `/api/docs`

The bridge intentionally does **not** expose protected OMOS credentials in browser JavaScript or generated markup.

## Modular UI Standard

Every shortcode is treated as an entry point to a reusable UI module rather than a standalone visual implementation.

Shared components include:

- module headers
- host-profile badges
- status badges
- metrics
- cards
- launcher cards
- responsive grids
- dashboard action groups
- empty/error states
- buttons and text links

See `docs/wordpress-modular-ui-widgets.md` for the full architecture and acceptance criteria.

## Version Discipline

A shortcode name existing in documentation does not make the module operational. A module is considered operational only when it is registered, render-tested, connected to its intended data source where applicable, documented, and repeatable on the approved WordPress host.

## Next Build Gates

Before production distribution:

1. Run PHP syntax/static checks against the target WordPress/PHP version.
2. Install on a staging WordPress instance.
3. Verify all ten shortcode rows show Registered + Working.
4. Verify runtime-backed modules report Connected when the canonical runtime is healthy.
5. Test OneGodian.org, OneGodian.com, and QuantumOHI.com host profiles independently.
6. Test responsive layouts and reduced-motion behavior.
7. Add Gutenberg/WPBakery wrappers using the same renderer in the next implementation pass.
8. Package the approved source as the installable plugin ZIP only after staging validation.
