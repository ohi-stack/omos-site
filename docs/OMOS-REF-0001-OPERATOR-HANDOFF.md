# OMOS-REF-0001 Production Operator Handoff

Date: 2026-09-10
Canonical host: `https://omos.onegodian.com`
Certification issue: `#28`

This handoff contains only the steps that must occur in the actual production hosting environment. Repository engineering for P0 Decision Record hardening is already merged.

## Required deployed environment

```text
NODE_ENV=production
OMOS_VERSION=1.1.0
OMOS_CANONICAL_HOST=https://omos.onegodian.com
OMOS_API_KEYS=<non-placeholder production values>
DATABASE_URL=<production PostgreSQL URL>
OMOS_DB_SSL=<deployment-correct value>
OMOS_DB_POOL_MAX=5
OMOS_REQUIRE_DURABLE_DB=true
OMOS_ALLOW_MEMORY_PERSISTENCE=false
OMOS_BUILD_SHA=<exact deployed GitHub SHA when .git metadata is unavailable>
```

Do not paste real credentials into GitHub issues, logs, screenshots, or repository files.

## Deployment sequence

1. Deploy the intended current `main` revision or a documented descendant containing `d97b8344ebc644ef63cd994a1db9adfbbd61edf3`.
2. Set `OMOS_BUILD_SHA` to that exact SHA if the host does not retain `.git` metadata.
3. Run `npm install` / `npm ci` according to the established Hostinger deployment procedure.
4. Run `npm run check`.
5. Run `npm run preflight:production` and stop on any failure.
6. Start/restart the canonical Node runtime.
7. Run `npm run smoke:live` against `https://omos.onegodian.com` with `OMOS_EXPECTED_SHA` set to the deployed SHA.
8. Confirm `/build.json` reports the same SHA.
9. Confirm `/api/v1/persistence` reports PostgreSQL, durable, initialized, and no error.
10. Record the evidence on Issue #28 without exposing secrets.

## Governed Decision Record proof

After source parity and PostgreSQL are proven:

1. Create one canonical governed Council run through Ask OMOS.
2. Record the generated Decision ID.
3. Submit the server-side Human Gate disposition.
4. Reopen the record from Dashboard History/API.
5. Record its current record hash/revision.
6. Restart/redeploy the canonical runtime.
7. Reopen the exact same Decision ID.
8. Verify the human disposition, owner isolation, revision/hash audit chain, and PostgreSQL persistence survived.
9. Add Decision ID, deployed SHA, timestamps, and non-secret verification evidence to Issue #28.

## PASS rule

OMOS-REF-0001 is **PASS** only when the exact deployed source revision and the restart-survival of a governed Decision Record are both proven on the canonical host.

A green repository CI run, HTTP 200 responses, or a matching semantic version is not sufficient by itself.
