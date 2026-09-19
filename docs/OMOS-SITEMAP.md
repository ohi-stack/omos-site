# OMOS.OneGodian.com Sitemap — September 19, 2026

Repository: `ohi-stack/omos-site`  
Canonical runtime: `https://omos.onegodian.com`  
WordPress presentation client: `https://omos.onegodian.org`  
Status: current repository information architecture; deployment verification remains separate

## Current registry snapshot

The September 18 registry sync established **30 canonical ODIN-addressable OMOS pages** and records **386 core pages across 11 tracked OneGodian platforms**. The sitemap below reconciles that registry with the routes that are actually implemented in the current OMOS repository.

Production rule:

> A registered page, repository route, plugin package, or deployment target is not Production merely because it exists in source control. Production requires implementation, documentation, repeatability, live deployment, and verification evidence.

## Public navigation

Primary areas:

`OMOS | Workspace | Council | OLLM | Tools | Developers | Pricing`

Persistent actions:

`Runtime | Sign In / Workspace | Ask OMOS`

Customer proposition:

**Make Better Decisions With AI.**

## Canonical governed workflow

`INPUT → LAYER 1 → ALIGN → COUNCIL → SYNTHESIZE → HUMAN GATE → RECORD → HISTORY`

External consequential execution remains separately authorized through approved action/control-plane paths.

## 30 canonical ODIN pages

Status vocabulary:

- **ACTIVE** — repository route or static public page exists.
- **ACTIVE / CONTROLLED** — implementation exists but is not a general public page or requires controlled access.
- **REGISTERED** — ODIN path is canonical but the dedicated public page is not yet implemented on the current runtime.
- **FUNCTIONALITY ELSEWHERE** — the underlying capability exists, but the dedicated ODIN page still needs convergence.

| ODIN | Page | Path | Repository status |
|---|---|---|---|
| ODIN-OMOS-0001 | Home | `/` | ACTIVE |
| ODIN-OMOS-0002 | OMOS Overview | `/omos` | ACTIVE |
| ODIN-OMOS-0003 | OHI Runtime | `/ohi` | ACTIVE |
| ODIN-OMOS-0004 | Agent Authority Model | `/agent-authority-model` | REGISTERED — source documentation exists; dedicated public route pending |
| ODIN-OMOS-0005 | ACC Structure | `/acc` | REGISTERED — ACC is a separate control-plane system; dedicated OMOS explainer route pending |
| ODIN-OMOS-0006 | OCP Structure | `/ocp` | REGISTERED |
| ODIN-OMOS-0007 | OEG Structure | `/oeg` | REGISTERED |
| ODIN-OMOS-0008 | Output Pipeline | `/ohi-output-pipeline` | ACTIVE |
| ODIN-OMOS-0009 | Protocols | `/protocol` | ACTIVE |
| ODIN-OMOS-0010 | API | `/api` | FUNCTIONALITY ELSEWHERE — runtime APIs are active under `/api/*`; dedicated API landing page pending |
| ODIN-OMOS-0011 | Documentation | `/docs` | ACTIVE |
| ODIN-OMOS-0012 | Developer Portal | `/developers` | ACTIVE |
| ODIN-OMOS-0013 | Alignment Engine | `/alignment` | FUNCTIONALITY ELSEWHERE — Alignment is part of the governed runtime/tools; dedicated page pending |
| ODIN-OMOS-0014 | Belief Mapper | `/belief-mapper` | ACTIVE |
| ODIN-OMOS-0015 | Identity Schema | `/identity-schema` | REGISTERED |
| ODIN-OMOS-0016 | Registry | `/registry` | REGISTERED |
| ODIN-OMOS-0017 | Logs | `/logs` | REGISTERED — public exposure must remain security-safe |
| ODIN-OMOS-0018 | Verification | `/verification` | ACTIVE |
| ODIN-OMOS-0019 | Governance Rules | `/governance-rules` | REGISTERED |
| ODIN-OMOS-0020 | Integrations | `/integrations` | FUNCTIONALITY ELSEWHERE — Connection & Adaptation runtime exists; dedicated convergence page pending |
| ODIN-OMOS-0021 | Tools | `/tools` | ACTIVE |
| ODIN-OMOS-0022 | Dashboard | `/dashboard` | ACTIVE |
| ODIN-OMOS-0023 | Admin | `/admin` | ACTIVE / CONTROLLED |
| ODIN-OMOS-0024 | Policies | `/policies` | REGISTERED |
| ODIN-OMOS-0025 | Schemas | `/schemas` | FUNCTIONALITY ELSEWHERE — repository schemas exist; dedicated public page pending |
| ODIN-OMOS-0026 | Agents | `/agents` | REGISTERED |
| ODIN-OMOS-0027 | Workflows | `/workflows` | REGISTERED |
| ODIN-OMOS-0028 | Status | `/status` | ACTIVE |
| ODIN-OMOS-0029 | FAQ | `/faq` | REGISTERED |
| ODIN-OMOS-0030 | Portal | `/portal` | ACTIVE — canonical directory for all 30 ODIN pages |

Canonical registry source: `config/omos-odin-pages.json`.

## Supporting public routes

These are valid OMOS public/runtime-support routes but are not separate entries in the current 30-page ODIN core registry.

### Workspace and decision runtime

- `/workspace`
- `/ask/`
- `/council`
- `/reference-run`
- `/omos-ref-0001`
- `/council-provenance`

### Models and intelligence

- `/ollm`
- `/models`
- `/models/openai`
- `/models/anthropic`
- `/models/gemini`
- `/models/xai`

### Connections and engineering

- `/connections`
- `/mcp`
- `/engineering-council`
- `/developers`

### Tools

- `/tools/belief-mapper`
- `/tools/declaration-generator`
- `/tools/time-converter`
- `/tools/protocol-explorer`
- `/tools/algorithm-visualizer`

### Documentation and evidence

- `/artifacts`
- `/docs/protocol-spec`
- `/docs/algorithm-spec`
- `/docs/system-prompt`
- `/docs/api-manifest`
- `/docs/compliance`
- `/docs/version-history`
- `/docs/sitemap`

### Experience, commerce, updates, legal and contact

- `/algorithm`
- `/digital-sanctuary`
- `/pricing`
- `/shop`
- `/latest-news`
- `/legal`
- `/legal/seeger-test`
- `/legal/institutional-classification`
- `/contact`

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

API availability and production certification remain distinct. Provider configuration must not be represented as a successful live provider test.

## Model Gateway

First-class provider contracts:

- OpenAI, including the native GPT-6 Astra connector contract where account/model access is authorized
- Anthropic / Claude
- Google / Gemini
- xAI / Grok
- OLLM as a OneGodian provider once its live backend and OMOS registration are verified

Provider/council state must preserve explicit live, degraded, simulation, and unverified boundaries.

## OneGodian MCP and Connection & Adaptation Layer

Repository-conformance-tested connection classes:

- Model
- Data
- Action
- Environment

MCP supplies interoperability. OMOS governs runtime use. ACC may orchestrate separately authorized execution. Connected domain systems remain their own sources of record.

Named external connectors are not Production until each retains live authentication, capability discovery, permission/authorization, provenance, audit, failure/retry, and deployed-SHA evidence.

## WordPress and cross-platform architecture

### Canonical runtime

`https://omos.onegodian.com`

Owns governed runtime state, provider state, Council execution, persistence, Decision Records, and runtime APIs.

### OMOS WordPress presentation client

`https://omos.onegodian.org`

Uses **OMOS Core Tools v1.4.0** as the specialized WordPress presentation/client layer. It must not become a second OMOS runtime or Decision Store.

### Shared OneGodian WordPress bridge

The **OneGodian Platform Plugin** provides the shared cross-property OMOS status/integration layer for:

- OneGodian.org
- OneGodian.com
- QuantumOHI.com
- U.OneGodian.org where enabled

### Consequential WordPress actions

`acc-wp-adapter` remains the separate authenticated action path for approved WordPress/WooCommerce execution.

## Ecosystem core-page registry — September 19, 2026

The current tracked registry contains **11 platforms / 386 core pages**:

| Platform | Core pages |
|---|---:|
| OneGodian.org | 36 |
| OneGodian.com | 72 |
| U.OneGodian.com | 25 |
| Galaxy.OneGodian.com | 32 |
| Capital.OneGodian.com | 55 |
| OMOS.OneGodian.com | 30 |
| App.OneGodian.com | 40 |
| OBP1.OneGodian.org | 28 |
| Time.OneGodian.org | 24 |
| QuantumOHI.com | 26 |
| QRV.Network | 18 |
| **Total** | **386** |

This is a registry count, not a claim that all 386 pages are individually production-verified.

## Repository boundaries

| Repository | Role |
|---|---|
| `ohi-stack/omos-site` | Canonical OMOS runtime, public site, OMOS Core Tools source, runtime contracts and production evidence |
| `ohi-stack/onegodian-platform-plugin` | Shared cross-property WordPress platform/status bridge |
| `ohi-stack/acc` | Canonical integrated ACC execution control plane |
| `ohi-stack/acc-wp-adapter` | Governed WordPress/WooCommerce action adapter |
| `ohi-stack/onegodian-llm` | OLLM service/provider boundary |
| `ohi-stack/onegodian-protocol` | Protocol/Algorithm/interoperability specification source |
| `ohi-stack/OneGodian-Metaphysical-Operating-System-AI-Studio` | Historical/parallel OMOS site planning and WordPress support; not runtime authority |

## Public safety and authority boundaries

- Model agreement is not factual verification.
- Provider configuration is not a successful live provider test.
- Repository implementation is not deployment proof.
- WordPress presentation is not runtime authority.
- A Decision Record is an audit record, not automatic legal certification.
- Human authorization remains controlling for consequential external actions.
- Secrets remain outside public payloads, logs, Decision Records and source control.
- UTC is canonical system time; Gregorian controls civil/legal references; OneGodian Time is supplemental.
- ONEGODIAN, LLC commercial/software/IP operations remain distinct from INO religious-society/community/internal-governance contexts.

## Production gate

The immediate OMOS runtime release gate remains **OMOS-REF-0001**:

1. exact deployed Git SHA matches the approved runtime revision;
2. production PostgreSQL is initialized and durable;
3. one governed Ask OMOS/Council run completes;
4. Human Gate disposition is persisted;
5. the Decision Record reopens from History;
6. runtime is restarted/redeployed;
7. the same Decision ID and record lineage reopen with owner isolation and hash-chain integrity.

WordPress synchronization has an additional independent gate: each required target must prove installed plugin version, canonical Node URL, runtime connectivity, correct authority role, page/shortcode rendering and verification timestamp.

## Sitemap publication rule

`public/sitemap.xml` contains routes that are currently implemented/publicly addressable. Canonical ODIN pages that are only REGISTERED are documented here and in `config/omos-odin-pages.json` but are **not** added to the public XML sitemap until their dedicated route exists.

## Version discipline

> If a capability is not fully operational, documented, repeatable, and testable, it does not exist in the current operational version.
