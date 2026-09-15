# OMOS Production Deployment Handoff — 2026-09-15

## Target

Canonical host: `https://omos.onegodian.com`  
Repository: `ohi-stack/omos-site`  
Branch: `main`  
Runtime target: `1.1.0`  
Approved current-main baseline at handoff creation: `27d3416a11725858e97df0a09cb668fb168b062b`

## Current observed production state

The scheduled OMOS Runtime Health workflow reached the canonical host on September 15, 2026 and observed runtime version `1.0.1` while the repository target is `1.1.0`.

This means:

- DNS/TLS/application reachability exists;
- the canonical host is still serving an older runtime revision;
- repository readiness and production deployment are not yet aligned;
- no Production or OMOS-REF-0001 PASS claim should be made until live evidence passes.

## Existing-host deployment sequence

Run this only in the **existing OMOS production application directory** already serving `omos.onegodian.com`. Do not create a second hosting stack or replace the existing process supervisor solely for this release.

```bash
git fetch origin
git checkout main
git pull --ff-only origin main
git rev-parse HEAD
npm install
npm run check
npm run preflight:production
```

Confirm the checked-out SHA is the approved current main revision or a documented descendant that passed CI.

Then run migrations using the repository's production migration procedure and restart the existing Node service with the supervisor already configured on the Hostinger environment.

## Required environment contract

Do not commit or paste secret values into GitHub issues or documentation.

Production must provide valid values for:

```text
NODE_ENV=production
OMOS_VERSION=1.1.0
OMOS_CANONICAL_HOST=https://omos.onegodian.com
OMOS_BUILD_SHA=<exact deployed git SHA>
OMOS_API_KEYS=<non-placeholder hashed key configuration>
DATABASE_URL=<production PostgreSQL URL>
OMOS_DB_SSL=<deployment-correct value>
OMOS_DB_POOL_MAX=<deployment-correct value; baseline 5 unless evidence supports another value>
OMOS_REQUIRE_DURABLE_DB=true
```

Memory fallback must not be used for production Decision Records.

## Post-restart evidence

Verify the public runtime after restart:

```text
/api/health
/api/manifest
/api/v1/persistence
/api/v1/providers
/build.json
/
/ask/
/dashboard
/reference-run
/models
/docs
```

Required evidence:

- runtime version is `1.1.0`;
- deployed/build SHA matches the approved source revision;
- persistence reports PostgreSQL, durable and initialized;
- provider status payload resolves without exposing credentials;
- required public surfaces resolve;
- protected APIs reject unauthenticated access;
- production preflight passes with no fallback warning.

## OMOS-REF-0001 certification

After source/version parity is established:

1. submit one governed Ask OMOS/Council run;
2. record the Decision ID;
3. complete the server-side Human Gate disposition;
4. reopen the Decision Record from History;
5. record its revision and record hash;
6. restart/redeploy the runtime;
7. reopen the exact same Decision ID;
8. verify ownership isolation, Human Gate disposition, revision lineage and hash chain remain intact;
9. attach the evidence to the active production deployment record.

Only after those gates pass should the tested deployment be represented as Production-certified.

## Source-of-truth rule

`ohi-stack/omos-site/main` is the canonical OMOS runtime/site source. AI Studio mirrors, OLLM, Protocol, ACC/Oru, OneGodian API and other related repositories contribute scoped components and specifications but do not supersede the canonical OMOS runtime source.
