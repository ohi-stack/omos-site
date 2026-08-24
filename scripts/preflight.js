const REQUIRED = [
  'NODE_ENV',
  'OMOS_VERSION',
  'OMOS_CANONICAL_HOST',
  'OMOS_API_KEYS',
  'DATABASE_URL'
];

const EXPECTED = {
  NODE_ENV: 'production',
  OMOS_VERSION: '1.1.0',
  OMOS_CANONICAL_HOST: 'https://omos.onegodian.com'
};

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

console.log('OMOS production preflight');
console.log(`Node: ${process.version}`);

const major = Number(process.versions.node.split('.')[0]);
if (major < 20) fail('Node 20+ is required.');

for (const key of REQUIRED) {
  if (!process.env[key]) fail(`${key} is not configured.`);
}

for (const [key, expected] of Object.entries(EXPECTED)) {
  if (process.env[key] && process.env[key] !== expected) {
    fail(`${key} must equal ${expected}; received ${process.env[key]}.`);
  }
}

if (process.env.OMOS_API_KEYS === 'replace-with-production-key') {
  fail('OMOS_API_KEYS is still using the example placeholder.');
}

if (process.env.DATABASE_URL && !/^postgres(?:ql)?:\/\//i.test(process.env.DATABASE_URL)) {
  fail('DATABASE_URL must be a PostgreSQL connection URL.');
}

const providerKeys = ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GEMINI_API_KEY', 'XAI_API_KEY'];
const configuredProviders = providerKeys.filter((key) => Boolean(process.env[key]));
console.log(`Configured live model providers: ${configuredProviders.length}/4`);
console.log('Provider keys are optional; unconfigured providers remain explicitly simulated.');

if (process.exitCode) {
  console.error('OMOS production preflight FAILED. Do not restart production.');
} else {
  console.log('OMOS production preflight PASSED. Environment is eligible for runtime restart and live verification.');
}
