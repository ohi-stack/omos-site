'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const syncManifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'omos-platform-sync.manifest.json'), 'utf8'));
const pluginManifest = JSON.parse(fs.readFileSync(path.join(root, 'plugins', 'omos-core-tools-v1.4.0', 'plugin-manifest.json'), 'utf8'));
const pluginPath = path.join(root, 'plugins', 'omos-core-tools-v1.4.0', 'omos-core-tools.php');
const plugin = fs.readFileSync(pluginPath, 'utf8');
const failures = [];

function expect(condition, code) {
  if (!condition) failures.push(code);
}

function has(pattern, code) {
  expect(pattern.test(plugin), code);
}

expect(syncManifest.canonical.repository === 'ohi-stack/omos-site', 'sync:canonical_repository');
expect(syncManifest.canonical.runtimeHost === 'https://omos.onegodian.com', 'sync:canonical_runtime');
expect(syncManifest.wordpressLayers && syncManifest.wordpressLayers.omosCoreTools && syncManifest.wordpressLayers.omosCoreTools.version === '1.4.0', 'sync:plugin_version');
expect(syncManifest.wordpressLayers.omosCoreTools.path === 'plugins/omos-core-tools-v1.4.0', 'sync:plugin_path');
expect(Array.isArray(syncManifest.requiredWordPressTargets) && syncManifest.requiredWordPressTargets.includes('omos.onegodian.org'), 'sync:presentation_target_required');

expect(pluginManifest.plugin && pluginManifest.plugin.version === '1.4.0', 'plugin_manifest:version');
expect(pluginManifest.plugin.canonical_runtime === 'https://omos.onegodian.com', 'plugin_manifest:runtime');
expect(pluginManifest.presentation_target && pluginManifest.presentation_target.url === 'https://omos.onegodian.org', 'plugin_manifest:presentation_target');
expect(pluginManifest.presentation_target && pluginManifest.presentation_target.authority === 'client-only', 'plugin_manifest:presentation_authority');
expect(pluginManifest.plugin.status !== 'production', 'plugin_manifest:no_false_production_claim');

const expectedReads = ['/api/health', '/api/manifest', '/api/v1/providers', '/api/v1/persistence'];
for (const endpoint of expectedReads) {
  expect((pluginManifest.implemented_runtime_reads || []).includes(endpoint), `plugin_manifest:missing_read:${endpoint}`);
}
expect((pluginManifest.implemented_authenticated_actions || []).some(item => item.includes('POST /api/v1/council/run')), 'plugin_manifest:council_action');

has(/Version:\s*1\.4\.0/, 'plugin:version_header');
has(/https:\/\/omos\.onegodian\.com/, 'plugin:canonical_runtime');
has(/OMOS_BRIDGE_API_KEY/, 'plugin:server_bridge_key_support');
has(/api\/v1\/providers/, 'plugin:providers_proxy');
has(/api\/v1\/persistence/, 'plugin:persistence_proxy');
has(/api\/v1\/council\/run/, 'plugin:council_proxy');
has(/register_rest_route\('omos\/v1',\s*'\/ask'/, 'plugin:ask_route');
has(/permission_callback[\s\S]{0,240}is_user_logged_in\(\)/, 'plugin:ask_login_gate');
has(/sanitize_textarea_field\(/, 'plugin:prompt_sanitization');
has(/'x-omos-key'\]\s*=\s*\$key/, 'plugin:authenticated_runtime_header');
has(/WordPress is an OMOS client\/interface/, 'plugin:authority_boundary');

const forbiddenSecretNames = ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GEMINI_API_KEY', 'XAI_API_KEY', 'DATABASE_URL'];
for (const secretName of forbiddenSecretNames) {
  expect(!plugin.includes(secretName), `plugin:runtime_secret_reference:${secretName}`);
}

const result = {
  status: failures.length ? 'FAIL' : 'PASS',
  canonicalRepository: syncManifest.canonical.repository,
  canonicalRuntime: syncManifest.canonical.runtimeHost,
  plugin: {
    slug: pluginManifest.plugin.slug,
    version: pluginManifest.plugin.version,
    status: pluginManifest.plugin.status,
    path: syncManifest.wordpressLayers.omosCoreTools.path
  },
  presentationTarget: pluginManifest.presentation_target,
  sharedWordPressRepository: syncManifest.repositories.sharedWordPressPlatform,
  actionAdapterRepository: syncManifest.repositories.wordpressActionAdapter,
  failures,
  productionClaim: false,
  note: 'PASS proves repository-side OMOS Core Tools v1.4 contract alignment only. Live WordPress installation and target-site behavior require separate verification.'
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
