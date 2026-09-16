<?php
if (!defined('ABSPATH')) {
    exit;
}

final class OMOS_Admin {
    private $client;

    public function __construct(OMOS_Node_Client $client) {
        $this->client = $client;
    }

    public function register() {
        add_action('admin_menu', array($this, 'menu'));
        add_action('admin_init', array($this, 'settings'));
    }

    public function menu() {
        add_menu_page('OMOS', 'OMOS', 'manage_options', 'omos-core-tools', array($this, 'dashboard'), 'dashicons-networking', 3);
        add_submenu_page('omos-core-tools', 'OMOS Dashboard', 'Dashboard', 'manage_options', 'omos-core-tools', array($this, 'dashboard'));
        add_submenu_page('omos-core-tools', 'OMOS Node Settings', 'Node Settings', 'manage_options', 'omos-core-tools-settings', array($this, 'settings_screen'));
        add_submenu_page('omos-core-tools', 'OMOS Content Sync', 'Content Sync', 'manage_options', 'omos-core-tools-sync', array($this, 'sync_screen'));
        add_submenu_page('omos-core-tools', 'OMOS System Health', 'System Health', 'manage_options', 'omos-core-tools-health', array($this, 'health_screen'));
    }

    public function settings() {
        register_setting('omos_core_tools', OMOS_Node_Client::OPTION_NODE_URL, array(
            'type' => 'string',
            'sanitize_callback' => array($this, 'sanitize_node_url'),
            'default' => 'https://omos.onegodian.com',
        ));
    }

    public function sanitize_node_url($value) {
        $value = esc_url_raw(trim((string) $value));
        $parts = wp_parse_url($value);
        if (!$value || empty($parts['scheme']) || strtolower($parts['scheme']) !== 'https') {
            add_settings_error(OMOS_Node_Client::OPTION_NODE_URL, 'omos_https_required', 'OMOS Node URL must be a valid HTTPS URL.');
            return $this->client->node_url();
        }
        return untrailingslashit($value);
    }

    private function header($title) {
        echo '<div class="wrap"><h1>' . esc_html($title) . '</h1>';
        echo '<p>OMOS Core Tools v' . esc_html(OMOS_CORE_TOOLS_VERSION) . ' · Bridge client · Canonical node: <code>' . esc_html($this->client->node_url()) . '</code></p>';
    }

    private function finish() {
        echo '</div>';
    }

    public function dashboard() {
        if (!current_user_can('manage_options')) {
            return;
        }
        $this->header('OMOS Dashboard');
        $status = $this->client->safe_status();
        echo '<table class="widefat striped"><tbody>';
        echo '<tr><th>WordPress property</th><td>' . esc_html(home_url('/')) . '</td></tr>';
        echo '<tr><th>Plugin</th><td>omos-core-tools ' . esc_html(OMOS_CORE_TOOLS_VERSION) . '</td></tr>';
        echo '<tr><th>Node</th><td>' . esc_html($status['node']) . '</td></tr>';
        echo '<tr><th>Health endpoint</th><td>' . esc_html($status['health']['ok'] ? 'PASS' : 'REVIEW') . '</td></tr>';
        echo '<tr><th>Manifest endpoint</th><td>' . esc_html($status['manifest']['ok'] ? 'PASS' : 'REVIEW') . '</td></tr>';
        echo '<tr><th>Write bridge</th><td>Disabled</td></tr>';
        echo '<tr><th>Deployment verification</th><td>' . esc_html($status['verified'] ? 'Runtime endpoints reachable; target-site smoke evidence still required.' : 'Not verified.') . '</td></tr>';
        echo '</tbody></table>';
        $this->finish();
    }

    public function settings_screen() {
        if (!current_user_can('manage_options')) {
            return;
        }
        $this->header('OMOS Node Settings');
        settings_errors();
        echo '<form method="post" action="options.php">';
        settings_fields('omos_core_tools');
        echo '<table class="form-table"><tr><th><label for="omos_core_tools_node_url">OMOS Node URL</label></th><td><input class="regular-text" type="url" id="omos_core_tools_node_url" name="' . esc_attr(OMOS_Node_Client::OPTION_NODE_URL) . '" value="' . esc_attr($this->client->node_url()) . '" required><p class="description">Production target: https://omos.onegodian.com. The .org host may be used only after its alias/redirect behavior is verified.</p></td></tr></table>';
        submit_button('Save OMOS Node Settings');
        echo '</form>';
        $this->finish();
    }

    public function sync_screen() {
        if (!current_user_can('manage_options')) {
            return;
        }
        $message = '';
        if (isset($_POST['omos_bridge_refresh'])) {
            check_admin_referer('omos_bridge_refresh');
            $this->client->clear_cache();
            $checks = array('health', 'manifest', 'ecosystem', 'tools', 'artifacts', 'docs', 'bridge_status');
            $passed = 0;
            foreach ($checks as $check) {
                if (!is_wp_error($this->client->get($check, true))) {
                    $passed++;
                }
            }
            $message = sprintf('Node read sync checked: %d/%d public endpoints reachable.', $passed, count($checks));
        }
        $this->header('OMOS Content Sync');
        if ($message) {
            echo '<div class="notice notice-info"><p>' . esc_html($message) . '</p></div>';
        }
        echo '<p>This screen refreshes the read-only cache and validates public OMOS Node endpoints. It does not push WordPress content into OMOS and does not grant write authority.</p>';
        echo '<form method="post">';
        wp_nonce_field('omos_bridge_refresh');
        submit_button('Refresh and Test OMOS Node', 'primary', 'omos_bridge_refresh');
        echo '</form>';
        $this->finish();
    }

    public function health_screen() {
        if (!current_user_can('manage_options')) {
            return;
        }
        $this->header('OMOS System Health');
        $checks = array('health', 'manifest', 'ecosystem', 'tools', 'artifacts', 'docs', 'bridge_status');
        echo '<table class="widefat striped"><thead><tr><th>Endpoint</th><th>State</th><th>Latency</th></tr></thead><tbody>';
        foreach ($checks as $check) {
            $result = $this->client->get($check, true);
            if (is_wp_error($result)) {
                echo '<tr><td>' . esc_html($check) . '</td><td>REVIEW · ' . esc_html($result->get_error_code()) . '</td><td>—</td></tr>';
            } else {
                echo '<tr><td>' . esc_html($check) . '</td><td>PASS</td><td>' . esc_html((string) $result['latency_ms']) . ' ms</td></tr>';
            }
        }
        echo '</tbody></table>';
        echo '<p><strong>Boundary:</strong> endpoint reachability proves bridge connectivity only. It does not prove provider truth, database durability, or production deployment parity.</p>';
        $this->finish();
    }
}
