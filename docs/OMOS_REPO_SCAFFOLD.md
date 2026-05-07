# OMOS Repository Scaffold

Version: v1.0.0
Status: Production documentation scaffold
Canonical site: https://omos.onegodian.com

## Purpose

This repository supports OMOS.OneGodian.com as a public-facing WordPress site, documentation library, tool hub, and future API-connected operating surface.

## Production Boundary

OMOS is not yet a complete autonomous runtime. The current production baseline is a WordPress-powered site and tool layer supported by documentation, imports, plugin releases, and visual assets.

A feature is operational only when it is implemented, versioned, documented, repeatable, logged where applicable, and testable.

## Core Directories

```text
/docs        System documentation, whitepaper summaries, governance notes
/legal       Terms, privacy, AI disclaimer, IP notice
/wordpress   WXR imports, shortcode page map, menu/footer structure
/plugins     Plugin release notes and installation guidance
/assets      Logo, banner, visual references, brand notes
/animations  HTML animations and visual explainers
/tools       Tool specifications for public shortcodes and future APIs
```

## Architecture Rule

WordPress is the interface, public content, commerce, and shortcode tool layer.

Node/API systems are the future authority, execution, validation, logging, policy, and verification layer.

QRV and registry systems are future proof and verification layers and should not be described as operational until deployed, documented, and testable.

## Current Public Tool Shortcodes

```text
[omos_declaration_generator]
[omos_obsidian_seal_generator]
[omos_ai_demo]
[omos_ohi_pipeline]
[omos_time_converter]
[omos_belief_mapper]
```

## Current Priority

1. Keep the OMOS site usable.
2. Keep all tool pages connected to shortcodes.
3. Keep legal and IP pages published.
4. Keep documentation versioned.
5. Prepare clean future API integration without overstating runtime status.
