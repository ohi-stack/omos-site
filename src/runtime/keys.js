const crypto = require("crypto");

const KEY_PREFIX = "omos_live_";

function hashApiKey(apiKey) {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}

function parseKeyStore() {
  const raw = process.env.OMOS_API_KEYS || "";

  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [name, hash, plan = "starter"] = entry.split(":");
      return { name, hash, plan };
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
  return keys.find((key) => key.hash === keyHash) || null;
}

module.exports = {
  KEY_PREFIX,
  generateApiKey,
  hashApiKey,
  verifyApiKey
};
