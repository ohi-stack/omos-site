# OMOS Black-Gold Page Design Standard

Date: 2026-09-10
Reference: IMG_4200 visual direction
Status: Canonical public-page visual standard

## Purpose

All public OMOS pages should present as one product family. The canonical visual direction is the black/obsidian OMOS presentation shown by the production-evidence homepage: black header and body, official gold OMOS logo, warm cream/white editorial typography, gold borders and labels, and restrained signal colors only where they communicate actual runtime state.

## Required visual rules

- Page background: true black / obsidian, not navy or blue.
- Global header: black with the official `omos-logo-gold.png` artwork.
- Header logo must replace the temporary square `O` identity on shared-shell pages.
- Primary typography: warm cream / white.
- Editorial accent: OMOS gold.
- Panels/cards: near-black surfaces with subtle gold or neutral borders.
- Cyan/mint may be used only for operational state, health, live-provider, progress, or verification signals.
- Purple/blue gradients must not be used as the dominant page background.
- Existing page-specific blue/navy backgrounds are overridden by the shared OMOS shell.
- Mobile layouts retain the same black/gold identity and use the hamburger navigation pattern.

## Shared implementation rule

`public/omos-ui.css` is the canonical compatibility layer for server-rendered and legacy OMOS pages. Page-specific HTML may retain local styles for layout and animation, but the global stylesheet must control the public shell, background family, shared card surfaces, typography hierarchy, and brand identity.

The homepage may use its dedicated `omos-home.css`, provided it remains visually consistent with this standard.

## Color family

- Obsidian: `#020305`
- Near-black panel: `#08090c`
- Elevated panel: `#0d0e12`
- Cream: `#f5f0e6`
- Muted cream/gray: `#aaa7a1`
- OMOS gold: `#d8b35a`
- Light gold: `#f0d98a`
- Runtime cyan: `#42c6ff` — signal/status use only
- Runtime mint: `#8af3d1` — signal/status use only

## Acceptance test

A visitor moving from the homepage to Council, OHI, Models, Algorithm, Docs, Tools, Workspace, Dashboard, Developers, Pricing, Protocol, or other public OMOS pages should perceive one continuous black/gold product—not a mixture of black/gold and older blue/navy themes.
