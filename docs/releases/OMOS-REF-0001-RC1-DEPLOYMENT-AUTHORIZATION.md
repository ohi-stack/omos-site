# OMOS-REF-0001 RC1 Deployment Authorization

Date: 2026-09-10

Human authority explicitly instructed deployment of the resulting OMOS release candidate.

Authorized release candidate branch: `release/omos-ref-0001-rc1`
Authorized RC head at authorization time: `49b3005997707d3be980a5d9cfaead8ac00a4cd5`
Target branch: `main`
Target runtime: OMOS 1.1.0
Canonical host: `https://omos.onegodian.com`

## Preconditions verified in GitHub

- PR #44 is mergeable.
- OMOS Runtime CI run #63 completed successfully for RC head `49b3005997707d3be980a5d9cfaead8ac00a4cd5`.
- CI passed syntax checks, lifecycle regression, P0 Decision Record hardening, PostgreSQL migration and cross-process restart verification, runtime startup against durable PostgreSQL, smoke tests, page tests, authenticated Decision Record ownership, and the persistence endpoint check.

## Deployment boundary

This authorization permits promotion of RC1 through the repository and the existing production deployment path. It does not itself certify the canonical host as Production. Host-side pull/restart and public evidence gates remain required.

Production certification requires the canonical host to report the intended deployed SHA, OMOS version 1.1.0, initialized durable PostgreSQL, required public surfaces, and the separate OMOS-REF-0001 governed Decision Record restart-survival proof.
