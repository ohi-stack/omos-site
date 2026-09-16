'use strict';

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'config', 'platform-surfaces.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

function fail(message) {
  console.error(`FAIL platform-surfaces: ${message}`);
  process.exitCode = 1;
}

function validHttps(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && Boolean(parsed.hostname);
  } catch (_) {
    return false;
  }
}

if (data.schemaVersion !== '1.0.0') fail('schemaVersion must be 1.0.0');
if (data.runtimeVersionTarget !== '1.1.0') fail('runtimeVersionTarget must match OMOS 1.1.0 release target');
if (data.wordpressPluginVersionTarget !== '0.3.0') fail('wordpressPluginVersionTarget must match shared plugin 0.3.0');

const canonical = data.canonical || {};
for (const key of ['publicWordPress', 'governedRuntime', 'runtimeManifest', 'runtimeHealth']) {
  if (!validHttps(canonical[key])) fail(`canonical.${key} must be an HTTPS URL`);
}

if (canonical.publicWordPress === canonical.governedRuntime) {
  fail('public WordPress and governed runtime surfaces must remain distinct');
}

const nodes = Array.isArray(data.wordpressNodes) ? data.wordpressNodes : [];
if (nodes.length < 5) fail('initial WordPress synchronization set must contain at least five nodes');

const hosts = new Set();
const roles = new Set();
for (const node of nodes) {
  if (!node || !node.host || !node.role || !validHttps(node.url)) {
    fail('each wordpressNodes entry requires host, role, and HTTPS url');
    continue;
  }
  if (hosts.has(node.host)) fail(`duplicate WordPress host: ${node.host}`);
  if (roles.has(node.role)) fail(`duplicate WordPress role: ${node.role}`);
  hosts.add(node.host);
  roles.add(node.role);
}

if (!hosts.has('omos.onegodian.org')) fail('OMOS public WordPress host missing');
if (!data.authority || data.authority.humanFinalAuthority !== true) fail('humanFinalAuthority must remain true');
if (data.productionClaim !== false) fail('repository surface contract must not claim production deployment');

if (!process.exitCode) {
  console.log(`PASS platform-surfaces: ${nodes.length} WordPress nodes, runtime ${data.runtimeVersionTarget}, plugin ${data.wordpressPluginVersionTarget}`);
}
