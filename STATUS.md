# OMOS Repository Status Report

Date: 2026-09-10
Repository: `ohi-stack/omos-site`
Canonical runtime: `https://omos.onegodian.com`
Runtime version target: `1.1.0`
Current maturity: **Functional; production certification pending**

## Executive status

OMOS is a live Node/Express runtime and public operational workspace for the OneGodian Protocol™, OneGodian Algorithm™, and OHI™. The repository now contains the governed runtime path, provider adapters, Layer 1 distillation, Alignment Engine, Council orchestration, cross-model review, Governed Synthesis, Human Gate, Decision Records, PostgreSQL persistence, ownership isolation, revision/hash chaining, restart verification tooling, public workspace routes, and runtime health checks.

The repository portion of P0 Decision Record persistence hardening is complete on `main`. PR #27 was merged as `d97b8344ebc644ef63cd994a1db9adfbbd61edf3`, superseding the divergent PR #25 implementation. The current default-branch descendants preserve that same source tree after an accidental placeholder commit was immediately removed.

**OMOS-REF-0001 is not yet certified PASS.** Repository CI and live endpoint reachability are necessary evidence, but final certification still requires source-parity proof on the canonical host, initialized durable PostgreSQL, one governed Decision Record, server-side Human Gate disposition, restart/redeploy, and reopening the same record with the audit chain intact.

Certification is tracked in Issue #28.

## Canonical architecture

```text
OneGodian Protocol™ = definitions, identity rules, scope, and interoperability
OneGodian Algorithm™ = Observe → Distill → Align → Select → Execute → Verify
OHI™ = multi-model comparison, critique, disagreement preservation, and synthesis
OMOS™ = runtime, orchestration, persistence, interfaces, and Decision Records
ACC™ = operational command/execution control plane for agents and approved actions
```

## Canonical product flow

```text
INPUT → LAYER 1 → ALIGN → COUNCIL → SYNTHESIZE → RECORD → HISTORY
```

The Human Decision Gate remains mandatory inside the Record transition for governed Council runs.

## Verified repository state

| Area | Defensible status | Evidence boundary |
|---|---|---|
| Node/Express runtime | Functional | Runtime source and routes are on `main`. |
| Ask OMOS workspace | Functional | `/ask/` is part of the runtime and health probes. |
| Layer 1 distillation | Functional | Deterministic signal classification exists in `src/runtime/orchestrator.js`. |
| Alignment Engine | Functional | Dimension scoring, hard gates, and explicit non-verification note are implemented. |
| Council orchestration | Functional / provider-dependent | OpenAI, Anthropic, Gemini, and xAI adapters exist; live status depends on production credentials. |
| Cross-model review | Functional / provider-dependent | 4x4-minus-self review execution exists in the orchestrator. |
| Governed Synthesis | Functional | Agreement, contradiction, missing-evidence, and human-review fields are produced. |
| Human Gate | Functional | Authenticated `APPROVED` / `REJECTED` mutation is implemented. |
| Decision Records | Functional | Complete run state is persisted and reopenable by owner in repository tests. |
| PostgreSQL persistence | Repository-verified | P0 durable persistence and migration path are merged; canonical-host DB state still needs production proof. |
| Ownership isolation | Repository-verified | API-key owner scoping is implemented and tested in CI. |
| Revision/hash audit chain | Repository-verified | Append-only revisions and SHA-256 chaining are implemented and tested. |
| Restart verification tooling | Repository-verified | Cross-process PostgreSQL restart verification is part of P0 CI. |
| Dashboard History | Functional | Authenticated history/reopen APIs and workspace integration exist. |
| Live public surfaces | Reachable | Scheduled runtime-health workflow has successfully probed the canonical host; reachability is not source-parity proof. |
| Factual verification | Not complete | Model agreement remains explicitly separate from external evidence verification. |
| Commerce entitlement runtime | Specification | Commerce contract exists; first paid end-to-end transaction is not certified. |
| OLLM native provider | Architecture / development | First-class provider design exists; production runtime is not certified. |
| ACC execution handoff | Architecture / development | OMOS/ACC boundary is defined; end-to-end execution evidence remains future work. |

## Production hardening merged on 2026-09-10

PR #27 added/reconciled:

- durable PostgreSQL required for production Decision Records;
- idempotent migrations;
- ownership/audit-chain migration;
- append-only Decision Record revisions;
- SHA-256 record chaining;
- API-key owner isolation;
- ordered Human Gate → Decision Record transitions;
- PostgreSQL cross-process restart verification;
- production preflight DB/migration enforcement;
- PostgreSQL-backed CI service;
- ownership, lifecycle, persistence, and audit regression gates.

Repository CI is code/readiness evidence. It is not a substitute for live-host certification.

## Production evidence update in review

The branch `update/production-evidence-2026-09-10` adds a stricter deployment-evidence contract:

- runtime-generated `/build.json` with exact Git SHA provenance;
- `OMOS_BUILD_SHA` for hosts that strip `.git` metadata;
- a live smoke test that checks version, canonical host, exact deployed SHA, PostgreSQL durability/initialization, provider-status payload, and required public surfaces;
- an hourly production-evidence workflow that can compare the canonical host to the current `main` SHA;
- `docs/OMOS-PRODUCTION-EVIDENCE-2026-09-10.md`.

This work should be reviewed and merged before OMOS-REF-0001 production certification so deployed-source parity can be proven mechanically.

## Council integrity / provenance gap

The current runtime preserves provider name, model, simulation state, output text, latency, and provider metadata. OpenAI, Anthropic, and xAI adapters already capture a provider request ID when returned by the upstream API. However, the Council record does not yet expose a complete normalized contribution envelope with per-contribution ID, assigned role, connector identity, input hash, output hash, timestamps, and explicit provenance status.

This is now a defined integrity gap because human-mediated Council testing demonstrated that transcript labels can be misattributed. OMOS should treat provider labels as assertions unless the runtime execution path can prove provenance.

Required rule:

> **Provenance precedes synthesis. Evidence outranks model agreement. Variable reasoning must operate inside invariant governance and record contracts.**

## OMOS-REF-0001 — remaining certification gates

1. Merge the production-evidence/source-parity controls.
2. Deploy the intended `main` revision or a documented descendant containing the P0 persistence baseline.
3. Set `NODE_ENV=production`, `OMOS_VERSION=1.1.0`, canonical host, non-placeholder API keys, production PostgreSQL `DATABASE_URL`, SSL, and pool configuration.
4. Run `npm run preflight:production` successfully.
5. Confirm `/build.json` identifies the exact deployed Git SHA.
6. Confirm `/api/v1/persistence` reports `backend: postgresql`, `durable: true`, `initialized: true` with no error.
7. Execute one canonical governed `/ask` / Council run and record its Decision ID.
8. Submit the server-side Human Gate disposition.
9. Reopen the Decision Record from history and verify ownership/audit state.
10. Restart/redeploy the runtime.
11. Reopen the exact same Decision ID and verify the revision/hash chain remains intact.
12. Attach source SHA, runtime timestamp, Decision ID, record hash, persistence backend, and workflow evidence to Issue #28.

Only then may OMOS-REF-0001 be marked **PASS**.

## Next engineering order after OMOS-REF-0001

1. Harden normalized Council contribution provenance and role assignment.
2. Add explicit GCD/common-ground extraction while preserving provider-specific remainders and contradictions.
3. Add external evidence verification so governed synthesis can distinguish reasoned convergence from verified state.
4. Complete provider health/retry/circuit-breaker/cost telemetry.
5. Complete ACC handoff and Engineering Record linkage for authorized execution.
6. Complete the first paid checkout → entitlement → governed run → Decision Record → History transaction.
7. Advance OLLM and OneGodian MCP implementation only after the core reference transaction is stable.

## Production rule

> **If it is not fully operational, documented, and repeatable, it does not exist in the current version.**

Maturity remains component-based:

```text
CONCEPTUAL → PROTOTYPE → FUNCTIONAL → VERIFIED → PRODUCTION
```

**Current defensible OMOS system status: Functional, with substantial repository-level verification and production certification still pending OMOS-REF-0001.**
