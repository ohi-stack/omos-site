'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'omos-platform-sync.manifest.json'), 'utf8'));
const required = String(process.env.OMOS_REQUIRE_WORDPRESS_TARGETS || 'false').toLowerCase() === 'true';
const timeoutMs = Math.max(1000, Number(process.env.OMOS_WORDPRESS_VERIFY_TIMEOUT_MS || 8000));

async function checkTarget(target) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const url = `https://${target.host}/wp-json/omos/v1/bridge/status`;
  try {
    const response = await fetch(url, { headers: { accept: 'application/json' }, signal: controller.signal, redirect: 'follow' });
    let payload = null;
    try { payload = await response.json(); } catch (_) {}
    const versionOk = payload && payload.plugin_version === manifest.wordpressBridge.packageVersion;
    const nodeOk = payload && payload.node === manifest.canonical.runtimeHost;
    const bridgeOk = payload && payload.authority === 'read-only-bridge' && payload.write_bridge_enabled === false;
    const endpointsOk = payload && payload.health && payload.health.ok === true && payload.manifest && payload.manifest.ok === true;
    const ok = response.ok && versionOk && nodeOk && bridgeOk && endpointsOk;
    return {
      host: target.host,
      url,
      ok,
      httpStatus: response.status,
      pluginVersion: payload && payload.plugin_version || null,
      node: payload && payload.node || null,
      authority: payload && payload.authority || null,
      health: payload && payload.health || null,
      manifest: payload && payload.manifest || null,
      checkedAtUtc: new Date().toISOString()
    };
  } catch (error) {
    return {
      host: target.host,
      url,
      ok: false,
      error: error && error.name === 'AbortError' ? 'timeout' : String(error && error.message || error),
      checkedAtUtc: new Date().toISOString()
    };
  } finally {
    clearTimeout(timer);
  }
}

(async () => {
  const results = [];
  for (const target of manifest.wordpressTargets || []) results.push(await checkTarget(target));
  const passed = results.filter(item => item.ok).length;
  const allPassed = passed === results.length && results.length > 0;
  const output = {
    status: allPassed ? 'PASS' : 'REVIEW',
    canonicalRuntime: manifest.canonical.runtimeHost,
    expectedPluginVersion: manifest.wordpressBridge.packageVersion,
    passed,
    total: results.length,
    results,
    productionClaim: allPassed,
    note: allPassed
      ? 'All declared WordPress targets exposed the expected bridge version, canonical Node URL, read-only authority, health, and manifest connectivity at verification time.'
      : 'One or more targets are not yet verifiably synchronized. Repository readiness does not substitute for target installation evidence.'
  };
  console.log(JSON.stringify(output, null, 2));
  if (required && !allPassed) process.exit(1);
})().catch(error => {
  console.error(error && error.stack || error);
  process.exit(1);
});
