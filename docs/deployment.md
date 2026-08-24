# OMOS.OneGodian.com Production Deployment Runbook

Canonical host: `https://omos.onegodian.com`
Target runtime: `1.1.0`

## Current production state

Before deploying, verify the public runtime version. If production still reports `1.0.1`, the host has not yet pulled and restarted the `1.1.0` runtime.

## Required production environment

Configure production secrets and settings from `.env.example` in the hosting environment. Do not commit `.env` or live credentials.

Required deployment gates:

- `NODE_ENV=production`
- `OMOS_VERSION=1.1.0`
- `OMOS_CANONICAL_HOST=https://omos.onegodian.com`
- a non-placeholder `OMOS_API_KEYS` value
- a valid PostgreSQL `DATABASE_URL`
- `OMOS_DB_SSL` and `OMOS_DB_POOL_MAX` appropriate for the database provider

Provider API keys are optional for deployment. Any unconfigured model provider must remain explicitly identified as simulation mode.

## Exact host-side deployment sequence

From the existing OMOS application directory on the production host:

```bash
git fetch origin
git checkout main
git pull --ff-only origin main
npm install
npm run check
npm run preflight:production
npm run test:lifecycle
```

The preflight command intentionally fails if PostgreSQL persistence, canonical host metadata, runtime version, or core security settings are missing.

Then restart the existing Node service using the process supervisor configured by the hosting environment. Do not introduce a new supervisor merely for this deployment. Examples may include the hosting control panel, systemd, PM2, Docker, or another already-configured mechanism.

## Local-on-host verification after restart

With the runtime listening on its configured `PORT`:

```bash
OMOS_BASE_URL=http://127.0.0.1:3000 npm run smoke
OMOS_BASE_URL=http://127.0.0.1:3000 npm run smoke:pages
OMOS_BASE_URL=http://127.0.0.1:3000 npm run smoke:security
```

Adjust `127.0.0.1:3000` only if the production service uses a different internal port.

## Canonical public verification

After the reverse proxy is serving the restarted process:

```bash
OMOS_BASE_URL=https://omos.onegodian.com \
OMOS_EXPECTED_VERSION=1.1.0 \
npm run smoke:live
```

`smoke:live` requires all of the following:

- `/api/health` reports `status: ok` and version `1.1.0`
- `/api/manifest` reports version `1.1.0` and the canonical OMOS host
- `/api/v1/persistence` reports PostgreSQL with durable persistence enabled
- `/api/v1/providers` responds successfully
- `/`, `/ask/`, `/dashboard`, `/ohi-output-pipeline`, and `/sitemap.xml` resolve successfully

The normal security smoke test must also confirm that protected runtime and Council endpoints reject unauthenticated requests.

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

## Deployment boundary

A GitHub commit, successful CI job, or passing local test suite is not itself a production deployment. Deployment is complete only when the hosting environment has pulled the intended revision, restarted the runtime, and the canonical public smoke verification passes.

OMOS remains component-classified. A successful runtime deployment does not automatically promote every OMOS capability from Functional to Verified or Production.

## Rollback

If any post-deployment gate fails:

1. record the failed endpoint/test and current deployed commit;
2. restore the last known-good host revision;
3. restart the existing runtime service;
4. repeat health, manifest, persistence, page, and security verification;
5. do not reopen or relabel failed components as Production until the failure is resolved.
