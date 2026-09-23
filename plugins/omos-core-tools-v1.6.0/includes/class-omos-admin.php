<?php
if (!defined('ABSPATH')) {
    exit;
}

final class OMOS_Admin {
    private $client;
    private $shortcodes;
    private $members;
    private $site_role_callback;

    public function __construct(OMOS_Runtime_Client $client, OMOS_Shortcodes $shortcodes, OMOS_Members_Bridge $members, $site_role_callback) {
        $this->client = $client;
        $this->shortcodes = $shortcodes;
        $this->members = $members;
        $this->site_role_callback = $site_role_callback;
    }

    public function register_hooks() {
        add_action('admin_menu', array($this, 'menu'));
    }

    private function site_role() {
        return is_callable($this->site_role_callback) ? call_user_func($this->site_role_callback) : 'wordpress-client';
    }

    public function menu() {
        add_menu_page('OMOS Core Tools', 'OMOS', 'manage_options', 'omos-core', array($this, 'dashboard'), 'dashicons-networking', 3);

        $screens = array(
            'bridge'      => array('App Bridge', 'bridge'),
            'shortcodes'  => array('Shortcodes', 'shortcodes'),
            'members'     => array('Members Integration', 'members'),
            'settings'    => array('Settings', 'settings'),
            'keys'        => array('API Keys', 'keys'),
            'tools'       => array('Tools Registry', 'tools'),
            'submissions' => array('Submissions', 'submissions'),
            'status'      => array('Status', 'status'),
            'checklist'   => array('Production Checklist', 'checklist'),
            'docs'        => array('Documentation', 'docs'),
            'prompt'      => array('System Prompt', 'system_prompt'),
        );

        foreach ($screens as $slug => $screen) {
            add_submenu_page('omos-core', $screen[0], $screen[0], 'manage_options', 'omos-core-' . $slug, array($this, $screen[1]));
        }
    }

    private function page($title, $body) {
        echo '<div class="wrap omos-core-admin"><div class="omos-core-admin-hero"><div><span class="omos-core-eyebrow">OneGodian™ • OMOS™ • WordPress Bridge</span><h1>' . esc_html($title) . '</h1></div><span class="omos-core-version">v' . esc_html(OMOS_CORE_TOOLS_VERSION) . '</span></div>' . $body . '</div>';
    }

    private function metric($label, $value) {
        return '<div class="omos-core-metric"><span>' . esc_html($label) . '</span><strong>' . esc_html((string) $value) . '</strong></div>';
    }

    private function badge($ok, $yes = 'PASS', $no = 'REVIEW') {
        return '<span class="omos-core-status ' . ($ok ? 'is-connected' : 'is-review') . '">' . esc_html($ok ? $yes : $no) . '</span>';
    }

    public function dashboard() {
        $health = $this->client->health();
        $manifest = $this->client->manifest();
        $members = $this->members->public_status();
        $runtime_version = (!empty($manifest['ok']) && is_array($manifest['data']) && isset($manifest['data']['version'])) ? $manifest['data']['version'] : 'Unavailable';
        $refresh_url = wp_nonce_url(admin_url('admin-post.php?action=omos_core_tools_refresh'), 'omos_core_tools_refresh');
        $members_label = !empty($members['available']) ? ('Connected' . (!empty($members['version']) ? ' v' . $members['version'] : '')) : 'Not detected';
        $body = '<div class="omos-core-metrics">'
            . $this->metric('Runtime', !empty($health['ok']) ? 'Connected' : 'Not verified')
            . $this->metric('Runtime Version', $runtime_version)
            . $this->metric('Plugin Version', OMOS_CORE_TOOLS_VERSION)
            . $this->metric('Site Role', $this->site_role())
            . $this->metric('Members / INO Platform', $members_label)
            . '</div><div class="omos-core-actions"><a class="button button-primary" href="' . esc_url($refresh_url) . '">Refresh Runtime</a><a class="button" href="' . esc_url($this->client->runtime_url('dashboard')) . '" target="_blank" rel="noopener">Open OMOS Runtime</a><a class="button" href="' . esc_url($this->client->public_url()) . '" target="_blank" rel="noopener">Open OMOS Public</a></div>';
        $this->page('OMOS Bridge Control Center', $body);
    }

    public function bridge() {
        $members = $this->members->public_status();
        $body = '<div class="omos-core-panel"><h2>Authority Boundary</h2><p><strong>OMOS.OneGodian.org</strong> is the WordPress public/presentation surface. <strong>OMOS.OneGodian.com</strong> is the governed Node/Express runtime. WordPress does not own provider credentials, Council authority, Human Gate decisions, Decision Records, PostgreSQL, deployments, payments, or consequential external actions.</p><p><strong>OneGodian Members / INO Platform</strong> and WordPress/WooCommerce remain authoritative for membership state and membership transactions. OMOS only reads integration capabilities and renders approved member surfaces.</p><p>ACC remains the control plane for separately authorized external execution.</p></div><div class="omos-core-panel"><h2>Verification Endpoints</h2><code>' . esc_html(rest_url('omos/v1/status')) . '</code><br><code>' . esc_html(rest_url('omos/v1/sync')) . '</code><br><code>' . esc_html(rest_url('omos/v1/shortcodes')) . '</code><br><code>' . esc_html(rest_url('omos/v1/members')) . '</code></div><div class="omos-core-panel"><h2>Members Integration</h2><pre class="omos-core-json">' . esc_html(wp_json_encode($members, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)) . '</pre></div>';
        $this->page('OMOS App Bridge', $body);
    }

    public function shortcodes() {
        $matrix = $this->shortcodes->status_matrix();
        $body = '<div class="omos-core-panel"><h2>Canonical 10-Module Registry</h2><div class="omos-core-table-wrap"><table class="widefat striped"><thead><tr><th>Shortcode</th><th>Registered</th><th>Working</th><th>Connected</th><th>Error</th></tr></thead><tbody>';
        foreach ($matrix as $tag => $row) {
            $body .= '<tr><td><code>[' . esc_html($tag) . ']</code></td><td>' . $this->badge($row['registered'], 'Registered', 'Error') . '</td><td>' . $this->badge($row['working'], 'Working', 'Error') . '</td><td>' . $this->badge($row['connected'], 'Connected', 'Error') . '</td><td>' . esc_html($row['error'] ? $row['error'] : '—') . '</td></tr>';
        }
        $body .= '</tbody></table></div><h3>Compatibility Shortcodes</h3><p><code>[' . esc_html(implode(']</code> <code>[', $this->shortcodes->compatibility_registry())) . ']</code></p></div>';
        $this->page('Shortcode Status', $body);
    }

    public function members() {
        $status = $this->members->public_status();
        $body = '<div class="omos-core-panel"><h2>Members / INO Platform Compatibility</h2><p>This is a read-through integration. OMOS does not determine or write membership status. It detects the active first-party membership plugin and reuses its registered member surfaces.</p><pre class="omos-core-json">' . esc_html(wp_json_encode($status, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)) . '</pre><p><strong>Authenticated REST:</strong> <code>' . esc_html(rest_url('omos/v1/members')) . '</code></p><p><strong>Member portal shortcode:</strong> <code>[omos_member_portal]</code></p></div>';
        $this->page('Members Integration', $body);
    }

    public function settings() {
        $settings = $this->client->settings();
        ob_start();
        ?>
        <div class="omos-core-panel"><form method="post" action="options.php">
            <?php settings_fields('omos_core_tools'); ?>
            <table class="form-table" role="presentation">
                <tr><th><label for="omos_runtime_url">Governed runtime</label></th><td><input id="omos_runtime_url" class="regular-text" type="url" name="<?php echo esc_attr(OMOS_Runtime_Client::SETTINGS_OPTION); ?>[runtime_url]" value="<?php echo esc_attr($settings['runtime_url']); ?>" required><p class="description">HTTPS only. Default: https://omos.onegodian.com</p></td></tr>
                <tr><th><label for="omos_public_url">Public surface</label></th><td><input id="omos_public_url" class="regular-text" type="url" name="<?php echo esc_attr(OMOS_Runtime_Client::SETTINGS_OPTION); ?>[public_url]" value="<?php echo esc_attr($settings['public_url']); ?>" required><p class="description">Default: https://omos.onegodian.org</p></td></tr>
                <tr><th><label for="omos_cache">Cache minutes</label></th><td><input id="omos_cache" type="number" min="1" max="60" name="<?php echo esc_attr(OMOS_Runtime_Client::SETTINGS_OPTION); ?>[cache_minutes]" value="<?php echo esc_attr($settings['cache_minutes']); ?>"></td></tr>
                <tr><th><label for="omos_node_name">Node name</label></th><td><input id="omos_node_name" class="regular-text" type="text" name="<?php echo esc_attr(OMOS_Runtime_Client::SETTINGS_OPTION); ?>[node_name]" value="<?php echo esc_attr($settings['node_name']); ?>"></td></tr>
                <tr><th><label for="omos_node_role">Node role</label></th><td><input id="omos_node_role" class="regular-text" type="text" name="<?php echo esc_attr(OMOS_Runtime_Client::SETTINGS_OPTION); ?>[node_role]" value="<?php echo esc_attr($settings['node_role']); ?>"></td></tr>
            </table>
            <?php submit_button(); ?>
        </form></div>
        <?php
        $this->page('OMOS Settings', ob_get_clean());
    }

    public function keys() {
        $source = $this->client->bridge_key_source();
        $body = '<div class="omos-core-panel"><h2>Bridge Authentication</h2><p>Current source: <strong>' . esc_html($source) . '</strong></p><p>Production should define <code>OMOS_BRIDGE_API_KEY</code> server-side. Model-provider credentials never belong in WordPress and are never displayed here.</p>';
        if ('wordpress-option-legacy' === $source) {
            $body .= '<div class="notice notice-warning inline"><p>A legacy database-stored bridge key exists. Migrate it to the server environment before Production certification.</p></div>';
        }
        $body .= '</div>';
        $this->page('OMOS API Keys', $body);
    }

    public function tools() {
        $body = '<div class="omos-core-panel"><h2>Tool Registry</h2><p>This WordPress plugin exposes presentation modules and governed-runtime launchers. Runtime tools remain authoritative in OMOS.</p><p><a class="button button-primary" href="' . esc_url($this->client->runtime_url('tools')) . '" target="_blank" rel="noopener">Open Runtime Tools</a></p></div>';
        $this->page('OMOS Tools Registry', $body);
    }

    public function submissions() {
        $body = '<div class="omos-core-panel"><h2>Submission Boundary</h2><p>WordPress does not maintain a competing Decision Record store. Ask OMOS submissions are sent to the governed runtime when authenticated, and authoritative run/history state remains in OMOS.</p><p><a class="button button-primary" href="' . esc_url($this->client->runtime_url('dashboard')) . '" target="_blank" rel="noopener">Open Runtime History</a></p></div>';
        $this->page('OMOS Submissions', $body);
    }

    public function status() {
        $payload = array(
            'health'              => $this->client->health(true),
            'manifest'            => $this->client->manifest(true),
            'providers'           => $this->client->providers(true),
            'persistence'         => $this->client->persistence(true),
            'members_integration' => $this->members->public_status(),
        );
        $body = '<div class="omos-core-panel"><pre class="omos-core-json">' . esc_html(wp_json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)) . '</pre></div>';
        $this->page('OMOS Status', $body);
    }

    public function checklist() {
        $health = $this->client->health();
        $manifest = $this->client->manifest();
        $members = $this->members->public_status();
        $matrix = $this->shortcodes->status_matrix();
        $all_registered = true;
        $all_working = true;
        foreach ($matrix as $row) {
            $all_registered = $all_registered && $row['registered'];
            $all_working = $all_working && $row['working'];
        }
        $shared_plugin = defined('OGP_VERSION') && version_compare(OGP_VERSION, '0.3.0', '>=');
        $checks = array(
            'WordPress site uses HTTPS'                         => is_ssl(),
            'Canonical runtime uses HTTPS'                      => 0 === strpos($this->client->runtime_url(), 'https://'),
            'OMOS runtime reachable'                            => !empty($health['ok']),
            'Runtime manifest available'                        => !empty($manifest['ok']),
            'All 10 canonical shortcodes registered'            => $all_registered,
            'All 10 canonical shortcode handlers working'       => $all_working,
            'Shared OneGodian Platform Plugin >= 0.3.0'         => $shared_plugin,
            'Members / INO Platform integration available'      => !empty($members['available']),
            'Bridge key uses server environment'                => 'environment' === $this->client->bridge_key_source(),
        );
        $body = '<div class="omos-core-panel"><ul class="omos-core-checklist">';
        foreach ($checks as $label => $ok) {
            $body .= '<li>' . $this->badge($ok) . ' ' . esc_html($label) . '</li>';
        }
        $body .= '</ul><p><strong>Repository checks do not certify a live installation.</strong> Verify the installed plugin version, <code>/wp-json/omos/v1/sync</code>, and authenticated <code>/wp-json/omos/v1/members</code> response on each target site.</p></div>';
        $this->page('Production Checklist', $body);
    }

    public function docs() {
        $body = '<div class="omos-core-panel"><p><a class="button button-primary" href="' . esc_url($this->client->runtime_url('docs')) . '" target="_blank" rel="noopener">OMOS Documentation</a> <a class="button" href="' . esc_url($this->client->runtime_url('developers')) . '" target="_blank" rel="noopener">Developer Hub</a></p><p>WordPress REST namespace: <code>/wp-json/omos/v1/</code></p></div>';
        $this->page('OMOS Documentation', $body);
    }

    public function system_prompt() {
        $body = '<div class="omos-core-panel"><h2>Runtime-Owned Configuration</h2><p>The OMOS system prompt, Council policy, provider configuration and synthesis rules are runtime concerns. This WordPress plugin intentionally does not provide a local prompt editor that could bypass governed runtime configuration.</p><p><a class="button" href="' . esc_url($this->client->runtime_url('docs')) . '" target="_blank" rel="noopener">Review Runtime Documentation</a></p></div>';
        $this->page('System Prompt', $body);
    }
}
