=== OMOS Core Tools ===
Contributors: onegodian
Tags: omos, onegodian, bridge, tools, artifacts, documentation
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.3.0
License: Proprietary / ONEGODIAN, LLC distribution terms

Read-only WordPress bridge to the canonical OMOS runtime.

== Description ==

OMOS Core Tools connects approved WordPress properties to the canonical OMOS Node at https://omos.onegodian.com. It reads public OMOS health, manifest, ecosystem, tool, artifact, documentation, and bridge-status endpoints and renders public-safe cards and status blocks.

The plugin does not make a WordPress property an OMOS runtime, does not proxy provider credentials, and does not grant write authority into OMOS.

Canonical target properties:
* OneGodian.com — commerce/product pathways
* OneGodian.org — public identity and education
* QuantumOHI.com — technology and developer pathways

The requested https://omos.onegodian.org host is treated as an alias candidate until DNS/redirect/proxy behavior is independently verified. The runtime source remains https://omos.onegodian.com unless the canonical domain policy is intentionally changed.

== Shortcodes ==

* [omos_manifest]
* [omos_runtime_status]
* [omos_system_status]
* [omos_ecosystem_cards]
* [omos_tool_grid]
* [omos_artifact_grid]
* [omos_docs_grid]
* [omos_open_console_button]
* [omos_unity_dashboard]
* [omos_bridge_builder] — intentionally returns a planned/non-operational notice

== Admin Screens ==

* OMOS Dashboard
* Node Settings
* Content Sync
* System Health

== REST ==

GET /wp-json/omos/v1/bridge/status

This route exposes only public-safe bridge state. It does not expose API keys or OMOS private configuration.

== Installation ==

1. Install this directory as the `omos-core-tools` WordPress plugin.
2. Activate the plugin.
3. Open OMOS > Node Settings and confirm `https://omos.onegodian.com`.
4. Open OMOS > System Health and verify the public OMOS Node endpoints.
5. Add only the shortcodes appropriate to the role of that WordPress property.
6. Record screenshots, plugin version, site URL, node URL, endpoint results, and test timestamp before marking that property VERIFIED.

== Production Boundaries ==

Repository availability is not deployment proof. Each WordPress property must be installed, configured, and tested independently. Endpoint reachability proves connectivity only; it does not prove model output is factually verified, that OMOS PostgreSQL is durable, or that external providers are live.

== Changelog ==

= 1.3.0 =
* Establish installable read-only bridge package.
* Add allowlisted OMOS Node client with transient caching and HTTPS-only node configuration.
* Add public-safe status, manifest, ecosystem, tools, artifacts, docs, dashboard, and console shortcodes.
* Add WordPress admin node settings, content-sync checks, and system health.
* Add public-safe bridge status REST route.
* Preserve Bridge Builder as explicitly planned/non-operational.
