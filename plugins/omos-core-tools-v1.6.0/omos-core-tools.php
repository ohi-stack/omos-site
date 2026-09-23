<?php
/**
 * Plugin Name: OMOS Core Tools
 * Plugin URI: https://omos.onegodian.org/
 * Description: Canonical WordPress presentation and integration bridge for the OMOS governed runtime, with OneGodian Members / INO Platform interoperability.
 * Version: 1.6.0
 * Author: One Gregory Onegodian™ / ONEGODIAN, LLC
 * Author URI: https://onegodian.com/
 * License: Proprietary
 * Text Domain: omos-core-tools
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

define('OMOS_CORE_TOOLS_VERSION', '1.6.0');
define('OMOS_CORE_TOOLS_FILE', __FILE__);
define('OMOS_CORE_TOOLS_DIR', plugin_dir_path(__FILE__));
define('OMOS_CORE_TOOLS_URL', plugin_dir_url(__FILE__));

require_once OMOS_CORE_TOOLS_DIR . 'includes/class-omos-runtime-client.php';
require_once OMOS_CORE_TOOLS_DIR . 'includes/class-omos-members-bridge.php';
require_once OMOS_CORE_TOOLS_DIR . 'includes/class-omos-shortcodes.php';
require_once OMOS_CORE_TOOLS_DIR . 'includes/class-omos-admin.php';
require_once OMOS_CORE_TOOLS_DIR . 'includes/class-omos-core-tools.php';

register_activation_hook(__FILE__, array('OMOS_Core_Tools', 'activate'));
register_deactivation_hook(__FILE__, array('OMOS_Core_Tools', 'deactivate'));

OMOS_Core_Tools::instance()->run();
