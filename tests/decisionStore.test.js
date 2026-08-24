const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  getDecisionRecord,
  listDecisionRecords,
  saveDecisionRecord,
  verifyDecisionRecord
} = require("../src/runtime/decisionStore");

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "omos-decision-store-"));

try {
  const first = saveDecisionRecord({
    decision_id: "OMOS-REF-0001",
    status: "HUMAN_REVIEW_REQUIRED",
    created_at_utc: "2026-08-24T01:31:00.000Z",
    versions: { omos: "1.1", algorithm: "1.0", schema: "1.1" },
    input: { raw: "test", hash: "input-hash" },
    layer_1: { canonical_input: "test" },
    alignment: { state: "HUMAN_REVIEW_REQUIRED" },
    council: { mode: "simulation", adapters_requested: [], adapters_available: [], adapters_failed: [] },
    governed_output: { recommendation: "Review", verification_state: "UNVERIFIED" },
    human_gate: { decision: null }
  }, { dir });

  assert.strictEqual(first.audit.revision, 1);
  assert.strictEqual(verifyDecisionRecord(first).valid, true);

  const loaded = getDecisionRecord("OMOS-REF-0001", { dir });
  assert.strictEqual(loaded.decision_id, "OMOS-REF-0001");
  assert.strictEqual(loaded.status, "HUMAN_REVIEW_REQUIRED");

  const second = saveDecisionRecord({
    ...loaded,
    status: "APPROVED",
    human_gate: {
      decision: "approved",
      decided_at_utc: "2026-08-24T01:35:00.000Z",
      comment: "Reference run accepted."
    }
  }, { dir });

  assert.strictEqual(second.audit.revision, 2);
  assert.strictEqual(second.audit.previous_record_hash, first.audit.record_hash);
  assert.strictEqual(verifyDecisionRecord(second).valid, true);

  const history = listDecisionRecords({ dir });
  assert.strictEqual(history.length, 1);
  assert.strictEqual(history[0].status, "APPROVED");

  const tampered = JSON.parse(JSON.stringify(second));
  tampered.status = "REJECTED";
  assert.strictEqual(verifyDecisionRecord(tampered).valid, false);

  console.log("OMOS Decision Store tests passed.");
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}
