<?php
/**
 * Plugin Name: OMOS Core Tools
 * Description: Read-only WordPress bridge to the canonical OMOS runtime for status, manifests, tools, artifacts, docs, and ecosystem cards.
 * Version: 1.3.0
 * Author: ONEGODIAN, LLC
 * Text Domain: omos-core-tools
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

define('OMOS_CORE_TOOLS_VERSION', '1.3.0');
define('OMOS_CORE_TOOLS_FILE', __FILE__);
define('OMOS_CORE_TOOLS_DIR', plugin_dir_path(__FILE__));

require_once OMOS_CORE_TOOLS_DIR . 'includes/class-omos-node-client.php';
require_once OMOS_CORE_TOOLS_DIR . 'includes/class-omos-shortcodes.php';
require_once OMOS_CORE_TOOLS_DIR . 'includes/class-omos-admin.php';

final class OMOS_Core_Tools {
    private static $instance = null;
    private $client;
    private $shortcodes;
    private $admin;

    public static function instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->client = new OMOS_Node_Client();
        $this->shortcodes = new OMOS_Shortcodes($this->client);
        $this->admin = new OMOS_Admin($this->client);

        add_action('init', array($this->shortcodes, 'register'));
        add_action('rest_api_init', array($this, 'rest_routes'));
        add_action('wp_enqueue_scripts', array($this, 'public_assets'));
        $this->admin->register();
    }

    public static function activate() {
        if (!get_option(OMOS_Node_Client::OPTION_NODE_URL)) {
            add_option(OMOS_Node_Client::OPTION_NODE_URL, 'https://omos.onegodian.com', '', false);
        }
    }

    public function public_assets() {
        wp_register_style('omos-core-tools', false, array(), OMOS_CORE_TOOLS_VERSION);
        wp_enqueue_style('omos-core-tools');
        $css = '.omos-core-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px;margin:20px 0}.omos-core-card{background:#070607;color:#f5f1e8;border:1px solid rgba(216,179,90,.22);border-radius:18px;padding:20px;box-shadow:0 18px 44px rgba(0,0,0,.18)}.omos-core-card h3{margin-top:0;color:#f0d98a}.omos-core-card p{color:rgba(245,241,232,.84)}.omos-core-link,.omos-core-button{color:#f0d98a}.omos-core-button{display:inline-block;background:#15111f;border:1px solid #d8b35a;border-radius:999px;padding:11px 18px;text-decoration:none}.omos-core-unavailable{border-color:rgba(255,180,80,.45)}.omos-core-ok{border-color:rgba(216,179,90,.5)}.omos-core-planned{border-style:dashed}.omos-core-dashboard{display:grid;gap:16px}.omos-core-actions{margin:8px 0 24px}';
        wp_add_inline_style('omos-core-tools', $css);
    }

    public function rest_routes() {
        register_rest_route('omos/v1', '/bridge/status', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'bridge_status'),
            'permission_callback' => '__return_true',
        ));
    }

    public function bridge_status() {
        $status = $this->client->safe_status();
        $status['site_role'] = $this->site_role();
        $status['authority'] = 'read-only-bridge';
        $status['production_claim'] = false;
        return rest_ensure_response($status);
    }

    private function site_role() {
        $host = strtolower((string) wp_parse_url(home_url('/'), PHP_URL_HOST));
        if ($host === 'onegodian.com' || substr($host, -15) === '.onegodian.com') {
            return $host === 'omos.onegodian.com' ? 'canonical-omos-runtime-host' : 'commerce-or-ecosystem-property';
        }
        if ($host === 'onegodian.org' || substr($host, -15) === '.onegodian.org') {
            return 'public-identity-or-education-property';
        }
        if ($host === 'quantumohi.com' || substr($host, -15) === '.quantumohi.com') {
            return 'technology-positioning-property';
        }
        return 'configured-wordpress-property';
    }
}

register_activation_hook(__FILE__, array('OMOS_Core_Tools', 'activate'));
add_action('plugins_loaded', array('OMOS_Core_Tools', 'instance'));
