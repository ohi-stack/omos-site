# OMOS Production Environment Contract

## Canonical Runtime

Canonical production host:

```text
https://omos.onegodian.com
```

OMOS.OneGodian.com is the Node authority runtime for:

- protocol documentation
- algorithm specifications
- OHI synthesis pages
- manifests
- runtime APIs
- tools
- artifacts
- dashboards
- developer documentation

The WordPress plugin layer is a distribution and embedding layer only.

## Primary Integration Targets

### OneGodian.com
Role:
- commerce
- memberships
- downloads
- product pathways
- contribution products

Plugin usage:
- protocol cards
- OMOS summaries
- product embeds
- WooCommerce routing
- dashboard launch buttons

### OneGodian.org
Role:
- institutional home
- educational explanation
- public orientation
- membership onboarding

Plugin usage:
- public-safe explainers
- Belief Mapper embeds
- journey pathways
- OMOS summaries

### QuantumOHI.com
Role:
- technical services
- governance tooling
- OHI consulting
- alignment systems

Plugin usage:
- API embeds
- OHI summaries
- runtime cards
- technical manifests

## Required Environment Variables

```bash
PORT=3000
NODE_ENV=production
OMOS_SITE_URL=https://omos.onegodian.com
OMOS_API_KEYS=name:sha256hash:starter
```

## DNS

Recommended DNS target:

```text
omos.onegodian.com
```

Should point to:
- VPS
- Node runtime
- Docker runtime
- Cloud Run
- Railway
- Render
- Hostinger VPS

## Required Production Endpoints

```text
/health
/manifest
/process
/dashboard
/omos
/protocol
/algorithm
/ohi
/tools
/legal
```

## Production Rules

1. Node runtime is source-of-truth.
2. Plugin pages should mirror Node content.
3. Public claims must match implemented features.
4. Commercial pages belong to ONEGODIAN, LLC.
5. Governance language must remain legally separated.
6. Gregorian dates remain authoritative for compliance and institutions.

## Recommended Next Runtime Additions

- sitemap.xml
- robots.txt
- OpenGraph metadata
- analytics
- Stripe hooks
- product API
- member auth
- downloadable artifact registry
- PDF manifest system
- runtime logging
- CI smoke tests
