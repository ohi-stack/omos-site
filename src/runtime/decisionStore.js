const MEMORY_STORE = new Map();
const MAX_MEMORY_RUNS = 200;

let pool = null;
let initialized = false;
let initializationError = null;

function databaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
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

async function ensureSchema() {
  if (initialized || !databaseConfigured()) return;
  const db = getPool();
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS omos_decision_records (
        request_id TEXT PRIMARY KEY,
        mode TEXT NOT NULL,
        output_status TEXT NOT NULL,
        verification_status TEXT,
        human_decision TEXT,
        started_at TIMESTAMPTZ NOT NULL,
        completed_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        record JSONB NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_omos_decision_records_updated_at
        ON omos_decision_records (updated_at DESC);
      CREATE INDEX IF NOT EXISTS idx_omos_decision_records_status
        ON omos_decision_records (output_status);
    `);
    initialized = true;
    initializationError = null;
  } catch (error) {
    initializationError = error;
    throw error;
  }
}

function remember(record) {
  MEMORY_STORE.set(record.requestId, record);
  while (MEMORY_STORE.size > MAX_MEMORY_RUNS) {
    MEMORY_STORE.delete(MEMORY_STORE.keys().next().value);
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
    simulationProviders: record.simulationProviders || []
  };
}

async function saveRecord(record) {
  remember(record);
  if (!databaseConfigured()) return { backend: 'memory', durable: false };

  await ensureSchema();
  const db = getPool();
  await db.query(
    `INSERT INTO omos_decision_records
      (request_id, mode, output_status, verification_status, human_decision, started_at, completed_at, updated_at, record)
     VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),$8::jsonb)
     ON CONFLICT (request_id) DO UPDATE SET
       mode = EXCLUDED.mode,
       output_status = EXCLUDED.output_status,
       verification_status = EXCLUDED.verification_status,
       human_decision = EXCLUDED.human_decision,
       completed_at = EXCLUDED.completed_at,
       updated_at = NOW(),
       record = EXCLUDED.record`,
    [
      record.requestId,
      record.mode || 'unknown',
      record.outputStatus || 'UNKNOWN',
      record.verificationStatus || null,
      record.humanGate?.decision || null,
      record.startedAt || new Date().toISOString(),
      record.completedAt || null,
      JSON.stringify(record)
    ]
  );
  return { backend: 'postgresql', durable: true };
}

async function getRecord(requestId) {
  if (databaseConfigured()) {
    await ensureSchema();
    const result = await getPool().query(
      'SELECT record FROM omos_decision_records WHERE request_id = $1 LIMIT 1',
      [requestId]
    );
    if (result.rows[0]?.record) {
      const record = result.rows[0].record;
      remember(record);
      return record;
    }
  }
  return MEMORY_STORE.get(requestId) || null;
}

async function listRecords(limit = 20) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 20, 100));
  if (databaseConfigured()) {
    await ensureSchema();
    const result = await getPool().query(
      'SELECT record FROM omos_decision_records ORDER BY updated_at DESC LIMIT $1',
      [safeLimit]
    );
    return result.rows.map((row) => row.record);
  }
  return [...MEMORY_STORE.values()].slice(-safeLimit).reverse();
}

async function hydrateRecent(limit = 100) {
  if (!databaseConfigured()) return 0;
  const records = await listRecords(limit);
  records.slice().reverse().forEach(remember);
  return records.length;
}

function getPersistenceStatus() {
  return {
    backend: databaseConfigured() ? 'postgresql' : 'memory',
    durable: databaseConfigured(),
    configured: databaseConfigured(),
    initialized,
    error: initializationError ? initializationError.message : null,
    table: databaseConfigured() ? 'omos_decision_records' : null
  };
}

async function closeStore() {
  if (pool) {
    await pool.end();
    pool = null;
    initialized = false;
  }
}

module.exports = {
  saveRecord,
  getRecord,
  listRecords,
  hydrateRecent,
  getPersistenceStatus,
  summary,
  closeStore
};