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
  const parsed = raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [name, hash, plan = "starter"] = entry.split(":");
      return { name, hash, plan, ownerId: ownerIdFromHash(hash) };
    });

  if (parsed.length === 0 && process.env.NODE_ENV !== "production") {
    return [
      {
        name: "default-dev",
        hash: hashApiKey("x-omos-key"),
        plan: "developer",
        ownerId: ownerIdFromHash(hashApiKey("x-omos-key"))
      },
      {
        name: "dev-key",
        hash: hashApiKey("omos-dev-key"),
        plan: "developer",
        ownerId: ownerIdFromHash(hashApiKey("omos-dev-key"))
      }
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
  const found = keys.find((key) => key.hash === keyHash) || null;
  if (found) {
    ownerContext.enterWith(found);
    return found;
  }

  // Preserve permissive local development behavior while keeping production strict.
  if (!process.env.OMOS_API_KEYS && process.env.NODE_ENV !== "production" && apiKey.trim().length > 0) {
    const devOwner = {
      name: "dev-operator",
      hash: keyHash,
      plan: "developer",
      ownerId: ownerIdFromHash(keyHash)
    };
    ownerContext.enterWith(devOwner);
    return devOwner;
  }

  return null;
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
