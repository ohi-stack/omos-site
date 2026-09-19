# OMOS.OneGodian.com — Canonical Sitemap

**Status date:** September 19, 2026  
**Canonical host:** `https://omos.onegodian.com`  
**Repository:** `ohi-stack/omos-site`  
**Canonical core-page registry:** `config/omos-odin-pages.json`  
**Core ODIN page count:** **30**

## Sitemap rule

OMOS uses two related route classes:

1. **ODIN-addressable core pages** — the 30-page canonical registry. These define the durable information architecture and page identities.
2. **Application / operational surfaces** — customer workspace, Council, models, pricing, Ask OMOS, artifacts, reference-run and related runtime views. These may be implemented public routes without receiving a new ODIN code until the registry is formally expanded.

Do not increase the canonical 30-page count merely because a runtime view or utility route exists.

---

# A. Canonical 30 ODIN Pages

## Foundation & Architecture

| ODIN | Page | Route | 2026-09-19 source status |
| --- | --- | --- | --- |
| ODIN-OMOS-0001 | Home | `/` | Implemented route |
| ODIN-OMOS-0002 | OMOS Overview | `/omos` | Implemented route |
| ODIN-OMOS-0003 | OHI Runtime | `/ohi` | Implemented route |
| ODIN-OMOS-0004 | Agent Authority Model | `/agent-authority-model` | Registry-defined; dedicated public route not in current `publicRoutes` |
| ODIN-OMOS-0005 | ACC Structure | `/acc` | Registry-defined; dedicated public route not in current `publicRoutes` |
| ODIN-OMOS-0006 | OCP Structure | `/ocp` | Registry-defined; dedicated public route not in current `publicRoutes` |
| ODIN-OMOS-0007 | OEG Structure | `/oeg` | Registry-defined; dedicated public route not in current `publicRoutes` |
| ODIN-OMOS-0008 | Output Pipeline | `/ohi-output-pipeline` | Implemented route |
| ODIN-OMOS-0009 | Protocols | `/protocol` | Implemented route |

## Developer & Runtime

| ODIN | Page | Route | 2026-09-19 source status |
| --- | --- | --- | --- |
| ODIN-OMOS-0010 | API | `/api` | Registry-defined; API endpoints exist but dedicated page is not in current `publicRoutes` |
| ODIN-OMOS-0011 | Documentation | `/docs` | Implemented route |
| ODIN-OMOS-0012 | Developer Portal | `/developers` | Implemented route |
| ODIN-OMOS-0013 | Alignment Engine | `/alignment` | Registry-defined; Alignment functionality exists but dedicated public route is not in current `publicRoutes` |

## Identity, Registry & Governance

| ODIN | Page | Route | 2026-09-19 source status |
| --- | --- | --- | --- |
| ODIN-OMOS-0014 | Belief Mapper | `/belief-mapper` | Implemented route |
| ODIN-OMOS-0015 | Identity Schema | `/identity-schema` | Registry-defined; dedicated public route not in current `publicRoutes` |
| ODIN-OMOS-0016 | Registry | `/registry` | Registry-defined; dedicated public route not in current `publicRoutes` |
| ODIN-OMOS-0017 | Logs | `/logs` | Registry-defined; should remain restricted/admin-oriented unless explicitly made public |
| ODIN-OMOS-0018 | Verification | `/verification` | Registry-defined; verification functionality exists across runtime/docs but dedicated route is not in current `publicRoutes` |
| ODIN-OMOS-0019 | Governance Rules | `/governance-rules` | Registry-defined; dedicated public route not in current `publicRoutes` |
| ODIN-OMOS-0020 | Integrations | `/integrations` | Registry-defined; integration documentation exists but dedicated route is not in current `publicRoutes` |

## Tools, Administration & Operating Surfaces

| ODIN | Page | Route | 2026-09-19 source status |
| --- | --- | --- | --- |
| ODIN-OMOS-0021 | Tools | `/tools` | Implemented route |
| ODIN-OMOS-0022 | Dashboard | `/dashboard` | Implemented route |
| ODIN-OMOS-0023 | Admin | `/admin` | Implemented restricted control-plane route; excluded from public navigation |
| ODIN-OMOS-0024 | Policies | `/policies` | Registry-defined; dedicated public route not in current `publicRoutes` |
| ODIN-OMOS-0025 | Schemas | `/schemas` | Registry-defined; dedicated public route not in current `publicRoutes` |
| ODIN-OMOS-0026 | Agents | `/agents` | Registry-defined; Developer Agent Registry exists in documentation; dedicated public route not in current `publicRoutes` |
| ODIN-OMOS-0027 | Workflows | `/workflows` | Registry-defined; dedicated public route not in current `publicRoutes` |
| ODIN-OMOS-0028 | Status | `/status` | Registry-defined; health/status APIs exist but dedicated public route is not in current `publicRoutes` |
| ODIN-OMOS-0029 | FAQ | `/faq` | Registry-defined; dedicated public route not in current `publicRoutes` |
| ODIN-OMOS-0030 | Portal | `/portal` | Registry-defined; current customer workspace/portal functionality is distributed across `/workspace`, `/dashboard`, `/ask/` and related routes |

---

# B. Current Customer-Facing Runtime Surfaces

These routes are implemented or explicitly surfaced by the current Node runtime but are not all separate entries in the 30-page ODIN registry.

## Primary seven-section navigation

```text
OMOS        /omos
WORKSPACE   /workspace
COUNCIL     /council
OLLM        /ollm
TOOLS       /tools
DEVELOPERS  /developers
PRICING     /pricing
```

Persistent action:

```text
ASK OMOS    /ask/
```

## Supporting application routes

| Route | Role |
| --- | --- |
| `/models` | Model Connectors / Council provider control surface |
| `/artifacts` | Source documents, runtime evidence, manifests and implementation artifacts |
| `/shop` | Product/commerce bridge to OneGodian.com |
| `/latest-news` | Build notes, release status and development chronology |
| `/legal` | Legal, compliance and institutional positioning |
| `/contact` | Contact and ecosystem connection pathways |
| `/algorithm` | OneGodian Algorithm — Observe → Distill → Align → Select → Execute → Verify |
| `/digital-sanctuary` | Digital Sanctuary experience |
| `/reference-run` | OMOS-REF-0001 production-proof standard |
| `/dashboard` | Runtime, providers, runs and Decision Record history |
| `/admin` | Restricted OMOS control plane; never public mega-menu navigation |

---

# C. Runtime / API Utility Surfaces

Public-safe runtime endpoints currently represented by source include:

```text
GET /health
GET /manifest
GET /api/health
GET /api/manifest
GET /api/v1/providers
GET /api/v1/persistence
```

Authenticated governed-runtime endpoints include:

```text
POST /process
POST /api/v1/council/run
GET  /api/v1/council/runs
GET  /api/v1/council/runs/:id
POST /api/v1/council/runs/:id/human-decision
```

These are API surfaces, not additions to the 30-page public sitemap count.

---

# D. WordPress / Cross-Platform Surfaces

The canonical runtime remains `omos.onegodian.com`.

`omos.onegodian.org`, where used, is a WordPress presentation/client surface and must not become a second Decision Record authority.

Current WordPress bridge architecture:

```text
OMOS Runtime
   ↓
OneGodian Platform Plugin
   ↓
OneGodian.org / OneGodian.com / QuantumOHI.com / approved WordPress properties

OMOS-specific presentation:
OMOS Core Tools v1.5.0+

Consequential WordPress writes:
OMOS → Human Gate → ACC → acc-wp-adapter → WordPress/WooCommerce
```

---

# E. September 19 Reconciliation Priorities

1. Keep the 30 ODIN records stable while implementation catches up.
2. Build dedicated routes for registry-defined pages that are still absent from the current `publicRoutes` map.
3. Decide whether customer-facing routes such as `/workspace`, `/council`, `/ollm`, `/pricing`, `/models`, `/artifacts`, `/shop`, `/latest-news`, `/algorithm`, `/digital-sanctuary`, and `/reference-run` should receive new ODIN identities in a later registry expansion or remain application surfaces under existing core pages.
4. Keep `/admin` private/restricted and out of public navigation.
5. Treat `/logs` and other operational telemetry as restricted unless a public-safe view is intentionally created.
6. Keep API endpoints separate from page-count reporting.
7. Preserve the current production rule: a registered page is not production-complete until implemented, documented, repeatable, deployed, and independently verified.

## Current defensible status

**Canonical information architecture:** 30 ODIN-addressable core pages.  
**Current Node public application:** customer-first seven-section navigation plus supporting runtime surfaces.  
**State:** repository-defined and partially implemented; individual routes and canonical-host deployment remain subject to production verification.
