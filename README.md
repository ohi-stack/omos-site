# OMOS — OneGodian Metaphysical Operating System™

Canonical governed runtime and engineering repository for **OMOS™ — OneGodian Metaphysical Operating System™**.

- **Governed runtime:** `https://omos.onegodian.com`
- **WordPress presentation/documentation client:** `https://omos.onegodian.org`
- **Execution control plane:** `https://acc.onegodian.com`
- **Current runtime line:** OMOS 1.1.x / Functional, production certification in progress
- **Current WordPress bridge:** OMOS Core Tools v1.5.0

## Purpose

OMOS is the governed runtime, orchestration, persistence, interface, Decision Record, connector, and audit layer for the OneGodian technology architecture.

Maintain these system boundaries:

- **OneGodian Protocol™** — terminology, identity/interoperability rules, scope and policy constraints.
- **OneGodian Algorithm™** — evaluation and decision logic; canonical cycle: **Observe → Distill → Align → Select → Execute → Verify**.
- **OHI™** — multi-model comparison, critique, contradiction detection, synthesis and supported dissent.
- **OMOS™** — runtime execution, orchestration, model/data/action interfaces, Human Gate, Decision Records, persistence, history and auditability.
- **OLLM™** — OneGodian model/intelligence provider layer inside the OMOS Model Gateway.
- **ACC™** — separately authorized command/execution control plane for consequential actions.

This repository must not collapse those responsibilities into one generic application.

## Current product flow

The primary governed user journey is:

```text
INPUT
  ↓
LAYER 1 — DISTILL
  ↓
ALIGN
  ↓
COUNCIL
  ↓
SYNTHESIZE
  ↓
RECORD / HUMAN GATE
  ↓
HISTORY
```

A complete production reference run must later be reopenable and auditable from its persisted Decision Record.

## Repository maturity rule

> If a feature is not implemented, versioned, documented, repeatable, logged where applicable, testable, and supported by the required evidence, it is not operational in the current version.

Repository CI success is not the same as live deployment proof.

## Runtime responsibilities — `omos.onegodian.com`

The canonical Node/Express runtime owns or coordinates:

- Ask OMOS governed input;
- Layer 1 intake/distillation;
- Alignment Engine state;
- Model Gateway and Council orchestration;
- OpenAI / Anthropic / Gemini / xAI provider interfaces where configured;
- OLLM provider integration as it becomes operational;
- cross-model review and governed synthesis;
- Human Gate approval/rejection state;
- Decision Records and provenance;
- PostgreSQL persistence and history;
- model/data/action connection contracts;
- runtime health, manifest, provider and persistence surfaces;
- OHI output/pipeline behavior;
- production evidence and OMOS-REF-0001 verification.

WordPress does **not** become a second OMOS runtime.

## WordPress presentation responsibilities — `omos.onegodian.org`

The WordPress surface is a public/documentation/presentation client of the canonical runtime.

**OMOS Core Tools v1.5.0** is sourced from:

```text
plugins/omos-core-tools-v1.5.0/
```

It provides branded OMOS modules, runtime inspection, bridge status, and controlled Ask OMOS delegation without becoming provider, Council, Human Gate, Decision Record, PostgreSQL, deployment, payment or credential authority.

### Canonical 10 OMOS Core Tools modules

```text
[omos_manifest]
[omos_runtime_status]
[omos_ecosystem_cards]
[omos_bridge_builder]
[omos_tool_grid]
[omos_artifact_grid]
[omos_docs_grid]
[omos_open_console_button]
[omos_ohi_pipeline]
[omos_unity_dashboard]
```

Compatibility surfaces retained in v1.5.0:

```text
[omos_ask]
[omos_council]
[omos_decision_history]
[omos_belief_mapper]
```

### WordPress verification contract

```text
GET  /wp-json/omos/v1/status
GET  /wp-json/omos/v1/sync
GET  /wp-json/omos/v1/shortcodes
GET  /wp-json/omos/v1/manifest
GET  /wp-json/omos/v1/health
GET  /wp-json/omos/v1/providers
GET  /wp-json/omos/v1/persistence
POST /wp-json/omos/v1/ask
```

Provider credentials must not be placed in the WordPress plugin. `OMOS_BRIDGE_API_KEY` may be supplied server-side where the authenticated runtime bridge is enabled.

## Shared WordPress ecosystem

The shared cross-property platform bridge lives in:

```text
ohi-stack/onegodian-platform-plugin
```

Current target roles:

- `OneGodian.org` — public / identity / institutional presentation;
- `OneGodian.com` — commerce;
- `QuantumOHI.com` — technology / OHI presentation;
- `U.OneGodian.org` — education, optional shared OMOS status bridge unless separately required;
- `OMOS.OneGodian.org` — specialized OMOS Core Tools presentation client.

Consequential WordPress/WooCommerce writes remain on the governed path:

```text
OMOS → Human Gate → ACC → acc-wp-adapter → WordPress/WooCommerce → execution evidence
```

## Current customer-first navigation

The canonical OMOS information architecture is organized around what users can do:

1. **OMOS**
2. **WORKSPACE**
3. **COUNCIL**
4. **OLLM**
5. **TOOLS**
6. **DEVELOPERS**
7. **PRICING**

Persistent actions include runtime/status access, Sign In where available, and **ASK OMOS** as the dominant product CTA.

## Core product surfaces

Current and planned route families include:

```text
/
/omos
/ask
/dashboard
/runs
/ohi
/council
/models
/providers
/algorithm
/protocol
/tools
/docs
/artifacts
/shop
/belief-mapper
/ohi-output-pipeline
/oru
/status
/legal
/contact
```

Not every route has the same maturity. Public claims must reflect actual component evidence.

## Oru’Valen integration

The current mainline includes:

- `/oru/` — public Oru’Valen architecture/lived-experience surface;
- `/api/oru.json` — machine-readable profile/architecture surface;
- FACT / USER_STATEMENT / INFERENCE / PREDICTION separation;
- human-correction priority;
- no background-surveillance claim;
- approval-gated durable memory/update boundaries;
- consequential execution retained behind Human Gate + ACC.

## Environment and production contract

Primary environment template:

```text
.env.example
```

Production OMOS uses protected server-side configuration. Critical production variables include, as applicable:

```text
NODE_ENV
PORT
OMOS_VERSION
OMOS_CANONICAL_HOST
OMOS_BUILD_SHA
OMOS_API_KEYS
DATABASE_URL
OMOS_DB_SSL
OMOS_DB_POOL_MAX
OMOS_REQUIRE_DURABLE_DB
OMOS_ALLOW_MEMORY_PERSISTENCE
OPENAI_API_KEY
OPENAI_MODEL
ANTHROPIC_API_KEY
ANTHROPIC_MODEL
GEMINI_API_KEY
GEMINI_MODEL
XAI_API_KEY
XAI_MODEL
ONEGODIAN_ORG_URL
ONEGODIAN_STORE_URL
ONEGODIAN_APP_URL
QUANTUMOHI_URL
```

Never commit real credentials.

## Production persistence rule

A production OMOS deployment must not silently fall back to memory when durable persistence is required.

The expected production posture is:

```text
DATABASE_URL configured
OMOS_REQUIRE_DURABLE_DB=true
OMOS_ALLOW_MEMORY_PERSISTENCE=false
PostgreSQL migrations applied
/api/v1/persistence reports durable PostgreSQL
Decision Record survives process restart/redeploy
```

## Production verification

The controlling P0 gate is **OMOS-REF-0001**.

The canonical production-evidence sequence is:

```text
exact main SHA deployed
→ production preflight PASS
→ live smoke PASS
→ governed reference run created
→ Human Gate disposition persisted
→ Decision Record hash captured
→ runtime restarted/redeployed on same SHA
→ live smoke PASS after restart
→ same Decision Record reopened
→ Dashboard History confirms persistence
```

See:

```text
docs/OMOS-REF-0001-PRODUCTION-PROOF-RUNBOOK.md
```

and GitHub Issue **#57**.

## Development checks

Common repository checks include:

```bash
npm ci
npm run check
npm run test:openai-astra
npm run test:model-gateway
npm run test:connections
npm run test:lifecycle
npm run test:decision-record
npm run verify:persistence:restart
npm run preflight:production
npm run smoke:live
```

The exact required set is defined by current package scripts and CI workflows.

## Source and standards material

This repository maps implementation and documentation for, among other assets:

- OneGodian Protocol™;
- OneGodian Algorithm™;
- OHI Runtime and Council architecture;
- OHI Output Pipeline;
- OTS-V5 corrected timekeeping standard;
- OneGodian AI System Prompt;
- OneGodian Frequency Standard;
- Agent Authority Model;
- Quantum-OHI API intelligence / ACC authority boundary;
- Bridge-Builder Protocol and tooling;
- OneGodian MCP / Connection & Adaptation work;
- OneGodian ecosystem manifests;
- ODIN-SCI-0004 — OneGodian Particle Science™ research standard.

## Quantum-OHI relationship

Quantum-OHI is the OneGodian platform-intelligence and decision-support layer. It may analyze telemetry and operational context, but it does not directly own or mutate authoritative platform state merely because it produced a recommendation.

Canonical action boundary:

```text
Platform telemetry
→ Quantum-OHI analysis
→ recommendation
→ OMOS governance / applicable Human Gate
→ ACC approval/workflow
→ authoritative service
→ audit / verification
```

## Immediate priority

The source repository is substantially Functional. The immediate engineering objective is **not another architecture rewrite**. It is:

1. keep `main` internally synchronized;
2. deploy the exact current main revision to the existing canonical runtime host;
3. prove durable PostgreSQL and exact-build provenance;
4. complete OMOS-REF-0001 create → restart → reopen evidence;
5. install/verify Core Tools v1.5.0 on the WordPress presentation node;
6. verify the shared WordPress bridge on required connected properties;
7. only then advance applicable components from Functional toward Verified/Production.
