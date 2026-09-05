const crypto = require("crypto");
const { AsyncLocalStorage } = require("async_hooks");

const KEY_PREFIX = "omos_live_";
const ownerContext = new AsyncLocalStorage();

function hashApiKey(apiKey) {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}

function ownerIdFromHash(hash) {
  return `key_${String(hash || "").slice(0, 24)}`;
}

function parseKeyStore() {
  const raw = process.env.OMOS_API_KEYS || "";

  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [name, hash, plan = "starter"] = entry.split(":");
      return { name, hash, plan, ownerId: ownerIdFromHash(hash) };
    });
}

function generateApiKey() {
  return `${KEY_PREFIX}${crypto.randomBytes(24).toString("hex")}`;
}

function verifyApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== "string") {
    return null;
  }

  const keyHash = hashApiKey(apiKey);
  const keys = parseKeyStore();
  const matched = keys.find((key) => key.hash === keyHash) || null;
  if (matched) ownerContext.enterWith(matched);
  return matched;
}

function getCurrentOwner() {
  return ownerContext.getStore() || null;
}

function runAsOwner(owner, fn) {
  return ownerContext.run(owner, fn);
}

module.exports = {
  KEY_PREFIX,
  generateApiKey,
  hashApiKey,
  ownerIdFromHash,
  verifyApiKey,
  getCurrentOwner,
  runAsOwner
};
