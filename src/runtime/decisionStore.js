const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DEFAULT_DIR = process.env.OMOS_DECISION_STORE_DIR || path.join(process.cwd(), "data", "decisions");

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return crypto.createHash("sha256").update(typeof value === "string" ? value : stableJson(value)).digest("hex");
}

function ensureStore(dir = DEFAULT_DIR) {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function validateDecisionId(decisionId) {
  if (!/^OMOS-[A-Za-z0-9_-]+$/.test(String(decisionId || ""))) {
    const error = new Error("Invalid OMOS decision_id");
    error.code = "INVALID_DECISION_ID";
    throw error;
  }
}

function recordPath(decisionId, dir = DEFAULT_DIR) {
  validateDecisionId(decisionId);
  return path.join(ensureStore(dir), `${decisionId}.json`);
}

function normalizeRecord(record) {
  if (!record || typeof record !== "object") throw new Error("Decision Record must be an object");
  validateDecisionId(record.decision_id);

  const now = new Date().toISOString();
  const audit = record.audit && typeof record.audit === "object" ? { ...record.audit } : {};
  const normalized = {
    ...record,
    updated_at_utc: now,
    audit: {
      runtime_events: Array.isArray(audit.runtime_events) ? audit.runtime_events : [],
      failure_events: Array.isArray(audit.failure_events) ? audit.failure_events : [],
      revision: Number.isInteger(audit.revision) ? audit.revision : 1,
      previous_record_hash: audit.previous_record_hash || null,
      ...audit
    }
  };

  const unsigned = JSON.parse(JSON.stringify(normalized));
  delete unsigned.audit.record_hash;
  normalized.audit.record_hash = sha256(unsigned);
  return normalized;
}

function saveDecisionRecord(record, options = {}) {
  const dir = options.dir || DEFAULT_DIR;
  const file = recordPath(record.decision_id, dir);
  let next = { ...record };

  if (fs.existsSync(file)) {
    const previous = JSON.parse(fs.readFileSync(file, "utf8"));
    next.audit = {
      ...(next.audit || {}),
      revision: (previous.audit?.revision || 1) + 1,
      previous_record_hash: previous.audit?.record_hash || null
    };
  }

  const normalized = normalizeRecord(next);
  const temp = `${file}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  fs.renameSync(temp, file);
  return normalized;
}

function getDecisionRecord(decisionId, options = {}) {
  const file = recordPath(decisionId, options.dir || DEFAULT_DIR);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function listDecisionRecords(options = {}) {
  const dir = ensureStore(options.dir || DEFAULT_DIR);
  const limit = Math.max(1, Math.min(Number(options.limit || 100), 500));

  return fs.readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(dir, name), "utf8"));
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => String(b.updated_at_utc || b.created_at_utc || "").localeCompare(String(a.updated_at_utc || a.created_at_utc || "")))
    .slice(0, limit);
}

function verifyDecisionRecord(record) {
  if (!record?.audit?.record_hash) return { valid: false, reason: "missing_record_hash" };
  const unsigned = JSON.parse(JSON.stringify(record));
  const expected = unsigned.audit.record_hash;
  delete unsigned.audit.record_hash;
  const actual = sha256(unsigned);
  return { valid: actual === expected, expected, actual };
}

module.exports = {
  DEFAULT_DIR,
  ensureStore,
  getDecisionRecord,
  listDecisionRecords,
  saveDecisionRecord,
  sha256,
  stableJson,
  verifyDecisionRecord
};
