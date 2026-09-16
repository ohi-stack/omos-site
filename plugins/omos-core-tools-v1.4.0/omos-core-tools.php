<?php
/**
 * Plugin Name: OMOS Core Tools
 * Plugin URI: https://omos.onegodian.com/
 * Description: OMOS-specific WordPress interface for runtime status, Ask OMOS, Council, provider/persistence status, tools, docs, Decision History, and Belief Mapper.
 * Version: 1.4.0
 * Author: Gregory Lamar Jones / ONEGODIAN, LLC
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

final class OMOS_Core_Tools {
    const VERSION = '1.4.0';
    const OPT = 'omos_core_tools_settings';
    const MANIFEST_CACHE = 'omos_manifest_v140';

    public function __construct() {
        add_action('admin_menu', array($this, 'menu'));
        add_action('admin_init', array($this, 'settings'));
        add_action('rest_api_init', array($this, 'rest'));

        $shortcodes = array(
            'omos_runtime_status'   => 'sc_status',
            'omos_manifest'         => 'sc_manifest',
            'omos_ask'              => 'sc_ask',
            'omos_council'          => 'sc_council',
            'omos_tool_grid'        => 'sc_tools',
            'omos_docs_grid'        => 'sc_docs',
            'omos_decision_history' => 'sc_history',
            'omos_belief_mapper'    => 'sc_belief',
            'omos_unity_dashboard'  => 'sc_dashboard',
        );

        foreach ($shortcodes as $tag => $method) {
            add_shortcode($tag, array($this, $method));
        }
    }

    public static function activate() {
        if (!get_option(self::OPT)) {
            add_option(self::OPT, array(
                'runtime_url'   => 'https://omos.onegodian.com',
                'api_key'       => '',
                'cache_minutes' => 5,
                'node_name'     => get_bloginfo('name'),
                'node_type'     => 'wordpress',
            ));
        }
    }

    public static function deactivate() {
        delete_transient(self::MANIFEST_CACHE);
    }

    private function cfg() {
        return wp_parse_args(get_option(self::OPT, array()), array(
            'runtime_url'   => 'https://omos.onegodian.com',
            'api_key'       => '',
            'cache_minutes' => 5,
            'node_name'     => get_bloginfo('name'),
            'node_type'     => 'wordpress',
        ));
    }

    private function bridge_key() {
        if (defined('OMOS_BRIDGE_API_KEY') && OMOS_BRIDGE_API_KEY) {
            return (string) OMOS_BRIDGE_API_KEY;
        }
        $cfg = $this->cfg();
        return isset($cfg['api_key']) ? (string) $cfg['api_key'] : '';
    }

    private function url($path = '') {
        $cfg = $this->cfg();
        return untrailingslashit($cfg['runtime_url']) . '/' . ltrim($path, '/');
    }

    private function call($method, $path, $body = null, $authenticated = false) {
        $headers = array(
            'Accept'       => 'application/json',
            'Content-Type' => 'application/json',
            'User-Agent'   => 'OMOS-WP/' . self::VERSION . '; ' . home_url('/'),
        );

        if ($authenticated) {
            $key = $this->bridge_key();
            if (!$key) {
                return array(
                    'ok'     => false,
                    'status' => 503,
                    'error'  => 'bridge_key_not_configured',
                );
            }
            $headers['x-omos-key'] = $key;
        }

        $args = array(
            'method'      => strtoupper($method),
            'headers'     => $headers,
            'timeout'     => 20,
            'redirection' => 3,
        );

        if (null !== $body) {
            $args['body'] = wp_json_encode($body);
        }

        $response = wp_remote_request($this->url($path), $args);
        if (is_wp_error($response)) {
            return array(
                'ok'     => false,
                'status' => 0,
                'error'  => $response->get_error_message(),
            );
        }

        $code = (int) wp_remote_retrieve_response_code($response);
        $raw = wp_remote_retrieve_body($response);
        $decoded = json_decode($raw, true);

        return array(
            'ok'     => $code >= 200 && $code < 300,
            'status' => $code,
            'data'   => is_array($decoded) ? $decoded : $raw,
        );
    }

    private function public_get($path) {
        return $this->call('GET', $path, null, false);
    }

    private function health() {
        $result = $this->public_get('api/health');
        if (!$result['ok']) {
            $result = $this->public_get('health');
        }
        return $result;
    }

    private function manifest($force = false) {
        if (!$force) {
            $cached = get_transient(self::MANIFEST_CACHE);
            if (false !== $cached) {
                return $cached;
            }
        }

        $result = $this->public_get('api/manifest');
        if (!$result['ok']) {
            $result = $this->public_get('manifest');
        }

        if ($result['ok'] && is_array($result['data'])) {
            $cfg = $this->cfg();
            set_transient(
                self::MANIFEST_CACHE,
                $result['data'],
                max(1, (int) $cfg['cache_minutes']) * MINUTE_IN_SECONDS
            );
            return $result['data'];
        }

        return array();
    }

    private function providers() {
        return $this->public_get('api/v1/providers');
    }

    private function persistence() {
        return $this->public_get('api/v1/persistence');
    }

    public function settings() {
        register_setting('omos_core_tools', self::OPT, array(
            'sanitize_callback' => function ($value) {
                $current = $this->cfg();
                $incoming_key = isset($value['api_key']) ? sanitize_text_field($value['api_key']) : '';

                return array(
                    'runtime_url'   => esc_url_raw(isset($value['runtime_url']) ? $value['runtime_url'] : 'https://omos.onegodian.com'),
                    'api_key'       => '' !== $incoming_key ? $incoming_key : $current['api_key'],
                    'cache_minutes' => max(1, min(60, (int) (isset($value['cache_minutes']) ? $value['cache_minutes'] : 5))),
                    'node_name'     => sanitize_text_field(isset($value['node_name']) ? $value['node_name'] : get_bloginfo('name')),
                    'node_type'     => sanitize_key(isset($value['node_type']) ? $value['node_type'] : 'wordpress'),
                );
            },
        ));
    }

    public function menu() {
        add_menu_page('OMOS', 'OMOS', 'manage_options', 'omos-core', array($this, 'admin_dashboard'), 'dashicons-networking', 3);

        $screens = array(
            'bridge'    => 'App Bridge',
            'settings'  => 'Settings',
            'keys'      => 'API Keys',
            'tools'     => 'Tools',
            'status'    => 'Status',
            'checklist' => 'Production Checklist',
            'docs'      => 'Documentation',
        );

        foreach ($screens as $slug => $title) {
            add_submenu_page('omos-core', $title, $title, 'manage_options', 'omos-' . $slug, array($this, 'admin_' . $slug));
        }
    }

    private function shell($title, $body) {
        echo '<div class="wrap"><h1>' . esc_html($title) . '</h1>' . wp_kses_post($body) . '</div>';
    }

    public function admin_dashboard() {
        $health = $this->health();
        $persistence = $this->persistence();
        $providers = $this->providers();

        $persistence_label = 'Unavailable';
        if ($persistence['ok'] && is_array($persistence['data'])) {
            $p = isset($persistence['data']['persistence']) ? $persistence['data']['persistence'] : $persistence['data'];
            if (is_array($p) && isset($p['backend'])) {
                $persistence_label = $p['backend'] . (!empty($p['durable']) ? ' • durable' : ' • non-durable');
            }
        }

        $provider_count = 0;
        if ($providers['ok'] && isset($providers['data']['providers']) && is_array($providers['data']['providers'])) {
            $provider_count = count($providers['data']['providers']);
        }

        $body = '<h2>Runtime: ' . ($health['ok'] ? 'Connected' : 'Unavailable / not verified') . '</h2>';
        $body .= '<p><strong>Canonical runtime:</strong> ' . esc_html($this->url()) . '</p>';
        $body .= '<p><strong>Plugin:</strong> v' . esc_html(self::VERSION) . '</p>';
        $body .= '<p><strong>Persistence:</strong> ' . esc_html($persistence_label) . '</p>';
        $body .= '<p><strong>Providers reported:</strong> ' . esc_html((string) $provider_count) . '</p>';
        $body .= '<p><a class="button button-primary" href="https://omos.onegodian.com/admin" target="_blank" rel="noopener">Open OMOS Admin</a></p>';
        $this->shell('OMOS Platform Bridge', $body);
    }

    public function admin_bridge() {
        $this->shell(
            'OMOS App Bridge',
            '<p>WordPress is an OMOS client/interface. Provider credentials, orchestration, Alignment, Council synthesis, Human Gate state and Decision Records remain authoritative in the canonical OMOS runtime.</p><p>Shared cross-site status synchronization belongs to the OneGodian Platform Plugin v0.3.0+. This plugin supplies richer OMOS-specific interfaces.</p>'
        );
    }

    public function admin_settings() {
        $cfg = $this->cfg();
        ob_start();
        ?>
        <form method="post" action="options.php">
            <?php settings_fields('omos_core_tools'); ?>
            <table class="form-table">
                <tr><th>Runtime URL</th><td><input class="regular-text" name="<?php echo esc_attr(self::OPT); ?>[runtime_url]" value="<?php echo esc_attr($cfg['runtime_url']); ?>"></td></tr>
                <tr><th>Cache minutes</th><td><input type="number" min="1" max="60" name="<?php echo esc_attr(self::OPT); ?>[cache_minutes]" value="<?php echo esc_attr($cfg['cache_minutes']); ?>"></td></tr>
                <tr><th>Node name</th><td><input class="regular-text" name="<?php echo esc_attr(self::OPT); ?>[node_name]" value="<?php echo esc_attr($cfg['node_name']); ?>"></td></tr>
                <tr><th>Node type</th><td><input name="<?php echo esc_attr(self::OPT); ?>[node_type]" value="<?php echo esc_attr($cfg['node_type']); ?>"></td></tr>
            </table>
            <?php submit_button(); ?>
        </form>
        <?php
        $this->shell('OMOS Settings', ob_get_clean());
    }

    public function admin_keys() {
        $cfg = $this->cfg();
        $constant_key = defined('OMOS_BRIDGE_API_KEY') && OMOS_BRIDGE_API_KEY;
        ob_start();
        ?>
        <p>Only an OMOS bridge key belongs here. Model-provider credentials stay server-side in OMOS.</p>
        <?php if ($constant_key) : ?>
            <div class="notice notice-info inline"><p>OMOS_BRIDGE_API_KEY is supplied by server configuration. No database-stored key is required.</p></div>
        <?php else : ?>
        <form method="post" action="options.php">
            <?php settings_fields('omos_core_tools'); ?>
            <input type="hidden" name="<?php echo esc_attr(self::OPT); ?>[runtime_url]" value="<?php echo esc_attr($cfg['runtime_url']); ?>">
            <input type="hidden" name="<?php echo esc_attr(self::OPT); ?>[cache_minutes]" value="<?php echo esc_attr($cfg['cache_minutes']); ?>">
            <input type="hidden" name="<?php echo esc_attr(self::OPT); ?>[node_name]" value="<?php echo esc_attr($cfg['node_name']); ?>">
            <input type="hidden" name="<?php echo esc_attr(self::OPT); ?>[node_type]" value="<?php echo esc_attr($cfg['node_type']); ?>">
            <input type="password" autocomplete="new-password" class="regular-text" name="<?php echo esc_attr(self::OPT); ?>[api_key]" value="" placeholder="Leave blank to keep existing key">
            <?php submit_button('Save Bridge Key'); ?>
        </form>
        <?php endif; ?>
        <?php
        $this->shell('OMOS API Keys', ob_get_clean());
    }

    public function admin_tools() {
        $this->shell('OMOS Tools', $this->sc_tools());
    }

    public function admin_status() {
        $payload = array(
            'health'      => $this->health(),
            'manifest'    => $this->manifest(true),
            'providers'   => $this->providers(),
            'persistence' => $this->persistence(),
        );
        $this->shell('OMOS Status', '<pre>' . esc_html(wp_json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)) . '</pre>');
    }

    public function admin_checklist() {
        $health = $this->health();
        $manifest = $this->manifest();
        $providers = $this->providers();
        $persistence = $this->persistence();

        $checks = array(
            'Runtime URL configured' => (bool) $this->cfg()['runtime_url'],
            'HTTPS enabled on WordPress' => is_ssl(),
            'Runtime health reachable' => $health['ok'],
            'Manifest available' => !empty($manifest),
            'Providers endpoint reachable' => $providers['ok'],
            'Persistence endpoint reachable' => $persistence['ok'],
            'Bridge key configured for authenticated Ask OMOS' => (bool) $this->bridge_key(),
        );

        $body = '<ul>';
        foreach ($checks as $label => $passed) {
            $body .= '<li>' . ($passed ? '✅' : '⬜') . ' ' . esc_html($label) . '</li>';
        }
        $body .= '</ul><p><strong>Node heartbeat:</strong> not active in v1.4.0 because the canonical OMOS runtime does not currently expose a verified <code>/api/v1/nodes/heartbeat</code> endpoint.</p>';

        $this->shell('OMOS Production Checklist', $body);
    }

    public function admin_docs() {
        $this->shell(
            'OMOS Documentation',
            '<p><a href="https://omos.onegodian.com/docs" target="_blank" rel="noopener">Open OMOS Developer Documentation</a></p><p>OMOS-specific WordPress REST namespace: <code>/wp-json/omos/v1/</code></p><p>Shared platform OMOS namespace: <code>/wp-json/onegodian/v1/omos/</code></p>'
        );
    }

    public function rest() {
        register_rest_route('omos/v1', '/status', array(
            'methods' => 'GET',
            'permission_callback' => '__return_true',
            'callback' => function () {
                $health = $this->health();
                return rest_ensure_response(array(
                    'plugin' => 'OMOS Core Tools',
                    'version' => self::VERSION,
                    'runtime' => $this->url(),
                    'runtime_connected' => $health['ok'],
                    'authority' => 'client-interface',
                ));
            },
        ));

        register_rest_route('omos/v1', '/manifest', array(
            'methods' => 'GET',
            'permission_callback' => '__return_true',
            'callback' => function () {
                return rest_ensure_response($this->manifest());
            },
        ));

        register_rest_route('omos/v1', '/health', array(
            'methods' => 'GET',
            'permission_callback' => '__return_true',
            'callback' => function () {
                return rest_ensure_response($this->health());
            },
        ));

        register_rest_route('omos/v1', '/providers', array(
            'methods' => 'GET',
            'permission_callback' => '__return_true',
            'callback' => function () {
                return rest_ensure_response($this->providers());
            },
        ));

        register_rest_route('omos/v1', '/persistence', array(
            'methods' => 'GET',
            'permission_callback' => '__return_true',
            'callback' => function () {
                return rest_ensure_response($this->persistence());
            },
        ));

        register_rest_route('omos/v1', '/ask', array(
            'methods' => 'POST',
            'permission_callback' => function () {
                return is_user_logged_in();
            },
            'callback' => function ($request) {
                $prompt = sanitize_textarea_field($request->get_param('prompt'));
                if (!$prompt) {
                    return new WP_Error('omos_prompt_required', 'A prompt is required.', array('status' => 400));
                }

                $result = $this->call('POST', 'api/v1/council/run', array(
                    'prompt' => $prompt,
                    'context' => array(
                        'source' => 'wordpress',
                        'user_id' => get_current_user_id(),
                        'node' => home_url('/'),
                    ),
                ), true);

                return rest_ensure_response($result);
            },
        ));
    }

    private function card($title, $description, $url) {
        return '<a style="display:block;padding:18px;border:1px solid #d8b35a;border-radius:14px;text-decoration:none;margin:8px" href="' . esc_url($url) . '"><strong>' . esc_html($title) . '</strong><br>' . esc_html($description) . '</a>';
    }

    public function sc_status() {
        $result = $this->health();
        return '<div><strong>OMOS Runtime:</strong> ' . ($result['ok'] ? 'Connected' : 'Unavailable / not verified') . '</div>';
    }

    public function sc_manifest() {
        return '<pre>' . esc_html(wp_json_encode($this->manifest(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)) . '</pre>';
    }

    public function sc_ask() {
        if (!is_user_logged_in()) {
            return '<p>Sign in to use Ask OMOS.</p>';
        }
        return '<p><a href="https://omos.onegodian.com/ask/">Open Ask OMOS</a></p>';
    }

    public function sc_council() {
        return $this->card('OMOS Council', 'Multi-model governed review', 'https://omos.onegodian.com/council');
    }

    public function sc_tools() {
        return $this->card('Ask OMOS', 'Governed decision workspace', 'https://omos.onegodian.com/ask/')
            . $this->card('Belief Mapper', 'Structured belief reflection', 'https://omos.onegodian.com/belief-mapper')
            . $this->card('Runtime Dashboard', 'Health, providers, persistence and history', 'https://omos.onegodian.com/dashboard');
    }

    public function sc_docs() {
        return $this->card('Protocol', 'Interaction contract', 'https://omos.onegodian.com/protocol')
            . $this->card('Algorithm', 'Decision logic', 'https://omos.onegodian.com/algorithm')
            . $this->card('O-H-I', 'Synthesis architecture', 'https://omos.onegodian.com/ohi');
    }

    public function sc_history() {
        return '<p><a href="https://omos.onegodian.com/dashboard">Open OMOS Decision History</a></p>';
    }

    public function sc_belief() {
        return '<p><a href="https://omos.onegodian.com/belief-mapper">Open The Belief Mapper™</a></p>';
    }

    public function sc_dashboard() {
        return '<h2>OMOS Unity Dashboard</h2>' . $this->sc_status() . $this->sc_tools() . $this->sc_docs();
    }
}

register_activation_hook(__FILE__, array('OMOS_Core_Tools', 'activate'));
register_deactivation_hook(__FILE__, array('OMOS_Core_Tools', 'deactivate'));
new OMOS_Core_Tools();
