# OMOS Core Tools v1.5.0

Canonical WordPress presentation and integration bridge for OMOS™.

**Originator:** One Gregory Onegodian™  
**Owner / publisher:** ONEGODIAN, LLC  
**Public WordPress surface:** `https://omos.onegodian.org`  
**Governed runtime:** `https://omos.onegodian.com`

## Architecture boundary

OMOS Core Tools does not turn WordPress into the OMOS runtime.

- `OMOS.OneGodian.org` is the WordPress public/documentation/presentation surface.
- `OMOS.OneGodian.com` is the governed Node/Express runtime.
- ACC remains the separate control plane for separately authorized external execution.
- Connected domains remain their own sources of record.
- WordPress does not own provider credentials, Council authority, Human Gate, Decision Records, PostgreSQL, deployments, payments, credential changes, or consequential external actions.

## v1.5.0 changes

- Replaces the competing v1.4.0 monolithic/draft variants with one modular codebase.
- Keeps the 10-module branded shortcode registry.
- Preserves operational v1.4.0 Ask/Council/History/Belief Mapper shortcodes as compatibility surfaces.
- Adds a dedicated shortcode health screen with **Registered / Working / Connected / Error** states.
- Adds machine-readable WordPress sync endpoints for WPVibe verification.
- Adds explicit `.org` public / `.com` governed-runtime separation.
- Uses `wp_safe_remote_request()` for server-side runtime calls.
- Keeps bridge credentials server-side; `OMOS_BRIDGE_API_KEY` is the preferred production source.
- Adds OneGodian/OMOS obsidian, gold, purple and warm-white responsive styling.
- Adds production checklist and admin boundary screens without duplicating runtime authority.

## Canonical shortcodes

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

Compatibility surfaces retained from the operational v1.4.0 bridge:

- `[omos_ask]`
- `[omos_council]`
- `[omos_decision_history]`
- `[omos_belief_mapper]`

## WordPress REST verification contract

Public read-only endpoints:

- `GET /wp-json/omos/v1/status`
- `GET /wp-json/omos/v1/sync`
- `GET /wp-json/omos/v1/shortcodes`
- `GET /wp-json/omos/v1/manifest`
- `GET /wp-json/omos/v1/health`
- `GET /wp-json/omos/v1/providers`
- `GET /wp-json/omos/v1/persistence`

Authenticated user submission:

- `POST /wp-json/omos/v1/ask`

`POST /ask` sends the user prompt to the governed OMOS runtime. It does not persist a parallel WordPress Decision Record.

## Admin screens

- Dashboard
- App Bridge
- Shortcodes
- Settings
- API Keys
- Tools Registry
- Submissions
- Status
- Production Checklist
- Documentation
- System Prompt

The System Prompt screen intentionally does **not** provide a local prompt editor. Prompt policy, provider configuration, Council rules and synthesis policy remain runtime-owned.

## Shared platform dependency

OMOS Core Tools should be deployed alongside `ohi-stack/onegodian-platform-plugin` version `0.3.0+` where the shared WordPress platform layer is used. Shared infrastructure belongs in that plugin; OMOS-specific presentation and governed runtime integration belong here.

## Production configuration

Preferred server-side configuration:

```php
define('OMOS_BRIDGE_API_KEY', getenv('OMOS_BRIDGE_API_KEY'));
```

Do not place OpenAI, Anthropic, Gemini, xAI or other provider credentials in WordPress.

## Target sites

Initial synchronized WordPress nodes:

- `https://omos.onegodian.org`
- `https://onegodian.org`
- `https://onegodian.com`
- `https://u.onegodian.org`
- `https://quantumohi.com`

## WPVibe live verification

Repository success is not live deployment proof. After installing the packaged plugin, WPVibe should verify on each target node:

1. Plugin reports `1.5.0`.
2. `/wp-json/omos/v1/status` resolves.
3. `/wp-json/omos/v1/sync` reports the expected site role, public surface and governed runtime.
4. `/wp-json/omos/v1/shortcodes` shows all 10 canonical modules Registered + Working.
5. Runtime-backed state reports Connected only when the canonical OMOS runtime is actually reachable.
6. No provider or bridge secret appears in HTML, JavaScript, REST payloads or logs.
7. Responsive rendering and accessibility checks pass.

## Maturity

**Repository status:** Functional / repository-tested after CI passes.  
**Live status:** Unverified until installed and inspected through WPVibe on each target WordPress node.  
**Production status:** Not claimed until both WordPress deployment evidence and canonical OMOS runtime production evidence pass.
