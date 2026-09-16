'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'omos-platform-sync.manifest.json'), 'utf8'));
const enforce = String(process.env.OMOS_REQUIRE_WORDPRESS_TARGETS || 'false').toLowerCase() === 'true';
const timeoutMs = Math.max(1000, Number(process.env.OMOS_WORDPRESS_VERIFY_TIMEOUT_MS || 8000));
const canonicalRuntime = manifest.canonical.runtimeHost.replace(/\/$/, '');

const targets = [
  { host: 'onegodian.org', kind: 'shared', required: true, role: 'public_identity' },
  { host: 'onegodian.com', kind: 'shared', required: true, role: 'commerce' },
  { host: 'quantumohi.com', kind: 'shared', required: true, role: 'technology' },
  { host: 'omos.onegodian.org', kind: 'specialized', required: true, role: 'omos_presentation' },
  { host: 'u.onegodian.org', kind: 'shared', required: false, role: 'education' }
];

async function getJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json', 'user-agent': 'OMOS-WordPress-Target-Verifier/1.0' },
      signal: controller.signal,
      redirect: 'follow'
    });
    let payload = null;
    try { payload = await response.json(); } catch (_) {}
    return { response, payload };
  } finally {
    clearTimeout(timer);
  }
}

function normalizeUrl(value) {
  return String(value || '').replace(/\/$/, '');
}

async function verifyShared(target) {
  const url = `https://${target.host}/wp-json/onegodian/v1/omos/status`;
  try {
    const { response, payload } = await getJson(url);
    const versionOk = payload && payload.plugin_version === '0.3.0';
    const nodeOk = payload && normalizeUrl(payload.node) === canonicalRuntime;
    const connectedOk = payload && payload.connected === true && payload.status === 'connected';
    const roleOk = payload && payload.site_role === target.role;
    const healthOk = payload && payload.health && payload.health.status !== 'unavailable';
    const manifestOk = payload && payload.manifest && payload.manifest.status !== 'unavailable';
    return {
      host: target.host,
      kind: target.kind,
      role: target.role,
      required: target.required,
      url,
      ok: response.ok && versionOk && nodeOk && connectedOk && roleOk && healthOk && manifestOk,
      httpStatus: response.status,
      pluginVersion: payload && payload.plugin_version || null,
      node: payload && payload.node || null,
      connected: payload && payload.connected === true,
      siteRole: payload && payload.site_role || null,
      checks: { versionOk, nodeOk, connectedOk, roleOk, healthOk, manifestOk },
      checkedAtUtc: new Date().toISOString()
    };
  } catch (error) {
    return { host: target.host, kind: target.kind, role: target.role, required: target.required, url, ok: false, error: error && error.name === 'AbortError' ? 'timeout' : String(error && error.message || error), checkedAtUtc: new Date().toISOString() };
  }
}

async function verifySpecialized(target) {
  const url = `https://${target.host}/wp-json/omos/v1/status`;
  try {
    const { response, payload } = await getJson(url);
    const nameOk = payload && payload.plugin === 'OMOS Core Tools';
    const versionOk = payload && payload.version === '1.4.0';
    const runtimeOk = payload && normalizeUrl(payload.runtime) === canonicalRuntime;
    const connectedOk = payload && payload.runtime_connected === true;
    const authorityOk = payload && payload.authority === 'client-interface';
    return {
      host: target.host,
      kind: target.kind,
      role: target.role,
      required: target.required,
      url,
      ok: response.ok && nameOk && versionOk && runtimeOk && connectedOk && authorityOk,
      httpStatus: response.status,
      plugin: payload && payload.plugin || null,
      version: payload && payload.version || null,
      runtime: payload && payload.runtime || null,
      runtimeConnected: payload && payload.runtime_connected === true,
      authority: payload && payload.authority || null,
      checks: { nameOk, versionOk, runtimeOk, connectedOk, authorityOk },
      checkedAtUtc: new Date().toISOString()
    };
  } catch (error) {
    return { host: target.host, kind: target.kind, role: target.role, required: target.required, url, ok: false, error: error && error.name === 'AbortError' ? 'timeout' : String(error && error.message || error), checkedAtUtc: new Date().toISOString() };
  }
}

(async () => {
  const results = [];
  for (const target of targets) {
    results.push(target.kind === 'specialized' ? await verifySpecialized(target) : await verifyShared(target));
  }

  const required = results.filter(item => item.required);
  const requiredPassed = required.filter(item => item.ok).length;
  const optional = results.filter(item => !item.required);
  const allRequiredPassed = required.length > 0 && requiredPassed === required.length;

  const output = {
    status: allRequiredPassed ? 'PASS' : 'REVIEW',
    canonicalRuntime,
    requiredPassed,
    requiredTotal: required.length,
    optionalPassed: optional.filter(item => item.ok).length,
    optionalTotal: optional.length,
    results,
    productionClaim: allRequiredPassed,
    note: allRequiredPassed
      ? 'All required WordPress properties matched the declared OMOS bridge contracts at verification time.'
      : 'One or more required WordPress properties are not yet verifiably synchronized. Repository readiness is not deployment proof.'
  };

  console.log(JSON.stringify(output, null, 2));
  if (enforce && !allRequiredPassed) process.exit(1);
})().catch(error => {
  console.error(error && error.stack || error);
  process.exit(1);
});
