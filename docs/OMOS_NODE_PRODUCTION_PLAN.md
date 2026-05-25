# OMOS.OneGodian.com Node Production Plan

## Purpose

OMOS.OneGodian.com is the dedicated protocol, specification, documentation, and alignment node for the OneGodian digital ecosystem.

It is separate from:

- OneGodian.org — organization / public identity / institutional home
- OneGodian.com — store / commerce platform
- u.OneGodian.com — education / LMS
- galaxy.OneGodian.com — galaxy / planets / planet stores
- capital.OneGodian.com — corporate finance / capital platform
- app.OneGodian.com — Node control plane tying everything together

## Production Scope

This repository provides the Node runtime for OMOS.OneGodian.com.

Current production-facing responsibilities:

- Public OMOS pages
- Protocol/specification pages
- Algorithm and alignment pages
- Documentation index
- Tool registry index
- Plugin bridge deployment guide
- Runtime health and manifest endpoints
- API aliases for app.OneGodian.com status mirroring

## Required Routes

```txt
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

## WordPress Plugin Targets

The OMOS Core Tools plugin is intended for:

```txt
OneGodian.com
OneGodian.org
QuantumOHI.com
```

Each WordPress target should expose its own REST bridge under:

```txt
/wp-json/omos/v1
```

## App Mirror Requirement

app.OneGodian.com must mirror OMOS status through system cards:

- OMOS Site Status
- OMOS Node Runtime Status
- OMOS Plugin Bridge Status
- OMOS Tool Registry
- OMOS Documentation Index
- OMOS LLM Gateway Status

## Environment Variables

```env
OMOS_PUBLIC_URL=https://omos.onegodian.com
ONEGODIAN_PUBLIC_URL=https://onegodian.org
ONEGODIAN_COMMERCE_URL=https://onegodian.com
ONEGODIAN_APP_URL=https://app.onegodian.com
QUANTUM_OHI_URL=https://quantumohi.com
OMOS_API_KEYS=change-me-local-dev-key
OMOS_ONEGODIAN_ORG_REST_BASE_URL=https://onegodian.org/wp-json/omos/v1
OMOS_ONEGODIAN_COM_REST_BASE_URL=https://onegodian.com/wp-json/omos/v1
OMOS_QUANTUM_OHI_REST_BASE_URL=https://quantumohi.com/wp-json/omos/v1
OMOS_ONEGODIAN_ORG_APP_BRIDGE_KEY=
OMOS_ONEGODIAN_COM_APP_BRIDGE_KEY=
OMOS_QUANTUM_OHI_APP_BRIDGE_KEY=
ONEGODIAN_APP_MANIFEST_URL=https://app.onegodian.com/api/manifest
ONEGODIAN_APP_HEALTH_URL=https://app.onegodian.com/api/health
```

## Build / Check / Deploy

```bash
npm install
npm run check
npm start
npm run smoke
```

Production deployment should run:

```bash
npm ci
npm run check
npm start
npm run smoke
```

## Deployment Rule

After any frontend or public route update:

1. Build or syntax-check the updated frontend/runtime.
2. Run smoke tests.
3. Redeploy OMOS.OneGodian.com.
4. Verify live routes.
5. Confirm app.OneGodian.com mirrors the updated status.

## Legal-Safe Positioning

OMOS is a protocol/specification/alignment documentation platform and software-support layer. It is not a legal filing system, financial instrument, religious authority, or substitute for civil law.

ONEGODIAN, LLC should be described as the commercial/IP/software entity. Governance language belongs only where legally appropriate and should not be mixed into LLC product pages without clarification.
