# OMOS WordPress Shortcode Registry

Version: v1.0.0
Site target: https://omos.onegodian.com

## Purpose

This file defines the public OMOS tool shortcodes that should be used on WordPress pages after the OMOS Core Tools plugin is installed and activated.

## Required Plugin

OMOS Core Tools Plugin v1.x

## Public Tool Shortcodes

| Tool | Shortcode | Recommended Page |
|---|---|---|
| Declaration Generator | `[omos_declaration_generator]` | `/tools/declaration-generator/` |
| Obsidian Seal Generator | `[omos_obsidian_seal_generator]` | `/tools/obsidian-seal-generator/` |
| OMOS AI Demo | `[omos_ai_demo]` | `/tools/how-omos-works-in-ai/` |
| OHI Output Pipeline | `[omos_ohi_pipeline]` | `/tools/ohi-output-pipeline/` |
| OneGodian Time Converter | `[omos_time_converter]` | `/tools/onegodian-time-converter/` |
| Belief Mapper | `[omos_belief_mapper]` | `/tools/belief-mapper/` |

## Tool Hub Page

Recommended hub page:

```text
/tools/
```

Suggested hub content:

```text
OMOS Tools

Use these tools to generate declarations, map belief stages, convert OneGodian Time, and explore the OHI output pipeline.

[omos_declaration_generator]
[omos_obsidian_seal_generator]
[omos_belief_mapper]
[omos_time_converter]
[omos_ohi_pipeline]
[omos_ai_demo]
```

## Production Rule

Shortcodes should not be pasted into menus or footer widgets unless the design intentionally supports embedded tools there. Menus and footers should link to tool pages instead.
