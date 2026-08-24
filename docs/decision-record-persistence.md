# OMOS Decision Record Persistence

## Production objective

OMOS Decision Records must survive process restart, redeployment, and browser-session loss.

The runtime now supports PostgreSQL-backed persistence for:

- Council run records
- Layer 1 results
- Alignment state
- Round 1 provider outputs
- Cross-model reviews
- Governed synthesis
- Human Gate disposition
- Output and record hashes
- Runtime timestamps and status

## Configuration

Set a production PostgreSQL connection string:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
OMOS_DB_SSL=true
OMOS_DB_POOL_MAX=5
```

When `DATABASE_URL` is configured, OMOS reports:

```json
{
  "backend": "postgresql",
  "durable": true
}
```

When it is not configured, OMOS intentionally falls back to bounded process memory and reports:

```json
{
  "backend": "memory",
  "durable": false
}
```

The memory fallback is suitable for local development and controlled validation only. It must not be represented as restart-safe persistence.

## Schema

Canonical migration:

`db/migrations/001_omos_decision_records.sql`

The runtime also performs an idempotent `CREATE TABLE IF NOT EXISTS` before the first PostgreSQL write so a newly configured environment can initialize safely.

## Human Gate API

Authenticated endpoint:

```http
POST /api/v1/council/runs/:id/human-decision
x-omos-key: <authorized key>
Content-Type: application/json
```

Body:

```json
{
  "decision": "APPROVED",
  "comment": "Accepted as the disposition of this controlled run."
}
```

Allowed decisions:

- `APPROVED`
- `REJECTED`

A Human Gate decision does not establish factual verification. It records the authorized human disposition of the governed output.

## History and reopen APIs

```http
GET /api/v1/council/runs
GET /api/v1/council/runs/:id
```

Both require `x-omos-key` and read from PostgreSQL when configured.

## Persistence status

Public operational-status endpoint:

```http
GET /api/v1/persistence
```

This endpoint exposes only persistence mode and health metadata. It does not disclose credentials or database connection details.

## Definition of done

Durable persistence is production-ready only when:

1. `DATABASE_URL` is configured in the deployment environment.
2. `/api/v1/persistence` reports `durable: true`.
3. A Council run is created and receives a Human Gate disposition.
4. The process is restarted or redeployed.
5. `GET /api/v1/council/runs/:id` returns the same Decision Record.
6. The Human Gate decision, hashes, stage states, and timestamps remain intact.
7. No model-consensus field is automatically converted into factual-verification status.

## Security boundary

Database credentials remain server-side environment secrets. They must never be exposed in browser JavaScript, WordPress shortcodes, public manifests, repository files, or client-visible API responses.