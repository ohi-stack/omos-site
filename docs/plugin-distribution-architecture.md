# OMOS Plugin Distribution Architecture

## Canonical architecture

OMOS.OneGodian.com is the canonical Node authority runtime for:

- OMOS specifications
- manifests
- APIs
- protocol docs
- alignment schemas
- runtime tooling
- dashboards
- model synthesis demonstrations
- implementation documentation

The OMOS WordPress plugin is the distribution and presentation layer.

The plugin should be installed on:

1. OneGodian.com
2. OneGodian.org
3. QuantumOHI.com

## Separation rule

Node runtime = authority and execution.

WordPress plugin = embedding, mirroring, CTA routing, WooCommerce integration, and educational presentation.

The plugin should not become the primary source of truth.

## Plugin responsibilities

### OneGodian.com

Primary role:

- commerce
- downloads
- memberships
- product kits
- protocol products
- checkout flows

Recommended plugin blocks:

- OMOS product grids
- runtime status widgets
- protocol summaries
- manifest snapshots
- tool embeds
- checkout CTA sections

### OneGodian.org

Primary role:

- public explanation
- educational orientation
- member pathways
- institutional summaries

Recommended plugin blocks:

- What Is OMOS
- Belief Mapper CTA
- Protocol summaries
- OHI explanation sections
- latest OMOS updates

### QuantumOHI.com

Primary role:

- technical services
- AI governance tooling
- enterprise explanation
- alignment consulting

Recommended plugin blocks:

- API documentation embeds
- runtime architecture diagrams
- OHI synthesis demos
- model council visualizations
- protocol implementation references

## Recommended plugin structure

```text
omos-plugin/
  omos-plugin.php
  /admin
  /public
  /blocks
  /shortcodes
  /api
  /assets
  /templates
  /manifests
```

## Recommended shortcodes

```text
[omos_manifest]
[omos_runtime_status]
[omos_protocol_summary]
[omos_algorithm_summary]
[omos_belief_mapper]
[omos_bridge_builder]
[omos_latest_updates]
```

## Runtime integration

The plugin should read from:

- /manifest
- /health
- /api/tools
- /api/stats

from the canonical OMOS Node runtime.

## Production discipline

If a route, tool, API, or shortcode is not:

- implemented
- documented
- testable
- versioned
- repeatable

then it should not be presented as operational.
