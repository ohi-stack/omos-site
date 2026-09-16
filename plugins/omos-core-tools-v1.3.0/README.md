# OMOS Core Tools v1.3.0

`omos-core-tools` is the canonical WordPress bridge package for approved OneGodian ecosystem properties.

## Current role

Version 1.3.0 is a **read-only bridge client** to the canonical OMOS runtime at `https://omos.onegodian.com`.

It is not a second OMOS runtime and it does not give WordPress permission to execute consequential actions through OMOS.

## Installable source

- `omos-core-tools.php` — plugin bootstrap, bridge status REST route, public styles.
- `includes/class-omos-node-client.php` — HTTPS-only, allowlisted Node client with transient caching.
- `includes/class-omos-shortcodes.php` — public-safe OMOS shortcodes.
- `includes/class-omos-admin.php` — Dashboard, Node Settings, Content Sync, and System Health.
- `readme.txt` — WordPress installation and production boundary documentation.
- `uninstall.php` — controlled plugin option/cache cleanup.

## Public shortcodes

- `[omos_manifest]`
- `[omos_runtime_status]`
- `[omos_system_status]`
- `[omos_ecosystem_cards]`
- `[omos_tool_grid]`
- `[omos_artifact_grid]`
- `[omos_docs_grid]`
- `[omos_open_console_button]`
- `[omos_unity_dashboard]`
- `[omos_bridge_builder]` — planned notice only; no execution path is enabled.

## Approved target roles

1. `OneGodian.com` — OMOS commerce/product discovery pathways; checkout remains on OneGodian.com.
2. `OneGodian.org` — public education, identity, framework, and source-document pathways.
3. `QuantumOHI.com` — technology, alignment, protocol, and developer pathways.

The plugin Node URL defaults to `https://omos.onegodian.com`. `https://omos.onegodian.org` is treated as an alias candidate until its redirect/proxy behavior is independently verified and documented.

## Production rule

A repository package is not proof that the plugin is installed or synchronized on a WordPress property. Each target remains unverified until the installed version, Node URL, `/api/health`, `/api/manifest`, shortcode rendering, local `/wp-json/omos/v1/bridge/status`, screenshots, and verification timestamp are recorded.

See `config/omos-platform-sync.manifest.json` and `docs/OMOS-WORDPRESS-PLATFORM-SYNC.md` for the cross-platform architecture and evidence contract.
