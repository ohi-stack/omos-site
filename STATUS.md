# OMOS Repository Status Report

Date: 2026-09-10
Repository: `ohi-stack/omos-site`
Canonical runtime: `https://omos.onegodian.com`
Status authority: repository evidence + canonical-host production proof

## Executive Status

OMOS is a **live Functional runtime and operational-intelligence platform** for the OneGodian Protocol™, OneGodian Algorithm™, OHI™, governed multi-model processing, persistent Decision Records, developer interfaces, and ecosystem integrations.

The repository is materially beyond the August 23 baseline. The current `main` line contains the customer-first seven-area navigation, Ask OMOS workspace, Council/model surfaces, OLLM entrypoint, server-side Human Gate handling, PostgreSQL Decision Record persistence, owner isolation, append-only audit revisions, restart-verification tooling, production preflight enforcement, exact deployed-SHA provenance, and semantic live-production verification.

OMOS must still **not** be described as blanket Verified or Production. Maturity remains component-based.

> If a capability is not fully operational, documented, repeatable, and evidenced in its target environment, it does not exist as a completed capability in the current version.

## Canonical Architecture

```text
OneGodian Protocol™ = definitions, identity rules, interoperability, and scope
OneGodian Algorithm™ = Observe → Distill → Align → Select → Execute → Verify decision logic
OHI™ = multi-model comparison, critique, synthesis, and meaningful-dissent preservation
OMOS™ = runtime, orchestration, interfaces, persistence, audit, and Decision Records
ACC™ = operational command/control plane for agents, tasks, approvals, repositories, and deployments
MCP = interoperability/tool interface; not the authoritative database or source of record
QR-V = verification evidence where applicable
```

Model agreement is not factual verification. Human authorization remains required for consequential legal, financial, identity, security, infrastructure, registry, credential, payment, and external-system actions.

## Current Mainline Evidence

### Persistence hardening

Merged to `main`:

`d97b8344ebc644ef63cd994a1db9adfbbd61edf3` — **OMOS-REF-0001: production persistence hardening**

This reconciled implementation adds or hardens:

- PostgreSQL as the required production Decision Record backend;
- idempotent migrations;
- API-key ownership isolation;
- append-only Decision Record revisions;
- SHA-256 revision/hash chaining;
- ordered Human Gate → Decision Record transitions;
- cross-process restart verification;
- production preflight database verification;
- PostgreSQL-backed CI;
- ownership/audit regression tests;
- `/api/v1/persistence` durability assertions.

PR #27 is merged. The divergent PR #25 is closed as superseded.

### Production evidence machinery

Merged to `main`:

`e6b3fcb45dae7517525e3e2265f6b97ddf891f78` — **OMOS production evidence: exact deployed SHA + semantic live verification**

This adds:

- runtime-generated `/build.json` provenance;
- `OMOS_BUILD_SHA` support when the host does not retain `.git` metadata;
- version + exact deployed Git SHA evidence;
- canonical-host semantic smoke verification;
- mandatory checks for initialized durable PostgreSQL;
- provider-status payload verification;
- required public-surface verification;
- hourly/manual production-evidence workflow;
- retained production-evidence artifacts;
- automatic production-alignment issue handling;
- automated evidence-candidate comments on OMOS-REF-0001 Issue #28 when exact alignment passes.

This strengthens deployment proof but **does not complete the final Decision Record restart-survival certification by itself**.

## Live Production Observation

The canonical site is live. The current production-evidence work records that the observed live host still identifies an older runtime state (`Live host 1.0.1 observed`) and production verification as pending.

Therefore:

- **Repository:** current production-target code is ahead of the observed live host.
- **Live host:** reachable, but exact parity with current `main` is not yet established.
- **OMOS-REF-0001:** remains **NOT CERTIFIED / production proof pending**.

The production operator must deploy the intended current `main` revision (or a documented descendant), expose its exact build SHA, activate durable PostgreSQL, and complete the reference-run restart proof.

## Customer-First Navigation

The current server-side mega menu is implemented around seven primary areas:

```text
OMOS | Workspace | Council | OLLM | Tools | Developers | Pricing
```

Primary public/workspace routes include:

```text
/
/omos
/workspace
/council
/ollm
/tools
/developers
/pricing
/ohi
/models
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
/ohi-output-pipeline
/ask/
```

The runtime manifest identifies the shared OMOS UI v2 Operational Workspace, navigation, Council modes, providers, Human Gate requirement, persistence state, WordPress bridge targets, and application/commerce bridges.

## Current Defensible Capability Matrix

| Area | Current status | Evidence boundary |
|---|---|---|
| OMOS public node | Functional | Live host is reachable; exact current-main parity still pending production evidence. |
| Seven-area mega menu | Implemented on `main` | OMOS / Workspace / Council / OLLM / Tools / Developers / Pricing are in `server.js`. |
| Shared UI shell | Functional | Shared routed navigation and page shell exist. |
| Ask OMOS | Functional foundation | User-facing governed-run workspace exists; OMOS-REF-0001 production certification remains open. |
| Layer 1 | Functional under controlled validation | Distillation/canonicalization architecture and tests exist. |
| Alignment Engine | Functional foundation | Dimension-based scoring and hard-gate structures exist; factual verification remains separate. |
| Council of Models | Production-alpha / provider-dependent | OpenAI, Anthropic, Gemini, and xAI architecture exists; live status depends on provider configuration and proof. |
| Governed Synthesis | Functional foundation | Agreement, contradiction, missing-evidence, dissent, and synthesis structures exist. |
| Human Gate | Implemented server-side | APPROVED / REJECTED disposition is persisted through the runtime path. |
| Decision Records | Implemented in repository | PostgreSQL persistence, ownership isolation, revisions, hashing, retrieval, and history support exist. |
| Production PostgreSQL | Code-ready; live proof pending | Must report `postgresql`, `durable: true`, `initialized: true` on the canonical host. |
| Dashboard History | Functional foundation | Server-backed reopen/history exists; restart survival must be proven in production. |
| OHI Output Pipeline | Functional visualization/simulator | Cross-model workflow is exposed publicly. |
| Exact deployed-SHA evidence | Implemented in repository | `/build.json` + live-smoke workflow now exist; live deployment must adopt them. |
| OLLM | Architecture / integration stage | First-class provider direction exists; native provider/runtime completion remains pending. |
| ACC Engineering Factory | PR stage | PR #26 is not yet merged to `main`. |
| GPT-6 Astra native connector | PR stage | PR #22 is not yet merged/verified on production. |
| Oru’Valen integration | PR stage | PR #19 remains separate from `main`. |
| Commerce / entitlements | Specification / implementation stage | Product surfaces exist; full payment → entitlement → run transaction remains incomplete. |
| OneGodian MCP conformance | Standard / implementation stage | Standard exists; runtime conformance implementation remains incomplete. |

## OMOS-REF-0001 — Remaining Production Certification

Issue #28 is the canonical production certification record.

Repository-side hardening is substantially complete. Remaining live-host gates are:

1. Deploy the intended current `main` revision or documented descendant containing `d97b8344...` and `e6b3fcb4...`.
2. Confirm `NODE_ENV=production`.
3. Confirm `OMOS_VERSION=1.1.0`.
4. Confirm `OMOS_CANONICAL_HOST=https://omos.onegodian.com`.
5. Configure non-placeholder `OMOS_API_KEYS`.
6. Configure production PostgreSQL `DATABASE_URL`.
7. Configure `OMOS_DB_SSL` correctly.
8. Configure `OMOS_DB_POOL_MAX` (baseline 5 unless deployment evidence supports another value).
9. Set `OMOS_BUILD_SHA` when Git metadata is unavailable in the deployment artifact.
10. Run `npm run preflight:production` successfully.
11. Apply/verify database migrations.
12. Restart the Node runtime.
13. Verify `/api/health` and `/api/manifest`.
14. Verify `/build.json` reports the expected exact deployed SHA.
15. Verify `/api/v1/persistence` reports `backend: postgresql`, `durable: true`, `initialized: true`, and no error.
16. Verify `/api/v1/providers` returns structured provider status.
17. Execute one canonical Ask OMOS / Council reference run and capture its Decision ID.
18. Submit the server-side Human Gate disposition.
19. Reopen that Decision Record from history.
20. Restart/redeploy the runtime.
21. Reopen the exact same Decision ID after restart.
22. Verify owner isolation and revision/hash audit-chain integrity.
23. Record deployed SHA, runtime timestamp, Decision ID, record hash, database backend, and evidence in Issue #28.

**Certification rule:** OMOS-REF-0001 passes only when the same governed Decision Record survives the real production restart/redeploy and remains reopenable with its lineage intact.

## Repository Governance Gap

The canonical `main` branch is currently reported as **unprotected**, with no branch-level required status checks enforced.

Issue #31 tracks the required correction. Recommended baseline:

- pull request required for material changes;
- OMOS Runtime CI required;
- independent review for consequential changes;
- no force pushes to `main`;
- no deletion of `main`;
- stale approvals dismissed after material changes where supported;
- production deployment proof after merge for production-affecting work.

Green CI is necessary but is not production proof.

## Highest-Value Next Work

### P0 — Finish live-host OMOS-REF-0001

No additional conceptual architecture should outrank this gate. The key task is exact source parity + durable PostgreSQL + real governed Decision Record + restart survival.

### P1 — Provider / Model Gateway hardening

Complete provider-neutral behavior for OpenAI, Anthropic, Gemini, xAI, and future OLLM connections:

- provider/model identity;
- capability discovery;
- configuration/health state;
- latency;
- usage/cost telemetry;
- provider request IDs;
- provenance;
- retry/timeout/circuit breaker behavior;
- explicit simulation/hybrid/live states;
- degraded Council behavior.

### P1 — ACC Engineering Factory

Review and reconcile PR #26, then implement executable task/evidence envelopes for issue → agent → PR → review → CI → OMOS review → human approval → merge → deploy → evidence.

### P1 — OLLM v0.1

Implement OLLM as a first-class OMOS provider/intelligence layer focused on canonical OneGodian retrieval/context, source authority, provider-neutral inference, provenance, evaluation, and Council participation.

### P2 — Customer Workflows

Finish three complete outcomes before broad catalog expansion:

1. OMOS Decision Review
2. OMOS AI Council Review
3. OMOS Document Intelligence

Each should terminate in a persistent, human-reviewable Decision Record.

### P2 — Commerce / Entitlements

Complete:

```text
Ask OMOS Free
→ paid upgrade
→ verified Stripe webhook
→ OMOS entitlement
→ authorized run allowance
→ governed OMOS run
→ Decision Record
→ Dashboard History
```

The browser success page must never grant entitlement authority.

### P2 — PR / Branch Hygiene

Reconcile older open OMOS PRs against current `main`. Merge only current non-divergent value; close/supersede stale branches so parallel architectures do not remain indefinitely open.

## Immediate Definition of Done

The next OMOS milestone is:

> A real user submits a difficult question on `omos.onegodian.com`; the live deployment identifies its exact Git SHA; OMOS processes the request through Layer 1, Alignment, Council, Governed Synthesis, and Human Gate; the resulting Decision Record is durably written to PostgreSQL; the Node runtime is restarted/redeployed; and the exact same Decision Record remains searchable, reopenable, owner-isolated, and revision/hash-verifiable afterward.

When that workflow passes with captured production evidence, **OMOS-REF-0001 may be marked PASS for that governed workflow**. It does not automatically make every planned OMOS subsystem Production.

## Time and Audit Standard

UTC is the canonical system timestamp. Gregorian time remains the controlling civil/legal reference. OneGodian Time™ is supplemental and derived under OTS-V5.

## Entity / Authority Separation

- **ONEGODIAN, LLC**: commercial software, IP, publishing, education, products, licensing, and technical infrastructure.
- **Indigenous Nation of Onegodia (INO)**: separate community, spiritual/religious-society, and internal-governance functions where actually applicable.
- OMOS must not imply government authority, financial-institution status, or external legal jurisdiction beyond the actual authority of the relevant entity.

## Current Definitive Description

**OMOS™ is the central governed runtime and operational-intelligence environment for the OneGodian Protocol™, OneGodian Algorithm™, and OHI™. It receives and distills complex requests, coordinates supported models, applies alignment and policy controls, preserves dissent and uncertainty, requires human authority where appropriate, persists auditable Decision Records, and exposes those capabilities through user workspaces, developer interfaces, production-evidence tooling, and controlled ecosystem integrations.**
