const { initializePersistence, closeStore } = require('../src/runtime/decisionStore');

const REQUIRED = [
  'NODE_ENV',
  'OMOS_VERSION',
  'OMOS_CANONICAL_HOST',
  'OMOS_BUILD_SHA',
  'OMOS_API_KEYS',
  'DATABASE_URL',
  'OMOS_DB_SSL',
  'OMOS_DB_POOL_MAX',
  'OMOS_REQUIRE_DURABLE_DB',
  'OMOS_ALLOW_MEMORY_PERSISTENCE'
];

const EXPECTED = {
  NODE_ENV: 'production',
  OMOS_VERSION: '1.1.0',
  OMOS_CANONICAL_HOST: 'https://omos.onegodian.com',
  OMOS_REQUIRE_DURABLE_DB: 'true',
  OMOS_ALLOW_MEMORY_PERSISTENCE: 'false'
};

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function validateBuildSha(value) {
  return /^[0-9a-f]{40}$/i.test(String(value || '').trim()) && !/^0{40}$/.test(String(value || '').trim());
}

function validateApiKeyStore(raw) {
  const entries = String(raw || '').split(',').map((entry) => entry.trim()).filter(Boolean);
  if (!entries.length) return ['OMOS_API_KEYS must contain at least one hashed production key entry.'];

  const errors = [];
  const names = new Set();
  const hashes = new Set();
  for (const entry of entries) {
    const parts = entry.split(':');
    if (parts.length !== 3) {
      errors.push('Each OMOS_API_KEYS entry must use name:sha256_hash:plan format.');
      continue;
    }
    const [name, hash, plan] = parts;
    if (!/^[A-Za-z0-9._-]{1,64}$/.test(name)) errors.push(`Invalid OMOS_API_KEYS name: ${name || '[empty]'}.`);
    if (!/^[0-9a-f]{64}$/i.test(hash)) errors.push(`OMOS_API_KEYS entry ${name || '[unnamed]'} must store a 64-character SHA-256 hash, never a raw key.`);
    if (!/^[A-Za-z0-9._-]{1,64}$/.test(plan)) errors.push(`Invalid OMOS_API_KEYS plan for ${name || '[unnamed]'}.`);
    if (names.has(name)) errors.push(`Duplicate OMOS_API_KEYS name: ${name}.`);
    if (hashes.has(hash)) errors.push(`Duplicate OMOS_API_KEYS hash for ${name || '[unnamed]'}.`);
    names.add(name);
    hashes.add(hash);
  }
  return errors;
}

function validateDatabaseUrl(raw) {
  try {
    const parsed = new URL(String(raw || ''));
    if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) return 'DATABASE_URL must use postgres:// or postgresql://.';
    if (!parsed.hostname) return 'DATABASE_URL must include a database host.';
    if (!parsed.pathname || parsed.pathname === '/') return 'DATABASE_URL must include a database name.';
    if (/replace|example|your[-_]?|changeme/i.test(raw)) return 'DATABASE_URL appears to contain a placeholder value.';
    return null;
  } catch {
    return 'DATABASE_URL must be a valid PostgreSQL connection URL.';
  }
}

async function run() {
  console.log('OMOS production preflight');
  console.log(`Node: ${process.version}`);

  const major = Number(process.versions.node.split('.')[0]);
  if (major < 20) fail('Node 20+ is required.');

  for (const key of REQUIRED) {
    if (!String(process.env[key] || '').trim()) fail(`${key} is not configured.`);
  }

  for (const [key, expected] of Object.entries(EXPECTED)) {
    if (process.env[key] && process.env[key] !== expected) {
      fail(`${key} must equal ${expected}; received ${process.env[key]}.`);
    }
  }

  if (!validateBuildSha(process.env.OMOS_BUILD_SHA)) {
    fail('OMOS_BUILD_SHA must be the exact non-zero 40-character Git SHA being deployed.');
  }

  if (process.env.OMOS_API_KEYS === 'replace-with-production-key' || /omos_live_/i.test(process.env.OMOS_API_KEYS || '')) {
    fail('OMOS_API_KEYS must contain hashed key records, not the example placeholder or a raw omos_live_ secret.');
  }
  for (const error of validateApiKeyStore(process.env.OMOS_API_KEYS)) fail(error);

  const databaseError = validateDatabaseUrl(process.env.DATABASE_URL);
  if (databaseError) fail(databaseError);

  if (!['true', 'false'].includes(String(process.env.OMOS_DB_SSL || '').toLowerCase())) {
    fail('OMOS_DB_SSL must be explicitly set to true or false.');
  }

  const poolMax = Number(process.env.OMOS_DB_POOL_MAX);
  if (!Number.isInteger(poolMax) || poolMax < 1 || poolMax > 50) {
    fail('OMOS_DB_POOL_MAX must be an integer from 1 through 50. The recommended initial production value is 5.');
  }

  const providerKeys = ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GEMINI_API_KEY', 'XAI_API_KEY'];
  const configuredProviders = providerKeys.filter((key) => Boolean(process.env[key]));
  console.log(`Configured live model providers: ${configuredProviders.length}/4`);
  console.log('Provider keys are optional; unconfigured providers remain explicitly simulated.');
  console.log(`Deployment provenance: ${process.env.OMOS_BUILD_SHA ? process.env.OMOS_BUILD_SHA.slice(0, 12) : 'unresolved'}`);
  console.log(`Database policy: ssl=${process.env.OMOS_DB_SSL}; poolMax=${process.env.OMOS_DB_POOL_MAX}; durableRequired=${process.env.OMOS_REQUIRE_DURABLE_DB}; memoryFallback=${process.env.OMOS_ALLOW_MEMORY_PERSISTENCE}`);

  if (!process.exitCode) {
    try {
      const persistence = await initializePersistence();
      if (persistence.backend !== 'postgresql' || !persistence.durable || !persistence.initialized || persistence.error) {
        fail(`Decision Record persistence is not durable PostgreSQL: ${JSON.stringify({
          backend: persistence.backend,
          durable: persistence.durable,
          initialized: persistence.initialized,
          error: persistence.error || null
        })}`);
      } else {
        console.log(`Decision Record persistence: ${persistence.backend}; durable=${persistence.durable}; migrations initialized.`);
      }
    } catch (error) {
      fail(`PostgreSQL persistence/migration verification failed: ${error.message}`);
    } finally {
      await closeStore().catch(() => {});
    }
  }

  if (process.exitCode) {
    console.error('OMOS production preflight FAILED. Do not restart production.');
  } else {
    console.log('OMOS production preflight PASSED. Environment is eligible for runtime restart and live verification.');
  }
}

run().catch((error) => {
  console.error('OMOS production preflight FAILED:', error);
  process.exit(1);
});
