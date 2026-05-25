# OMOS Site

Public Node site and documentation repository for **OMOS — OneGodian Metaphysical Operating System**.

Canonical site target: `https://omos.onegodian.com`

## Purpose

This repo holds the public-facing OMOS Node runtime, documentation map, WordPress import assets, protocol references, tool-page requirements, plugin bridge guidance, and production notes for building OMOS.OneGodian.com.

OMOS.OneGodian.com is the dedicated protocol/specification/alignment platform in the current OneGodian digital ecosystem. It should not replace the organization site, store, LMS, galaxy, capital site, or app control plane.

## Current ecosystem foundation

```text
OneGodian.org         = Organization / public identity / institutional home
OneGodian.com         = Store / commerce platform
u.OneGodian.com       = Education / LMS
galaxy.OneGodian.com  = Galaxy / planets / planet stores
capital.OneGodian.com = Corporate finance / capital platform
OMOS.OneGodian.com    = Protocol / specification / alignment system
app.OneGodian.com     = Node control plane tying everything together
```

## Current repository status

This repository is a hybrid documentation + lightweight Node runtime + WordPress support repository.

The Node layer provides a basic Express runtime with public pages, dashboard, API aliases, `/health`, `/manifest`, and protected `/process` routes.

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
- Bridge-Builder Protocol specification
- Bridge-Builder Tool specification and WordPress page draft
- OMOS financial and institutional classification references
- Algorithmic GCD Model Synthesis reference
- Seeger Test and OneGodian Identity reference

## Master site architecture

```text
/
/omos
/protocol
/algorithm
/alignment-api
/tools
/docs
/plugin-bridge
/legal
/contact
/dashboard
/admin
/health
/manifest
/api/health
/api/manifest
/api/tools
/api/stats
/process
```

Legacy/planned WordPress sitemap routes may still include:

```text
/ohi
/models
/artifacts
/shop
/latest-news
```

Those should not be treated as operational on the Node runtime until they are implemented, tested, and added to `src/content/site-content.js`.

## Primary mega menu

The public mega menu should use these seven primary links:

1. OMOS
2. Protocol
3. Algorithm
4. Alignment API
5. Tools
6. Docs
7. Plugin Bridge

`Open Console` should remain a persistent CTA that links to `/dashboard`.

Supporting links such as Legal and Contact belong in the footer, mobile menu, and secondary navigation.

## WordPress plugin targets

The OMOS plugin will be used on:

```text
OneGodian.com
OneGodian.org
QuantumOHI.com
```

Each target should expose its own bridge under:

```text
/wp-json/omos/v1
```

The app bridge keys must remain server-side or inside protected WordPress admin settings. Do not expose bridge keys or LLM provider keys in frontend JavaScript.

## Priority implementation order

1. Merge the Node content foundation.
2. Deploy OMOS.OneGodian.com Node runtime.
3. Verify `/health`, `/manifest`, `/api/health`, `/api/manifest`, `/api/tools`, and `/api/stats`.
4. Import WXR pages and category taxonomies into the appropriate WordPress targets.
5. Activate the OMOS Core Tools plugin on OneGodian.com, OneGodian.org, and QuantumOHI.com.
6. Generate or repair route pages in WordPress using the plugin.
7. Connect tool shortcodes to generated pages.
8. Connect shop pages to Stripe/WooCommerce products.
9. Mirror OMOS status inside app.OneGodian.com.
10. Add analytics and conversion tracking.
11. Confirm all public claims match implemented/runtime status.

## WordPress assets

Store WXR/XML, shortcodes, import instructions, menu/footer structure, and plugin support files in `/wordpress`.

Current WordPress page drafts:

- `wordpress/pages/bridge-builder-tool-page.md`

## Documentation assets

Store protocol, runtime, algorithm, timekeeping, agent authority, declaration generator, and founder references in `/docs`.

Current documentation additions:

- `docs/bridge-builder-protocol.md`
- `docs/OMOS_NODE_PRODUCTION_PLAN.md`

## Tool requirements

Store interactive tool specs in `/tools`.

Current tool specs:

- `tools/bridge-builder-tool-spec.md`

## Plugin sync rule

The WordPress plugin manifest must match the master sitemap. Any new public route, tool route, product pathway, or documentation route should be added to both:

1. the sitemap/source-map documentation; and
2. the WordPress page generator manifest.

For Bridge-Builder, the route `/tools/bridge-builder` and shortcode `[omos_bridge_builder]` should not be treated as operational until the shortcode is implemented, tested, and connected through the plugin manifest.

## Commercial path

The immediate commercial objective is to turn OMOS from documentation into a customer path:

```text
Understand OMOS → Use a tool → Get product/download → Join/member → Follow updates
```

## Local commands

```bash
npm install
npm run check
npm start
npm run smoke
```

## Deployment rule

After any frontend or public route update:

1. Run checks.
2. Run smoke tests.
3. Redeploy the updated frontend/runtime.
4. Verify live routes.
5. Confirm app.OneGodian.com mirrors the updated status.

## Production note

The OMOS site should be public-safe and commercially disciplined. ONEGODIAN, LLC should be described as the commercial/IP/software entity. Governance language belongs only where legally appropriate and should not be mixed into LLC product pages without clarification.
