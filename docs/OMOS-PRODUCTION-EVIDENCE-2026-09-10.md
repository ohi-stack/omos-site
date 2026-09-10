# OMOS Production Evidence Standard — 2026-09-10

Repository: `ohi-stack/omos-site`
Canonical host: `https://omos.onegodian.com`
Runtime version target: `1.1.0`
Persistence hardening baseline: `d97b8344ebc644ef63cd994a1db9adfbbd61edf3`
Certification issue: `#28 — OMOS-REF-0001: complete canonical production deployment proof`

## Purpose

A live URL, successful page load, green repository CI run, or matching semantic version is not sufficient by itself to prove that the intended OMOS revision is running in production.

OMOS production evidence must identify the deployed source revision and verify runtime behavior against the canonical host.

## Runtime build provenance

`npm start` writes `public/build.json` before starting the Node runtime.

The build record contains:

- service identifier
- OMOS version
- full Git commit SHA
- short Git commit SHA
- canonical host
- runtime start timestamp in UTC
- provenance resolution status

The commit SHA is resolved in this order:

1. `OMOS_BUILD_SHA`
2. `GITHUB_SHA`
3. `SOURCE_COMMIT`
4. `COMMIT_SHA`
5. local `git rev-parse HEAD`
6. `unknown` when none of the above are available

A production certification run must not accept `unknown` as source proof.

If Hostinger strips `.git` metadata during deployment, the operator must set `OMOS_BUILD_SHA` to the exact deployed GitHub commit SHA.

## Canonical live evidence gate

`scripts/live-smoke.js` validates all of the following:

1. `/api/health` is healthy and reports the expected OMOS version.
2. `/api/manifest` reports the expected version and canonical host.
3. `/build.json` reports the OMOS service, expected version, a runtime-resolved commit SHA, and—when supplied—the exact expected Git SHA.
4. `/api/v1/persistence` reports:
   - `backend: postgresql`
   - `durable: true`
   - `initialized: true`
   - no persistence error
5. `/api/v1/providers` returns structured provider status.
6. Required public surfaces remain reachable:
   - `/`
   - `/ask/`
   - `/dashboard`
   - `/ohi-output-pipeline`
   - `/sitemap.xml`

Successful execution prints a machine-readable evidence summary containing the timestamp, canonical host, version, deployed SHA, persistence status, and provider status.

## Automated canonical-host comparison

`.github/workflows/runtime-health.yml` runs hourly and may also be triggered manually.

The workflow compares the canonical host against the exact current default-branch SHA using:

- `OMOS_EXPECTED_VERSION=1.1.0`
- `OMOS_EXPECTED_SHA=${{ github.sha }}`

The workflow uploads the evidence output as a retained GitHub Actions artifact.

If the canonical host is not aligned with the current main revision, the workflow opens a single production-alignment issue instead of treating a simple HTTP 200 as deployment proof.

When the exact current main revision passes the automated gate, the workflow closes the mismatch issue and records a deduplicated production-evidence candidate on Issue #28.

## OMOS-REF-0001 boundary

Passing this automated gate establishes that the intended runtime revision is serving the canonical host with initialized durable PostgreSQL and the required public/runtime surfaces.

It does **not**, by itself, prove the final restart-survival requirement for a specific governed Decision Record.

OMOS-REF-0001 remains incomplete until a governed run is created, receives the server-side Human Gate disposition, is reopened from history, the runtime is restarted/redeployed, and the exact same Decision Record is reopened with its audit chain intact.

## Operational rule

**Merge is not deployment. Deployment is not production proof. Production proof requires source parity plus behavioral evidence.**
