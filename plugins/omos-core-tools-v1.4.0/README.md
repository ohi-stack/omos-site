# OMOS Core Tools v1.4.0

Production-oriented WordPress bridge for OMOS.OneGodian.com.

## Capabilities

- OMOS runtime URL and API key configuration
- Runtime health check and connection test
- Manifest synchronization and transient caching
- Node registration/heartbeat contract
- Public shortcodes for runtime status, manifest, Ask OMOS, tools, docs, Council, Decision History, Belief Mapper and Unity Dashboard
- WordPress REST proxy endpoints under `/wp-json/omos/v1/`
- Admin Dashboard, App Bridge, Settings, API Keys, Tools, Status, Production Checklist and Documentation screens
- Capability-safe admin access and nonce-protected operations
- No provider API keys stored in the plugin; model credentials remain server-side in OMOS

## Canonical runtime

`https://omos.onegodian.com`

## Shortcodes

- `[omos_runtime_status]`
- `[omos_manifest]`
- `[omos_ask]`
- `[omos_council]`
- `[omos_tool_grid]`
- `[omos_docs_grid]`
- `[omos_decision_history]`
- `[omos_belief_mapper]`
- `[omos_unity_dashboard]`

## Production rule

The WordPress plugin is an interface/bridge. OMOS runtime remains authoritative for orchestration, provider credentials, Alignment, Council execution, governed synthesis and Decision Records.
