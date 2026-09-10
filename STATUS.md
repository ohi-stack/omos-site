# OMOS Repository Status Report

Date: 2026-09-10
Repository: `ohi-stack/omos-site`
Canonical runtime: `https://omos.onegodian.com`
Repository package version: `1.1.0`
Canonical `main` revision at this audit: `d97b8344ebc644ef63cd994a1db9adfbbd61edf3`
Overall status: **FUNCTIONAL / PRODUCTION VERIFICATION PENDING**

## Executive Status

OMOS is a live public Node/Express operating-intelligence runtime with a materially hardened `1.1.0` repository implementation. The repository now contains the governed Ask OMOS lifecycle, Layer 1 distillation, Alignment, Council orchestration, Human Gate, Decision Records, PostgreSQL persistence support, ownership isolation, audit-chain revisions, migrations, runtime health probes, and deployment-preflight controls.

The production host is reachable, but OMOS **must not yet be certified `PRODUCTION_VERIFIED`**. The canonical public page still reports the host as `v1.0.1 observed`, while `main` is `1.1.0`; the live production database/version semantics have not yet been proven against the current release gate.

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

### Repository revision

PR #27 reconciled the production-persistence hardening work against the current mainline and merged on September 10, 2026. The resulting `main` revision is:

```text
d97b8344ebc644ef63cd994a1db9adfbbd61edf3
```

PR #25 was closed as superseded rather than leaving two competing persistence implementations.

### CI evidence

The PR #27 runtime CI completed successfully with PostgreSQL 16 and passed:

- syntax checks;
- lifecycle regression;
- P0 Decision Record hardening tests;
- PostgreSQL migrations;
- cross-process restart verification;
- runtime startup with durable PostgreSQL;
- smoke tests;
- page tests;
- authenticated Decision Record ownership isolation;
- `/api/v1/persistence` assertions.

This is strong repository-level verification. It is not a substitute for production-host proof.

### Decision Record persistence

`main` now implements:

- PostgreSQL-backed Decision Records;
- production durability enforcement;
- idempotent migrations;
- append-only Decision Record revisions;
- SHA-256 revision/hash chaining;
- owner-scoped record access;
- persisted Human Gate disposition;
- history/retrieval interfaces;
- persistence status reporting;
- cross-process restart verification.

When `NODE_ENV=production`, durable storage is required unless an explicit non-production exception is configured. Production is expected to use PostgreSQL rather than memory fallback.

### Council / OHI runtime

`main` contains provider adapters for:

- OpenAI;
- Anthropic;
- Google Gemini;
- xAI.

The runtime distinguishes simulation, hybrid, and live execution. Provider availability in the repository does **not** prove that a production credential/model is configured or working on the live host.

### Human authority

The Human Gate remains a separate authorization boundary. Approval records a human disposition; it does not turn model consensus into factual verification and does not automatically authorize unrelated financial, legal, credential, registry, or infrastructure actions.

## Live-Host Evidence as of 2026-09-10

The scheduled `OMOS Runtime Health` workflow is passing against the canonical host. Its current availability probe checks:

- `/`;
- `/manifest`;
- `/dashboard`;
- `/ask/`;
- `/ohi-output-pipeline`;
- `/api/v1/persistence`.

A passing availability probe means those surfaces return HTTP success/redirect responses. It does **not** prove:

- deployed version = `1.1.0`;
- deployed SHA = current `main`;
- persistence backend = PostgreSQL;
- `durable: true`;
- `initialized: true`;
- production provider configuration;
- restart survival of a real production Decision Record.

The public production-evidence page still identifies the live host as `v1.0.1 observed`. That mismatch keeps the deployment gate open.

## Current Defensible Capability Matrix

| Area | Status | Evidence boundary |
|---|---|---|
| Public OMOS node | FUNCTIONAL | Live and reachable |
| Shared public navigation/UI | FUNCTIONAL | Live public interface present |
| Ask OMOS workspace | FUNCTIONAL | Repository implementation exists; production provider mode must be confirmed |
| Layer 1 distillation | REPOSITORY VERIFIED | Lifecycle regression passes |
| Alignment Engine | REPOSITORY VERIFIED / FUNCTIONAL | Heuristic decision-support scoring; not factual verification |
| Council orchestration | FUNCTIONAL | Four provider adapters exist; live provider credentials not yet production-certified |
| Cross-model review | FUNCTIONAL | No-self review architecture implemented |
| Governed synthesis | FUNCTIONAL | Human review remains required |
| Human Gate | REPOSITORY VERIFIED | Server-side approval/rejection persistence implemented |
| Decision Records | REPOSITORY VERIFIED | Record lifecycle and retrieval tested |
| PostgreSQL persistence | REPOSITORY VERIFIED | PostgreSQL CI/restart tests pass |
| Production PostgreSQL | NOT YET VERIFIED | Live semantic proof still required |
| Ownership isolation | REPOSITORY VERIFIED | Authenticated ownership test passes |
| Audit-chain revisions | REPOSITORY VERIFIED | Revision/hash-chain hardening implemented and tested |
| Dashboard History | FUNCTIONAL / VERIFY LIVE | Server-backed history architecture exists; production record reopen proof pending |
| WordPress bridge | STAGED | Must be installed/configured/tested per approved target |
| OLLM native runtime | DEVELOPMENT TARGET | Architecture defined; do not treat as production model yet |
| GPT-6 Astra native connector | OPEN PR / NOT MAIN | PR #22 remains unmerged; do not represent as deployed |
| ACC + Codex engineering factory contract | DRAFT PR / NOT MAIN | PR #26 remains open and unmerged |
| OMOS-REF-0001 | IN PROGRESS | Issue #28 is the authoritative production-proof gate |

## OMOS-REF-0001 Production Gate

Authoritative tracking issue: **#28 — `OMOS-REF-0001: complete canonical production deployment proof`**.

Required production evidence includes:

1. Deploy `d97b8344...` or a documented descendant containing it.
2. Confirm `NODE_ENV=production` and `OMOS_VERSION=1.1.0`.
3. Configure non-placeholder `OMOS_API_KEYS`.
4. Configure production PostgreSQL `DATABASE_URL`.
5. Configure database SSL/pool settings.
6. Run production preflight successfully.
7. Apply migrations successfully.
8. Restart the production Node runtime.
9. Verify health and manifest endpoints.
10. Verify `/api/v1/persistence` returns `backend: postgresql`, `durable: true`, and `initialized: true`.
11. Execute one real browser `/ask` / Council reference run and capture its Decision ID.
12. Submit the server-side Human Gate disposition.
13. Reopen the Decision Record from history.
14. Restart/redeploy the runtime.
15. Reopen the exact same Decision ID after restart.
16. Verify owner isolation and revision/hash audit chain.
17. Record deployed SHA, runtime timestamp, Decision ID, record hash, database backend, and proof evidence.

**Certification rule:** OMOS-REF-0001 is PASS only when every applicable gate has production evidence.

## Open Pull-Request Hygiene

Several older PRs remain open even though portions of their architecture or functionality now exist on `main`. Do not merge them mechanically. Each should first be compared against current `main` and classified as one of:

- still required;
- partially superseded;
- fully superseded;
- requires rebase/reconciliation.

Highest-value current open PRs:

- **PR #22** — native GPT-6 Astra OMOS connector; requires provider-access/integration verification before merge.
- **PR #26** — ACC + Codex engineering factory contract; documentation/operating contract, still draft.
- **PR #24** — Sites navigation and gold-branding synchronization; verify whether current `main` already contains equivalent assets before merge.
- **PR #19** — Oru’Valen / OMOS integration; larger scope and should remain separate from the current production-proof milestone.

## Immediate Priorities

### P0 — Production proof

Complete Issue #28 before broadening the release claim.

### P0 — Strengthen automated live health semantics

The hourly runtime health workflow should validate semantic production state, not only HTTP status:

- manifest version equals repository package version;
- persistence backend equals `postgresql`;
- persistence `durable` equals `true`;
- persistence `initialized` equals `true`;
- persistence reports no initialization error.

### P1 — Execute OMOS-REF-0001

Run the complete live transaction:

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

For every provider presented as live, verify actual runtime configuration, model, request success, provenance, and graceful degraded behavior. Providers without verified credentials must remain labeled simulation/unconfigured.

### P1 — Reconcile open PR backlog

Close or rebase superseded PRs so `main` remains the single source of truth.

### P2 — WordPress bridge verification

Test the OMOS bridge independently on each approved OneGodian target instead of assuming one installation proves all targets.

### P2 — Commerce/entitlement execution

After OMOS-REF-0001 passes, complete the revenue transaction path:

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

**Repository:** `VERIFIED` for the persistence-hardening slice at `d97b8344...`.

**Live host:** `FUNCTIONAL / DEPLOYMENT PROOF PENDING`.

**OMOS 1.1.0 overall:** `FUNCTIONAL` with significant repository-verified components; **not yet `PRODUCTION_VERIFIED` on the canonical host**.

## Definitive Current Description

**OMOS™ is the central runtime and operating environment for the OneGodian Protocol™, OneGodian Algorithm™, and OHI™. It receives and distills human requests, evaluates alignment, coordinates model providers, performs governed synthesis, preserves human authorization, records auditable decisions, and exposes those capabilities through runtime, workspace, dashboard, and integration interfaces. As of September 10, 2026, the current repository release candidate has passed substantial PostgreSQL-backed CI and persistence hardening, while canonical production certification remains gated on live deployment, durable PostgreSQL proof, one complete reference run, restart survival, and recorded deployment evidence.**
