# OMOS.OneGodian.com Sitemap

Updated: September 10, 2026
Repository: `ohi-stack/omos-site`
Canonical host: `https://omos.onegodian.com`
Status: Current live-site information architecture candidate

## 1. Primary navigation

The public header uses exactly seven primary areas:

1. OMOS
2. Workspace
3. Council
4. OLLM
5. Tools
6. Developers
7. Pricing

Persistent actions: Status, Sign In, Ask OMOS.

Each primary area may expose up to six mega-menu groups. Supporting pages should remain under those areas instead of expanding the top-level header indefinitely.

## 2. Core public routes

| Route | Purpose |
|---|---|
| `/` | Customer-first OMOS homepage |
| `/omos` | What OMOS is and canonical architecture |
| `/workspace` | Seven-stage customer operating workspace |
| `/ask/` | Flagship Ask OMOS interface |
| `/status` | Maturity, deployment, and evidence distinctions |
| `/founder` | Founder, authorship, entity, and source boundaries |
| `/ecosystem` | OneGodian platform-role architecture |

## 3. Runtime method routes

| Route | Purpose |
|---|---|
| `/distill` | Layer 1 / OMOS Distill, Meaning Units, constraints, quarantine |
| `/alignment` | Dimension-based Alignment Engine and hard gates |
| `/council` | Independent multi-provider reasoning and structured disagreement |
| `/models` | Model connector/control-center surface |
| `/gcd-synthesis` | Repeated-reduction common ground + material remainders |
| `/council-provenance` | Provider attribution, hashes, execution origin, disputes |
| `/verification` | Factual evidence and verification boundary |
| `/ohi` | OHI comparison, critique, synthesis, human-reviewed output |
| `/ohi-output-pipeline` | Visual Council / OHI processing pipeline |
| `/decision-records` | Decision Record structure, Human Gate, revision lineage |
| `/dashboard` | Runtime state and authorized history/reopen experience |

## 4. Foundation and knowledge routes

| Route | Purpose |
|---|---|
| `/protocol` | OneGodian Protocol working-draft public explanation |
| `/algorithm` | Observe → Distill → Align → Select → Execute → Verify |
| `/ollm` | OLLM production-track positioning inside OMOS model architecture |
| `/tools` | Current and staged tool hub |
| `/artifacts` | Source documents, schemas, runtime evidence, implementation records |
| `/docs` | Comprehensive documentation index |
| `/standards` | Runtime, protocol, conformance, provenance, MCP, and time standards |
| `/research` | Theoretical and experimental OneGodian research with classification boundaries |
| `/digital-sanctuary` | Immersive identity/OMOS experience |

## 5. Developer and operations routes

| Route | Purpose |
|---|---|
| `/developers` | Developer hub |
| `/developers/agents` | AI developer roles, separation of duties, binding status |
| `/connections` | Connection & Adaptation Layer |
| `/engineering-council` | Issue-to-production-proof lifecycle |
| `/mcp` | OneGodian MCP logical position and authorization boundaries |
| `/reference-run` | OMOS-REF-0001 production certification requirements |

## 6. Commercial and support routes

| Route | Purpose |
|---|---|
| `/pricing` | Capability-gated product ladder; numeric launch prices remain provisional until approved |
| `/shop` | Commerce bridge; checkout authority remains OneGodian.com |
| `/latest-news` | Build notes, releases, implementation history |
| `/legal` | Legal, entity, authority, and professional-advice boundaries |
| `/contact` | Contact and ecosystem routing |

## 7. Machine-readable runtime surfaces

Public:

- `GET /health`
- `GET /api/health`
- `GET /manifest`
- `GET /api/manifest`
- `GET /api/v1/providers`
- `GET /api/v1/persistence`
- `GET /build.json` when build-provenance support is present in the deployed revision

Authenticated:

- `POST /process`
- `POST /api/v1/council/run`
- `GET /api/v1/council/runs`
- `GET /api/v1/council/runs/:id`
- `POST /api/v1/council/runs/:id/human-decision`

## 8. External platform boundaries

| Platform | Role |
|---|---|
| OneGodian.org | Public organizational, educational, historical, cultural, interpretive layer |
| OneGodian.com | Commerce, checkout, products, commercial pathways |
| app.OneGodian.com | Broader application/control-plane experiences |
| u.OneGodian.com | Learning infrastructure |
| QuantumOHI.com | Enterprise architecture, technology, governance, consulting positioning |
| QRV.Network | Separate verification, credential, trust-layer infrastructure |
| acc.onegodian.com | ACC operational console for OHI systems, agents, tasks, workflows, approved execution |
| OMOS.OneGodian.com | Governed reasoning/runtime, Council, Decision Records, public/developer runtime documentation |

## 9. Source precedence

For live OMOS behavior, `ohi-stack/omos-site` is authoritative.

Related repositories may contribute current, non-conflicting documentation or component architecture. The AI Studio repository is a development mirror and does not override canonical `omos-site` runtime paths.

When materials conflict:

1. current verified runtime behavior wins for capability claims;
2. current `omos-site/main` wins for canonical live-site architecture;
3. current approved specification wins over older drafts for intended behavior;
4. historical/superseded material remains archived rather than silently replacing current state.

## 10. Public claims discipline

- Model agreement is not factual verification.
- Provider configuration is not proof of a successful live connection.
- A repository commit is not proof of deployment.
- A deployment is not production certification.
- Draft protocol, compliance, MCP, OLLM, research, identity, robotics, and other specifications retain their own maturity labels.
- ONEGODIAN, LLC commercial/software functions remain distinct from Indigenous Nation of Onegodia religious-society, community, and internal-governance functions.
- Specialized research must not be represented as established science, governmental authority, regulatory recognition, or production capability without separate evidence.

## 11. Current implementation coordination

This consolidated sitemap intentionally avoids duplicating active implementation branches:

- Model Connectors control-center work remains owned by its current dedicated PR.
- Native OpenAI/Astra connector work remains owned by its dedicated PR.
- Belief Mapper runtime remains owned by its dedicated functional-candidate PR until merge and verification.
- Commerce/shop source remains owned by the current consumer-product PR.
- Council contribution-level provenance implementation remains a separate runtime hardening track after the public standard is reviewed.

The consolidation pass supplies the public information architecture around those tracks so they can merge without creating competing product narratives.
