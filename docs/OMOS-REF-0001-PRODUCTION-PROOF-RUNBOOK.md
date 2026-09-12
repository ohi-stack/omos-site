# OMOS-REF-0001 Production Proof Runbook

**Milestone:** OMOS-REF-0001  
**Release target:** OMOS 1.1.0  
**Purpose:** Prove that one governed OMOS transaction is running on the canonical production host, persists durably in PostgreSQL, survives a runtime restart/redeployment, and can be reopened from history with the same Decision Record identity and hash.

## What this runbook certifies

A PASS proves the deployed OMOS revision can:

1. expose the expected runtime version and exact build SHA;
2. initialize durable PostgreSQL persistence;
3. create a governed Council run;
4. complete Layer 1, Alignment, Council Review, and Governed Synthesis;
5. stop at the Human Gate;
6. persist an explicit human disposition;
7. finalize and reopen the Decision Record;
8. list the same record in history;
9. prove a runtime restart/redeployment occurred; and
10. reopen the exact same record after that restart without losing or mutating it.

A PASS does **not** by itself certify every external model provider as live or factually verify model output. Provider live verification is a separate Model Gateway gate.

## Required production environment

The production host must supply these values at runtime. Never commit the secret values to GitHub.

```text
NODE_ENV=production
OMOS_VERSION=1.1.0
OMOS_CANONICAL_HOST=https://omos.onegodian.com
OMOS_API_KEYS=<hashed production key store>
DATABASE_URL=<production PostgreSQL connection URL>
OMOS_DB_SSL=true
OMOS_DB_POOL_MAX=5
OMOS_REQUIRE_DURABLE_DB=true
OMOS_ALLOW_MEMORY_PERSISTENCE=false
```

The operator performing the authenticated proof also needs the corresponding raw OMOS API key available only in that protected shell/session as:

```text
OMOS_PRODUCTION_KEY=<raw authorized OMOS API key>
```

## Gate 0 — Lock the deployment candidate

Before deploying, record the exact candidate SHA:

```bash
git rev-parse HEAD
```

Set it for the verification session:

```bash
export OMOS_EXPECTED_VERSION=1.1.0
export OMOS_EXPECTED_SHA=<exact 40-character deployed commit SHA>
export OMOS_BASE_URL=https://omos.onegodian.com
```

`OMOS_EXPECTED_SHA` is mandatory. Do not use a moving branch name as production evidence. The exact SHA is the evidence identity.

## Gate 1 — Production preflight

Run on the production runtime host with production environment variables loaded:

```bash
npm ci
npm run preflight:production
```

PASS requires:

- Node 20+;
- `NODE_ENV=production`;
- exact OMOS version and canonical host;
- non-placeholder OMOS API key configuration;
- valid PostgreSQL `DATABASE_URL`;
- successful database connectivity;
- successful idempotent migrations;
- persistence reported as PostgreSQL, durable, and initialized.

Any failure blocks restart/deployment promotion.

## Gate 2 — Deploy and resolve build provenance

Start/restart OMOS through the production process manager. `npm start` runs `scripts/write-build-metadata.js` before `server.js`, producing `/build.json` with runtime-resolved build provenance and `runtimeStartedAtUtc`.

Then run:

```bash
npm run smoke:live
```

with `OMOS_EXPECTED_SHA` set.

PASS requires:

- `/api/health` reports `1.1.0`;
- `/api/manifest` reports `1.1.0` and the canonical host;
- `/build.json` reports `service=omos-site`, `provenance=runtime-resolved`, the exact expected SHA, and a valid `runtimeStartedAtUtc`;
- `/api/v1/persistence` reports `backend=postgresql`, `durable=true`, `initialized=true`, and no error;
- provider status endpoint is valid;
- `/`, `/ask/`, `/dashboard`, `/ohi-output-pipeline`, and `/sitemap.xml` respond successfully.

## Gate 3 — Create OMOS-REF-0001

For the P0 persistence proof, simulation mode is acceptable because live-provider certification is a separate Model Gateway gate. To include configured providers, set `OMOS_REFERENCE_MODE=auto` instead.

```bash
export OMOS_PROOF_PHASE=create
export OMOS_REFERENCE_MODE=simulation
export OMOS_PROOF_OUTPUT=/tmp/omos-ref-0001-before-restart.json
npm run verify:production:reference-run
```

The verifier must prove:

- the exact deployed SHA matches `OMOS_EXPECTED_SHA`;
- the run is created under the authenticated owner;
- stages 1–5 are complete;
- stage 6 is `NEEDS_REVIEW` before authorization;
- stage 7 remains pending before authorization;
- an explicit `APPROVED` Human Gate disposition is persisted;
- the finalized record reaches stage 7;
- the record has revision `>= 2` and a valid SHA-256 record hash;
- immediate authenticated reopen succeeds;
- history contains the same request ID.

Capture from the PASS JSON:

```text
requestId
recordHash
deployedSha
runtimeStartedAtUtc
revision
humanDecisionAtUtc
```

Do not lose `requestId`, `recordHash`, or `runtimeStartedAtUtc`; all three are required for the restart proof.

## Gate 4 — Restart or redeploy the exact revision

Restart the production Node process or redeploy the exact same commit SHA. Do not change application code between the before-restart and after-restart proof phases.

After the process returns healthy, run:

```bash
npm run smoke:live
```

again with the same `OMOS_EXPECTED_SHA`.

The post-restart `/build.json` must retain the same `buildSha` while reporting a later `runtimeStartedAtUtc`.

## Gate 5 — Reopen the exact Decision Record after restart

```bash
export OMOS_PROOF_PHASE=reopen
export OMOS_REFERENCE_RUN_ID=<requestId from Gate 3>
export OMOS_REFERENCE_RECORD_HASH=<recordHash from Gate 3>
export OMOS_REFERENCE_RUNTIME_STARTED_AT=<runtimeStartedAtUtc from Gate 3>
export OMOS_PROOF_OUTPUT=/tmp/omos-ref-0001-after-restart.json
npm run verify:production:reference-run
```

The three `OMOS_REFERENCE_*` evidence inputs above are mandatory. The verifier will not issue a PASS if any are omitted.

PASS requires:

- the live build SHA is still the exact `OMOS_EXPECTED_SHA`;
- the new `runtimeStartedAtUtc` is strictly later than the pre-restart timestamp captured in Gate 3;
- the exact Decision Record is returned after restart;
- the request ID is unchanged;
- the Human Gate decision is still `APPROVED`;
- the final Decision Record stage remains complete;
- the record hash exactly matches the mandatory pre-restart hash;
- the record remains present in history;
- live runtime version and PostgreSQL durability gates still pass.

## Evidence record

The production Engineering Record should retain the following non-secret evidence:

| Field | Required |
|---|---|
| Milestone | `OMOS-REF-0001` |
| Environment | production |
| Canonical host | `https://omos.onegodian.com` |
| OMOS version | `1.1.0` |
| Deployed SHA | exact 40-character Git SHA |
| Pre-restart runtime start timestamp | UTC |
| Post-restart runtime start timestamp | later UTC value |
| Persistence backend | PostgreSQL |
| Persistence durable | `true` |
| Persistence initialized | `true` |
| Decision request ID | exact ID |
| Pre-restart record hash | exact hash |
| Post-restart record hash | exact same hash |
| Human disposition | `APPROVED` or `REJECTED` as applicable |
| Immediate reopen | PASS |
| Restart observed | PASS |
| Post-restart reopen | PASS |
| History retrieval | PASS |
| Live smoke | PASS |
| Production preflight | PASS |
| Final result | PASS / FAIL |

Do not place `DATABASE_URL`, raw `OMOS_PRODUCTION_KEY`, provider API keys, or other credentials in the Engineering Record.

## Certification rule

OMOS-REF-0001 is **PASS** only if every production gate above is evidenced against one exact deployed SHA, the runtime start timestamp proves a restart/redeployment occurred, and the same Decision Record survives that restart/redeployment with an unchanged record hash.

If the runtime uses memory persistence, the deployed SHA is unresolved or mismatched, the runtime restart cannot be proven, the record disappears, the hash changes unexpectedly, or the production host is still serving an older version, the result is **FAIL / NOT PRODUCTION-VERIFIED**.
