<?php
if (!defined('ABSPATH')) {
    exit;
}

final class OMOS_Core_Tools {
    private static $instance = null;
    private $client;
    private $shortcodes;
    private $admin;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->client = new OMOS_Runtime_Client();
        $this->shortcodes = new OMOS_Shortcodes($this->client);
        $this->admin = new OMOS_Admin($this->client, $this->shortcodes, array($this, 'site_role'));
    }

    public static function activate() {
        $client = new OMOS_Runtime_Client();
        if (!get_option(OMOS_Runtime_Client::SETTINGS_OPTION)) {
            add_option(OMOS_Runtime_Client::SETTINGS_OPTION, $client->defaults());
        }
        flush_rewrite_rules(false);
    }

    public static function deactivate() {
        $client = new OMOS_Runtime_Client();
        $client->clear_cache();
        flush_rewrite_rules(false);
    }

    public function run() {
        add_action('init', array($this->shortcodes, 'register'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_action('admin_post_omos_core_tools_refresh', array($this, 'refresh_runtime_cache'));
        $this->admin->register_hooks();
    }

    public function register_settings() {
        register_setting('omos_core_tools', OMOS_Runtime_Client::SETTINGS_OPTION, array(
            'type'              => 'array',
            'sanitize_callback' => array($this->client, 'sanitize_settings'),
            'default'           => $this->client->defaults(),
        ));
    }

    public function site_role() {
        $host = wp_parse_url(home_url('/'), PHP_URL_HOST);
        $host = strtolower((string) $host);

        if ('omos.onegodian.org' === $host) {
            return 'omos-public';
        }
        if ('u.onegodian.org' === $host) {
            return 'university';
        }
        if ('onegodian.org' === $host || 'www.onegodian.org' === $host) {
            return 'public-org';
        }
        if ('onegodian.com' === $host || 'www.onegodian.com' === $host) {
            return 'commerce';
        }
        if ('quantumohi.com' === $host || 'www.quantumohi.com' === $host) {
            return 'quantumohi';
        }
        return 'wordpress-client';
    }

    public function enqueue_frontend_assets() {
        if (!$this->page_has_omos_shortcode()) {
            return;
        }
        wp_enqueue_style('omos-core-tools', OMOS_CORE_TOOLS_URL . 'assets/omos-core-tools.css', array(), OMOS_CORE_TOOLS_VERSION);
    }

    public function enqueue_admin_assets($hook) {
        if (false === strpos((string) $hook, 'omos-core')) {
            return;
        }
        wp_enqueue_style('omos-core-tools-admin', OMOS_CORE_TOOLS_URL . 'assets/omos-core-tools.css', array(), OMOS_CORE_TOOLS_VERSION);
    }

    private function page_has_omos_shortcode() {
        if (!is_singular()) {
            return false;
        }
        $post = get_post();
        if (!$post || empty($post->post_content)) {
            return false;
        }
        foreach (array_merge($this->shortcodes->canonical_registry(), $this->shortcodes->compatibility_registry()) as $tag) {
            if (has_shortcode($post->post_content, $tag)) {
                return true;
            }
        }
        return false;
    }

    public function refresh_runtime_cache() {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('You do not have permission to refresh OMOS runtime data.', 'omos-core-tools'));
        }
        check_admin_referer('omos_core_tools_refresh');
        $this->client->clear_cache();
        wp_safe_redirect(add_query_arg(array('page' => 'omos-core', 'refreshed' => '1'), admin_url('admin.php')));
        exit;
    }

    public function register_rest_routes() {
        register_rest_route('omos/v1', '/status', array(
            'methods'             => 'GET',
            'permission_callback' => '__return_true',
            'callback'            => array($this, 'rest_status'),
        ));
        register_rest_route('omos/v1', '/sync', array(
            'methods'             => 'GET',
            'permission_callback' => '__return_true',
            'callback'            => array($this, 'rest_sync'),
        ));
        register_rest_route('omos/v1', '/shortcodes', array(
            'methods'             => 'GET',
            'permission_callback' => '__return_true',
            'callback'            => array($this, 'rest_shortcodes'),
        ));
        register_rest_route('omos/v1', '/manifest', array(
            'methods'             => 'GET',
            'permission_callback' => '__return_true',
            'callback'            => function () { return rest_ensure_response($this->client->manifest()); },
        ));
        register_rest_route('omos/v1', '/health', array(
            'methods'             => 'GET',
            'permission_callback' => '__return_true',
            'callback'            => function () { return rest_ensure_response($this->client->health()); },
        ));
        register_rest_route('omos/v1', '/providers', array(
            'methods'             => 'GET',
            'permission_callback' => '__return_true',
            'callback'            => function () { return rest_ensure_response($this->client->providers()); },
        ));
        register_rest_route('omos/v1', '/persistence', array(
            'methods'             => 'GET',
            'permission_callback' => '__return_true',
            'callback'            => function () { return rest_ensure_response($this->client->persistence()); },
        ));
        register_rest_route('omos/v1', '/ask', array(
            'methods'             => 'POST',
            'permission_callback' => function () { return is_user_logged_in(); },
            'callback'            => array($this, 'rest_ask'),
            'args'                => array('prompt' => array('required' => true, 'sanitize_callback' => 'sanitize_textarea_field')),
        ));
    }

    public function rest_status() {
        return rest_ensure_response(array(
            'status'        => 'functional',
            'plugin'        => 'OMOS Core Tools',
            'version'       => OMOS_CORE_TOOLS_VERSION,
            'site_role'     => $this->site_role(),
            'public_url'    => $this->client->public_url(),
            'runtime_url'   => $this->client->runtime_url(),
            'authority'     => 'presentation-and-integration-client',
            'key_source'    => $this->client->bridge_key_source(),
            'generated_at'  => gmdate('c'),
        ));
    }

    public function rest_sync() {
        $health = $this->client->health();
        $manifest = $this->client->manifest();
        return rest_ensure_response(array(
            'plugin'               => 'OMOS Core Tools',
            'plugin_version'       => OMOS_CORE_TOOLS_VERSION,
            'site_role'            => $this->site_role(),
            'site_url'             => home_url('/'),
            'public_surface'       => $this->client->public_url(),
            'governed_runtime'     => $this->client->runtime_url(),
            'runtime_connected'    => !empty($health['ok']),
            'runtime_version'      => (!empty($manifest['ok']) && is_array($manifest['data']) && isset($manifest['data']['version'])) ? $manifest['data']['version'] : null,
            'canonical_shortcodes' => $this->shortcodes->canonical_registry(),
            'compatibility'        => $this->shortcodes->compatibility_registry(),
            'authority_boundary'   => 'WordPress does not own provider credentials, Council authority, Human Gate, Decision Records, PostgreSQL, deployments, payments, or consequential external actions.',
            'generated_at'         => gmdate('c'),
        ));
    }

    public function rest_shortcodes() {
        return rest_ensure_response(array(
            'plugin_version' => OMOS_CORE_TOOLS_VERSION,
            'canonical'      => $this->shortcodes->status_matrix(),
            'compatibility'  => $this->shortcodes->compatibility_registry(),
            'generated_at'   => gmdate('c'),
        ));
    }

    public function rest_ask(WP_REST_Request $request) {
        $prompt = (string) $request->get_param('prompt');
        if ('' === trim($prompt)) {
            return new WP_Error('omos_prompt_required', 'A prompt is required.', array('status' => 400));
        }
        $result = $this->client->ask($prompt);
        $status = !empty($result['ok']) ? 200 : (isset($result['status']) && $result['status'] ? (int) $result['status'] : 502);
        return new WP_REST_Response($result, $status);
    }
}
