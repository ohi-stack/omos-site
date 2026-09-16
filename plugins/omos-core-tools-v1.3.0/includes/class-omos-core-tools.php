<?php

if (!defined('ABSPATH')) {
    exit;
}

final class OMOS_Core_Tools {
    const OPTION_SETTINGS = 'omos_core_tools_settings';
    private static $instance = null;
    private $client;

    public static function instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public static function activate() {
        $current = get_option(self::OPTION_SETTINGS, array());
        $defaults = array(
            'runtime_url' => 'https://omos.onegodian.com',
            'site_profile' => 'auto',
        );
        update_option(self::OPTION_SETTINGS, wp_parse_args(is_array($current) ? $current : array(), $defaults), false);
    }

    private function __construct() {
        $settings = $this->settings();
        $this->client = new OMOS_Runtime_Client($settings['runtime_url']);

        add_action('admin_menu', array($this, 'admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        add_action('init', array($this, 'register_shortcodes'));
    }

    public function settings() {
        $value = get_option(self::OPTION_SETTINGS, array());
        return wp_parse_args(is_array($value) ? $value : array(), array(
            'runtime_url' => 'https://omos.onegodian.com',
            'site_profile' => 'auto',
        ));
    }

    public function register_settings() {
        register_setting('omos_core_tools', self::OPTION_SETTINGS, array(
            'type' => 'array',
            'sanitize_callback' => array($this, 'sanitize_settings'),
            'default' => array('runtime_url' => 'https://omos.onegodian.com', 'site_profile' => 'auto'),
        ));
    }

    public function sanitize_settings($input) {
        $runtime_url = isset($input['runtime_url']) ? untrailingslashit(esc_url_raw($input['runtime_url'])) : 'https://omos.onegodian.com';
        if (strpos($runtime_url, 'https://') !== 0) {
            $runtime_url = 'https://omos.onegodian.com';
            add_settings_error(self::OPTION_SETTINGS, 'omos_https_required', 'OMOS runtime URL must use HTTPS.');
        }

        $allowed_profiles = array('auto', 'onegodian_com', 'onegodian_org', 'quantumohi_com', 'generic');
        $profile = isset($input['site_profile']) ? sanitize_key($input['site_profile']) : 'auto';
        if (!in_array($profile, $allowed_profiles, true)) {
            $profile = 'auto';
        }

        return array('runtime_url' => $runtime_url, 'site_profile' => $profile);
    }

    public function admin_menu() {
        add_menu_page(
            'OMOS Bridge',
            'OMOS Bridge',
            'manage_options',
            'omos-core-tools',
            array($this, 'render_admin_page'),
            'dashicons-networking',
            58
        );
    }

    public function render_admin_page() {
        if (!current_user_can('manage_options')) {
            return;
        }
        $settings = $this->settings();
        $status = $this->client->safe_connection_status();
        ?>
        <div class="wrap">
            <h1>OMOS WordPress Bridge</h1>
            <p>This plugin is a client of the canonical OMOS runtime. It does not duplicate Layer 1, Alignment, Council, Synthesis, Human Gate, or Decision Record authority inside WordPress.</p>

            <h2>Connection status</h2>
            <table class="widefat striped" style="max-width:900px">
                <tbody>
                    <tr><th>Runtime</th><td><?php echo esc_html($status['runtime_url']); ?></td></tr>
                    <tr><th>Connection</th><td><?php echo esc_html($status['status']); ?></td></tr>
                    <tr><th>Runtime version</th><td><?php echo esc_html(isset($status['runtime_version']) ? $status['runtime_version'] : 'Unavailable'); ?></td></tr>
                    <tr><th>Site profile</th><td><?php echo esc_html($this->site_profile()); ?></td></tr>
                    <tr><th>Authenticated actions</th><td><?php echo !empty($status['authenticated_requests_configured']) ? 'Server key configured' : 'Not configured'; ?></td></tr>
                </tbody>
            </table>

            <?php if (!empty($status['error'])) : ?>
                <div class="notice notice-warning"><p><?php echo esc_html($status['error']); ?></p></div>
            <?php endif; ?>

            <form method="post" action="options.php" style="max-width:900px;margin-top:24px">
                <?php settings_fields('omos_core_tools'); ?>
                <table class="form-table">
                    <tr>
                        <th scope="row"><label for="omos-runtime-url">OMOS Runtime URL</label></th>
                        <td><input id="omos-runtime-url" class="regular-text" type="url" name="<?php echo esc_attr(self::OPTION_SETTINGS); ?>[runtime_url]" value="<?php echo esc_attr($settings['runtime_url']); ?>" required></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="omos-site-profile">Site profile</label></th>
                        <td>
                            <select id="omos-site-profile" name="<?php echo esc_attr(self::OPTION_SETTINGS); ?>[site_profile]">
                                <?php foreach (array('auto'=>'Auto detect','onegodian_com'=>'OneGodian.com','onegodian_org'=>'OneGodian.org','quantumohi_com'=>'QuantumOHI.com','generic'=>'Generic WordPress client') as $value => $label) : ?>
                                    <option value="<?php echo esc_attr($value); ?>" <?php selected($settings['site_profile'], $value); ?>><?php echo esc_html($label); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </td>
                    </tr>
                </table>
                <?php submit_button('Save OMOS Bridge Settings'); ?>
            </form>

            <h2>Credential rule</h2>
            <p>For authenticated OMOS requests, define <code>OMOS_RUNTIME_API_KEY</code> server-side in <code>wp-config.php</code> or the hosting environment. The bridge never renders the key back to the browser and does not store it in Decision Records.</p>
        </div>
        <?php
    }

    public function register_shortcodes() {
        add_shortcode('omos_runtime_status', array($this, 'shortcode_runtime_status'));
        add_shortcode('omos_manifest', array($this, 'shortcode_manifest'));
        add_shortcode('omos_open_console_button', array($this, 'shortcode_open_console'));
        add_shortcode('omos_ask_launcher', array($this, 'shortcode_ask_launcher'));
    }

    public function shortcode_runtime_status() {
        $status = $this->client->safe_connection_status();
        $state = isset($status['status']) ? $status['status'] : 'UNAVAILABLE';
        $version = isset($status['runtime_version']) ? $status['runtime_version'] : 'unknown';
        return '<div class="omos-runtime-status"><strong>OMOS Runtime:</strong> ' . esc_html($state) . ' <span>Version ' . esc_html($version) . '</span></div>';
    }

    public function shortcode_manifest() {
        $manifest = $this->client->manifest();
        if (is_wp_error($manifest)) {
            return '<div class="omos-runtime-status">OMOS manifest unavailable.</div>';
        }
        $name = isset($manifest['name']) ? $manifest['name'] : 'OMOS';
        $version = isset($manifest['version']) ? $manifest['version'] : 'unknown';
        return '<div class="omos-manifest"><strong>' . esc_html($name) . '</strong><br><span>Runtime version: ' . esc_html($version) . '</span></div>';
    }

    public function shortcode_open_console() {
        return '<a class="omos-open-console" href="' . esc_url($this->client->base_url() . '/dashboard') . '">Open OMOS Console</a>';
    }

    public function shortcode_ask_launcher() {
        return '<a class="omos-ask-launcher" href="' . esc_url($this->client->base_url() . '/ask/') . '">Ask OMOS</a>';
    }

    public function register_rest_routes() {
        register_rest_route('omos/v1', '/bridge/status', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'rest_bridge_status'),
            'permission_callback' => '__return_true',
        ));
        register_rest_route('omos/v1', '/manifest', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'rest_bridge_manifest'),
            'permission_callback' => '__return_true',
        ));
    }

    public function rest_bridge_status() {
        return rest_ensure_response(array(
            'bridge' => 'omos-core-tools',
            'bridge_version' => OMOS_CORE_TOOLS_VERSION,
            'site_profile' => $this->site_profile(),
            'runtime' => $this->client->safe_connection_status(),
            'write_capabilities' => array(),
            'authority' => 'client_bridge_only',
        ));
    }

    public function rest_bridge_manifest() {
        return rest_ensure_response(array(
            'id' => 'omos-wordpress-bridge',
            'version' => OMOS_CORE_TOOLS_VERSION,
            'site_profile' => $this->site_profile(),
            'runtime_url' => $this->client->base_url(),
            'shortcodes' => array('omos_runtime_status', 'omos_manifest', 'omos_open_console_button', 'omos_ask_launcher'),
            'source_of_record' => array(
                'governed_runtime' => 'OMOS.OneGodian.com',
                'wordpress_content' => home_url('/'),
            ),
        ));
    }

    public function site_profile() {
        $settings = $this->settings();
        if ($settings['site_profile'] !== 'auto') {
            return $settings['site_profile'];
        }

        $host = strtolower((string) wp_parse_url(home_url('/'), PHP_URL_HOST));
        if ($host === 'onegodian.com' || substr($host, -14) === '.onegodian.com') {
            return 'onegodian_com';
        }
        if ($host === 'onegodian.org' || substr($host, -14) === '.onegodian.org') {
            return 'onegodian_org';
        }
        if ($host === 'quantumohi.com' || substr($host, -15) === '.quantumohi.com') {
            return 'quantumohi_com';
        }
        return 'generic';
    }
}
