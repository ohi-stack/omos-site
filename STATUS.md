# OMOS Repository Status Report

Date: 2026-09-10
Repository: `ohi-stack/omos-site`
Canonical runtime: `https://omos.onegodian.com`
Runtime target: `1.1.0`
Current maturity: **Functional — Production Certification In Progress**

## Executive Status

OMOS is a live Node/Express operating-intelligence runtime and public operational workspace for the OneGodian Protocol™, OneGodian Algorithm™, and OHI™. The repository now contains the governed runtime path, Layer 1 distillation, Alignment Engine, Council interfaces, cross-model review, Governed Synthesis, server-side Human Gate, Decision Records, PostgreSQL persistence, ownership isolation, revision/hash chaining, restart-verification tooling, public workspace routes, runtime health checks, and exact deployment-provenance tooling.

The repository portion of P0 Decision Record persistence hardening is complete on `main`. PR #27 was merged as `d97b8344ebc644ef63cd994a1db9adfbbd61edf3`, superseding PR #25. PR #29 subsequently added exact deployed-SHA and semantic live-verification machinery and was merged as `e6b3fcb45dae7517525e3e2265f6b97ddf891f78`.

**OMOS-REF-0001 is not yet certified PASS.** Repository CI and live endpoint reachability are necessary evidence, but certification still requires deployment-source parity on the canonical Hostinger runtime, initialized durable PostgreSQL, one governed Decision Record, server-side Human Gate disposition, restart/redeploy, and reopening the same record with its audit chain intact.

Certification remains tracked in Issue #28.

## Canonical Architecture

```text
OneGodian Protocol™ = definitions, identity rules, scope, and interoperability
OneGodian Algorithm™ = Observe → Distill → Align → Select → Execute → Verify
OHI™ = multi-model comparison, critique, disagreement preservation, and synthesis
OMOS™ = runtime, orchestration, persistence, interfaces, and Decision Records
OLLM = first-class OneGodian model/intelligence provider inside the OMOS Model Gateway
ACC™ = operational command/execution control plane for agents and approved actions
```

## Canonical Product Flow

```text
INPUT → LAYER 1 → ALIGN → COUNCIL → SYNTHESIZE → RECORD → HISTORY
```

The Human Decision Gate remains mandatory inside the Record transition for governed runs. Model agreement is comparative evidence; it is not factual verification.

## Current Defensible Component Status

| Area | Status | Evidence boundary |
|---|---|---|
| Node/Express runtime | Functional | Runtime source and routes are on `main`. |
| Ask OMOS workspace | Functional | `/ask/` is part of the runtime and health probes. |
| Layer 1 distillation | Functional | Deterministic signal classification is implemented. |
| Alignment Engine | Functional | Dimension scoring, hard gates, and explicit verification boundaries exist. |
| Council orchestration | Functional / provider-dependent | Provider adapters exist; live state depends on production credentials and connector health. |
| Cross-model review | Functional / provider-dependent | Council review execution exists when providers are available. |
| Governed Synthesis | Functional | Agreement, contradiction, missing-evidence, and human-review fields are produced. |
| Human Gate | Functional | Authenticated APPROVED / REJECTED mutation is implemented. |
| Decision Records | Functional | Complete run state is persistable and reopenable by owner in repository tests. |
| PostgreSQL persistence | Repository-verified | Durable production contract, migrations, and CI are merged; canonical-host DB state still needs live proof. |
| Ownership isolation | Repository-verified | API-key owner scoping is implemented and tested. |
| Revision/hash audit chain | Repository-verified | Append-only revisions and SHA-256 chaining are implemented and tested. |
| Restart verification tooling | Repository-verified | Cross-process PostgreSQL restart verification is part of P0 CI. |
| Dashboard History | Functional | History/reopen API and workspace integration exist. |
| Exact build provenance | Repository-verified | `/build.json` and `OMOS_BUILD_SHA` support are merged. |
| Semantic live verification | Repository-verified | Current workflow can compare version, exact SHA, persistence, providers, and public surfaces. |
| Live public host | Reachable | Scheduled health checks reach the canonical host; exact current-main deployment parity is still pending. |
| Factual evidence verification | Not complete | Model agreement remains separate from independently verified evidence. |
| Commerce entitlement runtime | Specification / implementation target | First paid end-to-end transaction is not certified. |
| OLLM native provider | Architecture / development | Production runtime is not certified. |
| ACC execution handoff | Architecture / development | End-to-end execution evidence remains future work. |

## Repository Hardening Completed on 2026-09-10

Merged P0 persistence work includes:

- PostgreSQL required for production Decision Records;
- idempotent migrations;
- ownership/audit-chain migration;
- append-only Decision Record revisions;
- SHA-256 record chaining;
- API-key owner isolation;
- ordered Human Gate → Decision Record transitions;
- PostgreSQL cross-process restart verification;
- production preflight DB/migration enforcement;
- PostgreSQL-backed CI;
- ownership, lifecycle, persistence, and audit regression gates.

Merged production-evidence work includes:

- runtime-generated `/build.json`;
- exact deployed Git SHA provenance;
- `OMOS_BUILD_SHA` support for hosts that strip `.git` metadata;
- semantic live verification of runtime version, exact SHA, PostgreSQL durability/initialization, provider status, and required public surfaces;
- retained GitHub Actions production-evidence artifacts;
- automated production-alignment issue handling.

Repository CI is code/readiness evidence. It is not a substitute for live-host certification.

## Live Production Boundary — September 10, 2026

The canonical public host is reachable. Current public evidence still identifies the live runtime as the older `1.0.1` deployment while the repository target is `1.1.0` and current `main` contains the production hardening and provenance controls.

Therefore the live runtime must not yet be represented as aligned with current `main` or as Production-certified.

The production environment must expose the exact deployed SHA through `/build.json`. If Hostinger strips `.git` metadata, set `OMOS_BUILD_SHA` to the exact approved commit deployed to the application.

## OMOS-REF-0001 Remaining Certification Gates

1. Deploy the approved current `main` revision to the canonical Hostinger Node environment.
2. Confirm `/build.json` identifies the exact deployed Git SHA.
3. Configure the real production PostgreSQL `DATABASE_URL` and required SSL/pool settings.
4. Run migrations and `npm run preflight:production` successfully.
5. Confirm `/api/v1/persistence` reports `backend: postgresql`, `durable: true`, `initialized: true`, and no error.
6. Execute one canonical governed Ask OMOS/Council run and record its Decision ID.
7. Confirm Layer 1 → Alignment → Council → Governed Synthesis completes with structured records.
8. Submit the server-side Human Gate disposition.
9. Reopen the Decision Record from Dashboard History before restart.
10. Restart/redeploy the Node runtime.
11. Reopen the exact same Decision ID and verify disposition, ownership, revision history, and SHA-256 chain remain intact.
12. Attach source SHA, runtime timestamp, Decision ID, record hash, persistence backend, and workflow evidence to Issue #28.

Only then may OMOS-REF-0001 be marked **PASS** and the tested runtime configuration advance from Functional/Verified to Production.

## Next Engineering Order After OMOS-REF-0001

1. Normalize Council contribution provenance: contribution ID, role, connector identity, input/output hashes, timestamps, request ID, and provenance state.
2. Add external evidence verification so governed synthesis distinguishes reasoned convergence from verified state.
3. Complete provider health, retry, circuit-breaker, latency, token/cost, and failure telemetry.
4. Rebase and verify the native GPT-6 Astra connector through the governed Council path before production activation.
5. Complete ACC handoff and Engineering Record linkage for approved execution.
6. Complete the first verified checkout → entitlement → governed run → Decision Record → History transaction.
7. Advance OLLM and OneGodian MCP implementation after the core reference transaction is stable.

## Production Rule

> **If it is not fully operational, documented, and repeatable, it does not exist in the current version.**

Maturity remains component-based:

```text
CONCEPTUAL → PROTOTYPE → FUNCTIONAL → VERIFIED → PRODUCTION
```

**Current defensible OMOS system status: Functional, with substantial repository-level verification and production certification still pending OMOS-REF-0001.**
