# OMOS Repository Status Report

Date: 2026-09-10
Repository: `ohi-stack/omos-site`
Canonical runtime: `https://omos.onegodian.com`
Repository package version: `1.1.0`
Canonical `main` revision at this audit: `e6b3fcb45dae7517525e3e2265f6b97ddf891f78`
Overall status: **FUNCTIONAL / PRODUCTION VERIFICATION IN PROGRESS**

## Executive Status

OMOS is a live Node/Express operating-intelligence runtime with a materially hardened `1.1.0` repository implementation. The current repository contains the governed Ask OMOS lifecycle, Layer 1 distillation, Alignment, Council orchestration, Human Gate, Decision Records, PostgreSQL persistence support, ownership isolation, audit-chain revisions, migrations, production preflight, runtime build provenance, and semantic live-production evidence checks.

The repository has moved beyond availability-only monitoring. Current `main` now contains an automated canonical-host evidence gate that checks exact runtime version, runtime-resolved build SHA, durable initialized PostgreSQL, provider-status payload, and required public surfaces.

OMOS **must not yet be called `PRODUCTION_VERIFIED`** until the canonical host passes the exact live evidence gate and OMOS-REF-0001 proves that one governed Decision Record survives a restart/redeploy and reopens with its lineage intact.

The immediate milestone remains **OMOS-REF-0001 — First Governed End-to-End Reference Run**.

## Canonical Architectural Separation

```text
OneGodian Protocol™ = definitions, identity rules, interoperability, and scope
OneGodian Algorithm™ = evaluation and decision logic
OHI™ = multi-model comparison, critique, and governed synthesis
OMOS™ = runtime, orchestration, persistence, interfaces, and audit records
OLLM = first-class model/intelligence provider behind the OMOS Model Gateway
ACC = authorized execution/control plane for downstream agent work
```

The governing Algorithm cycle remains:

```text
Observe → Distill → Align → Select → Execute → Verify
```

The primary OMOS product/runtime rail remains:

```text
INPUT → LAYER 1 → ALIGN → COUNCIL → SYNTHESIZE → RECORD → HISTORY
```

## What Is Verified on `main`

### 1. Production persistence hardening

PR #27 reconciled the P0 persistence work against the current mainline. The persistence-hardening commit was:

```text
d97b8344ebc644ef63cd994a1db9adfbbd61edf3
```

That slice passed PostgreSQL-backed CI for syntax, lifecycle regression, Decision Record hardening, migrations, cross-process restart verification, durable runtime startup, smoke/page tests, authenticated owner isolation, and persistence-endpoint assertions.

PR #25 was closed as superseded instead of preserving two competing implementations.

### 2. Production evidence automation

Current `main` advances to:

```text
e6b3fcb45dae7517525e3e2265f6b97ddf891f78
```

This revision adds exact deployed-SHA/runtime provenance and semantic canonical-host verification. The scheduled production-evidence workflow now validates:

- runtime version = `1.1.0`;
- live build SHA = expected `main` SHA;
- build provenance = runtime-resolved;
- canonical host identity;
- persistence backend = PostgreSQL;
- persistence `durable: true`;
- persistence `initialized: true`;
- no persistence initialization error;
- provider-status payload exists;
- required public surfaces respond successfully.

A green HTTP-only health result is no longer sufficient for production alignment.

### 3. Decision Record persistence and provenance

`main` implements:

- PostgreSQL-backed Decision Records;
- durable production persistence enforcement;
- idempotent migrations;
- append-only Decision Record revisions;
- SHA-256 revision/hash chaining;
- owner-scoped record access;
- persisted Human Gate disposition;
- history/retrieval interfaces;
- persistence status reporting;
- restart verification tooling.

### 4. Council / OHI runtime

`main` contains provider adapters for:

- OpenAI;
- Anthropic;
- Google Gemini;
- xAI.

The runtime distinguishes simulation, hybrid, and live modes. Adapter source in the repository does not by itself prove that production credentials or provider models are configured on the canonical host.

### 5. Human authority

The Human Gate is a separate authorization boundary. Approval records the human disposition; it does not establish factual truth and does not automatically authorize unrelated financial, legal, registry, credential, payment, or infrastructure actions.

## Current Defensible Capability Matrix

| Area | Current status | Evidence boundary |
|---|---|---|
| Public OMOS node | FUNCTIONAL | Canonical host is live/reachable |
| Repository package | 1.1.0 | `package.json` |
| Ask OMOS workspace | FUNCTIONAL | Repository implementation exists; exact production build proof remains part of live gate |
| Layer 1 distillation | REPOSITORY VERIFIED | Lifecycle regression coverage |
| Alignment Engine | REPOSITORY VERIFIED / FUNCTIONAL | Heuristic decision-support scoring; not factual verification |
| Council orchestration | FUNCTIONAL | Four provider adapters exist; production provider state must be runtime-verified |
| Cross-model review | FUNCTIONAL | No-self review architecture implemented |
| Governed synthesis | FUNCTIONAL | Human review remains required |
| Human Gate | REPOSITORY VERIFIED | Server-side disposition persistence implemented |
| Decision Records | REPOSITORY VERIFIED | Record lifecycle/retrieval tested |
| PostgreSQL persistence code | REPOSITORY VERIFIED | PostgreSQL CI/restart tests pass |
| Production PostgreSQL | LIVE EVIDENCE REQUIRED | Must pass semantic canonical-host gate |
| Ownership isolation | REPOSITORY VERIFIED | Authenticated owner-isolation tests pass |
| Audit-chain revisions | REPOSITORY VERIFIED | Revision/hash-chain hardening implemented/tested |
| Runtime build provenance | IMPLEMENTED ON MAIN | Exact deployed SHA must be resolved by live host |
| Semantic live-production monitor | IMPLEMENTED ON MAIN | Requires a successful scheduled/manual evidence run |
| Dashboard History | FUNCTIONAL / LIVE PROOF PENDING | Must reopen the actual production reference record after restart |
| WordPress bridge | STAGED | Test independently on each approved target |
| OLLM native model/runtime | DEVELOPMENT TARGET | Architecture exists; do not claim production model status |
| GPT-6 Astra native connector | OPEN PR / NOT MAIN | PR #22 remains unmerged |
| ACC + Codex engineering factory contract | DRAFT PR / NOT MAIN | PR #26 remains unmerged |
| OMOS-REF-0001 | IN PROGRESS | Issue #28 is authoritative certification gate |

## OMOS-REF-0001 Production Gate

Authoritative tracking issue: **#28 — `OMOS-REF-0001: complete canonical production deployment proof`**.

Required evidence includes:

1. Canonical host runs the exact intended `main` revision or a documented descendant.
2. Runtime reports version `1.1.0` and production environment.
3. Runtime-resolved build SHA matches the intended deployment.
4. Non-placeholder production access credentials are configured.
5. Production PostgreSQL is configured correctly.
6. Production preflight and migrations succeed.
7. `/api/v1/persistence` reports PostgreSQL, durable, initialized, and error-free.
8. Provider status reflects actual runtime configuration.
9. One real `/ask` / Council reference run produces a unique Decision ID.
10. The Human Gate disposition is written server-side.
11. The resulting Decision Record reopens from Dashboard History.
12. The runtime restarts or redeploys.
13. The exact same Decision ID reopens after restart.
14. Revision/hash lineage and owner isolation remain valid.
15. Deployed SHA, runtime timestamp, Decision ID, record hash, persistence backend, and verification evidence are recorded.

**Certification rule:** OMOS-REF-0001 is PASS only when every applicable gate has production evidence. Repository CI is necessary but not live-host proof.

## Open Pull-Request Hygiene

Do not merge old open PRs mechanically. Compare each to current `main` and classify it as still required, partially superseded, fully superseded, or requiring reconciliation.

Highest-value current open PRs include:

- **PR #22** — native GPT-6 Astra OMOS connector; requires provider-access and integration verification before merge.
- **PR #26** — ACC + Codex engineering factory operating contract; still draft.
- **PR #24** — Sites navigation / gold branding synchronization; compare with current main before merge.
- **PR #19** — Oru’Valen / OMOS integration; larger separate scope and not part of the immediate production-proof gate.

Older PRs such as #12, #13, #15, and #17 contain work that may already have been reconciled into later mainline commits. They should be reviewed and closed/rebased based on actual diff, not title or age.

## Immediate Priorities

### P0 — Let the exact live-production evidence gate run against current main

The new semantic monitor should be treated as the automated authority for canonical-host alignment. A reachable site with a mismatched SHA/version or non-durable database should fail this gate.

### P0 — Complete OMOS-REF-0001

Run the real governed transaction:

```text
Ask OMOS
→ Layer 1
→ Alignment
→ Council Review
→ Governed Synthesis
→ Human Gate
→ Decision Record
→ Dashboard History
→ Runtime restart/redeploy
→ Same Decision Record reopened
```

### P1 — Provider production proof

For every provider displayed as live, prove actual runtime configuration, selected model, successful request, provenance, and degraded/failure behavior. Unverified providers remain simulation/unconfigured.

### P1 — Reconcile the open PR backlog

Close or rebase superseded PRs so `main` remains the single source of truth.

### P2 — WordPress bridge verification

Install/configure/test the OMOS bridge separately on OneGodian.org, OneGodian.com, and QuantumOHI.com where those targets remain approved.

### P2 — Commerce and entitlement execution

After OMOS-REF-0001 passes, complete the first revenue transaction:

```text
Checkout → verified payment → entitlement → governed run → Decision Record → Dashboard History
```

## Status Vocabulary

Use:

- `BLOCKED`
- `READY_FOR_REVIEW`
- `READY_FOR_APPROVAL`
- `APPROVED_FOR_MERGE`
- `MERGED_NOT_DEPLOYED`
- `DEPLOYMENT_READY`
- `DEPLOYED_UNVERIFIED`
- `PRODUCTION_VERIFIED`
- `FAILED`
- `ROLLED_BACK`

Avoid the ambiguous status `DONE`.

## Current Final Classification

**Repository persistence-hardening slice:** `VERIFIED`.

**Repository production-evidence automation:** `IMPLEMENTED ON MAIN`.

**Canonical host:** `FUNCTIONAL`; exact current-main production alignment remains to be proven by the new evidence gate.

**OMOS 1.1.0 overall:** `FUNCTIONAL` with significant repository-verified components; **not yet `PRODUCTION_VERIFIED` until OMOS-REF-0001 passes end-to-end on the canonical host**.

## Definitive Current Description

**OMOS™ is the central runtime and operating environment for the OneGodian Protocol™, OneGodian Algorithm™, and OHI™. It receives and distills human requests, evaluates alignment, coordinates model providers, performs governed synthesis, preserves human authorization, records auditable decisions, and exposes those capabilities through runtime, workspace, dashboard, and integration interfaces. As of September 10, 2026, the repository has passed substantial PostgreSQL-backed CI and now contains exact-SHA semantic production-evidence automation; final Production verification remains gated on live canonical-host alignment plus one restart-surviving governed Decision Record under OMOS-REF-0001.**
