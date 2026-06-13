# OMOS Route Expansion Plan

## Purpose

This document defines the next production routes for OMOS.OneGodian.com beyond the initial runtime and documentation shell.

The goal is to make OMOS.OneGodian.com the canonical Node-based protocol, runtime, documentation, and tool gateway for OMOS content.

## Current Core Routes

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
/protocol
/algorithm
/digital-sanctuary
```

## Next Routes To Add

### Identity Layer

```text
/identity
/belief-mapper
/declaration-generator
```

Purpose:
- explain OneGodian identity architecture
- support journey-stage mapping
- prepare frontend tools for declaration workflows

### OHI / Synthesis Layer

```text
/gcd-synthesis
/council-of-models
/output-pipeline
```

Purpose:
- document multi-model reasoning
- show GCD synthesis logic
- embed the OHI Output Pipeline animation

### Developer Layer

```text
/developer
/api
/runtime-manifest
/schemas
```

Purpose:
- expose integration documentation
- document manifest structure
- prepare API and SDK pathways

### Tool Layer

```text
/tools/bridge-builder
/tools/belief-mapper
/tools/declaration-generator
/tools/protocol-explorer
/tools/runtime-checker
```

Purpose:
- make every OMOS tool a direct URL
- support plugin shortcode mapping
- support dashboard and app.OneGodian.com integration

### Commerce Bridge Layer

```text
/products
/downloads
/memberships
/kits
```

Purpose:
- explain OMOS products on the Node site
- route checkout to OneGodian.com
- avoid duplicate checkout logic

## Route Metadata Standard

Each route should include:

```json
{
  "path": "/example",
  "title": "Page Title",
  "eyebrow": "Layer Label",
  "heading": "Primary Heading",
  "summary": "One paragraph summary.",
  "cards": ["Card 1", "Card 2"],
  "status": "draft | active | planned",
  "canonical": "https://omos.onegodian.com/example"
}
```

## Production Rules

1. Do not add a route to the manifest until it returns HTTP 200.
2. Do not mark a route `active` until content exists and smoke tests pass.
3. Use generated fallback pages only for draft/planned routes.
4. Static HTML files in `src/pages` override generated fallback content.
5. Keep commerce CTAs pointed to OneGodian.com.
6. Keep public explanation CTAs pointed to OneGodian.org.
7. Keep execution/admin CTAs pointed to app.OneGodian.com.

## Definition of Done

A route is production-ready when:

- route metadata exists
- route returns HTTP 200
- route is included in `/api/manifest`
- route is included in smoke tests
- page copy is public-safe
- CTA links resolve
- plugin sync sees the route
- route is documented in this file or superseding manifest docs
