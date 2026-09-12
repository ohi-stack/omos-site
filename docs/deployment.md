# OMOS.OneGodian.com Production Deployment Runbook

Canonical host: `https://omos.onegodian.com`  
Target runtime: `1.1.0`

## Production rule

Repository readiness, merge state, deployment state, and production verification are separate evidence states. A commit is not a deployment, and a successful deployment is not by itself proof that every connector or OMOS capability is production-verified.

Before deploying, verify the public runtime version and build provenance. If production still reports `1.0.1`, lacks an exact build SHA, or reports non-durable persistence, the host has not yet reached the current `1.1.0` production baseline.

## Required production environment

Configure production secrets and settings from `.env.example` in the hosting environment. Do not commit `.env` or live credentials.

Required deployment gates:

- `NODE_ENV=production`
- `OMOS_VERSION=1.1.0`
- `OMOS_CANONICAL_HOST=https://omos.onegodian.com`
- a non-placeholder `OMOS_API_KEYS` value
- a valid PostgreSQL `DATABASE_URL`
- `OMOS_DB_SSL` and `OMOS_DB_POOL_MAX` appropriate for the database provider
- `OMOS_REQUIRE_DURABLE_DB=true`
- `OMOS_ALLOW_MEMORY_PERSISTENCE=false`
- `OMOS_BUILD_SHA=<exact deployed 40-character Git SHA>` when the host does not retain `.git` metadata

Provider API keys are optional for the base runtime deployment. Any unconfigured model provider must remain explicitly identified as simulation mode. A configured key is not proof of a successful live provider call.

## Exact host-side deployment sequence

From the existing OMOS application directory on the production host:

```bash
git fetch origin
git checkout main
git pull --ff-only origin main
export OMOS_BUILD_SHA=$(git rev-parse HEAD)
npm ci
npm run check
npm run test:openai-astra
npm run test:model-gateway
npm run test:connections
npm run test:lifecycle
npm run test:decision-record
npm run verify:persistence:restart
npm run preflight:production
```

`preflight:production` intentionally fails if PostgreSQL persistence, canonical host metadata, runtime version, or core security settings are missing. The connector tests prove repository/runtime contracts without making a production claim about external services.

Then restart the existing Node service using the process supervisor already configured by the hosting environment. Do not introduce a new supervisor merely for this deployment. Examples may include the hosting control panel, systemd, PM2, Docker, or another already-configured mechanism.

## Local-on-host verification after restart

With the runtime listening on its configured `PORT`:

```bash
OMOS_BASE_URL=http://127.0.0.1:3000 npm run smoke
OMOS_BASE_URL=http://127.0.0.1:3000 npm run smoke:pages
OMOS_BASE_URL=http://127.0.0.1:3000 npm run smoke:security
npm run connections:status
```

Adjust `127.0.0.1:3000` only if the production service uses a different internal port.

`connections:status` is contract/configuration evidence. `connections:probe` should be run only for explicitly configured external MCP targets because it performs network requests. An empty probe target set must not be reported as PASS evidence.

## Canonical public verification

After the reverse proxy is serving the restarted process:

```bash
export OMOS_BASE_URL=https://omos.onegodian.com
export OMOS_EXPECTED_VERSION=1.1.0
export OMOS_EXPECTED_SHA=$(git rev-parse HEAD)
npm run smoke:live
```

`smoke:live` requires all of the following:

- `/api/health` reports `status: ok` and version `1.1.0`
- `/api/manifest` reports version `1.1.0` and the canonical OMOS host
- `/build.json` reports runtime-resolved provenance and the exact deployed SHA
- `/api/v1/persistence` reports PostgreSQL with `durable=true` and `initialized=true`
- `/api/v1/providers` responds successfully
- `/`, `/ask/`, `/dashboard`, `/ohi-output-pipeline`, and `/sitemap.xml` resolve successfully

The normal security smoke test must also confirm that protected runtime and Council endpoints reject unauthenticated requests.

## OMOS-REF-0001 production proof

After public smoke verification succeeds, follow `docs/OMOS-REF-0001-PRODUCTION-PROOF-RUNBOOK.md` and run:

```bash
export OMOS_PROOF_PHASE=create
export OMOS_REFERENCE_MODE=simulation
export OMOS_PRODUCTION_KEY=<authorized raw key held only in the protected shell>
npm run verify:production:reference-run
```

Capture the emitted `requestId`, `recordHash`, and `runtimeStartedAtUtc`. Restart or redeploy the **same SHA**, then run the verifier again with `OMOS_PROOF_PHASE=reopen` and those exact evidence values. OMOS-REF-0001 may be marked PASS only if the runtime start timestamp advances and the same Decision Record reopens from PostgreSQL with the same record hash.

## Model Gateway production verification

The four provider adapters share the normalized contract tested by `npm run test:model-gateway`. That establishes `CONTRACT_VERIFIED`, not `LIVE_VERIFIED`.

A provider may be represented as `LIVE_VERIFIED` only after a controlled call from the deployed OMOS environment proves the configured credential/model works and the resulting provider, connector, model, request ID where available, latency, status, usage metadata where available, and `simulated:false` provenance are persisted and reopen correctly in a Decision Record. See `docs/MODEL-GATEWAY-PRODUCTION-TEST.md`.

## MCP and Connection & Adaptation production verification

`npm run test:connections` establishes the OneGodian MCP / Connection & Adaptation contract in repository scope. A named external connector still requires live endpoint evidence, authentication without secret disclosure, discovery/list success, authorization enforcement for consequential operations, audit/provenance persistence, error/timeout behavior, and domain-specific verification before it is labeled Production.

## PostgreSQL persistence

OMOS Decision Records use PostgreSQL when `DATABASE_URL` is configured. The runtime creates/maintains `omos_decision_records`, and the canonical SQL definition is retained at:

```text
db/migrations/001_omos_decision_records.sql
```

Production must not be represented as having durable Decision Record history while `/api/v1/persistence` reports the in-memory fallback.

## Runtime requirements

- Node.js 20+
- HTTPS/TLS at the public edge
- reverse proxy to the configured `PORT`
- an existing process restart/supervision mechanism
- production secrets stored outside Git
- PostgreSQL for durable Decision Records
- operational logs retained according to the hosting policy

## Rollback

If any post-deployment gate fails:

1. record the failed endpoint/test and current deployed commit;
2. restore the last known-good host revision;
3. restart the existing runtime service;
4. repeat health, manifest, persistence, page, security, and exact-SHA verification;
5. preserve the failed evidence rather than relabeling it as PASS;
6. do not represent failed components as Production until the failure is resolved and retested.
