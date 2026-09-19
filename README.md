# OMOS Site

Public site, governed runtime, documentation, and WordPress-bridge source for **OMOS — OneGodian Metaphysical Operating System™**.

**Canonical governed runtime:** `https://omos.onegodian.com`  
**Current runtime version:** `1.1.0`  
**Project operating contract:** `docs/OMOS-PROJECT-OPERATING-CONTRACT.md`

## What OMOS is

OMOS is the runtime/orchestration layer of the OneGodian intelligence architecture. It receives complex inputs, applies governed intake and alignment, coordinates supported model providers, preserves uncertainty and dissent, routes consequential outcomes through a Human Gate, and stores auditable Decision Records.

Canonical responsibility boundaries:

- **OneGodian Protocol™** — terminology, identity rules, interoperability, scope, policy constraints.
- **OneGodian Algorithm™** — evaluation and decision logic: **Observe → Distill → Align → Select → Execute → Verify**.
- **OHI™** — multi-model comparison, critique, contradiction detection, supported dissent, governed synthesis.
- **OMOS™** — runtime, orchestration, interfaces, persistence, Decision Records, APIs, connectors, history, auditability.
- **OLLM™** — OneGodian model/intelligence provider layer inside OMOS.
- **ACC™** — operational command/execution console at `https://acc.onegodian.com`.

## Canonical product flow

Customer-facing flow:

**INPUT → LAYER 1 → ALIGN → COUNCIL → SYNTHESIZE → RECORD → HISTORY**

Governed internal flow:

**Ask OMOS → Layer 1 → Alignment → Council Review → Governed Synthesis → Human Gate → Decision Record → Dashboard History**

The principal production milestone is **OMOS-REF-0001**, which requires one real end-to-end governed run with durable persistence, human disposition, restart/redeploy survival, and reopening of the exact same Decision Record.

## Evidence and maturity discipline

Use only evidence-based maturity states:

- Conceptual
- Prototype
- Functional
- Verified
- Production

> If a feature is not operational, documented, and repeatable, it does not exist in the current production version.

Repository implementation is not deployment proof. Merge is not deployment. Model agreement is not factual verification.

## Current public navigation

The canonical seven-part customer-first navigation is:

1. **OMOS**
2. **Workspace**
3. **Council**
4. **OLLM**
5. **Tools**
6. **Developers**
7. **Pricing**

Persistent actions prioritize Runtime/System Status, Sign In, and **ASK OMOS**.

## Main runtime surfaces

```text
/
/omos
/workspace
/council
/ollm
/tools
/developers
/pricing
/ask/
/dashboard
/ohi
/models
/belief-mapper
/artifacts
/docs
/shop
/reference-run
/protocol
/algorithm
/digital-sanctuary
/ohi-output-pipeline
/legal
/contact
```

The runtime manifest is the machine-readable authority for the currently exposed route inventory.

## Runtime/API surfaces

Current runtime includes public and protected interfaces such as:

- `/health`
- `/api/health`
- `/manifest`
- `/api/manifest`
- `/api/v1/providers`
- `/api/v1/persistence`
- `/api/v1/council/run`
- `/api/v1/council/runs`
- `/api/v1/council/runs/:id`
- `/api/v1/council/runs/:id/human-decision`
- `/process`
- `/dashboard`

Exact availability must be verified against the deployed revision rather than inferred from source code alone.

## Decision Records and persistence

Production Decision Records are designed for durable PostgreSQL persistence through `DATABASE_URL`.

Minimum record expectations include input/canonical input, Layer 1 output, Alignment State, provider/model provenance, Council review, contradictions, missing evidence, supported dissent, governed synthesis, verification state, Human Gate disposition, versions, timestamps, hashes, revision lineage, and ownership.

A memory-only fallback must never be represented as durable production persistence.

## Council and model connectors

The current provider-neutral architecture supports connectors for:

- OpenAI
- Anthropic
- Google Gemini
- xAI
- OLLM/local OneGodian models where available

Council behavior preserves independent outputs, cross-review, agreement, contradiction, missing information/evidence, novel insight, supported dissent, provenance, and uncertainty.

## Connection & Adaptation Layer

OMOS groups external integrations into:

- **Model Connections**
- **Data Connections**
- **Action Connections**
- **Environment Connections**

A **Connector** handles access/transport/authentication/capability exposure. An **Adapter** translates native platform objects/actions into OMOS contracts.

MCP remains an interoperability/tool interface, not the authoritative source of record for connected systems.

## WordPress/client architecture

WordPress sites are presentation/integration clients of the canonical OMOS runtime; they are not duplicate OMOS runtimes.

Current client/sync targets include:

- OneGodian.org
- OneGodian.com
- QuantumOHI.com
- U.OneGodian.org where applicable
- OMOS public WordPress presentation surfaces where intentionally deployed

Protected provider/database credentials stay server-side.

The shared WordPress architecture uses the OneGodian Platform Plugin and OMOS Core Tools/bridge work. Consequential external actions remain subject to the authorized ACC/execution path.

## UI/UX standard

OMOS uses a premium operational-intelligence design language:

- obsidian/deep navy foundation;
- metallic gold identity accents;
- cyan/cobalt intelligence accents;
- selective purple accents;
- warm-white typography;
- dimensional glass surfaces;
- responsive and accessible behavior;
- explicit system state and user actions.

The public experience should not regress into a generic WordPress layout, decorative sci-fi mockup, or static whitepaper-only site.

## Commerce contract

Commercial access follows:

**Checkout → verified server-side payment → entitlement → authorized run allowance → governed OMOS run → Decision Record → Dashboard History**

A browser success URL never grants paid capability by itself.

## Source documents integrated

Repository materials include or map:

- OHI Runtime technical specification
- OTS-V5 corrected timekeeping standard
- OneGodian Algorithm whitepaper
- OneGodian AI System Prompt
- OneGodian Frequency Standard
- OHI Output Pipeline
- Quantum-OHI API intelligence and ACC authority boundary
- Agent Authority Model
- OMOS WordPress/plugin architecture
- Bridge-Builder Protocol and tool specifications
- OneGodian ecosystem manifests
- specialized OneGodian research/standards records

## Environment

Primary template:

```text
.env.example
```

Key production configuration includes runtime host/version, API keys, PostgreSQL persistence, model-provider configuration, approved origins, ecosystem URLs, and WordPress bridge settings.

Never commit real credentials.

## Local validation

```bash
npm install
npm run check
npm run smoke
npm run smoke:pages
npm run smoke:security
npm run test:lifecycle
npm run test:decision-record
npm run test:model-gateway
npm run test:connections
```

Production verification uses separate live/preflight commands and evidence gates.

## Engineering lifecycle

Repository work follows:

**Issue → Classify → Assign → Implement → Pull Request → Independent Review → Tests/CI → OMOS Review → Human Approval → Merge → Deploy → Deployment Proof → Engineering Record**

See `AGENTS.md` and `docs/OMOS-PROJECT-OPERATING-CONTRACT.md`.

## Priority implementation order

1. Complete OMOS-REF-0001 production proof.
2. Harden security, authorization, persistence, and auditability.
3. Complete end-to-end customer functionality.
4. Harden provider-neutral model connectors and OLLM integration.
5. Integrate ACC orchestration and Engineering Council evidence.
6. Improve decision quality and verification.
7. Continue UI/UX and cross-platform synchronization.
8. Complete commerce entitlements only where runtime authorization/persistence contracts are enforceable.
9. Keep documentation synchronized with code and live evidence.
10. Avoid new conceptual expansion when completing an existing operational layer provides more value.

## Quantum-OHI relationship

Quantum-OHI™ is a connected intelligence/decision-support layer. OMOS remains the governed runtime/orchestration environment for OHI workflows, Human Gate decisions, and Decision Records. ACC remains the separately authorized execution control plane.

Canonical action boundary:

```text
Platform telemetry → Quantum-OHI analysis → recommendation → ACC approval/workflow → authoritative service → audit/verification
```
