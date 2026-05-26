# OMOS Live Content Update — May 26, 2026

## Current Production State

The OMOS runtime has moved from early scaffold into a production-hardened Node site with public routes, API routes, manifest delivery, plugin bridge metadata, and live route assets.

Canonical host:

```text
https://omos.onegodian.com
```

## Live Public Positioning

OMOS™ is the OneGodian Metaphysical Operating System™ — the Node runtime, protocol layer, and developer-facing orchestration architecture for the ONEGODIAN ecosystem.

It serves as the public and technical layer for:

- Protocol documentation
- OneGodian Algorithm™ runtime explanation
- OHI / Quantum-OHI™ synthesis framing
- public route pages
- API manifest delivery
- plugin bridge metadata
- digital sanctuary presentation
- WordPress integration guidance
- app.OneGodian.com bridge readiness

## Confirmed Runtime Routes

Public routes:

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
/legal
/contact
/protocol
/algorithm
/digital-sanctuary
```

API routes:

```text
/health
/api/health
/manifest
/api/manifest
/process
```

The `/process` endpoint remains protected by `x-omos-key` API-key enforcement.

## Manifest Bridge Content

The runtime manifest should clearly expose:

- service id
- runtime name
- OMOS version
- environment
- canonical host
- public routes
- API routes
- WordPress plugin bridge metadata
- compatible plugin hosts
- app bridge settings
- commerce bridge settings
- integration targets
- safety/compliance notes

## WordPress Plugin Bridge Targets

The OMOS plugin is intended for:

```text
OneGodian.com
OneGodian.org
QuantumOHI.com
```

Expected shortcodes:

```text
[omos_manifest]
[omos_runtime_status]
[omos_bridge_builder]
[omos_tool_grid]
[omos_docs_grid]
```

Plugin responsibilities:

- route synchronization
- shortcode registration
- OMOS card rendering
- tool manifest sync
- dashboard launch links
- canonical route verification

## Digital Sanctuary Content Standard

The `src/pages/digital-sanctuary.html` page should remain the premium visual landing experience using:

- dark navy / obsidian visual base
- gold and purple accents
- liquid-glass panels
- typed text animation
- required public-safe OMOS sections
- clear calls to action
- protocol and algorithm pathway cards

## WordPress Forms Bridge Standard

The WordPress Forms Bridge should be documented as part of the OMOS plugin ecosystem.

Recommended frontend routes:

```text
/contact
/development-inquiry
/business-inquiry
/community-inquiry
/membership-inquiry
/contributor-intake
```

Recommended admin screens:

```text
Forms
Submissions
Email Settings
Google Sync
Spam Protection
Export / Logs
```

Recommended flow:

```text
Plugin Form → WordPress DB → Gmail notification → Google Sheet via Apps Script webhook
```

## Commerce Bridge

Checkout and payment remain on OneGodian.com using WooCommerce and Stripe.

OMOS routes explain, document, and route traffic into:

- PDF guides
- prompt packs
- developer kits
- courses
- membership paths
- OMOS product categories

## Compliance Language

ONEGODIAN, LLC should be described as the commercial, IP, software, and education entity.

OMOS should not be presented as:

- a substitute for civil legal authority
- a government authority
- a financial guarantee system
- an exemption from U.S. law

Gregorian/civil dates remain controlling for legal, financial, banking, tax, contractual, and institutional purposes.

## Production Checklist

Required before marking any OMOS route or feature operational:

1. Implemented in code
2. Versioned
3. Documented
4. Repeatable
5. Testable
6. Logged where applicable
7. Verified against live runtime
8. Matched in manifest
9. Matched in WordPress plugin manifest
10. Public claims aligned with current feature status
