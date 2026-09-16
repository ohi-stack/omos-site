<?php
/**
 * Plugin Name: OMOS Core Tools
 * Plugin URI: https://omos.onegodian.com/
 * Description: Server-side WordPress bridge to the canonical OMOS runtime. Provides runtime health, manifest status, site profiles, safe shortcodes, and bridge diagnostics without duplicating the OMOS reasoning runtime inside WordPress.
 * Version: 1.3.0
 * Author: ONEGODIAN, LLC
 * Text Domain: omos-core-tools
 */

if (!defined('ABSPATH')) {
    exit;
}

define('OMOS_CORE_TOOLS_VERSION', '1.3.0');
define('OMOS_CORE_TOOLS_FILE', __FILE__);
define('OMOS_CORE_TOOLS_DIR', plugin_dir_path(__FILE__));
define('OMOS_CORE_TOOLS_URL', plugin_dir_url(__FILE__));

require_once OMOS_CORE_TOOLS_DIR . 'includes/class-omos-runtime-client.php';
require_once OMOS_CORE_TOOLS_DIR . 'includes/class-omos-core-tools.php';

register_activation_hook(__FILE__, array('OMOS_Core_Tools', 'activate'));

add_action('plugins_loaded', static function () {
    OMOS_Core_Tools::instance();
});
