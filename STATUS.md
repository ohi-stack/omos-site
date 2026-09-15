# OMOS Repository Status Report

Date: 2026-09-15
Repository: `ohi-stack/omos-site`
Canonical runtime: `https://omos.onegodian.com`
Repository runtime target: `1.1.0`
Current `main` SHA at status capture: `27d3416a11725858e97df0a09cb668fb168b062b`
Current maturity: **Functional — Repository Hardened / Production Host Update Required**

## Executive Status

OMOS now has a governed Node/Express runtime, Ask OMOS workspace, Layer 1 distillation, Alignment Engine, multi-provider Council orchestration, cross-review, Governed Synthesis, server-side Human Gate, durable Decision Record architecture, PostgreSQL persistence, owner isolation, append-oriented revision/hash chaining, provider-neutral Model Gateway contracts, MCP authorization controls, runtime health checks, production preflight enforcement, and exact deployed-SHA verification tooling.

Since the September 10 consolidation, `main` has advanced through the production-readiness series completed on September 12. The current mainline includes normalized OpenAI, Anthropic, Gemini, and xAI Model Gateway contracts; production Model Gateway verification rules; OMOS-REF-0001 production verification tooling; MCP authorization hardening; and a strict production restart preflight that requires exact build provenance, hashed API-key configuration, valid PostgreSQL configuration, durable persistence, and disabled memory fallback in production.

The remaining blocker is **deployment-source parity on the canonical host**. The scheduled OMOS Runtime Health workflow checked `https://omos.onegodian.com` on September 15, 2026 and observed runtime version `1.0.1`, while the repository target remains `1.1.0`. Therefore the public host is reachable but is not aligned with the approved current mainline.

Production deployment work is tracked by Issue #45 and the automated production-alignment mismatch by Issue #50.

## Canonical Architecture

```text
OneGodian Protocol™ = definitions, identity rules, scope, and interoperability
OneGodian Algorithm™ = Observe → Distill → Align → Select → Execute → Verify
OHI™ = multi-model comparison, critique, meaningful-dissent preservation, and governed synthesis
OMOS™ = runtime, orchestration, interfaces, persistence, Human Gate, audit, and Decision Records
OLLM = dedicated OneGodian model/intelligence provider track integrated through OMOS
Oru’Valen™ = approved continuity/context layer
ACC™ = separate execution control plane for authorized agents and external actions
```

## Canonical Product Flow

```text
INPUT → LAYER 1 → ALIGN → COUNCIL → SYNTHESIZE → RECORD → HISTORY
```

The Human Gate remains mandatory inside the governed Record transition. Model agreement is comparative reasoning evidence, not factual verification.

## Current Defensible Component Status

| Area | Status | Evidence boundary |
|---|---|---|
| Node/Express runtime | Functional | Runtime source and routes are implemented on `main`. |
| Ask OMOS workspace | Functional | Governed browser workflow and history UI exist in source. |
| Layer 1 distillation | Functional | Structured signal preservation/classification is implemented. |
| Alignment Engine | Functional | Dimension scoring, penalties, hard gates, and explicit review states exist. |
| Council orchestration | Functional / provider-dependent | Provider adapters and normalized Model Gateway contracts exist; live execution depends on production credentials and health. |
| Cross-model review | Functional / provider-dependent | Cross-review exists when providers complete successfully. |
| Governed Synthesis | Functional | Agreement, contradictions, missing evidence, dissent, uncertainty, and recommendation conditions are represented. |
| Human Gate | Functional | Authenticated approval/rejection is implemented server-side. |
| Decision Records | Functional | Governed run state can be persisted and reopened in repository tests. |
| PostgreSQL persistence | Repository-verified | Migrations, durability, restart verification, ownership, and persistence tests pass in CI. |
| Ownership isolation | Repository-verified | API-key owner scoping and isolation tests are implemented. |
| Revision/hash audit chain | Repository-verified | Append-oriented revisions and SHA-256 chain verification are implemented. |
| Strict production preflight | Repository-verified | Production rejects missing/unsafe build, auth, or database configuration. |
| Model Gateway contract | Repository-verified | OpenAI, Anthropic, Gemini, and xAI adapters use normalized production-facing contracts. |
| MCP authorization hardening | Repository-verified | Consequential MCP mutations require authoritative approval; endpoint credential boundaries are tested. |
| Dashboard History | Functional | History/reopen API and workspace integration exist. |
| Exact build provenance | Repository-verified | Build SHA verification tooling exists. |
| Live public host | Reachable / stale deployment | September 15 health evidence reports live runtime `1.0.1`, not repository target `1.1.0`. |
| OMOS-REF-0001 | Not certified | Requires exact production SHA parity plus durable Decision Record restart/reopen evidence. |
| Factual evidence verification | Incomplete | Council convergence remains distinct from external factual verification. |
| Commerce entitlement runtime | Incomplete | Paid access must not be represented as automated until checkout → entitlement → governed run is production-tested. |
| OLLM native provider | Development | Architecture exists; production inference/evaluation certification remains pending. |
| ACC execution handoff | Development | External execution remains separately authorized and not yet reference-certified end to end. |

## Production Readiness Added September 12, 2026

Current mainline production hardening includes:

- normalized OpenAI, Anthropic, Gemini, and xAI Model Gateway contracts;
- latency/provenance normalization and Model Gateway contract tests;
- production Model Gateway verification standard;
- exact-SHA OMOS-REF-0001 production verifier and runbook;
- MCP conformance expansion and production authorization hardening;
- strict production preflight for build SHA, API-key storage, PostgreSQL URL, SSL/pool configuration, durable persistence, and memory-fallback prohibition;
- CI gates covering syntax, provider contracts, lifecycle, Decision Record hardening, PostgreSQL restart verification, smoke/pages, owner isolation, persistence, and preflight rules.

Repository CI is readiness evidence. It is not proof that the canonical host is serving that revision.

## Live Production Boundary — September 15, 2026

The most recent scheduled production-evidence check reached the canonical host successfully but failed immediately on the version gate:

```text
Live runtime version: 1.0.1
Expected repository runtime: 1.1.0
Expected main SHA at check: 27d3416a11725858e97df0a09cb668fb168b062b
Result: NOT ALIGNED
```

Until the existing Hostinger Node application is pulled/restarted onto an approved current-main descendant and passes the production preflight, OMOS must not be represented as fully Production-certified.

## Required Production Update

1. In the existing Hostinger OMOS application directory, fetch and fast-forward to the approved current `main` revision.
2. Confirm the checked-out Git SHA and expose it through the runtime build provenance mechanism.
3. Confirm production environment values for `NODE_ENV`, `OMOS_VERSION`, `OMOS_CANONICAL_HOST`, hashed API-key configuration, `DATABASE_URL`, `OMOS_DB_SSL`, and `OMOS_DB_POOL_MAX`.
4. Run install/check, migrations, and `npm run preflight:production` successfully.
5. Restart the existing Node service using the supervisor already configured for the production application.
6. Verify `/api/health`, `/api/manifest`, `/api/v1/persistence`, `/api/v1/providers`, `/`, `/ask/`, `/dashboard`, and the required public/runtime surfaces.
7. Execute OMOS-REF-0001: governed run → Human Gate → Decision Record → History reopen.
8. Restart/redeploy again and reopen the exact same Decision ID with ownership and audit-chain verification intact.
9. Attach the deployed SHA, Decision ID, record hash, database backend, timestamps, and verification evidence to the production deployment issue.

## Next Engineering Order After Production Parity

1. Complete live provider health/execution verification for OpenAI, Anthropic, Gemini, and xAI without treating configuration as availability.
2. Add external evidence retrieval and claim-to-source verification.
3. Expand retry/backoff, circuit breakers, latency, token/usage/cost, and provider failure telemetry.
4. Complete connector execution through the governed OMOS → Human Gate → ACC → external system path.
5. Complete the first verified checkout → entitlement → governed run → Decision Record → History transaction.
6. Advance OLLM and OneGodian MCP only against the same conformance, observability, and production-evidence standards.

## Production Rule

> **If it is not fully operational, documented, and repeatable, it does not exist in the current version.**

Maturity remains component-based:

```text
CONCEPTUAL → PROTOTYPE → FUNCTIONAL → VERIFIED → PRODUCTION
```

**Current defensible OMOS system status: Functional with substantial repository-level verification; canonical production host update and OMOS-REF-0001 live proof remain required.**
