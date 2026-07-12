# OMOS Core Tools Plugin — Motion and Interactive UI Upgrade Spec

## Purpose

The OMOS plugin should evolve from static admin screens into an interactive WordPress control surface that matches the motion language of OMOS.OneGodian.com.

The plugin will be used on:

- OneGodian.com
- OneGodian.org
- QuantumOHI.com

## New Admin UI Standard

Every OMOS plugin screen should include:

- Animated status cards
- Tabbed navigation
- App bridge health panel
- Route readiness indicators
- Plugin target badges
- Interactive tool launcher cards
- REST endpoint copy buttons
- Environment variable checklist
- Success/error toast notices
- Mobile-responsive cards
- Audit/log timeline

## Required Plugin Screens

```txt
Dashboard
App Bridge
API Keys
LLM Gateway
Tools
Submissions
Status
Production Checklist
Documentation
Motion Lab
```

## Motion Lab Screen

Add a new admin tab:

```txt
OMOS Tools → Motion Lab
```

This screen should preview:

1. OMOS Orbit Architecture
2. OHI Output Pipeline
3. Plugin Bridge Status Board
4. Interactive Tool Cards
5. Admin Dashboard Preview

## Recommended Shortcodes

```txt
[omos_orbit_architecture]
[omos_ohi_pipeline]
[omos_motion_cards]
[omos_bridge_status_board]
[omos_dashboard_preview]
```

## Frontend Tool Routes

The plugin page generator should be able to create:

```txt
/omos
/omos/protocol
/omos/algorithm
/omos/ohi-output-pipeline
/omos/tools
/omos/plugin-bridge
/omos/motion-lab
```

## REST Endpoints to Add

```txt
/wp-json/omos/v1/motion/manifest
/wp-json/omos/v1/motion/components
/wp-json/omos/v1/motion/status
```

### `/motion/manifest`

Returns available motion components:

```json
{
  "status": "ok",
  "version": "1.3.0",
  "components": [
    "orbit_architecture",
    "ohi_pipeline",
    "motion_cards",
    "bridge_status_board",
    "dashboard_preview"
  ]
}
```

### `/motion/components`

Returns shortcode metadata and frontend component definitions.

### `/motion/status`

Returns whether each motion shortcode is enabled and which pages use it.

## Security

- Motion components must not expose provider keys, bridge keys, or server secrets.
- AJAX actions must use WordPress nonces.
- Admin-only actions require `manage_options` or a dedicated plugin capability.
- Frontend shortcodes must sanitize all attributes.
- REST routes returning configuration must hide secret values.

## Production Checklist

Before the plugin is considered production-ready:

- Admin Motion Lab loads on desktop and mobile.
- All shortcodes render without JavaScript errors.
- REST motion endpoints return valid JSON.
- App bridge key remains private.
- LLM provider keys remain private.
- Plugin routes are mirrored in app.OneGodian.com.
- WordPress pages using shortcodes are generated and checked.
- Frontend is built/redeployed after app-side changes.

## Version Target

Recommended next plugin version:

```txt
OMOS Core Tools v1.3.0 — Motion Lab + Interactive Components
```

## Implementation Note

The Node site now includes the same visual concepts under `/animations`. The WordPress plugin should implement equivalent components as reusable admin panels and front-end shortcodes so the same motion system can run on OneGodian.com, OneGodian.org, and QuantumOHI.com.
