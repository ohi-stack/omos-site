# OMOS.OneGodian.com — Code Tasks

Status: active build queue
Repository: ohi-stack/omos-site
Runtime: Node / Express
Platform role: OMOS Node console for protocol, tools, artifacts, docs, runtime manifest, and WordPress plugin sync.

---

## Phase 1 — Runtime Foundation

### TASK-001 — Expand Runtime Manifest

Priority: Critical

Build a structured manifest registry that includes:

- public routes
- dashboard routes
- API routes
- tool registry
- artifact registry
- docs registry
- plugin sync targets
- connected domains
- version metadata
- production status flags

Acceptance criteria:

- `/manifest` returns full structured platform metadata
- `/api/manifest` returns the same object with generated timestamp
- manifest includes OneGodian.com, OneGodian.org, QuantumOHI.com, and app.OneGodian.com targets
- manifest excludes test artifacts and duplicate consensus counter routes

---

### TASK-002 — Add Tools API

Priority: Critical

Create:

- `src/runtime/registries/tools.js`
- `GET /api/tools`
- `GET /api/tools/:slug`

Initial tools:

- belief-mapper
- consensus-counter
- ai-consensus
- foundation-day
- timekeeping
- generators
- converters

Acceptance criteria:

- API returns JSON tool cards
- each tool has title, slug, description, publicUrl, dashboardUrl, shortcode, status
- only one consensus counter exists

---

### TASK-003 — Add Artifacts API

Priority: Critical

Create:

- `src/runtime/registries/artifacts.js`
- `GET /api/artifacts`
- `GET /api/artifacts/:slug`

Artifact categories:

- documents
- code
- system
- whitepapers
- prompts

Required artifact fields:

- title
- slug
- type
- category
- description
- version
- status
- canonicalUrl
- downloadUrl
- sourceFile

Acceptance criteria:

- `/api/artifacts` returns all active artifact cards
- `/api/artifacts/onegodian-consensus-counter` exists
- `/artifacts/onegodian-site` is not included
- `/artifacts/onegodian-consensus-counter-v2` is not included

---

### TASK-004 — Add System Health API

Priority: High

Create:

- `GET /api/system-health`

Checks:

- manifest online
- tools registry loaded
- artifacts registry loaded
- required pages configured
- required API routes configured
- environment variables present
- plugin sync endpoints configured

Acceptance criteria:

- returns JSON with `status`, `checks`, and `recommendations`
- returns degraded status when required values are missing

---

## Phase 2 — Frontend Pages

### TASK-005 — Add Global Layout Shell

Priority: High

Create shared page shell for static HTML pages:

- header
- 7-link mega menu
- Open Console CTA
- footer with 4 columns
- OMOS color system
- responsive mobile navigation

Primary nav:

- OMOS
- OHI
- Models
- Tools
- Artifacts
- Docs
- Shop

Persistent CTA:

- OPEN CONSOLE → `/dashboard`

Acceptance criteria:

- all HTML pages share a consistent visual system
- mobile menu includes Latest News, Legal, and Contact
- CTA is visually distinct

---

### TASK-006 — Replace Placeholder Pages

Priority: High

Upgrade these pages from placeholder content to production sections:

- `src/pages/home.html`
- `src/pages/omos.html`
- `src/pages/protocol.html`
- `src/pages/algorithm.html`
- `src/pages/tools.html`
- `src/pages/docs.html`
- `src/pages/dashboard.html`
- `src/pages/legal.html`

Acceptance criteria:

- each page has hero, summary, cards, CTA, and internal links
- content aligns with OMOS as a platform console, not just a landing page

---

### TASK-007 — Add New Public Pages

Priority: Medium

Add routes and static pages for:

- `/ohi`
- `/models`
- `/artifacts`
- `/shop`
- `/latest-news`
- `/contact`
- `/registry`
- `/verify`
- `/time`
- `/foundation`
- `/manifest-page`

Acceptance criteria:

- all pages route without 404
- smoke tests cover every route

---

## Phase 3 — Dashboard Console

### TASK-008 — Dashboard Modules

Priority: High

Create dashboard sections:

- runtime status
- manifest status
- tools
- artifacts
- downloads
- activity
- settings
- plugin sync

Acceptance criteria:

- `/dashboard` shows console cards
- cards link to API endpoints and public pages
- dashboard reads live manifest data where practical

---

### TASK-009 — Dashboard API

Priority: Medium

Create:

- `GET /api/dashboard`

Payload:

- runtime status
- active tools count
- artifact count
- route count
- manifest version
- latest update date
- missing configuration list

---

## Phase 4 — WordPress Plugin Sync

### TASK-010 — Plugin Manifest Contract

Priority: Critical

Create:

- `docs/PLUGIN_MANIFEST_CONTRACT.md`
- `content/manifest/wordpress-plugin-sync.v1.json`

The WordPress plugin must consume:

- `/api/manifest`
- `/api/tools`
- `/api/artifacts`
- `/api/system-health`

Acceptance criteria:

- contract defines expected fields
- contract defines failure states
- contract defines cache and refresh behavior

---

### TASK-011 — WordPress Plugin Shortcode Registry

Priority: High

Define shortcodes for the OMOS plugin:

- `[omos_dashboard]`
- `[omos_artifacts]`
- `[omos_artifact_grid]`
- `[omos_tools]`
- `[omos_tool_grid]`
- `[omos_belief_mapper]`
- `[omos_consensus_counter]`
- `[omos_ai_consensus]`
- `[omos_foundation_day]`
- `[omos_timekeeping]`
- `[omos_system_status]`
- `[omos_open_console_button]`

Acceptance criteria:

- shortcode registry exists in docs
- each shortcode maps to an API source or local render function

---

## Phase 5 — Production Hardening

### TASK-012 — Environment Template

Priority: High

Create `.env.example` with:

- `PORT`
- `NODE_ENV`
- `OMOS_VERSION`
- `OMOS_CANONICAL_HOST`
- `ONEGODIAN_STORE_URL`
- `ONEGODIAN_ORG_URL`
- `ONEGODIAN_APP_URL`
- `QUANTUM_OHI_URL`
- `OMOS_API_KEYS`

Acceptance criteria:

- new developer can boot locally using copied `.env`
- no secrets committed

---

### TASK-013 — Docker + Deployment

Priority: Medium

Create:

- `Dockerfile`
- `.dockerignore`
- `docs/DEPLOYMENT.md`

Acceptance criteria:

- app builds in container
- exposes port 3000
- documents production deployment steps

---

### TASK-014 — CI Smoke Tests

Priority: Medium

Create GitHub Actions workflow:

- install dependencies
- run `npm run check`
- start server
- run `npm run smoke`

Acceptance criteria:

- CI fails on syntax errors
- CI fails on broken health/manifest endpoints

---

## Phase 6 — Compliance and Records

### TASK-015 — OTS-V5 Timestamp Utility

Priority: Medium

Create:

- `src/runtime/ots-v5.js`

Rules:

- UTC is primary system truth
- Gregorian remains controlling for legal/financial/institutional use
- OT is computed overlay only
- year rollover occurs March 18
- leap rule uses Gregorian year in which OT year ends

Acceptance criteria:

- utility returns UTC, local, and OT timestamp fields
- tests cover March 17/18 rollover

---

### TASK-016 — Compliance Notices

Priority: Medium

Create:

- `src/runtime/compliance.js`
- `GET /api/compliance`

Notices:

- entity separation
- no financial guarantees
- no U.S. law exemption
- OMOS is platform/documentation/runtime layer
- ONEGODIAN, LLC is commercial/IP/economic entity
- INO is separate spiritual/religious/internal governance context

---

## Build Rule

If a task cannot be tested, documented, and repeated, it is not production-ready.
