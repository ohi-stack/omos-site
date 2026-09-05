const crypto = require("crypto");

const KEY_PREFIX = "omos_live_";

function hashApiKey(apiKey) {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}

function parseKeyStore() {
  const raw = process.env.OMOS_API_KEYS || "";

  const parsed = raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [name, hash, plan = "starter"] = entry.split(":");
      return { name, hash, plan };
    });

  if (parsed.length === 0) {
    return [
      { name: "default-dev", hash: hashApiKey("x-omos-key"), plan: "developer" },
      { name: "dev-key", hash: hashApiKey("omos-dev-key"), plan: "developer" }
    ];
  }
  return parsed;
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
  const found = keys.find((key) => key.hash === keyHash);
  if (found) return found;

  // In development without configured keys, allow non-empty string keys
  if (!process.env.OMOS_API_KEYS && apiKey.trim().length > 0) {
    return { name: "dev-operator", hash: keyHash, plan: "developer" };
  }
  return null;
}

module.exports = {
  KEY_PREFIX,
  generateApiKey,
  hashApiKey,
  verifyApiKey
};
