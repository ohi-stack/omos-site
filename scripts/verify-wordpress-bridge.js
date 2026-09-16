'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'config', 'omos-platform-sync.manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const failures = [];

function requireFile(relative) {
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) failures.push(`missing:${relative}`);
  return full;
}

function requireText(relative, patterns) {
  const full = requireFile(relative);
  if (!fs.existsSync(full)) return;
  const text = fs.readFileSync(full, 'utf8');
  for (const [label, pattern] of patterns) {
    if (!pattern.test(text)) failures.push(`${relative}:${label}`);
  }
}

if (manifest.canonical.repository !== 'ohi-stack/omos-site') failures.push('manifest:canonical_repository');
if (manifest.canonical.runtimeHost !== 'https://omos.onegodian.com') failures.push('manifest:canonical_runtime_host');
if (manifest.wordpressBridge.packageVersion !== '1.3.0') failures.push('manifest:plugin_version');

const targetHosts = new Set((manifest.wordpressTargets || []).map(item => item.host));
for (const host of ['onegodian.com', 'onegodian.org', 'quantumohi.com', 'omos.onegodian.org', 'u.onegodian.org']) {
  if (!targetHosts.has(host)) failures.push(`manifest:missing_target:${host}`);
}

const requiredHosts = new Set((manifest.wordpressTargets || []).filter(item => item.required !== false).map(item => item.host));
for (const host of ['onegodian.com', 'onegodian.org', 'quantumohi.com', 'omos.onegodian.org']) {
  if (!requiredHosts.has(host)) failures.push(`manifest:required_target_not_enforced:${host}`);
}

for (const relative of manifest.wordpressBridge.sourcePaths || []) requireFile(relative);
requireFile('plugins/omos-core-tools-v1.3.0/readme.txt');
requireFile('plugins/omos-core-tools-v1.3.0/uninstall.php');

requireText('plugins/omos-core-tools-v1.3.0/omos-core-tools.php', [
  ['plugin_version', /Version:\s*1\.3\.0/],
  ['bridge_status_route', /\/bridge\/status/],
  ['readable_rest', /WP_REST_Server::READABLE/],
  ['plugin_loaded', /plugins_loaded/],
  ['presentation_role', /omos-wordpress-presentation-client/]
]);

requireText('plugins/omos-core-tools-v1.3.0/includes/class-omos-node-client.php', [
  ['https_requirement', /https/i],
  ['remote_get_only', /wp_remote_get/],
  ['health_allowlist', /'health'\s*=>\s*'\/api\/health'/],
  ['manifest_allowlist', /'manifest'\s*=>\s*'\/api\/manifest'/]
]);

requireText('plugins/omos-core-tools-v1.3.0/includes/class-omos-shortcodes.php', [
  ['manifest_shortcode', /omos_manifest/],
  ['runtime_shortcode', /omos_runtime_status/],
  ['tools_shortcode', /omos_tool_grid/],
  ['artifacts_shortcode', /omos_artifact_grid/],
  ['docs_shortcode', /omos_docs_grid/],
  ['bridge_builder_boundary', /not operational until/i]
]);

requireText('plugins/omos-core-tools-v1.3.0/includes/class-omos-admin.php', [
  ['manage_options', /manage_options/],
  ['nonce', /check_admin_referer/],
  ['canonical_node', /https:\/\/omos\.onegodian\.com/]
]);

const pluginFiles = (manifest.wordpressBridge.sourcePaths || []).map(relative => fs.readFileSync(path.join(root, relative), 'utf8')).join('\n');
if (/wp_remote_(post|request)\s*\(/i.test(pluginFiles)) failures.push('plugin:unexpected_remote_write_transport');
if (/OPENAI_API_KEY|ANTHROPIC_API_KEY|GEMINI_API_KEY|XAI_API_KEY|DATABASE_URL/i.test(pluginFiles)) failures.push('plugin:runtime_secret_reference_prohibited');

const result = {
  status: failures.length ? 'FAIL' : 'PASS',
  repository: manifest.canonical.repository,
  canonicalRuntime: manifest.canonical.runtimeHost,
  wordpressBridge: {
    slug: manifest.wordpressBridge.pluginSlug,
    version: manifest.wordpressBridge.packageVersion,
    mode: manifest.wordpressBridge.mode,
    repositoryPackageReady: failures.length === 0
  },
  wordpressTargets: (manifest.wordpressTargets || []).map(target => ({
    host: target.host,
    required: target.required !== false,
    deploymentState: target.deploymentState
  })),
  presentationDomain: (manifest.domains || []).find(item => item.host === 'omos.onegodian.org') || null,
  failures,
  productionClaim: false,
  note: 'PASS proves repository-side bridge packaging and safety boundaries only. Each WordPress property still requires live installation and target-site verification.'
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
