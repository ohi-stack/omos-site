# OMOS Site

Public site and documentation repository for **OMOS — OneGodian Metaphysical Operating System**.

Canonical site target: `https://omos.onegodian.com`

## Purpose

This repo holds the public-facing OMOS site plan, documentation map, WordPress import assets, protocol references, tool-page requirements, plugin page-generation logic, and production notes for building OMOS.OneGodian.com.

OMOS is positioned as the operating layer where OneGodian identity, OHI synthesis, model pages, protocol documents, tools, post categories, shop pathways, and developer-facing assets are organized into a usable public platform.

## Current repository status

This repository is a hybrid documentation + lightweight Node runtime + WordPress support repository.

The Node layer currently provides a basic Express runtime with `/health`, `/process`, and `/dashboard` routes. The WordPress layer contains the OMOS page generator plugin used to create and repair the public page structure.

Use this rule for version discipline:

> If a feature is not implemented, versioned, documented, repeatable, logged where applicable, and testable, it is not operational in the current version.

## Source documents integrated

This repo maps the following source materials into implementation-ready documentation:

- OHI Runtime technical specification
- OTS-V5 corrected timekeeping standard
- OneGodian Algorithm whitepaper
- OneGodian AI System Prompt
- OneGodian Frequency Standard
- OHI Output Pipeline HTML animation
- Agent Authority Model
- Founder and origin statement
- OMOS WordPress/WXR assets
- OMOS Core Tools / Page Generator plugin assets

## Master site architecture

```text
/
/omos
/ohi
/models
/tools
/artifacts
/docs
/shop
/latest-news
/dashboard
/admin
/legal
/contact
```

## Primary mega menu

The public mega menu should use these seven primary links:

1. OMOS
2. OHI
3. Models
4. Tools
5. Artifacts
6. Docs
7. Shop

`Open Console` should remain a persistent CTA that links to `/dashboard`.

Supporting links such as Latest News, Legal, and Contact belong in the footer, mobile menu, and secondary navigation, not in the seven-slot primary mega menu.

## Priority implementation order

1. Import WXR pages and category taxonomies into WordPress.
2. Activate the OMOS page generator / core tools plugin.
3. Run **Tools → OMOS Page Generator** to generate or repair route pages.
4. Set Home as the static front page.
5. Build the seven-link main navigation and 4-column footer.
6. Connect tool shortcodes to generated pages.
7. Connect shop pages to Stripe/WooCommerce products.
8. Publish first OMOS news, OHI reports, and Council updates.
9. Add analytics and conversion tracking.
10. Confirm all public claims match implemented/runtime status.

## WordPress assets

Store WXR/XML, shortcodes, import instructions, menu/footer structure, and plugin support files in `/wordpress`.

## Documentation assets

Store protocol, runtime, algorithm, timekeeping, agent authority, declaration generator, and founder references in `/docs`.

## Tool requirements

Store interactive tool specs in `/tools`.

## Plugin sync rule

The WordPress plugin manifest must match the master sitemap. Any new public route, tool route, product pathway, or documentation route should be added to both:

1. the sitemap/source-map documentation; and
2. the WordPress page generator manifest.

## Commercial path

The immediate commercial objective is to turn OMOS from documentation into a customer path:

```text
Understand OMOS → Use a tool → Get product/download → Join/member → Follow updates
```

## Production note

The OMOS site should be public-safe and commercially disciplined. ONEGODIAN, LLC should be described as the commercial/IP/software entity. Governance language belongs only where legally appropriate and should not be mixed into LLC product pages without clarification.
