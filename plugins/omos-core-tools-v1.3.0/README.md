# OMOS Core Tools v1.3.0

Status: functional bridge source / deployment validation required

`omos-core-tools` is the WordPress client bridge for the canonical OMOS runtime at `https://omos.onegodian.com`.

It does **not** reproduce Layer 1, Alignment, Council, Governed Synthesis, Human Gate, or Decision Record authority inside WordPress. Those functions remain owned by the central OMOS runtime.

## v1.3.0 implemented baseline

- WordPress admin screen: **OMOS Bridge**
- configurable HTTPS OMOS runtime URL
- site profiles for OneGodian.com, OneGodian.org, QuantumOHI.com, and generic WordPress clients
- server-side OMOS HTTP client
- public runtime health check via `/api/health`
- public manifest retrieval via `/api/manifest`
- provider and persistence client methods for future authenticated/admin diagnostics
- safe WordPress REST endpoints:
  - `/wp-json/omos/v1/bridge/status`
  - `/wp-json/omos/v1/manifest`
- public shortcodes:
  - `[omos_runtime_status]`
  - `[omos_manifest]`
  - `[omos_open_console_button]`
  - `[omos_ask_launcher]`
- server-only credential boundary through `OMOS_RUNTIME_API_KEY`
- no WordPress write/action capabilities enabled by default

## Credential rule

If authenticated OMOS requests are enabled later, configure `OMOS_RUNTIME_API_KEY` server-side through `wp-config.php` or the hosting environment. Do not print or inject this secret into JavaScript, page HTML, WordPress REST output, logs, or Decision Records.

## Source-of-record rule

- OMOS runtime / governed decisions: `OMOS.OneGodian.com`
- WordPress content: the individual WordPress property
- products/orders/entitlements: the applicable commerce system (for example WooCommerce on OneGodian.com)
- execution: ACC or another separately authorized action system

Synchronization does not make WordPress the source of truth for an OMOS Decision Record and does not give OMOS automatic authority to alter WordPress content.

## Next implementation gates

1. Stage and activate on each target WordPress property.
2. Confirm health + manifest parity against the deployed OMOS runtime.
3. Add signed/versioned content-manifest synchronization.
4. Add WooCommerce entitlement adapter on OneGodian.com.
5. Add authenticated Decision Record/history display for authorized users.
6. Add write/action endpoints only behind WordPress capability checks, nonce validation, OMOS policy/Human Gate requirements, idempotency, and audit receipts.
7. Package and release only after WordPress/PHP regression testing.
