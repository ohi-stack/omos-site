const fs = require('fs');
const path = require('path');

const pluginDir = path.join(__dirname, '..', 'plugins', 'omos-core-tools-v1.6.0');

function read(relativePath) {
  return fs.readFileSync(path.join(pluginDir, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const requiredFiles = [
  'omos-core-tools.php',
  'plugin-manifest.json',
  'includes/class-omos-core-tools.php',
  'includes/class-omos-members-bridge.php',
  'includes/class-omos-shortcodes.php',
  'includes/class-omos-admin.php',
];

for (const file of requiredFiles) {
  assert(fs.existsSync(path.join(pluginDir, file)), `missing ${file}`);
}

const bootstrap = read('omos-core-tools.php');
const core = read('includes/class-omos-core-tools.php');
const bridge = read('includes/class-omos-members-bridge.php');
const shortcodes = read('includes/class-omos-shortcodes.php');
const admin = read('includes/class-omos-admin.php');
const manifest = JSON.parse(read('plugin-manifest.json'));

assert(bootstrap.includes("Version: 1.6.0"), 'plugin header must be 1.6.0');
assert(bootstrap.includes("OMOS_CORE_TOOLS_VERSION', '1.6.0"), 'plugin constant must be 1.6.0');
assert(bootstrap.includes("class-omos-members-bridge.php"), 'members bridge must load from bootstrap');

assert(bridge.includes("defined('OGM_VERSION')"), 'bridge must detect OGM_VERSION');
assert(bridge.includes("OneGodian_Members_Contributors_Affiliates"), 'bridge must detect legacy/current members class');
assert(bridge.includes("onegodian_member_dashboard"), 'bridge must support member dashboard shortcode');
assert(bridge.includes("ino_platform_overview"), 'bridge must support current INO Platform surface');
assert(bridge.includes("source_of_truth"), 'bridge must declare membership source-of-truth boundary');

assert(core.includes("'/members'"), 'OMOS REST API must expose members integration route');
assert(core.includes("members_integration"), 'OMOS sync/status payloads must expose members integration status');
assert(core.includes("is_user_logged_in"), 'member REST route must require authenticated WordPress user');

assert(shortcodes.includes("'omos_member_portal'"), 'compatibility shortcode [omos_member_portal] must be registered');
assert(shortcodes.includes('render_member_portal'), 'member portal renderer must exist');

assert(admin.includes('Members / INO Platform'), 'admin UI must display Members / INO Platform integration status');

assert(manifest.plugin.version === '1.6.0', 'manifest version must be 1.6.0');
assert(manifest.members_integration, 'manifest must document members integration');
assert(manifest.members_integration.source_of_truth === 'OneGodian Members / INO Platform + WordPress/WooCommerce', 'manifest must preserve membership authority');
assert(manifest.compatibility_shortcodes.includes('[omos_member_portal]'), 'manifest must include member portal compatibility shortcode');
assert(manifest.wordpress_rest.includes('GET /wp-json/omos/v1/members'), 'manifest must include members REST route');

console.log('OMOS Members integration contract OK');
