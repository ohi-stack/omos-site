# OMOS Repository Status Report

Date: 2026-09-10
Repository: `ohi-stack/omos-site`
Canonical runtime: `https://omos.onegodian.com`
Status authority: repository evidence + production proof gates

## Current State

OMOS is a **live Functional runtime and operational-intelligence platform** for the OneGodian Protocol™, OneGodian Algorithm™, OHI™, model orchestration, governed decision processing, persistent Decision Records, developer surfaces, and cross-site integration.

The repository is materially beyond the August documentation/runtime baseline. The current codebase includes the customer-first seven-area navigation, Ask OMOS workspace, Council/model interfaces, OLLM entrypoint, runtime APIs, server-side Human Gate handling, PostgreSQL Decision Record support, ownership isolation, append-only audit revisions, restart verification tooling, production preflight enforcement, and expanded CI gates.

OMOS must still **not** be described as blanket Verified or Production. The current governing rule remains component-based:

> If a capability is not fully operational, documented, repeatable, and evidenced in its target environment, it does not exist as a completed capability in the current version.

## Canonical Architectural Separation

```text
OneGodian Protocol™ = definitions, identity rules, interoperability, and scope
OneGodian Algorithm™ = Observe → Distill → Align → Select → Execute → Verify decision logic
OHI™ = multi-model comparison, critique, synthesis, and meaningful-dissent preservation
OMOS™ = runtime, orchestration, interfaces, persistence, audit, and Decision Records
ACC™ = operational command/control plane for agents, tasks, approvals, repositories, and deployments
MCP = interoperability/tool interface; not the authoritative database or source of record
QR-V = verification evidence where applicable
```

Model agreement remains separate from factual verification. Human approval remains required for consequential legal, financial, identity, security, infrastructure, registry, payment, credential, and external-system actions.

## Current Mainline Baseline

At the September 10 status update, `main` contains the production persistence hardening merged as:

`d97b8344ebc644ef63cd994a1db9adfbbd61edf3` — **OMOS-REF-0001: production persistence hardening**

That change reconciles durable PostgreSQL Decision Records with the current frontend/runtime mainline and adds or hardens:

- PostgreSQL as the required production Decision Record backend;
- idempotent migrations;
- owner-scoped Decision Record access;
- append-only record revisions;
- SHA-256 record chaining;
- ordered Human Gate → Decision Record transitions;
- cross-process restart verification;
- production preflight database verification;
- PostgreSQL-backed CI;
- API ownership regression tests;
- persistence endpoint assertions.

The superseded divergent persistence PR #25 is closed. PR #27 was merged to `main` as the reconciled implementation.

## Site Navigation and Product Surface

The current server-side mega menu is implemented around seven primary product areas:

```text
OMOS | Workspace | Council | OLLM | Tools | Developers | Pricing
```

Primary routes include:

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

The runtime manifest exposes OMOS UI v2 — Operational Workspace, the shared header/footer, the mega menu, responsive behavior, public/API routes, Council modes, provider list, Human Gate requirements, persistence state, WordPress bridge targets, and application/commerce bridges.

## Current Defensible Capability Status

| Area | Status | Evidence boundary |
|---|---|---|
| Live OMOS public node | Functional | Canonical runtime is deployed; exact current deployed SHA still requires production evidence. |
| Customer-first mega menu | Implemented on `main` | OMOS / Workspace / Council / OLLM / Tools / Developers / Pricing are present in `server.js`. |
| Shared UI shell | Functional | Shared runtime navigation and routed page shell exist. |
| Ask OMOS | Functional foundation | User-facing governed-run workspace exists; production reference-run certification remains open. |
| Layer 1 | Functional under controlled validation | Canonicalization/distillation architecture and tests exist. |
| Alignment Engine | Functional foundation | Dimension-based alignment and hard-gate structures exist; factual verification remains separate. |
| Council of Models | Production-alpha / provider-dependent | OpenAI, Anthropic, Gemini, and xAI architecture exists; live availability depends on configured provider credentials and verification. |
| Governed Synthesis | Functional foundation | Agreement, contradiction, missing-evidence, dissent, and synthesis structures exist. |
| Human Gate | Implemented server-side | APPROVED / REJECTED disposition is persisted through the runtime path. |
| Decision Records | Implemented in repository | PostgreSQL persistence, owner isolation, revision/hash chain, retrieval, and history support are present. |
| Production PostgreSQL durability | Code-ready; live proof open | Must be verified against the actual production `DATABASE_URL` and runtime. |
| Dashboard History | Functional foundation | Server-backed history/reopen path exists; OMOS-REF-0001 must prove restart survival in production. |
| OHI Output Pipeline | Functional visualization / simulator | Public pipeline and cross-model review presentation exist. |
| OLLM | Architecture / integration stage | First-class OMOS provider direction exists; native runtime/provider completion remains pending. |
| ACC Engineering Factory | PR stage | PR #26 establishes the contract but is not yet part of `main`. |
| GPT-6 Astra native connector | PR stage | PR #22 remains separate from `main` until reviewed/merged/verified. |
| Oru’Valen integration | PR stage | PR #19 remains separate from `main` until reviewed/merged/verified. |
| Commerce/entitlements | Specification / implementation stage | Pricing surfaces exist; full verified payment → entitlement → run transaction remains incomplete. |
| OneGodian MCP conformance | Standard / implementation stage | Standard exists; runtime conformance surfaces remain to be completed. |

## OMOS-REF-0001 — Current Production Gate

Issue #28 is the canonical production certification record:

**OMOS-REF-0001: complete canonical production deployment proof**

The repository portion is substantially complete. The remaining gate is the target production environment.

Required production proof:

1. Deploy the exact current `main` revision or a documented descendant containing `d97b8344...`.
2. Confirm `NODE_ENV=production`.
3. Confirm `OMOS_VERSION=1.1.0`.
4. Confirm `OMOS_CANONICAL_HOST=https://omos.onegodian.com`.
5. Configure a non-placeholder `OMOS_API_KEYS` value.
6. Configure the production PostgreSQL `DATABASE_URL`.
7. Configure `OMOS_DB_SSL` correctly.
8. Configure `OMOS_DB_POOL_MAX` (baseline 5 unless production evidence supports another value).
9. Run `npm run preflight:production` successfully.
10. Apply/verify migrations.
11. Restart the production Node runtime.
12. Verify `/health` and `/api/health`.
13. Verify `/manifest` reports the intended version/runtime.
14. Verify `/api/v1/persistence` reports `backend: postgresql`, `durable: true`, `initialized: true`.
15. Execute one canonical Ask OMOS / Council reference run and record the Decision ID.
16. Submit a server-side Human Gate disposition.
17. Reopen the resulting Decision Record from history.
18. Restart/redeploy the runtime.
19. Reopen the exact same Decision ID after restart.
20. Verify owner isolation plus the revision/hash audit chain.
21. Record deployed SHA, runtime timestamp, Decision ID, record hash, database backend, and evidence in Issue #28.

**Certification rule:** OMOS-REF-0001 passes only when the complete Decision Record survives the real production restart/redeploy and remains reopenable with lineage intact.

## Repository Governance Gap

The `main` branch is currently reported as **unprotected**, with no required status checks enforced at the branch level.

That should be corrected in repository settings. At minimum, production governance should require:

- pull requests before merge for material changes;
- OMOS Runtime CI green;
- independent review for consequential changes;
- no force pushes to `main`;
- no branch deletion for `main`;
- deployment proof after merge for production-affecting work.

GitHub CI is necessary but does not substitute for production proof.

## Open High-Value Work

### P0 — Complete OMOS-REF-0001 live-host proof

Do not add unrelated architecture work until the persistence/runtime reference run is certified or a blocking production defect is documented.

### P1 — Provider/Model Gateway

Harden provider-neutral model connectors with:

- provider/model identity;
- capability discovery;
- health and availability;
- latency;
- usage and cost telemetry;
- request IDs;
- provenance;
- retry/timeout/circuit-breaker behavior;
- explicit simulation/hybrid/live states;
- degraded Council handling.

### P1 — ACC Engineering Factory

Review and reconcile PR #26, then move from a documentation contract to executable task/evidence envelopes containing:

```text
task_id
repository
issue
classification
priority
acceptance_criteria
assigned_agent
branch
pull_request
risk_class
required_checks
reviewer
omos_review_state
human_approval_state
merge_sha
deployed_sha
deployment_environment
deployment_evidence
final_maturity
```

### P1 — OLLM v0.1

Implement OLLM as a first-class provider/intelligence layer inside the OMOS Model Gateway. Initial scope should focus on canonical retrieval/context, OneGodian source authority, provider-neutral inference, provenance, evaluations, and Council participation rather than attempting to train a new frontier foundation model.

### P2 — Customer Workflows

Prioritize three complete user outcomes:

1. OMOS Decision Review
2. OMOS AI Council Review
3. OMOS Document Intelligence

Each workflow should end in a persistent, human-reviewable Decision Record.

### P2 — Commerce and Entitlements

Complete the canonical revenue transaction:

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

The browser success page must never be the authority that grants an entitlement.

### P2 — Pull Request / Branch Hygiene

Review older open OMOS PRs that have been overtaken by reconciled `main` work. Merge only current, non-divergent value; otherwise explicitly supersede/close them to prevent parallel architectures from remaining open indefinitely.

## Immediate Definition of Done

The next OMOS milestone is not another page count or architecture document.

It is:

> A real user submits a difficult question on `omos.onegodian.com`; OMOS processes it through Layer 1, Alignment, Council, Governed Synthesis, and Human Gate; the resulting Decision Record is written to production PostgreSQL; the Node runtime is restarted/redeployed; and the exact same Decision Record remains searchable, reopenable, owner-isolated, and hash/revision-verifiable afterward.

When that exact workflow passes with captured evidence, **OMOS-REF-0001 may be marked PASS for that governed production workflow**. That does not automatically make every planned OMOS subsystem Production.

## Time and Audit Standard

UTC remains the canonical system timestamp. Gregorian time is the controlling civil/legal reference. OneGodian Time™ is supplemental and derived under OTS-V5.

## Entity / Authority Separation

- **ONEGODIAN, LLC**: commercial software, IP, publishing, education, products, licensing, technical infrastructure.
- **Indigenous Nation of Onegodia (INO)**: separate community, spiritual/religious-society, and internal-governance functions where actually applicable.
- OMOS must not imply government authority, financial-institution status, or external legal jurisdiction beyond the actual authority of the relevant entity.

## Current Definitive Description

**OMOS™ is the central governed runtime and operational-intelligence environment for the OneGodian Protocol™, OneGodian Algorithm™, and OHI™. It receives and distills complex requests, coordinates supported models, applies alignment and policy controls, preserves dissent and uncertainty, requires human authority where appropriate, persists auditable Decision Records, and exposes those capabilities through user workspaces, developer interfaces, and controlled ecosystem integrations.**
