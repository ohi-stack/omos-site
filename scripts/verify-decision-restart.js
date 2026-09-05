const { spawnSync } = require('child_process');

async function childWrite() {
  const { initializePersistence, saveRecord, closeStore } = require('../src/runtime/decisionStore');
  await initializePersistence();
  const requestId = `restart_probe_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
  const ownerId = 'restart_probe_owner';
  const now = new Date().toISOString();
  const record = {
    requestId,
    ownerId,
    schemaVersion: 'restart-verification-1.0',
    runtimeVersion: process.env.OMOS_VERSION || '1.1.0',
    mode: 'verification',
    currentStage: 7,
    stages: [
      { id: 1, key: 'write', label: 'Write Probe', status: 'COMPLETE', startedAt: now, completedAt: now },
      { id: 7, key: 'record', label: 'Decision Record', status: 'COMPLETE', completedAt: now }
    ],
    humanGate: { decision: 'APPROVED', reviewer: 'restart-verifier', decidedAt: now },
    verificationStatus: 'persistence_probe',
    outputStatus: 'APPROVED',
    startedAt: now,
    completedAt: now
  };
  await saveRecord(record, ownerId);
  await closeStore();
  process.stdout.write(JSON.stringify({ requestId, ownerId, recordHash: record.recordHash }));
}

async function childRead() {
  const { initializePersistence, getRecord, verifyAuditChain, closeStore } = require('../src/runtime/decisionStore');
  const requestId = process.env.OMOS_RESTART_REQUEST_ID;
  const ownerId = process.env.OMOS_RESTART_OWNER_ID;
  const expectedHash = process.env.OMOS_RESTART_RECORD_HASH;
  await initializePersistence();
  const record = await getRecord(requestId, ownerId);
  if (!record) throw new Error('restart_probe_record_missing');
  if (record.recordHash !== expectedHash) throw new Error('restart_probe_hash_mismatch');
  const chain = await verifyAuditChain(requestId, ownerId);
  if (!chain.valid) throw new Error(`restart_probe_chain_invalid:${chain.reason}`);
  await closeStore();
  process.stdout.write(JSON.stringify({ requestId, recordHash: record.recordHash, chain }));
}

function runChild(phase, env = {}) {
  const result = spawnSync(process.execPath, [__filename], {
    env: { ...process.env, ...env, OMOS_RESTART_PHASE: phase, OMOS_REQUIRE_DURABLE_DB: 'true' },
    encoding: 'utf8'
  });
  if (result.status !== 0) {
    throw new Error(`${phase}_process_failed:${(result.stderr || result.stdout || '').trim()}`);
  }
  return JSON.parse(result.stdout.trim());
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required for restart verification');
  const phase = process.env.OMOS_RESTART_PHASE;
  if (phase === 'write') return childWrite();
  if (phase === 'read') return childRead();

  const written = runChild('write');
  const reopened = runChild('read', {
    OMOS_RESTART_REQUEST_ID: written.requestId,
    OMOS_RESTART_OWNER_ID: written.ownerId,
    OMOS_RESTART_RECORD_HASH: written.recordHash
  });

  console.log('OMOS Decision Record restart verification PASSED.');
  console.log(JSON.stringify({ written, reopened }, null, 2));
}

main().catch((error) => {
  console.error('OMOS Decision Record restart verification FAILED:', error.message);
  process.exit(1);
});
