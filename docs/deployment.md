# OMOS.OneGodian.com Production Deployment Runbook

Canonical host: `https://omos.onegodian.com`

## Pre-deployment gates

1. Configure production environment variables from `.env.example` without committing secrets.
2. Confirm `NODE_ENV=production` and `OMOS_CANONICAL_HOST=https://omos.onegodian.com`.
3. Install dependencies with `npm install`.
4. Run `npm run check`.
5. Start the runtime in the target environment and run `npm run smoke` against it.
6. Confirm `/api/health`, `/api/manifest`, `/api/v1/providers`, and `/api/v1/persistence` reflect the intended environment.
7. Confirm durable Decision Record persistence is configured before representing persistence as production-grade.

## Runtime requirements

- Node.js 20+
- HTTPS/TLS at the public edge
- Reverse proxy to the configured `PORT`
- Process restart supervision supplied by the hosting environment
- Production secrets stored in the host secret/environment manager
- Logs retained according to the host's operational policy

## Canonical verification

After deployment verify:

- `GET /api/health` returns HTTP 200 and `status: ok`.
- `GET /api/manifest` returns canonical host `https://omos.onegodian.com`.
- Every public route in the manifest returns HTTP 200.
- `POST /process` and protected Council endpoints reject missing/invalid `x-omos-key` credentials.
- `GET /sitemap.xml` returns the locked public sitemap.
- OneGodian.com, OneGodian.org, and QuantumOHI.com plugin clients can read the public manifest endpoints.

## Deployment boundary

A successful GitHub commit is not itself a production deployment. Production status requires the hosting environment to pull/build/restart the runtime and the post-deployment verification above to pass.

## Rollback

If verification fails, restore the last known-good deployment revision, restart the runtime, and repeat health/manifest/smoke verification before reopening public traffic.
