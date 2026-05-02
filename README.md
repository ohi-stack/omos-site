# OMOS Site

Public site and documentation repository for **OMOS — OneGodian Metaphysical Operating System**.

Canonical site target: `https://omos.onegodian.com`

## Purpose

This repo holds the public-facing OMOS site plan, documentation map, WordPress import assets, protocol references, tool-page requirements, and production notes for building OMOS.OneGodian.com.

OMOS is positioned as the operating layer where OneGodian identity, OHI synthesis, model pages, protocol documents, tools, post categories, shop pathways, and developer-facing assets are organized into a usable public platform.

## Current repository status

This repository is documentation-first. It is not yet a deployed application runtime.

Use this rule for version discipline:

> If a feature is not implemented, versioned, documented, repeatable, logged where applicable, and testable, it is not operational in the current version.

## Source documents integrated

This repo now maps the following source materials into implementation-ready documentation:

- OHI Runtime technical specification
- OTS-V5 corrected timekeeping standard
- OneGodian Algorithm whitepaper
- OneGodian AI System Prompt
- OneGodian Frequency Standard
- OHI Output Pipeline HTML animation
- Agent Authority Model
- Founder and origin statement
- OMOS WordPress/WXR assets

## Recommended site architecture

```text
/
/ohi
/models
/omos
/tools
/news
/shop
/about
/contact
```

## Priority implementation order

1. Import WXR pages and category taxonomies into WordPress.
2. Set Home as the static front page.
3. Build main navigation and 4-column footer.
4. Activate OMOS Core Tools plugin.
5. Connect tool shortcodes to generated pages.
6. Connect shop pages to Stripe/WooCommerce products.
7. Publish first OMOS news and Council reports.
8. Add analytics and conversion tracking.

## WordPress assets

Store WXR/XML, shortcodes, import instructions, and menu/footer structure in `/wordpress`.

## Documentation assets

Store protocol, runtime, algorithm, timekeeping, agent authority, and founder references in `/docs`.

## Tool requirements

Store interactive tool specs in `/tools`.

## Commercial path

The immediate commercial objective is to turn OMOS from documentation into a customer path:

```text
Understand OMOS → Use a tool → Get product/download → Join/member → Follow updates
```

## Production note

The OMOS site should be public-safe and commercially disciplined. ONEGODIAN, LLC should be described as the commercial/IP/software entity. Governance language belongs only where legally appropriate and should not be mixed into LLC product pages without clarification.
