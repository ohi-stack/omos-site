# OMOS Unity Command Console Specification

Version: v1.0.0
Proposed shortcode: `[omos_unity_command_console]`
Recommended page: `/dashboard/` or `/tools/unity-command-console/`

## Purpose

The Unity Command Console is a visual OMOS dashboard concept designed to present the OneGodian operating surface as a command-center interface. It is currently a front-end UI module and should be treated as a non-authoritative display layer unless connected to real authenticated data, registry records, API endpoints, and logging.

## Current UI Sections

- Sidebar navigation
- Unity Command header
- Core Matrix dashboard
- OneGodians metric card
- Resonance metric card
- Pulse Rate metric card
- Treasury metric card
- Neural Oscillations chart mockup
- Log Streams panel
- Congregation Registry table
- Root Terminal overlay

## Plugin Integration Recommendation

Add this as a shortcode-rendered module inside the OMOS Core Tools plugin.

```text
[omos_unity_command_console]
```

## WordPress Implementation Requirements

1. Register shortcode `omos_unity_command_console`.
2. Enqueue local plugin CSS instead of relying on Tailwind CDN in production.
3. Do not use live financial, registry, or identity claims until connected to verified backend data.
4. Label dashboard metrics as demo, sample, or preview until connected to authenticated APIs.
5. Keep all interactive terminal actions non-executing until a secure API layer exists.
6. Sanitize any user-controlled output.
7. Do not expose admin-only data on public pages.

## Safety and Versioning Notes

The current HTML contains sample values:

```text
OneGodians: 12,482
Resonance: 98.2%
Pulse Rate: 1,094
Treasury: $42.8k
```

These must be treated as UI placeholders unless backed by production data.

## Production Path

### Phase 1 — Static Display

Render the console as a visual dashboard preview.

### Phase 2 — WordPress Data

Connect to plugin settings and submissions table.

### Phase 3 — API Bridge

Connect to OEG / OCP / ACC or other verified authority layer.

### Phase 4 — Authentication

Restrict operational views to logged-in users with correct roles.

### Phase 5 — QRV / Registry Verification

Connect output records, declarations, IDs, or certificates to verification endpoints.

## Suggested Menu Placement

WordPress Admin:

```text
OMOS Tools → Unity Command
```

Public route:

```text
/dashboard/
```

or:

```text
/tools/unity-command-console/
```
