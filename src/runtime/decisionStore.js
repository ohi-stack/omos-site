const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const MEMORY_STORE = new Map();
const MEMORY_REVISIONS = new Map();
const MAX_MEMORY_RUNS = 200;

let pool = null;
let initialized = false;
let initializationError = null;

function databaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function durableRequired() {
  return process.env.OMOS_REQUIRE_DURABLE_DB === 'true' || (process.env.NODE_ENV === 'production' && process.env.OMOS_ALLOW_MEMORY_PERSISTENCE !== 'true');
}

function requireOwner(ownerId) {
  const normalized = String(ownerId || '').trim();
  if (!normalized) throw new Error('owner_required');
  return normalized;
}

function getPool() {
  if (!databaseConfigured()) return null;
  if (pool) return pool;
  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.OMOS_DB_SSL === 'false' ? false : { rejectUnauthorized: false },
    max: Number(process.env.OMOS_DB_POOL_MAX || 5),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  });
  pool.on('error', (error) => {
    initializationError = error;
    console.error('OMOS decision-store pool error:', error.message);
  });
  return pool;
}

function canonicalRecord(record) {
  const copy = JSON.parse(JSON.stringify(record || {}));
  delete copy.recordHash;
  delete copy.previousRecordHash;
  delete copy.revision;
  delete copy.audit;
  delete copy.persistence;
  return copy;
}

function calculateRecordHash(record, revision, previousRecordHash) {
  return `sha256:${crypto.createHash('sha256').update(JSON.stringify({
    revision,
    previousRecordHash: previousRecordHash || null,
    record: canonicalRecord(record)
  })).digest('hex')}`;
}

async function applyMigrations(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS omos_schema_migrations (
      migration_id TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const migrationDir = path.join(__dirname, '..', '..', 'db', 'migrations');
  const files = fs.readdirSync(migrationDir).filter((name) => /^\d+.*\.sql$/.test(name)).sort();
  for (const file of files) {
    const already = await db.query('SELECT 1 FROM omos_schema_migrations WHERE migration_id = $1', [file]);
    if (already.rowCount) continue;
    const sql = fs.readFileSync(path.join(migrationDir, file), 'utf8');
    await db.query('BEGIN');
    try {
      await db.query(sql);
      await db.query('INSERT INTO omos_schema_migrations (migration_id) VALUES ($1)', [file]);
      await db.query('COMMIT');
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  }
}

async function initializePersistence() {
  if (!databaseConfigured()) {
    if (durableRequired()) throw new Error('durable_postgresql_required');
    initialized = true;
    return getPersistenceStatus();
  }
  const db = getPool();
  try {
    await db.query('SELECT 1');
    await applyMigrations(db);
    initialized = true;
    initializationError = null;
    return getPersistenceStatus();
  } catch (error) {
    initializationError = error;
    throw error;
  }
}

async function ensureSchema() {
  if (!initialized) await initializePersistence();
}

function remember(record) {
  MEMORY_STORE.set(record.requestId, record);
  while (MEMORY_STORE.size > MAX_MEMORY_RUNS) {
    const oldest = MEMORY_STORE.keys().next().value;
    MEMORY_STORE.delete(oldest);
    MEMORY_REVISIONS.delete(oldest);
  }
}

function summary(record) {
  return {
    requestId: record.requestId,
    mode: record.mode,
    currentStage: record.currentStage,
    outputStatus: record.outputStatus,
    verificationStatus: record.verificationStatus,
    humanDecision: record.humanGate?.decision || null,
    startedAt: record.startedAt,
    completedAt: record.completedAt,
    liveProviders: record.liveProviders || [],
    simulationProviders: record.simulationProviders || [],
    revision: record.revision || 1,
    recordHash: record.recordHash || null
  };
}

function applyAuditMetadata(record, revision, previousRecordHash) {
  record.revision = revision;
  record.previousRecordHash = previousRecordHash || null;
  record.recordHash = calculateRecordHash(record, revision, previousRecordHash);
  record.audit = {
    chainVersion: '1.0',
    revision,
    previousRecordHash: previousRecordHash || null,
    recordHash: record.recordHash
  };
  return record;
}

async function saveRecord(record, ownerId) {
  const owner = requireOwner(ownerId || record.ownerId);
  record.ownerId = owner;

  if (!databaseConfigured()) {
    if (durableRequired()) throw new Error('durable_postgresql_required');
    const revisions = MEMORY_REVISIONS.get(record.requestId) || [];
    const previous = revisions[revisions.length - 1] || null;
    applyAuditMetadata(record, previous ? previous.revision + 1 : 1, previous?.recordHash || null);
    revisions.push(JSON.parse(JSON.stringify(record)));
    MEMORY_REVISIONS.set(record.requestId, revisions);
    remember(record);
    return record;
  }

  await ensureSchema();
  const db = getPool();
  await db.query('BEGIN');
  try {
    const current = await db.query(
      'SELECT owner_id, revision, record_hash FROM omos_decision_records WHERE request_id = $1 FOR UPDATE',
      [record.requestId]
    );
    const existing = current.rows[0] || null;
    if (existing && existing.owner_id !== owner) throw new Error('record_owner_mismatch');

    const revision = existing ? Number(existing.revision) + 1 : 1;
    const previousRecordHash = existing?.record_hash || null;
    applyAuditMetadata(record, revision, previousRecordHash);

    await db.query(
      `INSERT INTO omos_decision_record_revisions
        (request_id, revision, owner_id, record_hash, previous_record_hash, record)
       VALUES ($1,$2,$3,$4,$5,$6::jsonb)`,
      [record.requestId, revision, owner, record.recordHash, previousRecordHash, JSON.stringify(record)]
    );

    await db.query(
      `INSERT INTO omos_decision_records
        (request_id, owner_id, mode, output_status, verification_status, human_decision, started_at, completed_at, updated_at, revision, record_hash, previous_record_hash, record)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),$9,$10,$11,$12::jsonb)
       ON CONFLICT (request_id) DO UPDATE SET
         owner_id = EXCLUDED.owner_id,
         mode = EXCLUDED.mode,
         output_status = EXCLUDED.output_status,
         verification_status = EXCLUDED.verification_status,
         human_decision = EXCLUDED.human_decision,
         completed_at = EXCLUDED.completed_at,
         updated_at = NOW(),
         revision = EXCLUDED.revision,
         record_hash = EXCLUDED.record_hash,
         previous_record_hash = EXCLUDED.previous_record_hash,
         record = EXCLUDED.record`,
      [
        record.requestId,
        owner,
        record.mode || 'unknown',
        record.outputStatus || 'UNKNOWN',
        record.verificationStatus || null,
        record.humanGate?.decision || null,
        record.startedAt || new Date().toISOString(),
        record.completedAt || null,
        revision,
        record.recordHash,
        previousRecordHash,
        JSON.stringify(record)
      ]
    );
    await db.query('COMMIT');
    remember(record);
    return record;
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
}

async function getRecord(requestId, ownerId) {
  const owner = requireOwner(ownerId);
  if (databaseConfigured()) {
    await ensureSchema();
    const result = await getPool().query(
      'SELECT record FROM omos_decision_records WHERE request_id = $1 AND owner_id = $2 LIMIT 1',
      [requestId, owner]
    );
    if (result.rows[0]?.record) {
      const record = result.rows[0].record;
      remember(record);
      return record;
    }
    return null;
  }
  if (durableRequired()) throw new Error('durable_postgresql_required');
  const record = MEMORY_STORE.get(requestId) || null;
  return record?.ownerId === owner ? record : null;
}

async function listRecords(limit = 20, ownerId) {
  const owner = requireOwner(ownerId);
  const safeLimit = Math.max(1, Math.min(Number(limit) || 20, 100));
  if (databaseConfigured()) {
    await ensureSchema();
    const result = await getPool().query(
      'SELECT record FROM omos_decision_records WHERE owner_id = $1 ORDER BY updated_at DESC LIMIT $2',
      [owner, safeLimit]
    );
    return result.rows.map((row) => row.record);
  }
  if (durableRequired()) throw new Error('durable_postgresql_required');
  return [...MEMORY_STORE.values()].filter((record) => record.ownerId === owner).slice(-safeLimit).reverse();
}

async function verifyAuditChain(requestId, ownerId) {
  const owner = requireOwner(ownerId);
  let revisions;
  if (databaseConfigured()) {
    await ensureSchema();
    const result = await getPool().query(
      `SELECT revision, owner_id, record_hash, previous_record_hash, record
       FROM omos_decision_record_revisions
       WHERE request_id = $1 AND owner_id = $2
       ORDER BY revision ASC`,
      [requestId, owner]
    );
    revisions = result.rows.map((row) => ({
      revision: Number(row.revision),
      ownerId: row.owner_id,
      recordHash: row.record_hash,
      previousRecordHash: row.previous_record_hash,
      record: row.record
    }));
  } else {
    if (durableRequired()) throw new Error('durable_postgresql_required');
    revisions = (MEMORY_REVISIONS.get(requestId) || []).filter((record) => record.ownerId === owner).map((record) => ({
      revision: record.revision,
      ownerId: record.ownerId,
      recordHash: record.recordHash,
      previousRecordHash: record.previousRecordHash,
      record
    }));
  }

  if (!revisions.length) return { valid: false, reason: 'record_not_found', revisions: 0, headHash: null };
  let previousHash = null;
  for (let i = 0; i < revisions.length; i += 1) {
    const entry = revisions[i];
    if (entry.revision !== i + 1) return { valid: false, reason: 'revision_gap', revisions: revisions.length, headHash: revisions.at(-1).recordHash };
    if ((entry.previousRecordHash || null) !== previousHash) return { valid: false, reason: 'previous_hash_mismatch', revisions: revisions.length, headHash: revisions.at(-1).recordHash };
    const expected = calculateRecordHash(entry.record, entry.revision, entry.previousRecordHash);
    if (expected !== entry.recordHash) return { valid: false, reason: 'record_hash_mismatch', revisions: revisions.length, headHash: revisions.at(-1).recordHash };
    previousHash = entry.recordHash;
  }
  return { valid: true, reason: null, revisions: revisions.length, headHash: previousHash };
}

async function hydrateRecent(limit = 100, ownerId) {
  if (!databaseConfigured()) return 0;
  const records = await listRecords(limit, ownerId);
  records.slice().reverse().forEach(remember);
  return records.length;
}

function getPersistenceStatus() {
  return {
    backend: databaseConfigured() ? 'postgresql' : 'memory',
    durable: databaseConfigured(),
    durableRequired: durableRequired(),
    configured: databaseConfigured(),
    initialized,
    error: initializationError ? initializationError.message : null,
    table: databaseConfigured() ? 'omos_decision_records' : null,
    auditTable: databaseConfigured() ? 'omos_decision_record_revisions' : null
  };
}

async function closeStore() {
  if (pool) {
    await pool.end();
    pool = null;
  }
  initialized = false;
}

function clearMemoryStoreForTests() {
  MEMORY_STORE.clear();
  MEMORY_REVISIONS.clear();
}

module.exports = {
  saveRecord,
  getRecord,
  listRecords,
  hydrateRecent,
  initializePersistence,
  getPersistenceStatus,
  verifyAuditChain,
  summary,
  closeStore,
  clearMemoryStoreForTests,
  calculateRecordHash
};
