# OMOS.OneGodian.com Sitemap — September 10, 2026

Repository: `ohi-stack/omos-site`  
Canonical runtime: `https://omos.onegodian.com`  
Status: current public information architecture; component maturity remains explicit

## Public navigation

Primary areas:

`OMOS | Workspace | Council | OLLM | Tools | Developers | Pricing`

Persistent actions:

`Runtime | Sign In / Workspace | Ask OMOS`

The public site should optimize for the customer proposition **Make Better Decisions With AI** while retaining technical documentation, research, standards, provenance, and implementation evidence behind clear secondary pathways.

## Canonical customer/runtime flow

`INPUT → LAYER 1 → ALIGN → COUNCIL → SYNTHESIZE → RECORD → HISTORY`

The Human Gate remains required inside the governed Record transition. External consequential execution remains separately authorized.

## Core public routes

| Route | Purpose | Current repository posture |
|---|---|---|
| `/` | Customer-first OMOS homepage, runtime status, product proposition, production evidence | Active |
| `/omos` | OMOS architecture, component separation, connectors, Oru/ACC boundaries | Active |
| `/workspace` | User-oriented operating workspace entry point | Generated route + enhanced UI |
| `/council` | Multi-model Council explanation and launch path | Generated route + enhanced UI |
| `/ollm` | OLLM relationship, provider/product architecture, maturity boundary | Generated route + enhanced UI |
| `/tools` | Distill, Alignment, Council, Belief Mapper, Bridge Builder, future tools | Active |
| `/developers` | APIs, Model Gateway, Data Connector Gateway, WordPress bridge, ACC boundary | Generated route + enhanced UI |
| `/pricing` | Capability-gated product and plan ladder | Generated route + enhanced UI |
| `/ohi` | OHI multi-model review and governed synthesis | Active |
| `/models` | Model Connectors Control Center for OpenAI, Anthropic, Gemini, xAI | Active UI; live-test hardening pending |
| `/artifacts` | Specifications, schemas, evidence, research and implementation records | Active |
| `/docs` | Documentation and implementation boundaries | Active |
| `/shop` | Customer products/services and OneGodian.com checkout bridge | Active |
| `/latest-news` | Current build, release, production-certification status | Active |
| `/dashboard` | Governed run workspace, Human Gate, Decision Records and history | Active |
| `/legal` | Entity, authority, evidence, timekeeping and professional-advice boundaries | Active |
| `/contact` | Product, implementation, developer, commerce and ecosystem routing | Active |
| `/protocol` | OneGodian Protocol public specification | Active |
| `/algorithm` | OneGodian Algorithm public explanation | Active |
| `/digital-sanctuary` | Specialized immersive/identity experience | Active specialized route |
| `/ohi-output-pipeline` | OHI/Council pipeline visualization | Active |
| `/ask/` | Flagship governed Ask OMOS execution surface | Active |

## Runtime/API surfaces

Current runtime contract includes:

- `GET /health`
- `GET /api/health`
- `GET /manifest`
- `GET /api/manifest`
- `GET /api/v1/providers`
- `GET /api/v1/persistence`
- `POST /process` — authenticated
- `POST /api/v1/council/run` — authenticated
- `GET /api/v1/council/runs` — authenticated
- `GET /api/v1/council/runs/:id` — authenticated
- `POST /api/v1/council/runs/:id/human-decision` — authenticated

The public static content-source manifest is available from the repository under `public/api/site-content`; it is an informational site-content inventory and is not a substitute for the canonical runtime manifest.

## Model Gateway

First-class provider interfaces:

- OpenAI / GPT
- Anthropic / Claude
- Google / Gemini
- xAI / Grok
- OLLM — future first-class OneGodian provider once production gates pass

Required connector maturity target:

`CONNECTED | NOT_CONFIGURED | DEGRADED | UNAVAILABLE`

Council execution state:

`LIVE | HYBRID | DEGRADED | SIMULATION`

The current provider API exposes safe configuration/runtime-availability state. Dedicated provider connection tests, retries/backoff, circuit breakers, latency, usage/cost telemetry, and sanitized error normalization remain engineering work.

## Data Connector Gateway

Approved connector classes should include, as separately authorized and implemented:

- GitHub — code/repository source of record
- Google Drive — document source material
- WordPress — published public content and distributed OMOS bridge surfaces
- Stripe / OneGodian.com commerce — commercial products, subscriptions, payment state
- PostgreSQL / Supabase-compatible infrastructure — runtime/Decision Record persistence where selected
- QRV.Network — verification/credential records where separately activated
- OneGodian APIs — approved ecosystem synchronization

Every connector must retain source identity, authentication/permissions, sync direction, object type, external ID, OMOS ID, timestamps, provenance, conflict policy, health, last sync, and audit events. Synchronization does not establish truth or authority.

## Tool inventory

### Functional / provider-dependent surfaces

- Ask OMOS
- OMOS Distill / Layer 1
- Alignment Engine
- Compare AI Perspectives / Council
- Governed Synthesis
- Decision Record
- Dashboard History
- Runtime/Manifest/Persistence inspection

### Specification / rollout / planned surfaces

- Belief Mapper™ — staged behind privacy/schema/runtime parity
- Bridge Builder — specification exists; runtime activation gated
- Declaration Generator — planned; no automatic legal effect
- Protocol Explorer — planned
- Algorithm Visualizer — planned
- OTS-V5 Time Converter — planned

## Documentation domains

The live documentation center should surface:

- OneGodian Protocol™
- OneGodian Algorithm™
- OHI™
- OMOS Runtime 1.1
- OMOS-REF-0001
- Model Connector Standard
- Decision Record and persistence contracts
- Alignment/verification schemas
- OTS-V5 timekeeping rules
- WordPress bridge and ecosystem integration
- production evidence and deployment provenance
- OneGodian Science™ claim/evidence discipline
- OLLM integration and maturity
- Oru’Valen / OMOS / ACC authority separation

## Product and commerce pathways

Customer-facing product ladder remains capability-gated and provisional until corresponding entitlements are operational:

- OMOS Free — $0
- OMOS Decision Report — $9–$19/run
- AI Answer Compare — $9/run
- OMOS Personal — $12/month
- OMOS Pro — $29/month
- OMOS Team — $79/month
- OMOS Business — from $199/month
- OMOS API — usage-based after entitlement activation
- OMOS Implementation — from $1,500 scoped service

Checkout authority remains OneGodian.com. OMOS should never advertise unavailable team controls, unlimited Council usage, API entitlements, durable history, exports, or provider availability as if they are already active.

## Ecosystem boundaries

| Platform | Role |
|---|---|
| OneGodian.org | Public organization, education, historical/identity interpretation |
| OneGodian.com | Commerce, checkout, products, memberships and recurring revenue |
| u.OneGodian.com | Learning, courses, certifications and training |
| app.OneGodian.com | Broader OneGodian application/control surface |
| OMOS.OneGodian.com | Governed intelligence runtime, Council, tools, records, docs and connector control |
| QuantumOHI.com | Enterprise systems, governance architecture and consulting |
| QRV.Network | Verification and credential infrastructure |
| ACC / acc.onegodian.com | Approved execution control plane |

## Research and specialized content

The site may surface specialized OneGodian research, identity, metaphysical, synthetic-dignity, cosmological, particle-science, smart-contract, token/NFT, and institutional materials in documentation, artifacts, research, or future modules. These materials must not displace the mainstream customer proposition and must be classified according to actual implementation/evidence status.

Scientific status requires appropriate hypotheses, falsifiable predictions, transparent methods, reproducibility, empirical testing, and independent replication. Model agreement, simulation output, or internal review alone is not scientific proof.

## Public safety / authority boundaries

- Model agreement is not factual verification.
- Provider configuration is not a successful connection test.
- Deterministic processing is not guaranteed truth.
- A Decision Record is an audit record, not automatic legal certification.
- Human authorization remains controlling for consequential external actions.
- UTC is canonical system time; Gregorian controls civil/legal references; OneGodian Time is supplemental.
- ONEGODIAN, LLC commercial/software/IP operations remain distinct from INO religious-society/community/internal-governance contexts.
- OMOS does not claim governmental authority, legal immunity, financial-institution status, or compulsory authority over non-participants.

## Production gate

The immediate release gate is **OMOS-REF-0001**:

1. exact deployed Git SHA matches the approved runtime revision;
2. production PostgreSQL is initialized and durable;
3. one governed Ask OMOS/Council run completes;
4. Human Gate disposition is persisted;
5. the Decision Record reopens from History;
6. runtime is restarted/redeployed;
7. the same Decision ID reopens with owner isolation, revision lineage and hash chain intact.

Only after evidence for those gates exists should the tested configuration be represented as Production.

## Version discipline

> If a capability is not fully operational, documented, repeatable, and testable, it does not exist in the current operational version.
