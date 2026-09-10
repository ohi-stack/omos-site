const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const pkg = require('../package.json');

function gitSha() {
  const candidates = [
    process.env.OMOS_BUILD_SHA,
    process.env.GITHUB_SHA,
    process.env.SOURCE_COMMIT,
    process.env.COMMIT_SHA
  ].map((value) => String(value || '').trim()).filter(Boolean);

  if (candidates.length) return candidates[0];

  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    return 'unknown';
  }
}

const buildSha = gitSha();
const metadata = {
  service: 'omos-site',
  version: process.env.OMOS_VERSION || pkg.version,
  buildSha,
  buildShaShort: buildSha === 'unknown' ? 'unknown' : buildSha.slice(0, 12),
  canonicalHost: process.env.OMOS_CANONICAL_HOST || 'https://omos.onegodian.com',
  runtimeStartedAtUtc: new Date().toISOString(),
  provenance: buildSha === 'unknown' ? 'unresolved' : 'runtime-resolved'
};

try {
  const target = path.join(__dirname, '..', 'public', 'build.json');
  fs.writeFileSync(target, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
  console.log(`OMOS build provenance: ${metadata.buildShaShort} · ${metadata.version}`);
} catch (error) {
  console.warn(`OMOS build provenance unavailable: ${error.message}`);
}
