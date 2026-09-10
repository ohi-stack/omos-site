# OMOS-REF-0001 RC1

**Release candidate:** `release/omos-ref-0001-rc1`  
**Cut from main:** `e7b4605d8e630093f3383008a715256a31e84d6a`  
**Persistence reconciliation commit:** `d97b8344ebc644ef63cd994a1db9adfbbd61edf3`  
**Source work:** PR #25 — P0: Harden Decision Record production persistence and ownership  
**PR #25 source head:** `b64c9846b59b47662467f157f30e4bd99abce877`  
**Status:** Release candidate / not yet production-certified

## Included P0 persistence contract

RC1 includes the persistence hardening reconciled from PR #25 into the current mainline:

- PostgreSQL required for production Decision Records.
- Idempotent schema migration and ownership/audit-chain migration.
- Append-only Decision Record revision history.
- SHA-256 record chaining using current and previous record hashes.
- Authenticated owner isolation for record reads/history/human decisions.
- Ordered Human Gate → Decision Record state transition enforcement.
- Cross-process PostgreSQL restart verification.
- Production preflight requiring database connectivity and initialized migrations.
- CI PostgreSQL service and durable persistence checks.
- Regression coverage for ordered transitions, human decisions, owner isolation, and audit-chain integrity.

## Reconciliation decision

PR #25 was closed without a merge commit after its P0 work was reconciled directly into the current mainline in commit `d97b8344...`. The release candidate is therefore cut from current `main` rather than from the stale PR branch. This preserves subsequent mainline production-evidence and engineering-governance work while retaining the reconciled persistence implementation.

## Required production gates

This release candidate MUST NOT be represented as Production until all applicable gates pass in the target environment:

1. Configure a real production `DATABASE_URL`.
2. Run `npm run preflight:production` successfully.
3. Confirm `/api/v1/persistence` reports PostgreSQL with `durable: true`.
4. Run `npm run verify:persistence:restart` successfully against the production-class PostgreSQL backend.
5. Create a real Ask OMOS run with a unique Decision ID.
6. Persist a Human Gate disposition server-side.
7. Reopen the same Decision Record from Dashboard History.
8. Restart/redeploy the runtime.
9. Reopen the same Decision ID after restart with lineage and disposition intact.
10. Record the exact deployed commit SHA and live verification evidence.

## Certification rule

A merged branch, successful deployment, or passing model output is not by itself production proof. RC1 becomes production-certified only when the durable end-to-end OMOS-REF-0001 evidence set is complete and repeatable.