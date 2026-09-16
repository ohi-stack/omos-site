<?php
/**
 * Plugin Name: OMOS WordPress Bridge
 * Plugin URI: https://omos.onegodian.com
 * Description: Canonical OneGodian™ OMOS™ WordPress bridge for runtime status, manifests, tools, documentation, ecosystem surfaces, and synchronized host profiles.
 * Version: 1.4.0
 * Author: One Gregory Onegodian™ / ONEGODIAN, LLC
 * License: Proprietary
 * Text Domain: omos-wordpress-bridge
 */

if (!defined('ABSPATH')) {
    exit;
}

final class OMOS_WordPress_Bridge {
    const VERSION = '1.4.0';
    const API_BASE = 'https://omos.onegodian.com';
    const CACHE_TTL = 300;

    private static $instance = null;

    private $modules = array(
        'omos_manifest' => array(
            'label' => 'Manifest Summary',
            'route' => '/api/manifest',
            'kind' => 'data',
        ),
        'omos_runtime_status' => array(
            'label' => 'Runtime Status',
            'route' => '/api/health',
            'kind' => 'status',
        ),
        'omos_ecosystem_cards' => array(
            'label' => 'Ecosystem Cards',
            'route' => '/api/ecosystem',
            'kind' => 'grid',
        ),
        'omos_bridge_builder' => array(
            'label' => 'Bridge Builder',
            'route' => '/tools/bridge-builder',
            'kind' => 'launcher',
        ),
        'omos_tool_grid' => array(
            'label' => 'Tool Grid',
            'route' => '/api/tools',
            'kind' => 'grid',
        ),
        'omos_artifact_grid' => array(
            'label' => 'Artifact Grid',
            'route' => '/api/artifacts',
            'kind' => 'grid',
        ),
        'omos_docs_grid' => array(
            'label' => 'Documentation Grid',
            'route' => '/api/docs',
            'kind' => 'grid',
        ),
        'omos_open_console_button' => array(
            'label' => 'Console Launcher',
            'route' => '/dashboard',
            'kind' => 'launcher',
        ),
        'omos_ohi_pipeline' => array(
            'label' => 'OHI Pipeline',
            'route' => '/ohi-output-pipeline',
            'kind' => 'launcher',
        ),
        'omos_unity_dashboard' => array(
            'label' => 'Unity Dashboard',
            'route' => '/dashboard',
            'kind' => 'dashboard',
        ),
    );

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('init', array($this, 'register_shortcodes'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        add_action('admin_menu', array($this, 'register_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_action('admin_post_omos_bridge_refresh', array($this, 'handle_refresh'));
    }

    public function register_shortcodes() {
        foreach ($this->modules as $tag => $config) {
            add_shortcode($tag, array($this, 'render_shortcode'));
        }
    }

    public function enqueue_frontend_assets() {
        if (!$this->current_page_has_omos_shortcode()) {
            return;
        }

        wp_enqueue_style(
            'omos-wordpress-bridge',
            plugin_dir_url(__FILE__) . 'assets/omos-bridge.css',
            array(),
            self::VERSION
        );
    }

    public function enqueue_admin_assets($hook) {
        if ('toplevel_page_omos-bridge' !== $hook) {
            return;
        }

        wp_enqueue_style(
            'omos-wordpress-bridge-admin',
            plugin_dir_url(__FILE__) . 'assets/omos-bridge.css',
            array(),
            self::VERSION
        );
    }

    private function current_page_has_omos_shortcode() {
        if (!is_singular()) {
            return false;
        }

        $post = get_post();
        if (!$post || empty($post->post_content)) {
            return false;
        }

        foreach (array_keys($this->modules) as $tag) {
            if (has_shortcode($post->post_content, $tag)) {
                return true;
            }
        }

        return false;
    }

    public function register_admin_menu() {
        add_menu_page(
            'OMOS WordPress Bridge',
            'OMOS Bridge',
            'manage_options',
            'omos-bridge',
            array($this, 'render_admin_screen'),
            'dashicons-networking',
            58
        );
    }

    public function handle_refresh() {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('You do not have permission to perform this action.', 'omos-wordpress-bridge'));
        }

        check_admin_referer('omos_bridge_refresh');
        $this->clear_cache();

        wp_safe_redirect(add_query_arg(array(
            'page' => 'omos-bridge',
            'refreshed' => '1',
        ), admin_url('admin.php')));
        exit;
    }

    private function clear_cache() {
        foreach (array('/api/health', '/api/manifest', '/api/ecosystem', '/api/tools', '/api/artifacts', '/api/docs', '/api/bridge/status') as $path) {
            delete_transient($this->cache_key($path));
        }
    }

    private function cache_key($path) {
        return 'omos_bridge_' . md5($path);
    }

    private function fetch_json($path, $force = false) {
        $key = $this->cache_key($path);

        if (!$force) {
            $cached = get_transient($key);
            if (false !== $cached) {
                return $cached;
            }
        }

        $url = trailingslashit(self::API_BASE) . ltrim($path, '/');
        $response = wp_remote_get($url, array(
            'timeout' => 8,
            'redirection' => 2,
            'headers' => array(
                'Accept' => 'application/json',
                'User-Agent' => 'OMOS-WordPress-Bridge/' . self::VERSION,
            ),
        ));

        if (is_wp_error($response)) {
            return $response;
        }

        $code = (int) wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);

        if ($code < 200 || $code >= 300) {
            return new WP_Error('omos_http_error', sprintf('OMOS returned HTTP %d.', $code));
        }

        $decoded = json_decode($body, true);
        if (JSON_ERROR_NONE !== json_last_error()) {
            return new WP_Error('omos_json_error', 'OMOS returned an invalid JSON response.');
        }

        set_transient($key, $decoded, self::CACHE_TTL);
        return $decoded;
    }

    private function runtime_connection() {
        $health = $this->fetch_json('/api/health');

        if (is_wp_error($health)) {
            return array(
                'connected' => false,
                'status' => 'error',
                'message' => $health->get_error_message(),
                'data' => null,
            );
        }

        $status = isset($health['status']) ? strtolower((string) $health['status']) : 'unknown';
        $connected = in_array($status, array('ok', 'healthy', 'ready', 'functional'), true);

        return array(
            'connected' => $connected,
            'status' => $status,
            'message' => $connected ? 'Canonical OMOS runtime is reachable.' : 'Runtime responded but did not report a healthy state.',
            'data' => $health,
        );
    }

    public function render_shortcode($atts = array(), $content = '', $tag = '') {
        if (!isset($this->modules[$tag])) {
            return '';
        }

        $atts = shortcode_atts(array(
            'layout' => 'standard',
            'theme' => 'inherit',
            'title' => '',
            'show_header' => 'true',
            'show_status' => 'true',
            'limit' => '12',
            'columns' => '3',
            'category' => '',
            'profile' => 'auto',
        ), $atts, $tag);

        $profile = ('auto' === $atts['profile']) ? $this->detect_host_profile() : sanitize_key($atts['profile']);
        $config = $this->modules[$tag];
        $title = $atts['title'] ? sanitize_text_field($atts['title']) : $config['label'];

        try {
            return $this->render_module($tag, $config, $atts, $profile, $title);
        } catch (Throwable $e) {
            return $this->state_card('error', 'OMOS module error', $e->getMessage());
        }
    }

    private function render_module($tag, $config, $atts, $profile, $title) {
        $classes = array(
            'omos-module',
            'omos-layout-' . sanitize_html_class($atts['layout']),
            'omos-theme-' . sanitize_html_class($atts['theme']),
            'omos-profile-' . sanitize_html_class($profile),
        );

        $body = '';

        switch ($tag) {
            case 'omos_runtime_status':
                $connection = $this->runtime_connection();
                $body = $this->status_panel($connection);
                break;

            case 'omos_manifest':
                $body = $this->render_manifest();
                break;

            case 'omos_ecosystem_cards':
                $body = $this->render_api_grid('/api/ecosystem', 'Explore ecosystem', $atts);
                break;

            case 'omos_tool_grid':
                $body = $this->render_api_grid('/api/tools', 'Open OMOS tools', $atts);
                break;

            case 'omos_artifact_grid':
                $body = $this->render_api_grid('/api/artifacts', 'Browse artifacts', $atts);
                break;

            case 'omos_docs_grid':
                $body = $this->render_api_grid('/api/docs', 'Browse documentation', $atts);
                break;

            case 'omos_bridge_builder':
                $body = $this->launcher_card('Bridge Builder', 'Build and inspect approved connections between OMOS and OneGodian ecosystem surfaces.', self::API_BASE . '/tools/bridge-builder', 'Open Bridge Builder');
                break;

            case 'omos_open_console_button':
                $body = '<div class="omos-console-wrap"><a class="omos-button omos-button-primary" href="' . esc_url(self::API_BASE . '/dashboard') . '">Open OMOS Console</a></div>';
                break;

            case 'omos_ohi_pipeline':
                $body = $this->launcher_card('OHI Pipeline', 'View the OHI comparison, critique, disagreement-preservation, and synthesis pipeline.', self::API_BASE . '/ohi-output-pipeline', 'View OHI Pipeline');
                break;

            case 'omos_unity_dashboard':
                $body = $this->render_unity_dashboard();
                break;
        }

        $header = '';
        if ('true' === $atts['show_header']) {
            $header = '<div class="omos-module-header">'
                . '<div><span class="omos-brand-kicker">OneGodian™ • OMOS™ • WordPress Bridge</span>'
                . '<h2>' . esc_html($title) . '</h2></div>'
                . '<span class="omos-profile-badge">' . esc_html(ucfirst($profile)) . '</span>'
                . '</div>';
        }

        return '<section class="' . esc_attr(implode(' ', $classes)) . '" data-omos-module="' . esc_attr($tag) . '">'
            . $header
            . $body
            . '</section>';
    }

    private function render_manifest() {
        $manifest = $this->fetch_json('/api/manifest');
        if (is_wp_error($manifest)) {
            return $this->state_card('error', 'Manifest unavailable', $manifest->get_error_message());
        }

        $version = isset($manifest['version']) ? $manifest['version'] : 'Unknown';
        $status = isset($manifest['status']) ? $manifest['status'] : 'Unknown';
        $host = isset($manifest['canonicalHost']) ? $manifest['canonicalHost'] : self::API_BASE;

        return '<div class="omos-metric-grid">'
            . $this->metric('Runtime Version', $version)
            . $this->metric('Runtime Status', $status)
            . $this->metric('Canonical Host', $host)
            . $this->metric('Bridge Version', self::VERSION)
            . '</div>';
    }

    private function status_panel($connection) {
        $state = $connection['connected'] ? 'connected' : 'error';
        return '<div class="omos-status-panel">'
            . '<span class="omos-status omos-status-' . esc_attr($state) . '">' . esc_html($connection['connected'] ? 'Connected' : 'Error') . '</span>'
            . '<strong>' . esc_html(strtoupper((string) $connection['status'])) . '</strong>'
            . '<p>' . esc_html($connection['message']) . '</p>'
            . '<a class="omos-button" href="' . esc_url(self::API_BASE) . '">Open OMOS</a>'
            . '</div>';
    }

    private function render_api_grid($path, $fallback_title, $atts) {
        $data = $this->fetch_json($path);
        if (is_wp_error($data)) {
            return $this->launcher_card($fallback_title, 'The live data feed is currently unavailable. Open the canonical OMOS runtime for the latest available surface.', self::API_BASE, 'Open OMOS');
        }

        $items = $this->normalize_items($data);
        if (!$items) {
            return $this->state_card('empty', 'No items available', 'The canonical OMOS endpoint is connected but currently returned no displayable items.');
        }

        $limit = max(1, min(50, absint($atts['limit'])));
        $items = array_slice($items, 0, $limit);
        $columns = max(1, min(4, absint($atts['columns'])));

        $html = '<div class="omos-card-grid omos-cols-' . esc_attr($columns) . '">';
        foreach ($items as $item) {
            $item_title = isset($item['title']) ? $item['title'] : (isset($item['name']) ? $item['name'] : 'OMOS Item');
            $description = isset($item['description']) ? $item['description'] : '';
            $url = isset($item['url']) ? $item['url'] : (isset($item['href']) ? $item['href'] : self::API_BASE);

            $html .= '<article class="omos-card">'
                . '<span class="omos-card-eyebrow">OMOS</span>'
                . '<h3>' . esc_html($item_title) . '</h3>'
                . ($description ? '<p>' . esc_html($description) . '</p>' : '')
                . '<a class="omos-text-link" href="' . esc_url($url) . '">Open →</a>'
                . '</article>';
        }
        $html .= '</div>';

        return $html;
    }

    private function normalize_items($data) {
        if (!is_array($data)) {
            return array();
        }

        foreach (array('items', 'tools', 'docs', 'artifacts', 'ecosystem', 'routes', 'data') as $key) {
            if (isset($data[$key]) && is_array($data[$key])) {
                return array_values(array_filter($data[$key], 'is_array'));
            }
        }

        if (array_is_list($data)) {
            return array_values(array_filter($data, 'is_array'));
        }

        return array();
    }

    private function launcher_card($title, $description, $url, $button) {
        return '<article class="omos-feature-card">'
            . '<div><span class="omos-card-eyebrow">Canonical OMOS Surface</span>'
            . '<h3>' . esc_html($title) . '</h3>'
            . '<p>' . esc_html($description) . '</p></div>'
            . '<a class="omos-button omos-button-primary" href="' . esc_url($url) . '">' . esc_html($button) . '</a>'
            . '</article>';
    }

    private function render_unity_dashboard() {
        $connection = $this->runtime_connection();
        $manifest = $this->fetch_json('/api/manifest');
        $runtime_version = (!is_wp_error($manifest) && isset($manifest['version'])) ? $manifest['version'] : 'Unavailable';

        return '<div class="omos-dashboard-grid">'
            . $this->metric('Runtime', $connection['connected'] ? 'Connected' : 'Error')
            . $this->metric('OMOS Version', $runtime_version)
            . $this->metric('Bridge', self::VERSION)
            . $this->metric('Host Profile', ucfirst($this->detect_host_profile()))
            . '</div>'
            . '<div class="omos-dashboard-actions">'
            . '<a class="omos-button omos-button-primary" href="' . esc_url(self::API_BASE . '/dashboard') . '">Open Workspace</a>'
            . '<a class="omos-button" href="' . esc_url(self::API_BASE . '/docs') . '">Documentation</a>'
            . '</div>';
    }

    private function metric($label, $value) {
        return '<div class="omos-metric"><span>' . esc_html($label) . '</span><strong>' . esc_html((string) $value) . '</strong></div>';
    }

    private function state_card($state, $title, $message) {
        return '<div class="omos-state omos-state-' . esc_attr($state) . '">'
            . '<strong>' . esc_html($title) . '</strong>'
            . '<p>' . esc_html($message) . '</p>'
            . '</div>';
    }

    private function detect_host_profile() {
        $host = isset($_SERVER['HTTP_HOST']) ? strtolower(sanitize_text_field(wp_unslash($_SERVER['HTTP_HOST']))) : '';

        if (false !== strpos($host, 'quantumohi.com')) {
            return 'enterprise';
        }
        if (false !== strpos($host, 'onegodian.com') && false === strpos($host, 'omos.onegodian.com')) {
            return 'commerce';
        }
        return 'org';
    }

    private function shortcode_test($tag) {
        if (!shortcode_exists($tag)) {
            return array('working' => false, 'error' => 'Shortcode is not registered.');
        }

        try {
            $output = do_shortcode('[' . $tag . ' show_header="false" limit="1" columns="1"]');
            if ('' === trim((string) $output)) {
                return array('working' => false, 'error' => 'Shortcode returned empty output.');
            }
            return array('working' => true, 'error' => '');
        } catch (Throwable $e) {
            return array('working' => false, 'error' => $e->getMessage());
        }
    }

    public function render_admin_screen() {
        if (!current_user_can('manage_options')) {
            return;
        }

        $connection = $this->runtime_connection();
        $manifest = $this->fetch_json('/api/manifest');
        $manifest_version = (!is_wp_error($manifest) && isset($manifest['version'])) ? $manifest['version'] : 'Unavailable';
        $refresh_url = wp_nonce_url(admin_url('admin-post.php?action=omos_bridge_refresh'), 'omos_bridge_refresh');
        ?>
        <div class="wrap omos-admin-shell">
            <div class="omos-admin-hero">
                <div>
                    <span class="omos-brand-kicker">OneGodian™ • OMOS™ • WordPress Bridge</span>
                    <h1>OMOS Bridge Control Center</h1>
                    <p>Canonical runtime synchronization, shortcode health, modular UI status, and host-profile diagnostics.</p>
                </div>
                <div class="omos-admin-actions">
                    <span class="omos-version-badge">Bridge v<?php echo esc_html(self::VERSION); ?></span>
                    <a class="button button-primary" href="<?php echo esc_url($refresh_url); ?>">Refresh Runtime</a>
                </div>
            </div>

            <div class="omos-metric-grid omos-admin-metrics">
                <?php echo $this->metric('Canonical Runtime', $connection['connected'] ? 'Connected' : 'Error'); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                <?php echo $this->metric('OMOS Runtime', $manifest_version); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                <?php echo $this->metric('Bridge Version', self::VERSION); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                <?php echo $this->metric('Host Profile', ucfirst($this->detect_host_profile())); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
            </div>

            <?php if (isset($_GET['refreshed'])) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
                <div class="notice notice-success is-dismissible"><p>OMOS runtime cache refreshed.</p></div>
            <?php endif; ?>

            <div class="omos-admin-panel">
                <div class="omos-panel-heading">
                    <div>
                        <span class="omos-card-eyebrow">Canonical Module Registry</span>
                        <h2>Shortcode Status</h2>
                    </div>
                    <p>All ten canonical shortcodes are registered from this plugin codebase.</p>
                </div>

                <div class="omos-table-wrap">
                    <table class="widefat striped omos-status-table">
                        <thead>
                            <tr>
                                <th>Shortcode</th>
                                <th>Module</th>
                                <th>Registered</th>
                                <th>Working</th>
                                <th>Connected</th>
                                <th>Error</th>
                            </tr>
                        </thead>
                        <tbody>
                        <?php foreach ($this->modules as $tag => $config) :
                            $registered = shortcode_exists($tag);
                            $test = $this->shortcode_test($tag);
                            $connected = $connection['connected'];
                            $error = $test['error'];
                            if (!$connected && !$error) {
                                $error = $connection['message'];
                            }
                            ?>
                            <tr>
                                <td><code>[<?php echo esc_html($tag); ?>]</code></td>
                                <td><?php echo esc_html($config['label']); ?></td>
                                <td><?php echo $this->admin_state_badge($registered ? 'registered' : 'error', $registered ? 'Registered' : 'Error'); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></td>
                                <td><?php echo $this->admin_state_badge($test['working'] ? 'working' : 'error', $test['working'] ? 'Working' : 'Error'); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></td>
                                <td><?php echo $this->admin_state_badge($connected ? 'connected' : 'error', $connected ? 'Connected' : 'Error'); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></td>
                                <td><?php echo $error ? '<span class="omos-error-text">' . esc_html($error) . '</span>' : '<span class="omos-ok-text">—</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></td>
                            </tr>
                        <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="omos-admin-panel">
                <span class="omos-card-eyebrow">Brand Standard</span>
                <h2>OneGodian / OMOS Interface Identity</h2>
                <p>The bridge uses the canonical obsidian, gold, purple, and warm-white OneGodian interface palette, with shared cards, badges, buttons, metrics, grids, and responsive workspace layouts. Host profiles change emphasis without forking core module logic.</p>
            </div>
        </div>
        <?php
    }

    private function admin_state_badge($state, $label) {
        return '<span class="omos-status omos-status-' . esc_attr($state) . '">' . esc_html($label) . '</span>';
    }
}

OMOS_WordPress_Bridge::instance();
