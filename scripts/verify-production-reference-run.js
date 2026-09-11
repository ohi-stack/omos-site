const fs = require('fs');

const BASE = String(process.env.OMOS_BASE_URL || 'https://omos.onegodian.com').replace(/\/$/, '');
const API_KEY = String(process.env.OMOS_PRODUCTION_KEY || '').trim();
const EXPECTED_VERSION = String(process.env.OMOS_EXPECTED_VERSION || '1.1.0').trim();
const EXPECTED_SHA = String(process.env.OMOS_EXPECTED_SHA || '').trim();
const PHASE = String(process.env.OMOS_PROOF_PHASE || 'create').trim().toLowerCase();
const REFERENCE_MODE = String(process.env.OMOS_REFERENCE_MODE || 'simulation').trim().toLowerCase();
const EXISTING_RUN_ID = String(process.env.OMOS_REFERENCE_RUN_ID || '').trim();
const EXPECTED_RECORD_HASH = String(process.env.OMOS_REFERENCE_RECORD_HASH || '').trim();
const OUTPUT_FILE = String(process.env.OMOS_PROOF_OUTPUT || '').trim();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function redact(value) {
  if (!value) return null;
  const text = String(value);
  if (text.length <= 12) return '[redacted]';
  return `${text.slice(0, 6)}…${text.slice(-4)}`;
}

async function request(path, options = {}, auth = false) {
  const headers = {
    accept: 'application/json',
    ...(options.body ? { 'content-type': 'application/json' } : {}),
    ...(auth ? { 'x-omos-key': API_KEY } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    redirect: 'manual',
    signal: AbortSignal.timeout(30000)
  });

  const body = await response.text();
  let parsed = null;
  if (body) {
    try { parsed = JSON.parse(body); } catch { /* handled by caller */ }
  }
  return { status: response.status, body, json: parsed, headers: Object.fromEntries(response.headers.entries()) };
}

async function json(path, options = {}, auth = false) {
  const response = await request(path, options, auth);
  assert(response.status >= 200 && response.status < 300, `${path} returned HTTP ${response.status}`);
  assert(response.json, `${path} did not return JSON`);
  return response.json;
}

function unwrap(payload) {
  return payload && Object.prototype.hasOwnProperty.call(payload, 'data') ? payload.data : payload;
}

async function verifyLiveRuntime() {
  const health = await json('/api/health');
  assert(health.status === 'ok', '/api/health status must be ok');
  assert(health.version === EXPECTED_VERSION, `runtime version ${health.version} != expected ${EXPECTED_VERSION}`);

  const manifest = await json('/api/manifest');
  assert(manifest.version === EXPECTED_VERSION, `manifest version ${manifest.version} != expected ${EXPECTED_VERSION}`);
  assert(manifest.canonicalHost === BASE, `manifest canonicalHost ${manifest.canonicalHost} != ${BASE}`);

  const build = await json('/build.json');
  assert(build.service === 'omos-site', `build service ${build.service || 'unknown'} != omos-site`);
  assert(build.version === EXPECTED_VERSION, `build version ${build.version} != expected ${EXPECTED_VERSION}`);
  assert(build.provenance === 'runtime-resolved', `build provenance ${build.provenance || 'unknown'} != runtime-resolved`);
  assert(build.buildSha && build.buildSha !== 'unknown', 'live build SHA is unresolved');
  if (EXPECTED_SHA) assert(build.buildSha === EXPECTED_SHA, `live build SHA ${build.buildSha} != expected ${EXPECTED_SHA}`);

  const persistencePayload = await json('/api/v1/persistence');
  const persistence = persistencePayload.persistence || persistencePayload;
  assert(persistence.backend === 'postgresql', `persistence backend ${persistence.backend || 'unknown'} != postgresql`);
  assert(persistence.durable === true, 'persistence durable must be true');
  assert(persistence.initialized === true, 'persistence initialized must be true');
  assert(!persistence.error, `persistence error: ${persistence.error}`);

  return {
    version: health.version,
    buildSha: build.buildSha,
    buildShaShort: build.buildShaShort || build.buildSha.slice(0, 12),
    runtimeStartedAtUtc: build.runtimeStartedAtUtc || null,
    persistence: {
      backend: persistence.backend,
      durable: persistence.durable,
      initialized: persistence.initialized,
      table: persistence.table || null,
      auditTable: persistence.auditTable || null
    }
  };
}

function verifyPreApprovalRecord(record) {
  assert(record && record.requestId, 'Council run did not return requestId');
  assert(record.currentStage === 6, `new reference run currentStage ${record.currentStage} != 6`);
  const stages = Array.isArray(record.stages) ? record.stages : [];
  for (const id of [1, 2, 3, 4, 5]) {
    const stage = stages.find((item) => item.id === id);
    assert(stage && stage.status === 'COMPLETE', `stage ${id} must be COMPLETE before Human Gate`);
  }
  const human = stages.find((item) => item.id === 6);
  const decisionRecord = stages.find((item) => item.id === 7);
  assert(human && human.status === 'NEEDS_REVIEW', 'Human Gate must be NEEDS_REVIEW before approval');
  assert(decisionRecord && decisionRecord.status === 'PENDING', 'Decision Record stage must be PENDING before approval');
}

function verifyApprovedRecord(record) {
  assert(record && record.requestId, 'approved record is missing requestId');
  assert(record.currentStage === 7, `approved record currentStage ${record.currentStage} != 7`);
  assert(record.outputStatus === 'APPROVED', `approved record outputStatus ${record.outputStatus} != APPROVED`);
  assert(record.humanGate && record.humanGate.decision === 'APPROVED', 'persisted Human Gate decision must be APPROVED');
  assert(record.humanGate.decidedAt, 'persisted Human Gate decision timestamp is missing');
  assert(Number(record.revision || 0) >= 2, `approved record revision ${record.revision || 0} must be >= 2`);
  assert(record.recordHash, 'approved record hash is missing');
  const stage7 = (record.stages || []).find((item) => item.id === 7);
  assert(stage7 && stage7.status === 'COMPLETE', 'Decision Record stage must be COMPLETE after approval');
}

async function createReferenceRun(runtime) {
  assert(API_KEY, 'OMOS_PRODUCTION_KEY is required for authenticated reference-run proof');
  assert(['simulation', 'auto'].includes(REFERENCE_MODE), 'OMOS_REFERENCE_MODE must be simulation or auto');

  const prompt = [
    'OMOS-REF-0001 production proof transaction.',
    'Evaluate whether this deployed OMOS runtime can preserve a governed decision across a runtime restart or redeployment.',
    'Preserve uncertainty, do not treat model agreement as factual verification, and require the Human Gate before the Decision Record is finalized.'
  ].join(' ');

  const createdPayload = await json('/api/v1/council/run', {
    method: 'POST',
    body: JSON.stringify({
      prompt,
      mode: REFERENCE_MODE,
      providers: ['openai', 'anthropic', 'gemini', 'xai'],
      context: {
        referenceRun: 'OMOS-REF-0001',
        proofPurpose: 'production_persistence_and_restart_survival',
        expectedBuildSha: runtime.buildSha
      }
    })
  }, true);

  const created = unwrap(createdPayload);
  verifyPreApprovalRecord(created);

  const approvedPayload = await json(`/api/v1/council/runs/${encodeURIComponent(created.requestId)}/human-decision`, {
    method: 'POST',
    body: JSON.stringify({
      decision: 'APPROVED',
      comment: `OMOS-REF-0001 P0 production proof authorization for persistence/restart verification on build ${runtime.buildSha}. This approval does not authorize consequential external execution.`
    })
  }, true);

  const approved = unwrap(approvedPayload);
  verifyApprovedRecord(approved);

  const reopenedPayload = await json(`/api/v1/council/runs/${encodeURIComponent(created.requestId)}`, {}, true);
  const reopened = unwrap(reopenedPayload);
  verifyApprovedRecord(reopened);
  assert(reopened.recordHash === approved.recordHash, 'record hash changed between approval and immediate reopen');

  const historyPayload = await json('/api/v1/council/runs?limit=100', {}, true);
  const history = unwrap(historyPayload);
  assert(Array.isArray(history), 'history response is not an array');
  assert(history.some((item) => item.requestId === created.requestId), 'reference run is absent from Dashboard History API');

  return {
    status: 'PASS',
    referenceRun: 'OMOS-REF-0001',
    proofPhase: 'before_restart',
    checkedAtUtc: new Date().toISOString(),
    canonicalHost: BASE,
    version: runtime.version,
    deployedSha: runtime.buildSha,
    runtimeStartedAtUtc: runtime.runtimeStartedAtUtc,
    persistence: runtime.persistence,
    councilMode: reopened.mode || REFERENCE_MODE,
    liveProviders: reopened.liveProviders || [],
    simulationProviders: reopened.simulationProviders || [],
    requestId: reopened.requestId,
    ownerId: redact(reopened.ownerId),
    revision: reopened.revision,
    recordHash: reopened.recordHash,
    previousRecordHash: reopened.previousRecordHash || null,
    humanDecision: reopened.humanGate.decision,
    humanDecisionAtUtc: reopened.humanGate.decidedAt,
    historyReopenVerified: true,
    nextRequiredAction: 'Restart or redeploy the exact same revision, then run this verifier with OMOS_PROOF_PHASE=reopen using the emitted requestId and recordHash.'
  };
}

async function reopenReferenceRun(runtime) {
  assert(API_KEY, 'OMOS_PRODUCTION_KEY is required for authenticated reopen proof');
  assert(EXISTING_RUN_ID, 'OMOS_REFERENCE_RUN_ID is required when OMOS_PROOF_PHASE=reopen');

  const reopenedPayload = await json(`/api/v1/council/runs/${encodeURIComponent(EXISTING_RUN_ID)}`, {}, true);
  const reopened = unwrap(reopenedPayload);
  verifyApprovedRecord(reopened);
  assert(reopened.requestId === EXISTING_RUN_ID, 'reopened Decision Record ID does not match requested reference run');
  if (EXPECTED_RECORD_HASH) {
    assert(reopened.recordHash === EXPECTED_RECORD_HASH, `reopened record hash ${reopened.recordHash} != pre-restart hash ${EXPECTED_RECORD_HASH}`);
  }

  const historyPayload = await json('/api/v1/council/runs?limit=100', {}, true);
  const history = unwrap(historyPayload);
  assert(Array.isArray(history), 'history response is not an array');
  assert(history.some((item) => item.requestId === EXISTING_RUN_ID), 'reference run is absent from history after restart');

  return {
    status: 'PASS',
    referenceRun: 'OMOS-REF-0001',
    proofPhase: 'after_restart',
    checkedAtUtc: new Date().toISOString(),
    canonicalHost: BASE,
    version: runtime.version,
    deployedSha: runtime.buildSha,
    runtimeStartedAtUtc: runtime.runtimeStartedAtUtc,
    persistence: runtime.persistence,
    requestId: reopened.requestId,
    revision: reopened.revision,
    recordHash: reopened.recordHash,
    previousRecordHash: reopened.previousRecordHash || null,
    humanDecision: reopened.humanGate.decision,
    humanDecisionAtUtc: reopened.humanGate.decidedAt,
    restartSurvivalVerified: true,
    historyReopenVerified: true,
    productionProof: 'OMOS-REF-0001 persistence/restart gate passed for the captured deployed SHA.'
  };
}

function emit(evidence) {
  const rendered = `${JSON.stringify(evidence, null, 2)}\n`;
  if (OUTPUT_FILE) fs.writeFileSync(OUTPUT_FILE, rendered, 'utf8');
  process.stdout.write(rendered);
}

async function run() {
  assert(['create', 'reopen'].includes(PHASE), 'OMOS_PROOF_PHASE must be create or reopen');
  const runtime = await verifyLiveRuntime();
  const evidence = PHASE === 'create' ? await createReferenceRun(runtime) : await reopenReferenceRun(runtime);
  emit(evidence);
}

run().catch((error) => {
  const failure = {
    status: 'FAIL',
    referenceRun: 'OMOS-REF-0001',
    proofPhase: PHASE,
    checkedAtUtc: new Date().toISOString(),
    canonicalHost: BASE,
    expectedVersion: EXPECTED_VERSION,
    expectedSha: EXPECTED_SHA || null,
    error: error.message
  };
  emit(failure);
  process.exit(1);
});
