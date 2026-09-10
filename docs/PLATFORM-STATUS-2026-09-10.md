# OMOS Platform Status — September 10, 2026

**Canonical repository:** `ohi-stack/omos-site`  
**Canonical host:** `https://omos.onegodian.com`  
**Runtime line:** OMOS 1.1.0 / Functional  
**Assessment rule:** A capability is counted as implemented only where it exists on the current `main` code line. Production claims require live-host evidence in addition to repository evidence.

## Current repository baseline

The current `main` line contains the production-persistence hardening merged through commit `d97b8344ebc644ef63cd994a1db9adfbbd61edf3` and later descendant commits. The hardening includes PostgreSQL Decision Record persistence, revision/hash chaining, owner isolation, migrations, restart verification tooling, production preflight enforcement, and CI coverage.

The repository also contains the four model provider adapters:

- OpenAI
- Anthropic
- Google Gemini
- xAI

The runtime exposes provider configuration status through `GET /api/v1/providers`, persistence status through `GET /api/v1/persistence`, and runtime/manifest status through the health and manifest endpoints.

## Implemented on current main

| Capability | Repository status | Production evidence status |
|---|---|---|
| Node/Express OMOS runtime | Implemented | Live host exists; exact deployed SHA still needs evidence capture |
| Shared OMOS UI / navigation | Implemented | Deployment must be checked against current main |
| Ask OMOS workspace | Implemented | Requires live end-to-end reference run proof |
| Layer 1 deterministic signal classification | Implemented / Functional | Controlled validation only |
| Alignment scoring and hard-gate signals | Implemented / Functional | Heuristic Functional-stage scoring; not factual verification |
| OpenAI adapter | Implemented | Live credential/model execution not certified here |
| Anthropic adapter | Implemented | Live credential/model execution not certified here |
| Gemini adapter | Implemented | Live credential/model execution not certified here |
| xAI adapter | Implemented | Live credential/model execution not certified here |
| Council independent outputs | Implemented | Live four-provider execution still requires host evidence |
| Cross-model review | Implemented | Provider failures may produce simulation fallback; live state must remain explicit |
| Governed synthesis | Implemented / Functional | Human review remains required |
| Human Gate | Implemented | Live authenticated disposition must be demonstrated |
| Decision Record persistence contract | Implemented | PostgreSQL must be proven configured on production host |
| Decision Record owner isolation | Implemented/tested in repo | Must be demonstrated against deployed runtime |
| Revision/hash chain | Implemented/tested in repo | Must survive live restart/redeploy |
| Dashboard / history surface | Implemented | Durable reopen after restart not yet certified |
| Provider status endpoint | Implemented | Reports configured/simulation state, not active provider connectivity |
| Persistence status endpoint | Implemented | Must report PostgreSQL + durable=true in production |
| WordPress bridge contract | Implemented/documented | Cross-site live sync still needs production verification |

## September 10 UI update

The next live-platform branch upgrades `/models` from a documentation placeholder into a Model Connectors Control Center. It consumes `/api/v1/providers` and `/api/v1/persistence` client-side and displays safe runtime configuration/readiness information without exposing credentials.

Branch: `feature/omos-20260910-live-platform-pass`

The connector page intentionally distinguishes **configured** from **actively connection-tested**. Current `main` exposes provider configuration status but does not yet expose dedicated per-provider connection-test endpoints.

## Immediate P0 production gate — OMOS-REF-0001

Issue #28 remains the controlling live-host certification task. It is not complete until the canonical Hostinger Node deployment proves all applicable gates, including:

1. Deployed revision is the intended current `main` descendant containing `d97b8344`.
2. `NODE_ENV=production` and non-placeholder OMOS API keys are configured.
3. A real PostgreSQL `DATABASE_URL` is configured with the required SSL/pool settings.
4. `npm run preflight:production` passes in the target environment.
5. Migrations complete successfully.
6. `/health` and `/api/health` pass.
7. `/api/v1/persistence` reports `backend: postgresql`, `durable: true`, and `initialized: true`.
8. One canonical Ask OMOS / Council run completes and records its Decision ID.
9. A server-side Human Gate disposition is recorded.
10. The Decision Record is reopened from history.
11. The runtime is restarted/redeployed.
12. The exact same Decision ID reopens after restart with owner isolation and revision/hash-chain integrity intact.
13. The deployed SHA, Decision ID, record hash, timestamps, backend, and evidence are recorded in Issue #28.

Until those live-host proofs exist, OMOS remains **Functional** rather than fully Production-certified.

## P1 — Council connector hardening

After OMOS-REF-0001 production proof, harden the Model Gateway:

- dedicated per-provider `test` endpoint;
- measured latency;
- normalized `CONNECTED / NOT_CONFIGURED / DEGRADED / UNAVAILABLE` states;
- timeout policy;
- retry/backoff policy;
- circuit breakers;
- rate-limit classification;
- normalized usage/token telemetry;
- provider request IDs and safe provenance;
- explicit no-silent-simulation policy for failed live calls;
- cost telemetry;
- credential-leak regression tests.

A provider being configured is not the same as a provider connection test passing.

## P1 — Website / product UX

The public product surfaces should converge on:

`INPUT → LAYER 1 → ALIGN → COUNCIL → SYNTHESIZE → RECORD → HISTORY`

The website should make four states visible at all times:

- runtime health;
- Council mode (`LIVE`, `HYBRID`, `DEGRADED`, `SIMULATION`);
- persistence backend/durability;
- human/verification state.

`/models` should be the human-facing connector control center, while `/api/v1/providers` remains the machine-readable provider-status endpoint.

## P2 — Verification and evidence

Council agreement must remain separate from factual verification. The next verification layer should add:

- source/evidence retrieval;
- claim-to-source mapping;
- evidence quality/confidence;
- contradiction resolution state;
- verification result schema enforcement;
- provenance retention;
- clear `VERIFIED / PARTIAL / UNVERIFIED / CONFLICTED` evidence states.

No model majority or unanimous Council result should automatically set a factual claim to verified.

## P2 — Operational data connectors

After model-provider hardening, expand the separate OMOS Data Connector Gateway for systems such as GitHub, Google Drive, WordPress, Stripe, Supabase, and QRV. Each data class must retain its source-of-record designation, provenance, permissions, timestamps, conflict policy, and write authorization.

## Repository governance

Issue #31 remains open for `main` branch protection and required OMOS Runtime CI checks. Production provenance is stronger when material changes require a PR, passing CI, and documented review rather than unrestricted direct pushes.

## Definition of the next milestone

**OMOS-REF-0001 passes only when one difficult browser-originated question traverses the complete governed workflow, receives human disposition, is durably persisted in production PostgreSQL, survives restart/redeploy, and can be reopened with its identity, ownership, and audit chain intact.**
